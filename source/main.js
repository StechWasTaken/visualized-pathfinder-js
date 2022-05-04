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

var graph = null;
var source = null;
var target = null;   
var algorithm = selectAlgorithm();

generateField.addEventListener("click", function() {
    document.getElementById("run").setAttribute("disabled", "");
    document.getElementById("source").removeAttribute("disabled");
    document.getElementById("source").value = "";
    document.getElementById("target").removeAttribute("disabled");
    document.getElementById("target").value = "";
    graph = generateGraph();
    graph.element.addEventListener("click", function(e) {
        if (this.classList.contains("is-set-source")) {
            source = graph.getVertex(e.target.id);
            graph.setSource(source);
            document.getElementById("source").value = `Cell: (${source.x}, ${source.y})`;
        } else if (this.classList.contains("is-set-target")) {
            target = graph.getVertex(e.target.id);
            graph.setTarget(target);
            document.getElementById("target").value = `Cell: (${target.x}, ${target.y})`;
        }
    });
});

algorithmField.addEventListener("change", function() {
    algorithm = selectAlgorithm();
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
    generateField.setAttribute("disabled", "");
    sourceField.setAttribute("disabled", "");
    targetField.setAttribute("disabled", "");
    await algorithm(graph, source, target);
    clearField.removeAttribute("disabled");
    generateField.removeAttribute("disabled");
    this.removeAttribute("disabled");
});

clearField.addEventListener("click", function() {
    graph.clear();
    document.getElementById("source").removeAttribute("disabled");
    document.getElementById("target").removeAttribute("disabled");
});
