function Node(value) {
    this.data = value;
    this.previous = null;
    this.next = null;
}

function LinkedList() {
    this._length = 0;
    this.head = null;
    this.tail = null;
}

LinkedList.prototype.push = function(value) {
    var node = new Node(value);

    if (this._length) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
    } else {
        this.head = node;
        this.tail = node;
    }

    this._length++;

    return node;
};

LinkedList.prototype.pushleft = function(value) {
    var node = new Node(value);

    if (this._length) {
        this.head.previous = node;
        node.next = this.head;
        this.head = node;
    } else {
        this.head = node;
        this.tail = node;
    }

    this._length++;
}
LinkedList.prototype.searchNodeAt = function(position) {
    var currentNode = this.head,
        length = this._length,
        count = 1,
        message = { failure: 'Failure: non-existent node in this list.' };

    // 1st use-case: an invalid position
    if (length === 0 || position < 1 || position > length) {
        throw new Error(message.failure);
    }

    // 2nd use-case: a valid position
    while (count < position) {
        currentNode = currentNode.next;
        count++;
    }

    return currentNode;
};

LinkedList.prototype.length = function(position) {
    return this._length;
}
LinkedList.prototype.pop = function(position) {
    let res = this.tail;
    if (this._length === 1) {
        this.tail = null;
        this.head = null;
        this._length = 0;
    } else {
        this._length--;
        this.tail = this.tail.previous;
    }

    return res.data;
};
LinkedList.prototype.popleft = function(position) {
    let res = this.head;
    if (this._length === 1) {
        this.tail = null;
        this.head = null;
        this._length = 0;
    } else {
        this._length--;
        if (this.head === null) {
            return;
        }
        this.head = this.head.next;
    }

    return res.data;
};
export { LinkedList };