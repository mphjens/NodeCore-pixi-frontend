import { InterfaceValueType, PortType } from "./NodeConfig";
import { NodeConnection } from "./NodeConnection";

export class NodePort{
	//node:INode; <- not needed as of yet
	connection: NodeConnection | null = null;
	public readonly index: number;
	public readonly portType: PortType;
	public readonly valueType: InterfaceValueType;

	public isValid: boolean = false;
	public value: any;

	constructor(index:number, type: PortType, valuetype: InterfaceValueType){
		this.index = index;
		this.portType = type;
		this.valueType = valuetype;
	}
}