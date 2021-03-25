import { Container, InteractionEvent, Point, Rectangle, Renderer, } from "pixi.js";
import { INode, NodeConnection, NodeGraph } from "../NodeSystem/NodeCore";
import { IEditorCommand, IUpdateableEditorCommand } from "./Commands/IEditorCommand";
import { MoveItemsCommand as DragItemsCommand } from "./Commands/MoveItemsCommand";
import { SelectItemCommand } from "./Commands/SelectItemCommand";
import { GraphEditorItem } from "./EditorItems/GraphEditorItem";
import { RenderableNode } from "./EditorItems/RenderableNode";
import { RenderableNodeConnection } from "./EditorItems/RenderableNodeConnection";
import { AddNodeCommand } from "./Commands/AddNodeCommand";
import { ConstantNumberNode } from "../NodeSystem/Nodes/ConstantNumberNode";
import { RemoveEditorItemCommand } from "./Commands/RemoveItemCommand";

//A container rendering a NodeCore.NodeGraph
export class NodeGraphEditor extends Container {

    public _Graph: NodeGraph | null = null;
    private editorItems: GraphEditorItem[];

    //Maps node ids to GraphEditor item
    private nodeIdItemMap: Map<number, RenderableNode>;

    private undoDepth: number = 0;
    private commandstack: IEditorCommand[]; //The 'undo stack'
    private executingCommand: IUpdateableEditorCommand = null;

    public mouseIsDown: boolean; //might be nice to not have these public
    public mouseDownPos: Point = new Point(); //might be nice to not have these public
    public cMousePosition: Point = new Point(); //might be nice to not have these public
    public shiftIsDown: boolean; //might be nice to not have these public
    public ctrlIsDown: boolean; //might be nice to not have these public

    public selection: GraphEditorItem[]; //This is altered by SelectItemCommand.ts, might be nicer to use methods instead of making this public.

    constructor(graph: NodeGraph) {
        super();

        this._Graph = graph;
        this.editorItems = [];
        this.selection = [];
        this.commandstack = [];

        this.nodeIdItemMap = new Map();

        this.SetupGraph();
    }

    public update(): void {
        //console.log(this);
        if (this.executingCommand != null) {
            this.executingCommand.update(this);
        }
    }

    public StartCommand(command: IUpdateableEditorCommand) {
        if (this.executingCommand != null) {
            console.error(`[Command] Canceling ${this.executingCommand.name}`);
            this.CancelCommand();
            //return;
        }

        console.info(`[Command] Starting ${command.name}`);

        //Will make it so command.update() will be called every tick.
        this.executingCommand = command;
    }

    public CancelCommand(){
        if(this.executingCommand != null){
            this.executingCommand.cancel(this);
            this.executingCommand = null;
        }
    }

    public FinishCommand(command: IEditorCommand = null, save:boolean = true) {

        if (command == null)
            command = this.executingCommand

        command.do(this);

        if (command.saveInCommandStack) {
            //Reset the redo stack (no redo when a change has been made after undoing)
            while (this.undoDepth > 0) {
                this.commandstack.pop();
                this.undoDepth--;
            }

            this.commandstack.push(command);
        }

        if (command == this.executingCommand)
            this.executingCommand = null;

        console.info(`[Command] Finished ${command.description} ${command.saveInCommandStack ? '(saved)' : '(not saved)'}`);
    }

    public Redo() {
        if (this.undoDepth > 0) {
            this.undoDepth--;
            this.commandstack[this.commandstack.length - this.undoDepth - 1].do(this);
        }
    }

    public Undo() {
        if (this.commandstack.length - this.undoDepth > 0) {
            this.commandstack[this.commandstack.length - this.undoDepth - 1].undo(this);
            this.undoDepth++;
        }
    }

    private SetupGraph() {
        this.editorItems = []

        this.UpdateRenderableNodes();
    }

    //
    // KEYBOARD EVENT HANDLERS
    //
    public onWindowKeyDown(eventdata: KeyboardEvent) {
        console.log(eventdata);
        this.shiftIsDown = eventdata.shiftKey;
        this.ctrlIsDown = eventdata.ctrlKey;
        switch (eventdata.code) {
            case "KeyZ":
                if (eventdata.ctrlKey) {
                    this.Undo();
                }
                break;
            case "KeyY":
                if (eventdata.ctrlKey) {
                    this.Redo();
                }
                break;
            case "KeyA":
                this.FinishCommand(new AddNodeCommand(new ConstantNumberNode(2, this._Graph)));
                break;
            case "Delete":
                this.FinishCommand(new RemoveEditorItemCommand(this.selection));
                break;
        }
    }

