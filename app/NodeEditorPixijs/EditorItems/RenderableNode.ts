import { Graphics, Point, Text } from "pixi.js";
import { INode, NodeConnection, NodePort } from "../../NodeSystem/NodeCore";
import { GraphEditorItem } from "./GraphEditorItem";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { RenderableNodeConnection } from "./RenderableNodeConnection";
import { RenderableNodePort } from "./RenderableNodePort";

export class RenderableNode extends GraphEditorItem {

    public _node: INode;
    private nameText: Text;

    PaddingX: number = 4; //padding of content in node
    PaddingY: number = 2; //padding of content in node

    PortSpacing: number = 15;
    public PortSize: number = 7; //todo: URGENT don't really want this to be public, make a config file for these kind of settings.

    TitleTextSize: number = 12;
    NodeHeight: number = 64;
    NodeWidth: number = -1;
    OutlineSize: number = 2;

    rPorts: RenderableNodePort[] = [];

    //Only output connections are stored in the rnode (look in the previous node for input connections)
    rConnections: RenderableNodeConnection[] = [];
    



    constructor(editor: NodeGraphEditor, node: INode, pos: Point) {
        super(editor);
        this.interactive = true;
        this.movable = true;

        this._node = node;

        this.nameText = new Text(node.getName(), {
            "fill": "white",
            "fontSize": this.TitleTextSize
        });
        this.addChild(this.nameText);

        this.nameText.x = this.PaddingX;
        this.nameText.y = this.PaddingY;

        this.NodeWidth = this.nameText.width + (this.OutlineSize * 2) + this.PaddingX;

        this.x = pos.x;
        this.y = pos.y;

        
        this.UpdatePorts();

    }

    public UpdatePorts(): void {
        let nordePorts = this._node.getInputs().concat(this._node.getOutputs());

        nordePorts.forEach(port => {
            if(this.rPorts.map(x=>x._port).indexOf(port) == -1){
                let nrPort = new RenderableNodePort(this, port);
                
                this.editor.AddEditorItem(nrPort);
                this.rPorts.push(nrPort);

                nrPort.Redraw();
            }
        });
    }

    //Creates renderable connections for each of the connected output connections 
    //Skips if we already have a renderableconnection for this nodeconnection
    public UpdateConnections(): void {

        //Create our exsisting connections
        let connections: NodeConnection[] = this._node.getOutputs().map(x => x.connection);
        connections.forEach(con => {
            if (con != null && this.rConnections.map(x=>x._nodeCon).indexOf(con) == -1) {
                let nRenderableConnection: RenderableNodeConnection = new RenderableNodeConnection(this.editor, con);

                this.editor.AddEditorItem(nRenderableConnection);
                this.rConnections.push(nRenderableConnection);

                nRenderableConnection.Redraw();
            }
        });

        //Remove renderable connections with unreferenced NodeConnection
        for(let i = 0; i < this.rConnections.length; i++)
        {
            let con: NodeConnection = this.rConnections[i]._nodeCon;
            if(connections.indexOf(con) == -1)
            {
                this.editor.RemoveEditorItem(this.rConnections[i]);
                this.rConnections.splice(i, 1);
                i--;
            }
        }

    }

    public RedrawConnections(): void {
        //Output connections
        this.rConnections.forEach(element => {
            element.Redraw();
        });

        //also redraw the input node connections
        //TODO: the connections are drawn twice if two connections are comming from the same node.
        this._node.getInputs().forEach(x => {
            this.editor.GetNodeById(x.connection.NodeA.index).RedrawConnections();
        });
    }

    protected onSelected(): void {

        //TODO: Hacky
        //Bring to top
        // let parent = this.parent;
        // parent.removeChild(this);
        // parent.addChild(this);

        this.Redraw();
    }
    protected onDeselected(): void {
        this.Redraw();
    }

    protected onMoved(): void {
        // console.log("MOVED!'", this.rPorts);

        this.RedrawConnections();
        this.rPorts.forEach(port => {
            port.Redraw();
        });
    }

    public GetInputPosition(index: number): Point {
        let inputPorts: NodePort[] = this._node.getInputs(); //TODO: only used to get the size, add nr_inputs property??

        return new Point(-3.5, (this.NodeHeight / 2) - (((inputPorts.length - 1) * this.PortSpacing) / 2) + (index * this.PortSpacing));
    }

    public GetOutputPosition(index: number): Point {
        let outputPorts: NodePort[] = this._node.getOutputs(); //TODO: only used to get the size, add nr_outputs property??

        return new Point(this.NodeWidth - 3.5, (this.NodeHeight / 2) - (((outputPorts.length - 1) * this.PortSpacing) / 2) + (index * this.PortSpacing));
    }

    public Redraw() {
        this.clear();

        this.lineStyle(this.OutlineSize, 0x888888, 1);
        this.beginFill(this.selected ? 0x666666 : 0x444444);
        this.drawRect(0, 0, this.NodeWidth, this.NodeHeight);
        this.endFill();
        
    }

}