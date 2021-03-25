import { Point } from "pixi.js";
import { GraphEditorItem } from "../EditorItems/GraphEditorItem";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { IEditorCommand } from "./IEditorCommand";

export class MoveItemsCommand extends IEditorCommand {
    deltaX: number;
    deltaY: number;

    startPositions: any[];
    items: GraphEditorItem[];

    constructor(items: GraphEditorItem[]) {
        super("Move node(s)", "Moves one or more nodes")
        this.deltaX = 0;
        this.deltaY = 0;

        this.items = [];
        this.startPositions = [];

        for (let i = 0; i < items.length; i++) {
            var cPos = {
                x: items[i].x,
                y: items[i].y
            }

            this.items.push(items[i]);
            // this.nodeIds.push(items[i]._node.index);
            this.startPositions.push(cPos);
        }
    }

    public update(ctx: NodeGraphEditor): void {

        this.deltaX = ctx.cMousePosition.x - ctx.mouseDownPos.x;
        this.deltaY = ctx.cMousePosition.y - ctx.mouseDownPos.y;

        if (Math.abs(this.deltaX) > 0 && Math.abs(this.deltaY)) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].isMovable()) {
                    this.items[i].x = this.startPositions[i].x + this.deltaX;
                    this.items[i].y = this.startPositions[i].y + this.deltaY;

                    this.items[i].NotifyMoved();
                }

            }
        }
    }

    public cancel(ctx: NodeGraphEditor): void{
        for(let i = 0; i < this.items.length; i++){
            this.items[i].x = this.startPositions[i].x;
            this.items[i].y = this.startPositions[i].y;
        }
    }

    public do(ctx: NodeGraphEditor): void {
        this.saveInCommandStack = false;

        if (Math.abs(this.deltaX) > 0 && Math.abs(this.deltaY)) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].isMovable()) {
                    this.items[i].x = this.startPositions[i].x + this.deltaX;
                    this.items[i].y = this.startPositions[i].y + this.deltaY;

                    this.items[i].NotifyMoved();

                    this.saveInCommandStack = true;
                }
            }
        }
    }

    public undo(ctx: NodeGraphEditor): void {
        for (let i = 0; i < this.items.length; i++) {
            if(Math.abs(this.items[i].x - this.startPositions[i].x) > 0 || Math.abs(this.items[i].y - this.startPositions[i].y) > 0){
                this.items[i].x = this.startPositions[i].x;
                this.items[i].y = this.startPositions[i].y;

                this.items[i].NotifyMoved();
            }
        }
    }
}