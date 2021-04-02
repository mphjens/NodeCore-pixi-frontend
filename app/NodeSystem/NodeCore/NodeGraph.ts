import { GraphSystemClock } from "./GraphSystemClock";
import { IGraphClock } from "./IGraphClock";
import { INode } from "./INode";

export class NodeGraph{
	public Clock: IGraphClock;
	Nodes: INode[];
	//Connections: NodeConnection[];
	//Add some maps to efficently find connected nodes

	constructor(){
		this.Nodes = [];
		this.Clock = new GraphSystemClock();
	}

	//Returns the index of this node
	public AddNode(node:INode): number
	{
		if(node.graph == null){
			let index = this.Nodes.push(node) - 1;
			node.index = index;
			node.graph = this;
	
			return index;
		}

		//Node is already in another graph
		return -1; 
	}

	public EvaluateAll(): void
	{
		for(let i = 0; i< this.Nodes.length; i++)
		{
			//If a node doesn't have a connected output, evaluate it. (the rest is evaluated recursively as needed)
			if(!this.Nodes[i].HasConnectedOuput())
				this.Nodes[i].EvaluateNode();
		}
	}

	

	

}