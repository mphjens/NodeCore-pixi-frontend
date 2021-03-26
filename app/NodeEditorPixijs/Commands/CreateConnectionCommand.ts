import { Graphics } from "pixi.js";
import { NodeConnection } from "../../NodeSystem/NodeCore";
import { PortType } from "../../NodeSystem/NodeCore/NodeConfig";
import { RenderableNode } from "../EditorItems/RenderableNode";
import { RenderableNodePort } from "../EditorItems/RenderableNodePort";
import { NodeGraphEditor } from "../NodeGraphEditor";
import { IUpdateableEditorCommand } from "./IEditorCommand";

export class CreateConnectionCommand extends IUpdateableEditorCommand{

    startPort : RenderableNodePort; //Nodeport we're connecting from
    endPort: RenderableNodePort;    //Nodeport we connected to

    createdConnection: NodeConnection;
    oldConnection: NodeConnection; //previously connection (so we can connect it again in the undo)

    tmpLineObj: Graphics;

    constructor(startPort: RenderableNodePort){
        super("Create Connection", "Creating a node connection")
        this.startPort = startPort;

        this.tmpLineObj = new Graphics();
    }

    public update(ctx: NodeGraphEditor): void {
        if(this.tmpLineObj.parent == null)
        {
            ctx.addChild(this.tmpLineObj);
        }

        this.tmpLineObj.x = this.startPort.x;
        this.tmpLineObj.y = this.startPort.y;
        this.tmpLineObj.clear();
        this.tmpLineObj.lineStyle(2, 0x00ff00);
        this.tmpLineObj.lineTo(ctx.cMousePosition.x - this.tmpLineObj.x, ctx.cMousePosition.y - this.tmpLineObj.y);
    }
    public cancel(ctx: NodeGraphEditor): void {
        
        ctx.removeChild(this.tmpLineObj);
    }
    public do(ctx: NodeGraphEditor): void {
        
        if(this.endPort == null){
            let mouseoveritems = ctx.GetItemsAtPosition(ctx.cMousePosition.x, ctx.cMousePosition.y);
            mouseoveritems.forEach(item=>{
                if(item instanceof RenderableNodePort)
                {
                    let cPort:RenderableNodePort = item;
                    //TODO: URGENT IMPLEMENT FROM INPUT TO OUTPUT
                    // maybe swap endPort and startPort if we're connecting an input to an output
                    // also check if we're not connecting it to the same node (this should be enforced in NodeSystem code aswel)
                    if(this.startPort._port.portType == PortType.output && cPort._port.portType == PortType.input)
                    {
                        this.endPort = cPort;
                    }
                }
            });
        }

        if(this.endPort != null){
            this.oldConnection = null;
            if(this.endPort._port.connection != null)
            {
                this.oldConnection = this.endPort._port.connection;
            }

            this.createdConnection = this.startPort.parentNode._node.Connect(this.startPort._port.index, this.endPort._port.index, this.endPort.parentNode._node);
            
            this.startPort.parentNode.UpdateConnections();

            if(this.oldConnection != null){
                ctx.GetNodeById(this.oldConnection.NodeA.index).UpdateConnections();//also update the previously connected node to remove the old connection
            }
            
        } else{
            if(this.startPort._port.connection != null)
            {
                this.oldConnection = this.startPort._port.connection;

                let rNode: RenderableNode = ctx.GetNodeById(this.startPort._port.connection.NodeA.index);
                this.startPort._port.connection.Disconnect();
                rNode.UpdateConnections();
            }
        }
        


        ctx.removeChild(this.tmpLineObj);
    }
    public undo(ctx: NodeGraphEditor): void {
        
        //If we've overwritten a connection
        if(this.oldConnection != null){
            //Reset the old connection, this overwrites the createdConnection so we don't need to disconnect it
            this.oldConnection.NodeA.Connect(this.oldConnection.PortIndexA, this.oldConnection.PortIndexB, this.oldConnection.NodeB);
            ctx.GetNodeById(this.oldConnection.NodeA.index).UpdateConnections();
            
        }else{
            this.createdConnection.Disconnect();
        }

        this.startPort.parentNode.UpdateConnections();
        
        if(this.endPort != null)
            this.endPort.parentNode.UpdateConnections();    
        
    }

}