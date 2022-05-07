export const MAX_UPPERBOUND = 9999999;

export default class Vertex {
    element = document.createElement("div");

    constructor(x, y) {
        this.key = `${x}:${y}`;
        this.x = x;
        this.y = y;
        this.upperbound = MAX_UPPERBOUND;
        this.heuristicValue = MAX_UPPERBOUND;
        this.previous = null;
        this.isObstacle = false;
    }

    /**
     * @param {number} upperbound
     */
    setUpperbound(upperbound) {
        this.upperbound = upperbound
    }

    /**
     * 
     * @returns {boolean}
     */
    hasPrevious() {
        return this.previous != null;
    }
    
    /**
     * 
     * @returns {Vertex}
     */
    getPrevious() {
        return this.previous;
    }

    /**
     * 
     * @param {Vertex} previous 
     */
    setPrevious(previous) {
        this.previous = previous;
    }

    /**
     * 
     * @returns {number}
     */
    getUpperbound() {
        return this.upperbound;
    }

    /**
     * 
     * @returns {string}
     */
    getKey() {
        return this.key;
    }

    /**
     * @param {number} heuristicValue
     */
    setHeuristicValue(heuristicValue) {
        this.heuristicValue = heuristicValue;
    }

    /**
     * 
     * @returns {number}
     */
    getHeuristicValue() {
        return this.heuristicValue;
    }

    reset() {
        this.heuristicValue = MAX_UPPERBOUND;
        this.upperbound = MAX_UPPERBOUND;
        this.previous = null;
        this.element.classList.remove("visited");
        this.element.classList.remove("path");
    }

    switchObstacle() {
        this.isObstacle = !this.isObstacle;
        
        if (this.isObstacle) {
            this.element.classList.add("obstacle");
        } else {
            this.element.classList.remove("obstacle"); 
        }
    }

    getElement(size) {
        this.element.classList.add("vertex");
        this.element.style.width = (70 / size) + "vmin";
        this.element.style.height = (70 / size) + "vmin";
        this.element.id = this.key;

        return this.element;
    }
}