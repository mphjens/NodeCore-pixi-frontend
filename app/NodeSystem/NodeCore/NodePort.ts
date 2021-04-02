import { INode } from "./INode";
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

	public owner:INode;

	constructor(owner:INode, index:number, type: PortType, valuetype: InterfaceValueType){
		this.owner = owner;
		this.index = index;
		this.portType = type;
		this.valueType = valuetype;
	}

	public Connect(toPort: NodePort) : NodeConnection {
		if(toPort.portType != PortType.input)
		{
			console.warn("Must connect to input port");
			return null;
		}

		let nConnection: NodeConnection = new NodeConnection(
			this.owner,
			this.index,
			toPort.owner,
			toPort.index
		);

		this.connection = nConnection;
		toPort.connection = nConnection;

		return nConnection;
	}
}