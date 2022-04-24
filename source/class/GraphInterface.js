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
        if (!this.adjacencyList.has(x)) return [];

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

    
}