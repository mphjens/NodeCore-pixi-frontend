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