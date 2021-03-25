import { NodePort } from "../../NodeSystem/NodeCore";
import { PortType } from "../../NodeSystem/NodeCore/NodeConfig";
import { CreateConnectionCommand } from "../Commands/CreateConnectionCommand";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { GraphEditorItem } from "./GraphEditorItem";
import { RenderableNode } from "./RenderableNode";

export class RenderableNodePort extends GraphEditorItem{

    public readonly _port: NodePort;
    public readonly parentNode: RenderableNode;

    constructor(parentNode:RenderableNode, port:NodePort){
        super(parentNode.editor);
        this.interactive = true;
        //this.movable = false;

        this.parentNode = parentNode;
        this._port = port;
    }

    public Redraw(): void {
        this.clear();
        
        //TODO: not the prettiest
        let position = this._port.portType == PortType.input ? 
                this.parentNode.GetInputPosition(this._port.index) : this.parentNode.GetOutputPosition(this._port.index);

        this.x = this.parentNode.x + position.x;
        this.y = this.parentNode.y + position.y;

        this.lineStyle(this.selected ? 2: 1, 0x777777, 1);
        this.beginFill(this.selected ? 0xffffff : 0x222311);
        this.drawRect(0,0, this.parentNode.PortSize, this.parentNode.PortSize);
        this.endFill();
    }
    protected onSelected(): void {
        //throw new Error("Method not implemented.");
        this.Redraw();
    }
    protected onDeselected(): void {
        //throw new Error("Method not implemented.");
        this.Redraw();
    }
    protected onMoved(): void {
        //Cancels the move command that's issued by default
        this.editor.StartCommand(new CreateConnectionCommand(this));
    }

}