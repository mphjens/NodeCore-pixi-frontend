import { Application, BatchGeometry, Graphics, InteractionEvent, Loader, Point, Rectangle } from 'pixi.js';
import { NodeGraphEditor } from './NodeEditorPixijs/NodeGraphEditor';
import { NodeGraph } from './NodeSystem/NodeCore';
import { AddNode } from './NodeSystem/Nodes/AddNode';
import { ConstantNumberNode } from './NodeSystem/Nodes/ConstantNumberNode';
import { MultiplyNode } from './NodeSystem/Nodes/MultiplyNode';

const loader = Loader.shared;
class Game {
  private app: Application;
  nodeEditor: NodeGraphEditor = new NodeGraphEditor(this.generate_test_graph());

  constructor() {
	// instantiate app
	this.app = new Application({
	  width: 1080,
	  height: 1080,
	  backgroundColor: 0x333333, // light blue
	});
	//The bg object enables global pointer events within the stage
	let bg = new Graphics();
	bg.hitArea = new Rectangle(0,0, this.app.screen.width, this.app.screen.height);
	this.app.stage.addChild(bg)

	// create view in DOM
	document.body.appendChild(this.app.view);

	// preload needed assets
	loader.add('samir', 'assets/img/hero.png');

	// then launch app on loader ready
	loader.load(this.setup.bind(this));
  }

  //DEBUG FUNCTION
  generate_test_graph():NodeGraph
  {
	let Graph: NodeGraph = new NodeGraph();
	var cn1 = new ConstantNumberNode(2.5, Graph);
	var cn2 = new ConstantNumberNode(3.5, Graph);
	var an = new AddNode(Graph);
	var cn3 = new ConstantNumberNode(6.5, Graph);
	var an2 = new MultiplyNode(Graph);
	// Graph.AddNode(cn1);
	// Graph.AddNode(cn2);
	// Graph.AddNode(an);
	// Graph.AddNode(cn3);
	// Graph.AddNode(an2);

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

	this.app.stage.interactive = true;

	//const nodeRenderer: NodeGraphEditor = new NodeGraphEditor(this.generate_test_graph());
	this.app.stage.addChild(this.nodeEditor);
	
	this.app.stage.addListener('pointermove', (data:InteractionEvent)=>{this.nodeEditor.onWindowPointerMove(data)});
	this.app.stage.addListener('pointerdown', (data:InteractionEvent)=>{this.nodeEditor.onWindowPointerDown(data)});
	this.app.stage.addListener('pointerup', (data:InteractionEvent)=>{this.nodeEditor.onWindowPointerUp(data)});
	
	window.addEventListener('keydown', (data:KeyboardEvent)=>{this.nodeEditor.onWindowKeyDown(data)})
	window.addEventListener('keyup', (data:KeyboardEvent)=>{this.nodeEditor.onWindowKeyUp(data)})
	
	//  animate hero
	this.app.ticker.add(() => {
	  //nodeRenderer.x += 0.05;
	});

	//Mainloop
	this.app.ticker.add(()=>{
		
		this.nodeEditor.update();
	})
  }
}

// eslint-disable-next-line no-new
new Game();
