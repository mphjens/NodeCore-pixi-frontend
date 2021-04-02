import { NodeConnection } from "../NodeCore";
import { INode } from "../NodeCore/INode";
import { IResourceProcessorNode } from "../NodeCore/IResourceProcessorNode";
import { InterfaceValueType, NodeConfig, PortType, ResourceProcessorConfig } from "../NodeCore/NodeConfig";
import { NodeGraph } from "../NodeCore/NodeGraph";

export class WoodProductionNode extends IResourceProcessorNode{
    
    constructor(graph: NodeGraph){
        super(graph, {
            Name: "Wood production",
            Description: "Simple wood cutter",
            Inputs: [],
            Outputs: [
                {
                    Name: "Wood",
                    resource_id: 1,
                    Type: PortType.output,
                    ValueType: InterfaceValueType.resource,
                    consumption: 0,
                    producion: 10,
                }
            ]
        });
    }


    
}