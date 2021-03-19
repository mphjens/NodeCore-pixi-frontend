import { Application, Loader } from 'pixi.js';
import Character from './app/Character';
import { NodeGraphRenderer } from './NodeRendererPixijs/NodeGraphRenderer';
import { NodeGraph } from './NodeSystem/NodeCore';
import { AddNode } from './NodeSystem/Nodes/AddNode';
import { ConstantNumberNode } from './NodeSystem/Nodes/ConstantNumberNode';
import { MultiplyNode } from './NodeSystem/Nodes/MultiplyNode';

const loader = Loader.shared;
class Game {
  private app: Application;

  constructor() {
    // instantiate app
    this.app = new Application({
      width: 512,
      height: 512,
      backgroundColor: 0x1099bb, // light blue
    });

    // create view in DOM
    document.body.appendChild(this.app.view);

    // preload needed assets
    loader.add('samir', '/assets/img/hero.png');

    // then launch app on loader ready
    loader.load(this.setup.bind(this));
  }

  //DEBUG FUNCTION
  generate_test_graph():NodeGraph
  {
    let Graph: NodeGraph = new NodeGraph();
    var cn1 = new ConstantNumberNode(2.5);
    var cn2 = new ConstantNumberNode(3.5);
    var an = new AddNode();
    var cn3 = new ConstantNumberNode(6.5);
    var an2 = new MultiplyNode();
    Graph.AddNode(cn1);
    Graph.AddNode(cn2);
    Graph.AddNode(an);
    Graph.AddNode(cn3);
    Graph.AddNode(an2);

    cn1.Connect(0, 0, an);
    cn2.Connect(0, 1, an);
    cn3.Connect(0, 0, an2);
    an.Connect(0,1,an2);

    //an2.EvaluateNode();
    Graph.EvaluateAll();

    return Graph;
  }
  //

  setup(): void {
    // append hero
    const hero = new Character(loader.resources.samir.texture);
    this.app.stage.addChild(hero.sprite);
    hero.setTopPosition(256);

    const nodeRenderer: NodeGraphRenderer = new NodeGraphRenderer(this.generate_test_graph());
    this.app.stage.addChild(nodeRenderer);

    //  animate hero
    this.app.ticker.add(() => {
      nodeRenderer.x += 0.05;
      if (hero.sprite.x >= this.app.view.width) {
        hero.direction = 'left';
      } else if (hero.sprite.x < 0) {
        hero.direction = 'right';
      }
      hero.move();
    });
  }
}

// eslint-disable-next-line no-new
new Game();
