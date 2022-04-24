import Vertex from "./Vertex.js";

export default class Edge {

    /**
     * Returns the distance between two vertices.
     * @param {Vertex} a 
     * @param {Vertex} b 
     */
    static getWeight(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
}