const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let [Y, X] = [21, 21];
let [H, W] = [Y * 30, X * 30];
canvas.width = W;
canvas.height = H;

class Maze {
    constructor(h, w) {
        this.h = h;
        this.w = w;
        this.wall = "#";
        this.road = ".";
        this.mazeMap = [];
        this.availableRoad = [];
        this.initMaze();
        while (this.availableRoad.length !== 0) {
            this.createMaze();
        }
    }

    initMaze() {
        for (let i = 0; i < this.h + 2; i++) {
            this.mazeMap.push(new Array());
            for (let j = 0; j < this.w + 2; j++) {
                let now = this.road;
                if (i === 0 || i === this.h + 1 || j === 0 || j === this.w + 1) {
                    now = this.wall;
                } else if (i % 2 === 0 && j % 2 === 0) {
                    this.availableRoad.push(`${i}_${j}`);
                }
                this.mazeMap[i][j] = now;
            }
        }
    }
    splitPos2Two(posStr) {
        let splitted = posStr.split("_");
        return [Number(splitted[0]), Number(splitted[1])];
    }
    createMaze() {
        console.log("---------------------");
        let [y, x] = this.splitPos2Two(this.availableRoad[Math.floor(Math.random() * this.availableRoad.length)]);
        let newWall = new Set([`${y}_${x}`]);
        while (true) {
            let direction = [
                [2, 0],
                [-2, 0],
                [0, 2],
                [0, -2]
            ];
            let nxt_direction = direction[Math.floor(Math.random() * direction.length)];
            let [dy, dx] = [nxt_direction[0], nxt_direction[1]];
            let [ny, nx] = [y + dy, x + dx];

            let idx = this.availableRoad.indexOf(`${ny}_${nx}`);
            if (idx !== -1) {
                return false;
            } else {
                newWall.add(`${y}_${x}`);
                newWall.add(`${y + dy/2}_${x + dx /2}`);
                if (this.mazeMap[ny][nx] === this.wall) { break; }
            }

            [y, x] = [ny, nx];
        }
        for (let pos of newWall) {
            [y, x] = this.splitPos2Two(pos);
            this.mazeMap[y][x] = this.wall;
            let idx = this.availableRoad.indexOf(pos);
            if (idx !== -1) { this.availableRoad.splice(idx, 1); }
        }
        return true;
    }
    drawOnDocument() {
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 17; j++) {
                if (this.mazeMap[i][j] === this.wall) { document.write("●"); } else { document.write("○"); }
            }
            document.write("<br>");
        }
    }
    drawOnCanvas(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "white";
        for (let i = 0; i < Y + 2; i++) {
            for (let j = 0; j < X + 2; j++) {
                if (this.mazeMap[i][j] === this.road) {
                    ctx.fillRect(W / (X + 2) * j, H / (Y + 2) * i, W / (X + 2), H / (Y + 2));
                }
            }
        }
        ctx.closePath();
    }
}

let newMaze = new Maze(Y, X);
newMaze.drawOnCanvas(ctx);
newMaze.drawOnDocument();