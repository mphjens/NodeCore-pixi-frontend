import { NodeGraphEditor } from "../NodeGraphEditor";

export abstract class IEditorCommand {

    name: string;
    description: string;

    saveInCommandStack: boolean = true;
        
    constructor(name:string, description: string){
        this.name = name;
        this.description = description;
    }
    
    public abstract do(ctx: NodeGraphEditor) :void;
    public abstract undo(ctx: NodeGraphEditor) :void;
}

export abstract class IUpdateableEditorCommand extends IEditorCommand{


    constructor(name:string, description: string){
        super(name, description);
    }
    
    public abstract update(ctx: NodeGraphEditor) :void;
    public abstract cancel(ctx: NodeGraphEditor): void; // Only really applicable to updating commands 

}