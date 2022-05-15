import Edge from "./Edge.js";
import Vertex from "./Vertex.js";

export default class GridGraph {
    element = document.createElement("div");
    adjacencyList = new Map();
    vertices = new Map();
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

        let css = " ";

        for (let i = 0; i < width; i++) {
            css += "1fr ";
        }

        this.element.style.cssText = "grid-template-columns:" + css + ";";

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let vertex = new Vertex(x, y)
                this.vertices.set(`${x}-${y}`, vertex);
                this.adjacencyList.set(`${x}-${y}`, []);
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
        return this.vertices.has(key) ? this.vertices.get(key) : null;
    }

    hasVertex(key) {
        return this.vertices.has(key);
    }

    getNeighbors(key) {
        return this.adjacencyList.get(key);
    }

    getElement() {
        this.element.className = "grid";

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let vertex = this.vertices.get(`${x}-${y}`);
                let childElement = vertex.getElement(this.width);
                childElement.classList.add("vertex");
                this.element.insertAdjacentElement("beforeend", childElement);
            }
        }

        return this.element;
    }

    generate() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const currentKey = `${x}-${y}`;
                const neighborKeys = [`${x-1}-${y+1}`, `${x-1}-${y-1}`, `${x+1}-${y-1}`, `${x+1}-${y+1}`, `${x}-${y+1}`, `${x-1}-${y}`, `${x}-${y-1}`, `${x+1}-${y}`];
                for (const neighborKey of neighborKeys) {
                    if (this.adjacencyList.has(neighborKey)) {
                        if (this.vertices.get(neighborKey).isObstacle) continue;
                        this.adjacencyList.get(currentKey).push(this.vertices.get(neighborKey));
                    }
                }
            }
        }
    }

    clear() {
        for (const vertex of this.vertices.values()) {
            vertex.reset();
        }
    }
}