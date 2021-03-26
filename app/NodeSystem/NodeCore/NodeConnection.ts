import { INode } from "./INode";


//Represents a connection between nodes 
// ____							 ____
// |   |[IndexA]	 |----->[IndexB]|   | 
// | A |[IndexA] ----|	  [IndexB]| B |
// |__ |[IndexA]					|__ |
//
// isValid is used to determine if we need to evaluate NodeA[IndexA]
// value wil hold the value outputted by IndexA
export class NodeConnection{
	public NodeA: INode;
	public PortIndexA: number = -1;

	public NodeB: INode;
	public PortIndexB: number = -1;  

	constructor(nodeA: INode, PortIndexA:number, NodeB: INode, PortIndexB: number){
		this.NodeA = nodeA;
		this.PortIndexA = PortIndexA;

		this.NodeB = NodeB;
		this.PortIndexB = PortIndexB;

		let outPort = this.NodeA.GetOutput(this.PortIndexA);
		//outPort.isValid = false;

		let inPort = this.NodeB.GetInput(this.PortIndexB);
		inPort.isValid = false; //Will make it so value will be updated on next evaluation

	}

	public Disconnect()
	{
		let outPort = this.NodeA.GetOutput(this.PortIndexA);
		outPort.connection = null;

		let inPort = this.NodeB.GetInput(this.PortIndexB);
		inPort.connection = null;
		inPort.isValid = false;
		inPort.value = null;
	}

}
