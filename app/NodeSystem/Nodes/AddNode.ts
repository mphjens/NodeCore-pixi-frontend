// import { INode } from "../NodeCore/INode";
// import { InterfaceType, InterfaceValueType, NodeConfig } from "../NodeCore/NodeConfig";
import  {INode, InterfaceType, InterfaceValueType, NodeConfig, NodeGraph} from "../NodeCore";
import { NodeInfo, PortProperty } from "../NodeCore/NodeAttribute";

//TODO: Implement NodeAttribute.ts
// @NodeInfo({
// 	Name: "Add node",
// 	Description: "Adds inputs together",
// 	Inputs: [],
// 	Outputs: []
// })
export class AddNode extends INode{
	constructor(graph: NodeGraph)
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
		super(graph, cfg);
	}	

	//@PortProperty({Name: "a", Type: InterfaceType.input, ValueType: InterfaceValueType.number})
	//public a:number;

	protected GetValue(outPortNumber: number) : any {
		if(outPortNumber == 0){
			return this.GetInput(0).value + this.GetInput(1).value;
		}
	}
}

