"use strict";

import { LinkedList } from "./LinkedList";
window.LinkedList = LinkedList;


class Maze {
    constructor(h, w) {
        this.h = h;
        this.w = w;
        this.wall = "#";
        this.road = ".";
        this.mazeMap = [];
        this.directionOneStepAll = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        this.directionOneStepNoUpper = [
            [1, 0],
            [0, 1],
            [0, -1]
        ];
        this.mazeMap = this.initMaze();


        this.createMaze("boutaoshi");
        console.log(this.distFromStart([1, 1]));
    }

    // 盤面を初期化
    initMaze() {
        let res = []
        for (let i = 0; i < this.h + 2; i++) {
            res.push(new Array());
            for (let j = 0; j < this.w + 2; j++) {
                let now = this.road;
                if (i === 0 || i === this.h + 1 || j === 0 || j === this.w + 1) {
                    now = this.wall;
                }
                res[i][j] = now;
            }
        }
        return res;
    }

    // 1_1->[1,1] みたいに、アンダーバーで分ける 
    splitPos2Two(posStr) {
        let splitted = posStr.split("_");
        return [Number(splitted[0]), Number(splitted[1])];
    }

    shuffle([...array]) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 迷路を生成
    createMaze(method) {
        switch (method) {
            case "boutaoshi":
                this.createMethod_boutaoshi();
                break;
            default:
                this.createMethod_boutaoshi();
        }
    }

    createMethod_boutaoshi() {
        // http://rainbowvortex.blog.fc2.com/blog-entry-128.html
        // https://algoful.com/Archive/Algorithm/MazeBar
        let ny, nx;
        for (let i = 1; i < this.h; i += 2) {
            for (let j = 1; j < this.w; j += 2) {
                this.mazeMap[i + 1][j + 1] = this.wall;
                let targetArr;
                if (i === 1) {
                    targetArr = this.shuffle(this.directionOneStepAll);
                } else {
                    targetArr = this.shuffle(this.directionOneStepNoUpper);
                }
                for (let direction of targetArr) {
                    ny = i + direction[0] + 1;
                    nx = j + direction[1] + 1;
                    if (this.mazeMap[ny][nx] === this.wall) {
                        continue;
                    }
                    break;
                }
                this.mazeMap[ny][nx] = this.wall;
            }
        }
    }
    distFromStart(start) {
        start = [...start, 0];
        let mazeCopy = this.copy2DimentionalArr(this.mazeMap);
        const lst = new LinkedList();
        lst.push(start);
        while (lst.length() !== 0) {
            let now = lst.popleft();
            mazeCopy[now[0]][now[1]] = now[2];
            for (let nxtDirection of this.directionOneStepAll) {
                let ny = now[0] + nxtDirection[0];
                let nx = now[1] + nxtDirection[1];
                if (mazeCopy[ny][nx] !== this.road) {
                    continue;
                }
                mazeCopy[ny][nx] = now[2] + 1;
                lst.push([ny, nx, now[2] + 1]);
            }
        }
        return mazeCopy;
    }
    getShortestPath(from, to) {
        let distArr = this.distFromStart([...from, 0]);
        let res = [to];
        let nowIdx = [...to];
        for (let nxtIdx = 0; nxtIdx < distArr[to[0]][to[1]]; nxtIdx++) {
            for (let direction of this.directionOneStepAll) {
                let ny = nowIdx[0] + direction[0];
                let nx = nowIdx[1] + direction[1];
                if (distArr[ny][nx] === distArr[to[0]][to[1]] - nxtIdx - 1) {
                    res.push([ny, nx]);
                    nowIdx = [ny, nx];
                    break;
                }
            }
        }
        return res;
    }
    drawPath(path, ctx, canvasSize, sizeRatio) {
        let [Y, X] = canvasSize;
        let [H, W] = sizeRatio;
        ctx.beginPath();
        ctx.fillStyle = "green";
        for (let eachPath of path) {
            let i = eachPath[0];
            let j = eachPath[1];
            ctx.fillRect(W / (X + 2) * j, H / (Y + 2) * i, W / (X + 2), H / (Y + 2));
        }
        ctx.closePath();
    }

    copy2DimentionalArr(original) {
        let copy = [];
        for (const newLine of original) {
            copy.push([...newLine]);
        }
        return copy;
    }

    // 作成された迷路をdocument上に書き込む
    drawOnDocument() {
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 17; j++) {
                if (this.mazeMap[i][j] === this.wall) { document.write("●"); } else { document.write("○"); }
            }
            document.write("<br>");
        }
    }

    // 作成された迷路をcanvas上に書き込む
    drawOnCanvas(ctx, canvasSize, sizeRatio) {
        let [Y, X] = canvasSize;
        let [H, W] = sizeRatio;
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
    bfsMain() {}
}