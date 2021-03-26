import { NodeConfig, PortType } from "./NodeConfig";
import { NodeConnection } from "./NodeConnection";
import { NodeGraph } from "./NodeGraph";
import { NodePort } from "./NodePort";

export abstract class INode {
	public graph: NodeGraph;
	public index: number = -1;
	protected cfg: NodeConfig;

	private inputs: NodePort[];
	private outputs: NodePort[];

	constructor(config: NodeConfig, graph: NodeGraph) {
		this.cfg = config;
		this.inputs = [];
		this.outputs = [];

		for (let i = 0; i < config.Inputs.length; i++) {
			this.inputs[i] = new NodePort(i, PortType.input);
		}

		for (let i = 0; i < config.Outputs.length; i++) {
			this.outputs[i] = new NodePort(i, PortType.output);
		}

		if (graph != null)
			graph.AddNode(this);
	}


	public getName(): string {
		return this.cfg.Name;
	}

	public HasInvalidInputs(): boolean {
		for (let i = 0; i < this.inputs.length; i++) {
			if (!this.inputs[i].isValid)
				return true;
		}

		return false;
	}

	public GetInvalidInputs(): NodePort[] {
		let invalidPorts: NodePort[] = [];
		for (let i = 0; i < this.inputs.length; i++) {
			let cInput: NodePort = this.GetInput(i);
			if (!cInput.isValid)
				invalidPorts.push(cInput)
		}

		return invalidPorts;
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


		let nConnection: NodeConnection = new NodeConnection(
			this,
			outPortNumber,
			toNode,
			inPortNumber
		);

		this.outputs[outPortNumber].connection = nConnection;
		toNode.inputs[inPortNumber].connection = nConnection;

		//this.graph.Connections.push(nConnection);

		return nConnection;
	}

	//Evaluate all the output values and mark them valid
	//do this by recursively evaluating non valid input nodes
	public EvaluateNode(): void {
		//Recursively evaluate invalid input nodes
		let invalidInputs: NodePort[] = this.GetInvalidInputs();
		while (invalidInputs.length > 0 && invalidInputs[0].connection != null && invalidInputs[0].connection.NodeA != null) {
			invalidInputs[0].connection.NodeA.EvaluateNode(); //TODO: maybe selectively evaluate outputs. EvaluateNode() calculates all outputs (even when not connected).

			invalidInputs = this.GetInvalidInputs();
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