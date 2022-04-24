import Vertex from "./Vertex.js";

export default class Graph {
    adjacencyList = new Map();
    vertices = new Map();

    /**
     * 
     * @param {Vertex} x 
     * @param {Vertex} y 
     */
    adjacent(x, y) {
        if (!this.adjacencyList.has(x)) return false;

        return this.adjacencyList.get(x).has(y);
    }

    /**
     * 
     * @param {Vertex} x 
     */
    neighbors(x) {
        if (!this.adjacencyList.has(x)) return new Array();

        return this.adjacencyList.get(x);
    }

    /**
     * 
     * @param {Vertex} x 
     */
    addVertex(x) {
        if (!this.vertices.has(x)) {
            this.vertices.set(x, x);
        }
    }

    /**
     * 
     * @param {Vertex} x 
     */
    removeVertex(x) {
        if (this.vertices.has(x)) {
            this.vertices.delete(x);
        }
    }

    /**
     * 
     * @param {Vertex} x 
     * @param {Vertex} y 
     */
    addEdge(x, y) {
        if (!this.adjacencyList.has(x)) {
            this.adjacencyList.set(x, new Array());
        }

        this.adjacencyList.get(x).push(y);
    }

    /**
     * 
     * @param {Vertex} x 
     * @param {Vertex} y 
     */
    removeEdge(x, y) {
        if (this.adjacencyList.has(x)) {
            let edges = this.adjacencyList.get(x);
            let index = edges.indexOf(y);
            if (index > -1) {
                edges.splice(index, 1);
            }
        }
    }
}