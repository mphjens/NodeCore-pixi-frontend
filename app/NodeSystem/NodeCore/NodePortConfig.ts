import { PortType, InterfaceValueType } from "./NodeConfig";


export class NodePortConfig{
	public Name: string;
	public ValueType: InterfaceValueType;
	public Type: PortType;
	
	constructor(name: string, valuetype:InterfaceValueType){
		this.Type = PortType.uninitialized;
		this.Name = name; 
		this.ValueType = valuetype; // int, float ect..
	}
}

export class NodeResourcePortConfig extends NodePortConfig{
	//public portIndex: number;
	public resource_id: number = 0;
	public consumption: number = -1; //consumption of resource per minute. Only has value for input nodes.
	public producion: number = -1;//Production of resource per minute. Only has value for output nodes.  	//TODO: Perhaps these could be merged to a single variable called 'amount' 
}
