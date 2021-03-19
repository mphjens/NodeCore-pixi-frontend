// import { INode } from "../NodeCore/INode";
// import { InterfaceType, InterfaceValueType, NodeConfig } from "../NodeCore/NodeConfig";
import  {INode, InterfaceType, InterfaceValueType, NodeConfig} from "../NodeCore";

export class AddNode extends INode{
    constructor()
    {
        var cfg: NodeConfig = {
            Name: "Add node",
            Description: "Adds inputs together",
            Inputs: [
                {Name: "A", Type: InterfaceType.input, ValueType: InterfaceValueType.number},
                {Name: "B", Type: InterfaceType.input, ValueType: InterfaceValueType.number},
            ],
            Outputs: [
                {Name: "O", Type: InterfaceType.output, ValueType: InterfaceValueType.number}
            ]
        }
        super(cfg);
    }    

    protected GetValue(outPortNumber: number) : any {
        if(outPortNumber == 0){
            return this.GetInput(0).value + this.GetInput(1).value;
        }
    }
}

