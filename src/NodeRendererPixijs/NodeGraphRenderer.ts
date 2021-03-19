import { Container, Point } from "pixi.js";
import { INode, NodeGraph } from "../NodeSystem/NodeCore";
import { RenderableNode } from "./RenderableNode";

//A container rendering a NodeCore.NodeGraph
export class NodeGraphRenderer extends Container{
    
    private _Graph: NodeGraph | null = null; //Should NOT by any means be altered. TODO: Find a way to enforce this.
    private renderableNodes: Map<number, RenderableNode>;
    private savedPositions: Map<number, {x:number, y:number}>;

    constructor(graph: NodeGraph){
        super();

        this._Graph = graph;
        this.renderableNodes = new Map();
        this.savedPositions = new Map();
        this.savedPositions.set(1, {x:1, y:2});
        this.SetupGraph();
    }   

    private SetupGraph(){
        //TODO: Loop over renderablenodes and destruct them
        this.renderableNodes.clear();

        this.UpdateRenderableNodes();        
    }


    //Ensure we have a renderablenode for each INode in the graph
    private UpdateRenderableNodes():void{
        if(this._Graph != null){
            for(let i = 0; i < this._Graph.Nodes.length; i++)
            {
                let cNode: INode = this._Graph.Nodes[i];
                if(this.renderableNodes.has(cNode.index)){
                    continue; //We already have a renderable node for this INode
                }
                let rNode: RenderableNode = new RenderableNode(
                    cNode,
                    new Point(i * 30, i * 50)
                );

                this.renderableNodes.set(cNode.index, rNode)
                
                rNode.Draw();
                this.addChild(rNode);
            }
        }
    }

}