import { Graphics, Point, Text } from "pixi.js";
import { INode, NodeConnection, NodePort } from "../../NodeSystem/NodeCore";
import { GraphEditorItem } from "./GraphEditorItem";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { RenderableNode } from "./RenderableNode";

export class RenderableNodeConnection extends GraphEditorItem {

    public _nodeCon: NodeConnection;

    private lineWidth: number = 3;
    private color: number = 0x666688;

    constructor(editor: NodeGraphEditor, nodeConnection: NodeConnection) {
        super(editor);
        this.interactive = false;
        this.movable = false;

        this._nodeCon = nodeConnection;
    }

    protected onSelected(): void {
        this.Redraw();
    }
    protected onDeselected(): void {
        this.Redraw();
    }

    //Gets called after a move command has been finished
    protected onMoved(): void {

    }

    public Redraw(): void {
        this.clear();

        let rNodeA: RenderableNode = this.editor.GetNodeById(this._nodeCon.NodeA.index);
        let startOffset = rNodeA.GetOutputPosition(this._nodeCon.PortIndexA);
        let globalStartPosition = new Point(rNodeA.x + startOffset.x, rNodeA.y + startOffset.y + (rNodeA.PortSize / 2));

        this.x = globalStartPosition.x + (rNodeA.PortSize/2);
        this.y = globalStartPosition.y;

        let rNodeB: RenderableNode = this.editor.GetNodeById(this._nodeCon.NodeB.index);
        let endOffset = rNodeB.GetInputPosition(this._nodeCon.PortIndexB);
        let globalEndPosition = new Point(rNodeB.x + endOffset.x, rNodeB.y + endOffset.y + (rNodeB.PortSize / 2));
        let endposition = this.toLocal(globalEndPosition, this.editor);

        this.lineStyle(this.lineWidth, this.color, 1);
        this.bezierCurveTo(endposition.x, 0, 0, endposition.y, endposition.x, endposition.y);

    }

}