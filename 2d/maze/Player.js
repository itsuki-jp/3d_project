class Player {
    constructor(x, y, mazeMap) {
        this.x = x;
        this.y = y;
        this.mazeMap = mazeMap;
        this.drawPlayer();
    }

    drawPlayer() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(W / (X + 2) * this.x, H / (Y + 2) * this.y, W / (X + 2), H / (Y + 2));
        ctx.closePath();
    }
    convertEventKey2dydx(event) {
        let directionDict = {
            "ArrowRight": [0, 1],
            "ArrowLeft": [0, -1],
            "ArrowDown": [1, 0],
            "ArrowUp": [-1, 0]
        };
        if (event.key in directionDict) { return directionDict[event.key]; }
        return false;
    }
    isAvailable(event) {
        let dydx = this.convertEventKey2dydx(event);
        if (!dydx) { return false; }
        let [dy, dx] = dydx;
        if (this.mazeMap[this.y + dy][this.x + dx] === "#") { return false; }
        return true;
    }

    move(event) {
        let dydx = this.convertEventKey2dydx(event);
        if (!dydx) { return false; }
        let [dy, dx] = dydx;
        this.x += dx;
        this.y += dy;
    }
}