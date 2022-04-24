import GridGraph from "./class/GridGraph.js";
import Vertex from "./class/Vertex.js";
import Pathfinder from "./class/Pathfinder.js";
import Edge from "./class/Edge.js";

const WIDTH = 50;
const HEIGHT = WIDTH;

let sourceKey = `${Math.floor(Math.random() * (WIDTH - 1))}:${Math.floor(Math.random() * (HEIGHT - 1))}`;
let targetKey = `${Math.floor(Math.random() * (WIDTH - 1))}:${Math.floor(Math.random() * (HEIGHT - 1))}`;

let graph1 = new GridGraph(WIDTH, HEIGHT);
graph1.setSource(graph1.getVertex(sourceKey));
graph1.setTarget(graph1.getVertex(targetKey));
graph1.generate();  

document.getElementById("container").insertAdjacentElement("beforeend", graph1.getElement());

let path1 = Pathfinder.dijkstra(graph1, graph1.source, graph1.target);

let graph2 = new GridGraph(WIDTH, HEIGHT);
graph2.setSource(graph2.getVertex(sourceKey));
graph2.setTarget(graph2.getVertex(targetKey));
graph2.generate();

document.getElementById("container").insertAdjacentElement("beforeend", graph2.getElement());

let path2 = Pathfinder.astar(graph2, graph2.source, graph2.target);
