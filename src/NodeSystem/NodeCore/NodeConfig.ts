import { NodePortConfig } from "./NodePortConfig";

export enum InterfaceValueType{
    number,
    string,
    boolean    
}

export enum InterfaceType{
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