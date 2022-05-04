import GridGraph from "./class/GridGraph.js";
import Vertex from "./class/Vertex.js";
import Pathfinder from "./class/Pathfinder.js";
import Edge from "./class/Edge.js";

function selectAlgorithm() {
    const select = document.getElementById("algorithm");
    const algorithm = select.value;

    switch (algorithm) {
        case "dijkstra":
            return Pathfinder.dijkstra;
        case "astar":
            return Pathfinder.astar;
        default:
            return Pathfinder.dijkstra;
    }
}

function generateGraph() {
    const container = document.getElementById("container");
    const size = document.getElementById("size");
    const width = size.value
    const height = width;
    const graph = new GridGraph(width, height);
    graph.generate();
    container.innerHTML = "";
    container.append(graph.getElement());
    return graph;
}

const generateField = document.getElementById("generate");
const runField = document.getElementById("run");
const sizeField = document.getElementById("size");
const algorithmField = document.getElementById("algorithm");
const targetField = document.getElementById("target");
const sourceField = document.getElementById("source");
const clearField = document.getElementById("clear");

var graph = generateGraph();
var algorithm = selectAlgorithm();
var sourceKey = `0:0`;
var targetKey = `${size.value-1}:${size.value-1}`;
var source = graph.getVertex(sourceKey);
var target = graph.getVertex(targetKey);

graph.setSource(source);
graph.setTarget(target);

generateField.addEventListener("click", function() {
    graph = generateGraph();
});

algorithmField.addEventListener("change", function() {
    algorithm = selectAlgorithm();
});

sourceField.addEventListener("focusin", function() {
    graph.element.classList.add("is-set-source");
});

sourceField.addEventListener("focusout", async function(e) {
    await new Promise(resolve => setTimeout(resolve, 100));
    graph.element.classList.remove("is-set-source");
});

targetField.addEventListener("focusin", function() {
    graph.element.classList.add("is-set-target");
});

targetField.addEventListener("focusout", async function() {
    await new Promise(resolve => setTimeout(resolve, 100));
    graph.element.classList.remove("is-set-target");
});

graph.element.addEventListener("click", function(e) {
    if (this.classList.contains("is-set-source")) {
        sourceKey = e.target.id;
        source = graph.getVertex(sourceKey);
        graph.setSource(source);
    } else if (this.classList.contains("is-set-target")) {
        targetKey = e.target.id;
        target = graph.getVertex(targetKey);
        graph.setTarget(target);
    }
});

runField.addEventListener("click", async function() {
    this.setAttribute("disabled", "");
    clearField.setAttribute("disabled", "");
    generateField.setAttribute("disabled", "");
    sourceField.setAttribute("disabled", "");
    targetField.setAttribute("disabled", "");
    await algorithm(graph, source, target);
    sourceField.removeAttribute("disabled");
    targetField.removeAttribute("disabled");
    clearField.removeAttribute("disabled");
    generateField.removeAttribute("disabled");
    this.removeAttribute("disabled");
});

clearField.addEventListener("click", function() {
    graph.clear();
});
