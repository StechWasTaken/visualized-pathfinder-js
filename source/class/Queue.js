class Node {
    next = null;
    entry = null;

    /**
     * 
     * @param {any} entry 
     */
    constructor(entry) {
        this.next = null;
        this.entry = entry;
    }
}

export default class Queue {
    
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    /**
     * 
     * @param {any} entry 
     * @returns 
     */
    add(entry) {
        const node = new Node(entry);

        if (!this.first) {
            this.first = node;
            this.last = node;
        } else {
            this.last.next = node;
            this.last = node;
        }

        this.length++;
    }

    remove() {
        if (this.length == 0) return null;
        const element = this.first.entry;
        this.first = this.first?.next;
        this.length--;
        return element;
    }

    peek() {
        return this.first;
    }

    isEmpty() {
        return this.length == 0
    }

    size() {
        return this.size;
    }
}