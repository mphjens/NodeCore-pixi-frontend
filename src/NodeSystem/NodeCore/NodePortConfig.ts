import { InterfaceType, InterfaceValueType } from "./NodeConfig";


export class NodePortConfig{
    public Name: string;
    public ValueType: InterfaceValueType;
    public Type: InterfaceType;
    
    constructor(name: string, valuetype:InterfaceValueType){
        this.Type = InterfaceType.uninitialized;
        this.Name = name; 
        this.ValueType = valuetype; // int, float ect..
    }
}