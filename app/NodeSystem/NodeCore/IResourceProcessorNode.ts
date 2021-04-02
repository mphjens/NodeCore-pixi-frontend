import { NodeConnection } from ".";
import { INode } from "./INode";
import { NodeConfig, ResourceProcessorConfig } from "./NodeConfig";
import { NodeGraph } from "./NodeGraph";

export class IResourceProcessorNode extends INode {

    lastEvaluation: number; //Timestamp of last value check
    buffer: number = 0; //if we had a fractional return value save the left over here

    constructor(graph: NodeGraph, config: ResourceProcessorConfig) {
        super(graph, config);

        //TODO: This won't do if we want to serialize nodes
        this.lastEvaluation = this.graph.Clock.GetMillis();
    }

    protected GetValue(outPortNumber: number) {

        let cTime = this.graph.Clock.GetMillis();
        let deltaTime = cTime - this.lastEvaluation;

        let cfg: ResourceProcessorConfig = <ResourceProcessorConfig>this.cfg;
        if (this.GetInputs().length == 0) //We are a generator node
        {
            this.lastEvaluation = cTime;
            let produced = (cfg.Outputs[outPortNumber].producion * (deltaTime / 1000 / 60)) + this.buffer;
            this.buffer = produced % cfg.Outputs[outPortNumber].producion;

            console.log(this.buffer);
            return produced - this.buffer
        } else {
            //TODO: i feel this could be more efficient
            //Check the least number of resource we can produce given the amount of input resources produced
            let cMin = Number.MAX_VALUE;
            this.GetInputs().forEach(input => {
                let cval = (input.value / cfg.Inputs[input.index].consumption) * cfg.Outputs[outPortNumber].producion;
                if (cval < cMin) {
                    cMin = cval;
                }
            });

            //The max items produced given the time passed
            let max = ((deltaTime / 1000 / 60)) * cfg.Outputs[outPortNumber].producion;

            let produced = Math.min(max, cMin) + this.buffer;
            this.buffer = produced % cfg.Outputs[outPortNumber].producion;

            return produced - this.buffer;



        }

        return 0;
    }



}