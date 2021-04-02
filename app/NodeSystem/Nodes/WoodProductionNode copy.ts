import { NodeConnection } from "../NodeCore";
import { INode } from "../NodeCore/INode";
import { IResourceProcessorNode } from "../NodeCore/IResourceProcessorNode";
import { InterfaceValueType, NodeConfig, PortType, ResourceProcessorConfig } from "../NodeCore/NodeConfig";
import { NodeGraph } from "../NodeCore/NodeGraph";

export class WoodenPlankProductionNode extends IResourceProcessorNode{
    
    constructor(graph: NodeGraph){
        super(graph, {
            Name: "Wooden plank production",
            Description: "Cut's planks from wood",
            Inputs: [{
                Name: "Wood",
                resource_id: 1,
                Type: PortType.input,
                ValueType: InterfaceValueType.resource,
                consumption: 1,
                producion: 0
            }],
            Outputs: [
                {
                    Name: "Wooden plank",
                    resource_id: 2,
                    Type: PortType.output,
                    ValueType: InterfaceValueType.resource,
                    consumption: 0,
                    producion: 3,
                }
            ]
        });
    }


    
}