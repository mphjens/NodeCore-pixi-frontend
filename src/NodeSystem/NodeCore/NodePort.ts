import { NodeConnection } from "./NodeConnection";

export class NodePort{
    //node:INode; <- not needed as of yet
    connection: NodeConnection | null = null;

    public isValid: boolean = false;
    public value: any;
}