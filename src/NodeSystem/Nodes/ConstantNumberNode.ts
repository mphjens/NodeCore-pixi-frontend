// import { INode } from "../NodeCore/INode";
// import { InterfaceType, InterfaceValueType, NodeConfig } from "../NodeCore/NodeConfig";
import  {INode, InterfaceType, InterfaceValueType, NodeConfig} from "../NodeCore";

export class ConstantNumberNode extends INode{
    value: number;

    constructor(value: number)
    {
        var cfg: NodeConfig = {
            Name: "Constant number node",
            Description: "Output's a constant number",
            Inputs: [],
            Outputs: [
                {Name: "O", Type: InterfaceType.output, ValueType: InterfaceValueType.number}
            ]
        }
        super(cfg);

        this.value = value;
    }    

    protected GetValue(outPortNumber: number) : any {
        if(outPortNumber == 0){
            return this.value
        }
    }
}