    public onWindowKeyUp(eventdata: KeyboardEvent) {
        this.shiftIsDown = eventdata.shiftKey;
        this.ctrlIsDown = eventdata.ctrlKey;
    }
    //
    // MOUSE EVENT HANDLERS
    //
    public onWindowPointerMove(eventdata: InteractionEvent) {
        this.cMousePosition = eventdata.data.global.clone();
    }

    public onWindowPointerDown(eventdata: InteractionEvent) {
        this.mouseIsDown = true;
        this.cMousePosition = eventdata.data.global.clone();
        this.mouseDownPos.x = eventdata.data.global.x;
        this.mouseDownPos.y = eventdata.data.global.y;

        
        let hitItem = false; //Did we intersect an EditorItem
        this.GetItemsAtPosition(this.cMousePosition.x, this.cMousePosition.y).forEach(item => {
                this.onItemPointerDown(item, eventdata);
                hitItem = true;
        });

        if (!hitItem) {
            this.onItemPointerDown(null, eventdata); //TODO: there's a better way to do this, find out what it is
        }

        if (this.selection.length > 0) {
            this.StartCommand(new DragItemsCommand(this.selection));
        }

    }

    public onWindowPointerUp(eventdata: InteractionEvent) {
        this.mouseIsDown = false;

        if(this.executingCommand != null)
        {
            this.FinishCommand(this.executingCommand);
        }
        // //If we're executing a move command, finish it 
        // if (this.executingCommand != null && this.executingCommand instanceof DragItemsCommand) {
        //     this.FinishCommand(this.executingCommand);
        // }
    }

    public onItemPointerDown(item: GraphEditorItem, eventdata: InteractionEvent) {
        //Todo: this can be cleaned up, 
        if (item != null) {
            if (item.isSelectable()) {
                this.FinishCommand(new SelectItemCommand([item], this.shiftIsDown, this.selection));
            }
        }
        else {
            this.FinishCommand(new SelectItemCommand(null, false, this.selection));
        }
    }

    //
    // END MOUSE EVENT HANDLERS
    //

    

    public GetItemsAtPosition(x: number, y: number) : GraphEditorItem[]
    {
        let retval: GraphEditorItem[] = []

        this.editorItems.forEach(item => {

            //TODO: USE THE EXSISTING HIT INTERSECTION CODE FROM PIXI instead of using the getBounds()
            if (item.interactive && item.getBounds().contains(this.cMousePosition.x, this.cMousePosition.y)) {
                retval.push(item);
            }
        });

        return retval;
    }

    //Ensure we have editor items for each INode and connection in the graph
    //this is temporary and should be handled by the Deserializer and by the editor (adding/deleting nodes)
    private UpdateRenderableNodes(): void {
        if (this._Graph != null) {
            for (let i = 0; i < this._Graph.Nodes.length; i++) {
                let cNode: INode = this._Graph.Nodes[i];
                let rNode: RenderableNode = new RenderableNode(
                    this,
                    cNode,
                    new Point(i * 30, i * 50)
                );

                this.AddEditorItem(rNode);
            }

            //Create ports and connections
            //Todo: don't do this in the nodegrapheditor, there should be no imports to any EditorItem in here
            for (let i = 0; i < this._Graph.Nodes.length; i++) {
                let rNode = this.nodeIdItemMap.get(this._Graph.Nodes[i].index);
                rNode.UpdatePorts();
                rNode.UpdateConnections();
            }
        }
    }

    public GetNodeById(node_id: number) {
        return this.nodeIdItemMap.get(node_id);
    }

    public AddEditorItem(item: GraphEditorItem) {
        this.editorItems.push(item);
        this.addChild(item);

        //TODO: remove this when we decouple from the node system
        if(item instanceof RenderableNode)
        {
            var rn:RenderableNode = item;
            this.nodeIdItemMap.set(rn._node.index, rn);
        }

        item.Redraw();
    }

    public RemoveEditorItem(item: GraphEditorItem) {
        let index = this.editorItems.indexOf(item);
        if (index != -1) {
            this.editorItems.splice(index, 1);
            //item.Destruct(); // TODO: think on how to implement destruction of items when we know we won't be undo-ing the remove
            item.removeAllListeners();
            this.removeChild(item);
        }
    }

}