
import { NodeConfig, PortType } from "./NodeConfig";
import { NodeConnection } from "./NodeConnection";
import { NodeGraph } from "./NodeGraph";
import { NodePort } from "./NodePort";

export abstract class INode {
    //[x: string]: any; //TODO: Meh, added because we need to access NodeInfo
	public graph: NodeGraph;
	public index: number = -1;
	public readonly cfg: NodeConfig;

	private inputs: NodePort[];
	private outputs: NodePort[];

	constructor(graph: NodeGraph, config: NodeConfig = null ) {
		if(config != null && this.cfg != null)
			console.warn("Either pass the config as a constructor parameter or use the decorator, not both.");
		
		if(config != null)
			this.cfg = config;

		this.inputs = [];
		this.outputs = [];

		//no need to set size of array first??
		for (let i = 0; i < this.cfg.Inputs.length; i++) {
			this.inputs[i] = new NodePort(this, i, PortType.input, this.cfg.Inputs[i].ValueType);
		}

		for (let i = 0; i < this.cfg.Outputs.length; i++) {
			this.outputs[i] = new NodePort(this, i, PortType.output, this.cfg.Outputs[i].ValueType);
		}

		if (graph != null)
			graph.AddNode(this);
	}


	public getName(): string {
		return this.cfg.Name;
	}

	public HasDirtyInputs(): boolean {
		for (let i = 0; i < this.inputs.length; i++) {
			if (!this.inputs[i].isValid)
				return true;
		}

		return false;
	}

	public GetDirtyInputs(): NodePort[] {
		let dirtyPorts: NodePort[] = [];
		for (let i = 0; i < this.inputs.length; i++) {
			let cInput: NodePort = this.GetInput(i);
			if (!cInput.isValid)
				dirtyPorts.push(cInput)
		}

		return dirtyPorts;
	}

	public HasConnectedOuput(): boolean {
		for (let i = 0; i < this.outputs.length; i++) {
			if (this.outputs[i].connection != null)
				return true;
		}

		return false;
	}

	public Connect(outPortNumber: number, inPortNumber: number, toNode: INode): NodeConnection | null {
		if (this.graph != toNode.graph) {
			console.log("Nodes aren't in the same graph");
			return null;
		}

		if(toNode.inputs[inPortNumber].valueType != this.outputs[outPortNumber].valueType)
		{
			console.error("Node types not compatible");
			return null;
		}

		if (this.outputs[outPortNumber].connection != null) {
			console.log("OVERRIDING OUT NODECONNECTION");
			let oldCon = this.outputs[outPortNumber].connection;

			oldCon.NodeB.GetInput(oldCon.PortIndexB).connection = null;
		}

		if (toNode.inputs[inPortNumber].connection != null) {
			let oldCon = toNode.inputs[inPortNumber].connection;
			oldCon.NodeA.GetOutput(oldCon.PortIndexA).connection = null;
			console.log("OVERRIDING IN NODECONNECTION");
		}


		return this.outputs[outPortNumber].Connect(toNode.inputs[inPortNumber]);
	}

	//Evaluate all the output values and mark them valid
	//do this by recursively evaluating non valid input nodes
	public EvaluateNode(force:boolean = false): void {
		if(force){
			this.graph.Nodes.forEach(node=>{
				node.GetOutputs().forEach(output=>{
					output.isValid = false;
				});
				node.GetInputs().forEach(input=>{
					input.isValid = false;
				});
			});
		}
		//Recursively evaluate dirty input nodes
		let dirtyInputs: NodePort[] = this.GetDirtyInputs();
		while (dirtyInputs.length > 0 && dirtyInputs[0].connection != null && dirtyInputs[0].connection.NodeA != null) {
			dirtyInputs[0].connection.NodeA.EvaluateNode(false); //TODO: maybe selectively evaluate outputs. EvaluateNode() calculates all outputs (even when not connected).

			dirtyInputs = this.GetDirtyInputs();
		}

		//Evaluate all outputs
		for (let i = 0; i < this.outputs.length; i++) { 
			let nValue = this.GetValue(i);

			this.outputs[i].value = nValue;
			this.outputs[i].isValid = true;

			//Also set connected input's value and set valid. TODO: these should point to the same object to avoid setting the value twice. problem for future jens
			if (this.outputs[i].connection != null) {
				let conn = this.outputs[i].connection;
				if (conn != null && conn.NodeB != null) {
					conn.NodeB.inputs[conn.PortIndexB].isValid = true;
					conn.NodeB.inputs[conn.PortIndexB].value = nValue;
				}
			}

		}
	}

	//Implemented by extending class
	protected abstract GetValue(outPortNumber: number): any

	public GetOutput(outputNumber: number, evaluate: boolean = false): NodePort | null {
		if (outputNumber < this.outputs.length) {
			if (evaluate)
				this.EvaluateNode();

			return this.outputs[outputNumber];
		}

		return null;
	}

	public GetInput(portNumber: number): NodePort {
		return this.inputs[portNumber]
	}

	public GetInputs(): NodePort[] {
		return this.inputs;
	}

	public GetOutputs(): NodePort[] {
		return this.outputs;
	}

}
