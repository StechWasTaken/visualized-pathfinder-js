import Edge from "./Edge.js";
import Vertex from "./Vertex.js";

export default class GridGraph {
    element = document.createElement("div");
    adjacencyList = {}
    vertices = {}
    size = window.innerWidth / 3;
    source = null;
    target = null;

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let key = `${x}:${y}`;
                let vertex = new Vertex(x, y)
                this.vertices[key] = vertex;
                this.adjacencyList[key] = [];
            }
        }
    }

    /**
     * 
     * @param {Vertex} source 
     */
     setSource(source) {
        if (this.source != null) {
            this.source.element.classList.remove("source");
        }
        this.source = source;
        source.element.classList.add("source");
    }

    /**
     * 
     * @param {Vertex} target 
     */
    setTarget(target) {
        if (this.target != null) {
            this.target.element.classList.remove("target");
        }
        this.target = target;
        target.element.classList.add("target");
    }

    getVertex(key) {
        return key in this.vertices ? this.vertices[key] : null;
    }

    getElement() {
        this.element.className = "grid";

        for (let y = 0; y < this.height; y++) {
            let rowElement = document.createElement("div");
            rowElement.className = "row";
            rowElement.id = y;
            for (let x = 0; x < this.width; x++) {
                let vertex = this.vertices[`${x}:${y}`];
                let childElement = vertex.getElement(this.size / this.width);
                rowElement.insertAdjacentElement("beforeend", childElement);
            }
            this.element.insertAdjacentElement("beforeend", rowElement);
        }

        return this.element;
    }

    generate() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let key = `${x}:${y}`;
                let vertex = this.vertices[key];
            }
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let current = `${x}:${y}`;
                let neighbors = [`${x-1}:${y}`, `${x}:${y-1}`, `${x+1}:${y}`, `${x}:${y+1}`, `${x-1}:${y-1}`, `${x+1}:${y-1}`, `${x+1}:${y+1}`, `${x-1}:${y+1}`];
                for (let key in neighbors) {
                    if (neighbors[key] in this.adjacencyList) {
                        if (this.vertices[neighbors[key]].isObstacle) continue;
                        this.adjacencyList[current].push(this.vertices[neighbors[key]]);
                    }
                }
            }
        }
    }

    clear() {
        for (let key in this.vertices) {
            let vertex = this.vertices[key];
            vertex.reset();
        }
    }

    /**
     * 
     * @param {Vertex} vertex 
     */
    manhattenNeighbors(vertex) {
        const x = vertex.x;
        const y = vertex.y;
        const keys = [`${x-1}:${y}`, `${x}:${y-1}`, `${x+1}:${y}`, `${x}:${y+1}`];
        const neighbors = [];

        for (let key in keys) {
            if (keys[key] in this.adjacencyList) {
                neighbors.push(this.vertices[keys[key]]);
            }
        }

        return neighbors;
    }
}