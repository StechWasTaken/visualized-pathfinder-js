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

        await Maze.obstacleFill(graph);

        let x = Math.floor(Math.random() * (graph.width - 1));
        let y = Math.floor(Math.random() * (graph.height - 1));

        x += x % 2 == 0 ? 1 : 0;
        y += y % 2 == 0 ? 1 : 0; 

        let vertex = graph.getVertex(`${x}-${y}`);
        vertex.switchObstacle();
        passages.add(vertex);

        Maze.frontierCells(graph, vertex).forEach(fc => {
            walls.push(fc);
        });

        while (walls.length > 0) {
            const index = Math.floor(Math.random() * walls.length);
            const current = walls[index];
            const neighbors = Maze.frontierCells(graph, current);

            neighbors.sort((a, b) => 0.5 - Math.random());

            for (const neighbor of neighbors) {
                if (!neighbor.isObstacle) {
                    let dividingVertex = null;
                    if (current.x == neighbor.x) {
                        let dy = current.y > neighbor.y ? current.y - 1 : current.y + 1;
                        let dx = current.x;
                        let key = `${dx}-${dy}`;
                        dividingVertex = graph.getVertex(key);
                    } else {
                        let dy = current.y;
                        let dx = current.x > neighbor.x ? current.x - 1 : current.x + 1;
                        let key = `${dx}-${dy}`;
                        dividingVertex = graph.getVertex(key);
                    }

                    if (!dividingVertex || passages.has(dividingVertex)) continue;

                    dividingVertex.switchObstacle();

                    await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

                    current.switchObstacle();
                    passages.add(dividingVertex);
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

        let count = 0;
        for (const vertex of graph.vertices.values()) {
            if (Math.random() < 0.5) vertex.switchObstacle();
            if (++count % graph.width == 0) await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
        }
    }

    static async dfs(graph) {
        const stack = [];
        const passages = new Set();

        graph.clear();

        await Maze.obstacleFill(graph);

        let x = Math.floor(Math.random() * (graph.width - 1));
        let y = Math.floor(Math.random() * (graph.height - 1));

        x += x % 2 == 0 ? 1 : 0;
        y += y % 2 == 0 ? 1 : 0; 

        const startVertex = graph.getVertex(`${x}-${y}`);
        stack.push(startVertex);

        while (stack.length > 0) {
            const current = stack.pop();
            const neighbors = Maze.frontierCells(graph, current);

            neighbors.sort((a, b) => 0.5 - Math.random());

            passages.add(current);
            if (current.isObstacle) current.switchObstacle();

            for (const neighbor of neighbors) {
                let dividingVertex = null;

                if (!passages.has(neighbor)) {
                    if (current.x == neighbor.x) {
                        let dy = current.y > neighbor.y ? current.y - 1 : current.y + 1;
                        let dx = current.x;
                        dividingVertex = graph.getVertex(`${dx}-${dy}`);
                    } else {
                        let dy = current.y;
                        let dx = current.x > neighbor.x ? current.x - 1 : current.x + 1;
                        dividingVertex = graph.getVertex(`${dx}-${dy}`);
                    }

                    stack.push(current);
                    dividingVertex.switchObstacle();
                    passages.add(dividingVertex);
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
     */
    static async binaryTree(graph) {
        const visited = new Set();
        const unconnected = new Set();

        graph.clear();

        await Maze.obstacleFill(graph);
        
        const startVertex = graph.getVertex(`${1}-${1}`);
        startVertex.switchObstacle();
        visited.add(startVertex);
        unconnected.add(startVertex);

        for (const current of graph.vertices.values()) {
            const neighbors = Maze.frontierCells(graph, current);

            neighbors.sort((a, b) => 0.5 - Math.random());

            for (const neighbor of neighbors) {
                let dividingVertex = null;

                if (!visited.has(neighbor)) continue;

                if (current.x == neighbor.x) {
                    let dy = current.y > neighbor.y ? current.y - 1 : current.y + 1;
                    let dx = current.x;
                    dividingVertex = graph.getVertex(`${dx}-${dy}`);
                } else {
                    let dy = current.y;
                    let dx = current.x > neighbor.x ? current.x - 1 : current.x + 1;
                    dividingVertex = graph.getVertex(`${dx}-${dy}`);
                }

                dividingVertex.switchObstacle();
                unconnected.add(current);

                if (current.isObstacle) current.switchObstacle();

                visited.add(current);

                await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));

                break;
            }
        }
    }

    /**
     * 
     * @param {GridGraph} graph 
     */
    static async obstacleFill(graph) {
        let counter = 0;

        for (const [key, value] of graph.vertices.entries()) {
            if (!value.isObstacle) value.switchObstacle();
            if (++counter % graph.width == 0) await new Promise(resolve => setTimeout(resolve, TIMEOUT_TIME));
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
        const keys = [`${x-2}-${y}`, `${x}-${y-2}`, `${x+2}-${y}`, `${x}-${y+2}`];
        const neighbors = [];

        for (const key of keys) {
            if (graph.adjacencyList.has(key)) {
                neighbors.push(graph.getVertex(key));
            }
        }

        return neighbors;
    }
}