import { GraphEditorItem } from "../EditorItems/GraphEditorItem";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { IEditorCommand } from "./IEditorCommand";

export class SelectItemCommand extends IEditorCommand {

    editSelection: boolean;
    orgSelection: GraphEditorItem[];
    items: GraphEditorItem[];

    constructor(items: GraphEditorItem[], editSelection: boolean, originalSelection: GraphEditorItem[]) {
        super("Select", "Changed selection");

        this.editSelection = editSelection;
        this.orgSelection = [];

        for (let i = 0; i < originalSelection.length; i++) {
            this.orgSelection.push(originalSelection[i]);
        }

        this.items = items;
    }

    public do(ctx: NodeGraphEditor): void {
        //TODO: this method is messy
        this.saveInCommandStack = false; //If didn't change the selection don't save it in the undo stack

        if (this.editSelection) {
            if (this.items != null) {
                this.items.forEach(item => {
                    if (item != null) {
                        this.saveInCommandStack = true;

                        if (item.isSelected()) {
                            let index = ctx.selection.indexOf(item);
                            ctx.selection[index].Deselect();
                        }
                        else {
                            item.Select();
                        }
                    }
                });
            }

        }
        else {
            //Deselect all items (except our subjects)
            for (let i = 0; i < this.orgSelection.length; i++) {
                if (this.items == null || this.items.indexOf(this.orgSelection[i]) == -1) {
                    this.orgSelection[i].Deselect();
                    this.saveInCommandStack = true;
                }
            }

            if (this.items != null) {
                this.items.forEach(item => {
                    if (item != null && !item.isSelected()) {
                        item.Select();
                        
                        this.saveInCommandStack = true;
                    }

                    if (item == null && this.orgSelection.length > 0) {
                        this.saveInCommandStack = true;
                    }
                });
            }
        }
    }

    public undo(ctx: NodeGraphEditor): void {
        
        if(this.items != null){
            for(let i = 0; i < this.items.length; i++)
            {
                if (this.orgSelection.indexOf(this.items[i]) == -1) {
                    this.items[i].Deselect();
                }
            }
        }
        

        this.orgSelection.forEach(cItem => {
            if (!cItem.isSelected()) {
                cItem.Select();
            }
        });

    }

}