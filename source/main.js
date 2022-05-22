import GridGraph from "./class/GridGraph.js";
import Pathfinder from "./class/Pathfinder.js";
import Maze from "./class/Maze.js";

function selectPathfindingAlgorithm() {
    const algorithm = document.getElementById("algorithm").value;

    switch (algorithm) {
        case "dijkstra":
            return Pathfinder.dijkstra;
        case "astar":
            return Pathfinder.astar;
        case "bfs":
            return Pathfinder.bfs;
        case "dfs":
            return Pathfinder.dfs;
        default:
            return Pathfinder.dijkstra;
    }
}

function selectMazeAlgorithm() {
    const algorithm = document.getElementById("maze").value; 

    switch (algorithm) {
        case "prim":
            return Maze.prim;
        case "rmpprim":
            return Maze.multiplePathPrim;
        case "rmpdfs":
            return Maze.multiplePathDFS;
        case "random":
            return Maze.random;
        case "dfs":
            return Maze.dfs;
        case "bt":
            return Maze.binaryTree;
        default:
            return (graph) => (graph);
    }
}

async function generateGraph() {
    const container = document.getElementById("container");
    const size = document.getElementById("size").value;
    const graph = new GridGraph(size, size);
    graph.generate();
    container.innerHTML = "";
    container.append(graph.getElement());
    const algorithm = selectMazeAlgorithm();
    await algorithm(graph);
    return graph;
}

const gridField = document.getElementById("grid");
const runField = document.getElementById("run");
const sizeField = document.getElementById("size");
const algorithmField = document.getElementById("algorithm");
const targetField = document.getElementById("target");
const sourceField = document.getElementById("source");
const clearField = document.getElementById("clear");
const hamburger = document.getElementById("hamburger");

var graph = null;
var source = null;
var target = null;   
var algorithm = selectPathfindingAlgorithm();

hamburger.addEventListener("click", function() {
    const menu = document.getElementById("controller-navbar");

    if (!menu.classList.contains("is-active")) {
        menu.classList.add("is-active");
    } else {
        menu.classList.remove("is-active");
    }
    
});

gridField.addEventListener("click", async function() {
    document.getElementById("run").setAttribute("disabled", "");
    document.getElementById("grid").setAttribute("disabled", "");
    document.getElementById("source").setAttribute("disabled", "");
    document.getElementById("target").setAttribute("disabled", "");
    document.getElementById("clear").setAttribute("disabled", "");
    document.getElementById("source").value = "";
    document.getElementById("target").value = "";
    graph = await generateGraph();
    document.getElementById("source").removeAttribute("disabled");
    document.getElementById("grid").removeAttribute("disabled");
    document.getElementById("clear").removeAttribute("disabled");
    document.getElementById("target").removeAttribute("disabled");
    graph.element.addEventListener("click", function(e) {
        if (this.classList.contains("is-set-source")) {
            source = graph.getVertex(e.target.id);
            graph.setSource(source);
            document.getElementById("source").value = `Source: (${source.x}, ${source.y})`;
        } else if (this.classList.contains("is-set-target")) {
            target = graph.getVertex(e.target.id);
            graph.setTarget(target);
            document.getElementById("target").value = `Target: (${target.x}, ${target.y})`;
        }
    });
});

algorithmField.addEventListener("change", function() {
    algorithm = selectPathfindingAlgorithm();
});

sourceField.addEventListener("focusin", function() {
    graph.element.classList.add("is-set-source");
});

sourceField.addEventListener("focusout", async function(e) {
    await new Promise(resolve => setTimeout(resolve, 200));
    graph.element.classList.remove("is-set-source");
    if (target != null) {
        document.getElementById("run").removeAttribute("disabled");
    }
});

targetField.addEventListener("focusin", function() {
    graph.element.classList.add("is-set-target");
});

targetField.addEventListener("focusout", async function() {
    await new Promise(resolve => setTimeout(resolve, 200));
    graph.element.classList.remove("is-set-target");
    if (source != null) {
        document.getElementById("run").removeAttribute("disabled");
    }
});

runField.addEventListener("click", async function() {
    this.setAttribute("disabled", "");
    clearField.setAttribute("disabled", "");
    gridField.setAttribute("disabled", "");
    sourceField.setAttribute("disabled", "");
    targetField.setAttribute("disabled", "");
    let path = await algorithm(graph, source, target);
    clearField.removeAttribute("disabled");
    gridField.removeAttribute("disabled");
    this.removeAttribute("disabled");
    if (source == target) {
        graph.clear();
        document.getElementById("source").removeAttribute("disabled");
        document.getElementById("target").removeAttribute("disabled");
    }
});

clearField.addEventListener("click", function() {
    graph.clear();
    document.getElementById("source").removeAttribute("disabled");
    document.getElementById("target").removeAttribute("disabled");
});
