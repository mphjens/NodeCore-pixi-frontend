// import { INode } from "../NodeCore/INode";
// import { InterfaceType, InterfaceValueType, NodeConfig } from "../NodeCore/NodeConfig";
import  {INode, InterfaceType, InterfaceValueType, NodeConfig, NodeGraph} from "../NodeCore";

export class MultiplyNode extends INode{
	constructor(graph: NodeGraph)
	{
		var cfg: NodeConfig = {
			Name: "Multiply node",
			Description: "Multiplies inputs",
			Inputs: [
				{Name: "A", Type: InterfaceType.input, ValueType: InterfaceValueType.number},
				{Name: "B", Type: InterfaceType.input, ValueType: InterfaceValueType.number},
			],
			Outputs: [
				{Name: "O", Type: InterfaceType.output, ValueType: InterfaceValueType.number}
			]
		}
		super(graph, cfg);
	}	

	protected GetValue(outPortNumber: number) : any {
		if(outPortNumber == 0){
			return this.GetInput(0).value * this.GetInput(1).value;
		}
	}
}

