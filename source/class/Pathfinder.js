import PriorityQueue from "./PriorityQueue.js";
import Vertex from "./Vertex.js";
import GridGraph from "./GridGraph.js";
import Edge from "./Edge.js";
import { MAX_UPPERBOUND } from "./Vertex.js";

/**
 * @param {Vertex} a
 * @param {Vertex} b
 */
const DIJKSTRA_COMPARATOR = (a, b) => (a.getUpperbound() < b.getUpperbound());

/**
 * @param {Vertex} a
 * @param {Vertex} b
 */
const ASTAR_COMPARATOR = (a, b) => (a.getHeuristicValue() < b.getHeuristicValue());

const TIMEOUT_TIME = 1;

export default class Pathfinder {
    
    /**
     * 
     * @param {GridGraph} graph 
     * @param {Vertex} source 
     * @param {Vertex} target 
     */
    static async dijkstra(graph, source, target) {
        let pq = new PriorityQueue(DIJKSTRA_COMPARATOR);
        const unvisited = new Set();

        for (let key in graph.vertices) {
            let vertex = graph.vertices[key];
            vertex.reset();
            unvisited.add(vertex);
        }

        source.setUpperbound(0);
        pq.push(source);

        while (!pq.isEmpty()) {
            let current = pq.pop();

            current.element.classList.add("visited");

            const promise = new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
            await promise;

            if (current === target) break;

            let neighbors = graph.adjacencyList[current.getKey()];

            for (let key in neighbors) {
                let neighbor = neighbors[key];

                if (!unvisited.has(neighbor)) continue;

                let alt = current.getUpperbound() + Edge.getWeight(current, neighbor);
                if (alt < neighbor.getUpperbound()) {
                    neighbor.setUpperbound(alt);
                    neighbor.setPrevious(current);
                    pq.push(neighbor);
                }
            }

            unvisited.delete(current);
        }

        return Pathfinder.constructPath(source, target);
    }   

    /**
     * 
     * @param {GridGraph} graph 
     * @param {Vertex} source 
     * @param {Vertex} target 
     */
    static async astar(graph, source, target) {
        const pq = new PriorityQueue(ASTAR_COMPARATOR);
        const unvisited = new Set();

        for (let key in graph.vertices) {
            let vertex = graph.vertices[key];
            vertex.reset();
            unvisited.add(vertex);
        }

        source.setUpperbound(0);
        source.setHeuristicValue(Edge.getWeight(source, target));
        pq.push(source);

        while (!pq.isEmpty()) {
            let current = pq.pop();

            current.element.classList.add("visited");

            const promise = new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
            await promise;

            if (current === target) break;

            let neighbors = graph.adjacencyList[current.getKey()];

            for (let key in neighbors) {
                let neighbor = neighbors[key];

                if (!unvisited.has(neighbor)) continue;

                let alt = current.getUpperbound() + Edge.getWeight(current, neighbor);

                if (alt < neighbor.getUpperbound()) {
                    neighbor.setUpperbound(alt);
                    neighbor.setHeuristicValue(alt + Edge.getWeight(neighbor, target));
                    neighbor.setPrevious(current);
                    pq.push(neighbor);
                }
            }

            unvisited.delete(current);
        }

        return Pathfinder.constructPath(source, target);
    }

    /**
     * 
     * @param {*} source 
     * @param {*} target 
     */
    static constructPath(source, target) {
        let path = [];

        let current = target;
        while (current.hasPrevious()) {
            current.element.classList.add("path");
            path.push(current);
            current = current.getPrevious();
        }

        if (current !== source) return [];

        current.element.classList.add("path");

        path.push(current);

        return path.reverse();
    }
}