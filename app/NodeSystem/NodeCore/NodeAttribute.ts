import { INode } from "./INode";
import { NodeConfig, PortType } from "./NodeConfig"
import { NodePortConfig } from "./NodePortConfig";

//This is the definition of the attribute that can be added to 
export function NodeInfo(nodeCfg: NodeConfig) {
    console.log('c - a', this);
    return function (constructor: Function) {
        console.log('p - b', this);
        constructor.prototype.cfg = nodeCfg;
    }
}

export function PortProperty(portCfg: NodePortConfig) {
    console.log('p - a', portCfg, this);
    return function (target: any, propertyKey: string) {
        console.log('p - b', portCfg, target, propertyKey);
        let value: any;
        const getter = function () {
            return value;
        };
        const setter = function (newVal: string) {
            value = newVal;
            //TODO: MAYBE WE CAN SET THE PORT VALUES HERE 
        };
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });

        if (portCfg.Type == PortType.output)
            target.constructor.prototype.cfg.Outputs.push(portCfg);
        else
            target.constructor.prototype.cfg.Inputs.push(portCfg);
    }
}

    // return function (target:any) {
    //     if(portCfg.Type == PortType.output)
    //         target.cfg.Outputs.push(portCfg);    
    //     else
    //         target.cfg.Inputs.push(portCfg);   
    //   }


