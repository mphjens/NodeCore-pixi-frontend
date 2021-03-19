import { Graphics, Point,  Text } from "pixi.js";
import { INode } from "../NodeSystem/NodeCore";

export class RenderableNode extends Graphics{
    public _node: INode;
    private nameText: Text;

    constructor(node: INode, pos: Point){
        super()
        this.interactive = true;

        this._node = node;

        this.nameText = new Text(node.getName());
        this.addChild(this.nameText);

        this.x = pos.x;
        this.y = pos.y;
    }

    public Draw()
    {
        this.lineStyle(4, 0xFF3300, 1);
        this.beginFill(0x66CCFF);
        this.drawRect(0, 0, 64, 64);
        this.endFill();        
    }
}