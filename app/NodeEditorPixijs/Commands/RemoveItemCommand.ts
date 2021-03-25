import { Point } from "pixi.js";
import { INode } from "../../NodeSystem/NodeCore";
import { GraphEditorItem } from "../EditorItems/GraphEditorItem";
import { RenderableNode } from "../EditorItems/RenderableNode";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { IEditorCommand } from "./IEditorCommand";
import { SelectItemCommand } from "./SelectItemCommand";

export class RemoveEditorItemCommand extends IEditorCommand {

    items: GraphEditorItem[];

    constructor(items: GraphEditorItem[]) {
        super("Remove a node", "Node removed");

        
        this.items = [];
        for(let i = 0; i < items.length; i++)
        {
            this.items.push(items[i]);
        }

        if(this.items.length==0)
            this.saveInCommandStack = false;
    }

    public do(ctx: NodeGraphEditor): void {

        //ctx.FinishCommand(new SelectItemCommand(null, ))

        this.items.forEach(cItem => {
            cItem.Deselect();
            ctx.RemoveEditorItem(cItem);
        });


    }

    public undo(ctx: NodeGraphEditor): void {
        this.items.forEach(cItem => {
            ctx.AddEditorItem(cItem);
            cItem.Select();
        });
    }

}