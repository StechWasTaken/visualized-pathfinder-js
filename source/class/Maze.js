import GridGraph from "./GridGraph.js";
import Vertex from "./Vertex.js";

const TIMEOUT_TIME = 1;

export default class Maze {

    /**
     * 
     * @param {GridGraph} graph 
     */
    static async prim(graph) {
        const passages = new Set();
        const walls = [];

        graph.clear();

        for (let y = 0; y < graph.height; y++) {
            for (let x = 0; x < graph.width; x++) {
                graph.vertices[`${x}:${y}`].switchObstacle();
            }
            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
        }

        let x = Math.floor(Math.random() * (graph.width - 1));
        let y = Math.floor(Math.random() * (graph.height - 1));

        x += x % 2 == 0 ? 1 : 0;
        y += y % 2 == 0 ? 1 : 0; 

        let vertex = graph.getVertex(`${x}:${y}`);
        vertex.switchObstacle();
        passages.add(vertex);

        Maze.frontierCells(graph, vertex).forEach(fc => {
            walls.push(fc);
        });

        while (walls.length > 0) {
            let index = Math.floor(Math.random() * walls.length);
            let current = walls[index];
            let neighbors = Maze.frontierCells(graph, current);

            neighbors.sort((a, b) => 0.5 - Math.random());

            for (let key in neighbors) {
                let neighbor = neighbors[key];
                
                if (!neighbor.isObstacle) {
                    if (current.x == neighbor.x) {
                        let dy = current.y > neighbor.y ? current.y - 1 : current.y + 1;
                        let dx = current.x;
                        let key = `${dx}:${dy}`;
                        vertex = graph.getVertex(key);
                    } else {
                        let dy = current.y;
                        let dx = current.x > neighbor.x ? current.x - 1 : current.x + 1;
                        let key = `${dx}:${dy}`;
                        vertex = graph.getVertex(key);
                    }

                    if (!vertex || passages.has(vertex)) continue;

                    vertex.switchObstacle();

                    await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

                    current.switchObstacle();
                    passages.add(vertex);
                    passages.add(current);
                    
                    Maze.frontierCells(graph, current).forEach(fc => {
                        if (!walls.includes(fc) && !passages.has(fc)) walls.push(fc);
                    });

                    break;
                }
            }
            
            walls.splice(index, 1);
        }
    }

    static async random(graph) {
        graph.clear();

        for (let y = 0; y < graph.height; y++) {
            for (let x = 0; x < graph.width; x++) {
                if (Math.random() < 0.5) {
                    graph.vertices[`${x}:${y}`].switchObstacle();
                }
            }
            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
        }
    }

    static async dfs(graph) {
        const stack = [];
        const passages = new Set();

        graph.clear();

        for (let y = 0; y < graph.height; y++) {
            for (let x = 0; x < graph.width; x++) {
                graph.vertices[`${x}:${y}`].switchObstacle();
            }
            await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
        }

        let x = Math.floor(Math.random() * (graph.width - 1));
        let y = Math.floor(Math.random() * (graph.height - 1));

        x += x % 2 == 0 ? 1 : 0;
        y += y % 2 == 0 ? 1 : 0; 

        let vertex = graph.getVertex(`${x}:${y}`);
        stack.push(vertex);

        while (stack.length > 0) {
            let current = stack.pop();
            let neighbors = Maze.frontierCells(graph, current);

            neighbors.sort((a, b) => 0.5 - Math.random());

            passages.add(current);
            if (current.isObstacle) current.switchObstacle();

            for (let key in neighbors) {
                let neighbor = neighbors[key];

                if (!passages.has(neighbor)) {
                    if (current.x == neighbor.x) {
                        let dy = current.y > neighbor.y ? current.y - 1 : current.y + 1;
                        let dx = current.x;
                        vertex = graph.getVertex(`${dx}:${dy}`);
                    } else {
                        let dy = current.y;
                        let dx = current.x > neighbor.x ? current.x - 1 : current.x + 1;
                        vertex = graph.getVertex(`${dx}:${dy}`);
                    }

                    stack.push(current);
                    vertex.switchObstacle();
                    passages.add(vertex);
                    passages.add(neighbor);
                    stack.push(neighbor);

                    await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

                    break;
                }
            }
        }
    }

    /**
     * 
     * @param {GridGraph} graph 
     * @param {Vertex} vertex 
     */
    static frontierCells(graph, vertex) {
        const x = vertex.x;
        const y = vertex.y;
        const keys = [`${x-2}:${y}`, `${x}:${y-2}`, `${x+2}:${y}`, `${x}:${y+2}`];
        const neighbors = [];

        for (let key in keys) {
            if (keys[key] in graph.adjacencyList) {
                neighbors.push(graph.vertices[keys[key]]);
            }
        }

        return neighbors;
    }
}