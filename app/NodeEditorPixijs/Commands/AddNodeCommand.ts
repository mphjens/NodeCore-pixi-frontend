import { Point } from "pixi.js";
import { INode } from "../../NodeSystem/NodeCore";
import { RenderableNode } from "../EditorItems/RenderableNode";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { IEditorCommand } from "./IEditorCommand";

export class AddNodeCommand extends IEditorCommand {


    //The node template we're working from
    _node: INode;

    //This is created and added to the editor
    _rNode: RenderableNode = null;

    constructor(node: INode) {
        super("Add a node", "Node added");

        this._node = node;
    }

    public do(ctx: NodeGraphEditor): void {
        if(this._rNode == null){
            this._rNode = new RenderableNode(ctx, this._node, new Point(ctx.cMousePosition.x, ctx.cMousePosition.y));
        }

        ctx.AddEditorItem(this._rNode);
        this._rNode.Select();
    }

    public undo(ctx: NodeGraphEditor): void {
        this._rNode.Deselect();
        ctx.RemoveEditorItem(this._rNode);
    }

}