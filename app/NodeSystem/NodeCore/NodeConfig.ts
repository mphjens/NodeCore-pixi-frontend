import { NodePortConfig, NodeResourcePortConfig } from "./NodePortConfig";

export enum InterfaceValueType{
	number,
	string,
	boolean,
	resource
}

export enum PortType{
	input,
	output,
	uninitialized
}

export class NodeConfig{
	public Name: string = "NewNode";
	public Description: string = "Uninitialized";
	public Inputs: NodePortConfig[] = [];
	public Outputs: NodePortConfig[] = [];
}

export class ResourceProcessorConfig extends NodeConfig{
	public Inputs: NodeResourcePortConfig[] = [];
	public Outputs: NodeResourcePortConfig[] = [];
}