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

/**
 * 
 * @param {Vertex} current 
 * @param {Vertex} source 
 * @param {Vertex} target 
 * @returns 
 */
const vertexColor = (current, source, target) => {
    if (current == target || current == source) return;
    const percentage = Edge.getWeight(current, target) / Edge.getWeight(source, target);
    const r = 255 * (1 - percentage);
    const g = percentage <= 1 ? 255 * percentage : 255 - (255 * (percentage - 1));
    const b = percentage <= 1 ? 0 : 255 * (percentage - 1);
    current.setColor(`rgb(${r}, ${g}, ${b})`);
}

export default class Pathfinder {
    
    /**
     * 
     * @param {GridGraph} graph 
     * @param {Vertex} source 
     * @param {Vertex} target 
     */
    static async dijkstra(graph, source, target) {
        const pq = new PriorityQueue(DIJKSTRA_COMPARATOR);
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

            vertexColor(current, source, target);

            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

            if (current === target) break;

            const neighbors = graph.adjacencyList[current.getKey()];

            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor) || neighbor.isObstacle) continue;

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

            vertexColor(current, source, target);

            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

            if (current === target) break;

            const neighbors = graph.adjacencyList[current.getKey()];

            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor) || neighbor.isObstacle) continue;

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

    static async bfs(graph, source, target) {
        const queue = [];
        const unvisited = new Set();

        for (let key in graph.vertices) {
            let vertex = graph.vertices[key];
            vertex.reset();
            unvisited.add(vertex);
        }

        source.setUpperbound(0);
        queue.push(source);

        while (queue.length > 0) {
            let current = queue.shift();

            vertexColor(current, source, target);

            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

            if (current == target) break;

            const neighbors = graph.adjacencyList[current.getKey()];

            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor) || neighbor.isObstacle) continue;

                let alt = current.getUpperbound() + Edge.getWeight(current, neighbor);

                if (alt < neighbor.getUpperbound()) {
                    neighbor.setUpperbound(alt);
                    neighbor.setPrevious(current);
                    queue.push(neighbor);
                }
            }

            unvisited.delete(current);
        }

        return Pathfinder.constructPath(source, target);
    }

    static async dfs(graph, source, target) {
        const stack = [];
        const unvisited = new Set();

        for (let key in graph.vertices) {
            let vertex = graph.vertices[key];
            vertex.reset();
            unvisited.add(vertex);
        }

        source.setUpperbound(0);
        stack.push(source);

        while (stack.length > 0) {
            let current = stack.pop();

            vertexColor(current, source, target);

            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

            if (current == target) break;

            let neighbors = graph.adjacencyList[current.getKey()];

            for (let key in neighbors) {
                let neighbor = neighbors[key];

                if (!unvisited.has(neighbor) || neighbor.isObstacle) continue;

                let alt = current.getUpperbound() + Edge.getWeight(current, neighbor);

                if (alt < neighbor.getUpperbound()) {
                    neighbor.setUpperbound(alt);
                    neighbor.setPrevious(current);
                }

                stack.push(neighbor);
            }

            unvisited.delete(current);
        }

        return Pathfinder.constructPath(source, target);
    }

    /**
     * 
     * @param {Vertex} source 
     * @param {Vertex} target 
     */
    static constructPath(source, target) {
        let path = [];

        let current = target;
        while (current.hasPrevious()) {
            if (current !== target) current.setColor("#ffe08a");
            path.push(current);
            current = current.getPrevious();
        }

        if (current !== source) return [];

        current.element.classList.add("path");

        path.push(current);

        return path.reverse();
    }
}