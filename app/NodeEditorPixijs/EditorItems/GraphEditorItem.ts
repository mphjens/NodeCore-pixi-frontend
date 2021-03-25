import { Graphics } from "pixi.js";
import { NodeGraphEditor } from "../NodeGraphEditor";

export abstract class GraphEditorItem extends Graphics {

    protected movable: boolean = true;
    protected selectable: boolean = true; //TODO: These 'able' booleans could be implemented by inheritance (ex: SelectableGraphEditorItem class)
    protected selected: boolean = false;

    public readonly editor: NodeGraphEditor;

    //Last position, might be better kept elsewhere
    lastX: number;
    lastY: number;

    constructor(editor: NodeGraphEditor) {
        super();
        this.editor = editor;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public isSelectable(): boolean {
        return this.selectable;
    }

    public isMovable(): boolean {
        return this.movable;
    }

    public Select(): void {
        if (this.selectable && !this.selected) {
            this.selected = true;
            this.editor.selection.push(this);
            this.onSelected();
        } else {
            console.error("SELECTING ALREADY SELECTED ITEM")
        }
    }

    public NotifyMoved(): void {

        if (this.x != this.lastX || this.y != this.lastY) {
            this.onMoved();

            this.lastX = this.x;
            this.lastY = this.y;
        }

    }

    public Deselect(): void {
        if (this.selectable && this.selected) {
            this.selected = false;
            this.editor.selection.splice(this.editor.selection.indexOf(this), 1);
            this.onDeselected();
        } else {
            console.error("DESELECTING ALREADY SELECTED ITEM")
        }
    }


    public abstract Redraw(): void;
    //public abstract Destruct(): void; //When removed from editor
    //public abstract Restore(): void; //When readded afer remove
    protected abstract onSelected(): void;
    protected abstract onDeselected(): void;
    protected abstract onMoved(): void;

}