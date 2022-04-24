import Edge from "./Edge.js";
import Vertex from "./Vertex.js";

export default class GridGraph {
    element = document.createElement("div");
    adjacencyList = {}
    vertices = {}
    size = window.innerHeight / 2 - 50;
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
        this.source = source;
        source.element.classList.add("source");
    }

    /**
     * 
     * @param {Vertex} target 
     */
    setTarget(target) {
        this.target = target;
        target.element.classList.add("target");
    }

    getVertex(key) {
        return key in this.vertices ? this.vertices[key] : null;
    }

    getElement() {
        var _this = this;

        this.element.className = "grid";
        this.element.style.width = this.size + "px";
        this.element.style.height = this.size + "px";

        for (let key in this.vertices) {
            let vertex = this.vertices[key];
            let childElement = vertex.getElement(this.size / this.width);

            this.element.insertAdjacentElement("beforeend", childElement);
        }

        return this.element;
    }

    generate() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let key = `${x}:${y}`;
                let vertex = this.vertices[key];

                if (Math.random() < 0.45 && vertex !== this.source && vertex !== this.target) {
                    vertex.switchObstacle();
                }
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
}