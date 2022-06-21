const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const X = 800;
const Y = 500;
canvas.width = X;
canvas.height = Y;
const TIME = 10;
let counter = 0;
const BALL_RADIUS = 20;
const buff = 5;

class Circle {
    constructor(id, x, y, vx, vy, r, colour) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.colour = colour;
    }
}
/*
let circle1 = { x: X / 4 * 2 - 20, y: Y / 2, vx: 10, vy: 0, r: BALL_RADIUS, colour: "red" };
let circle2 = { x: X / 4 * 2 + BALL_RADIUS * 2, y: Y / 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "red" };
let circle3 = { x: X / 4 * 2 + BALL_RADIUS * 4, y: Y / 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "red" };
let circles = [circle1, circle2, circle3];
*/

//　必要なボールのオブジェクト作成(初期配置)
function initCirclePos() {
    let circles = [
        new Circle(0, X / 4 * 3 + 30, Y / 2, 0, 0, BALL_RADIUS, "white"),
        new Circle(1, X / 5 * 2, Y / 2, 0, 0, BALL_RADIUS, "blue"),
        new Circle(2, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2), Y / 2 + BALL_RADIUS, 0, 0, BALL_RADIUS, "yellow"),
        new Circle(3, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2), Y / 2 - BALL_RADIUS, 0, 0, BALL_RADIUS, "purple"),
        new Circle(4, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2, Y / 2 + BALL_RADIUS * 2, 0, 0, BALL_RADIUS, "red"),
        new Circle(5, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2, Y / 2, 0, 0, BALL_RADIUS, "black"),
        new Circle(6, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2, Y / 2 - BALL_RADIUS * 2, 0, 0, BALL_RADIUS, "magenta"),
        new Circle(7, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 3, Y / 2 + BALL_RADIUS, 0, 0, BALL_RADIUS, "pink"),
        new Circle(8, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 3, Y / 2 - BALL_RADIUS, 0, 0, BALL_RADIUS, "green"),
        new Circle(9, X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 4, Y / 2, 0, 0, BALL_RADIUS, "lightgreen"),

    ];
    return circles;
}

let circles = initCirclePos();

let edges = [
    { x: 0, y: 0, r: BALL_RADIUS * 1.5, colour: "black" },
    { x: X, y: 0, r: BALL_RADIUS * 1.5, colour: "black" },
    { x: 0, y: Y, r: BALL_RADIUS * 1.5, colour: "black" },
    { x: X, y: Y, r: BALL_RADIUS * 1.5, colour: "black" }
];

function totalSpeed() {
    let total = 0;
    for (let i = 0; i < circles.length; i++) {
        total += circles[i].vx ** 2 + circles[i].vy ** 2;
    }
    return total;
}

function init() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, X, Y);
}

function drawCircle(data, t = "ball") {
    if (t === "ball") {
        onBoard(data);
        dropSpeed(data);
        moveBall(data);
    }
    ctx.beginPath();
    ctx.fillStyle = data.colour;
    ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2);
    ctx.fill();
}

function moveBall(data) {
    data.x += data.vx;
    data.y += data.vy;
}

function dropSpeed(datas) {
    if (counter < 10) { counter++; return; }
    cnt = 0;
    for (let i = 0; i < datas.length; i++) {
        if (datas[i].vx ** 2 + datas[i].vy ** 2 <= 0.01) {
            datas[i].vx = 0;
            datas[i].vy = 0;
            cnt++;
            continue;
        }
        datas[i].vx *= 0.9;
        datas[i].vy *= 0.9;
    }
    counter = 0;
}

function collisionDetection(data1, data2) {
    let dist = ((data1.x - data2.x) ** 2 + (data1.y - data2.y) ** 2);
    let r = (data1.r + data2.r) ** 2;
    if (((data1.x - data2.x) ** 2 + (data1.y - data2.y) ** 2) <= (data1.r + data2.r) ** 2) {
        return true;
    }
    return false;
}

function isBallFall(data) {
    for (let edge of edges) {
        if (collisionDetection(data, edge)) {
            if (data.id == 0) {
                console.log("LOOOOSE");
            }
            return true;
        }
    }
    return false;
}

function preventCircleOverlap(a, b) {
    /* https://hakuhin.jp/as/collide.html
    めり込んだ量 -> 
    円Ｂから円Ａまでのベクトルを調べて距離を取得します。
    円Ａと円Ｂの半径を足して、距離を引けば、めり込んだ長さが得られます。
    */
    let vx = a.x - b.x;
    let vy = a.y - b.y;
    let len = Math.sqrt(vx ** 2 + vy ** 2);
    let distance = a.r + b.r - len;

    if (len > 0) {
        len = 1 / len;
    }
    vx *= len;
    vy *= len;
    distance /= 2;
    a.x += vx * distance;
    a.y += vy * distance;
    b.x -= vx * distance;
    b.y -= vy * distance;
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

function calcDirection(a, b) {
    let theta = Math.atan((a.y - b.y) / (a.x - b.x));
    let new_a = deepCopy(a);
    let sin = Math.sin;
    let cos = Math.cos;
    let E = 1;
    new_a.vx = (a.vx * sin(theta) - a.vy * cos(theta)) * sin(theta) +
        0.5 * ((1 - E) * (a.vx * cos(theta) + a.vy * sin(theta)) +
            (1 + E) * (b.vx * cos(theta) + b.vy * sin(theta))) * cos(theta);
    new_a.vy = -(a.vx * sin(theta) - a.vy * cos(theta)) * cos(theta) +
        0.5 * ((1 - E) * (a.vx * cos(theta) + a.vy * sin(theta)) +
            (1 + E) * (b.vx * cos(theta) + b.vy * sin(theta))) * sin(theta);
    return new_a;
}

function onBoard(data) {
    if (!(0 <= (data.x - data.r))) {
        data.vx *= -1;
        data.x = data.r;
    } else if (!((data.x + data.r) <= X)) {
        data.vx *= -1;
        data.x = X - data.r;
    } else if (!(0 <= (data.y - data.r))) {
        data.vy *= -1;
        data.y = data.r;
    } else if (!((data.y + data.r) <= Y)) {
        data.vy *= -1;
        data.y = Y - data.r;
    }
}

function main() {
    dropSpeed(circles);
    init();
    if (mouseClicked) {
        mouseLine();
    }
    for (let i = 0; i < circles.length; i++) {
        drawCircle(circles[i]);
    }
    for (let i = 0; i < edges.length; i++) {
        drawCircle(edges[i], "edge");
    }
    // circle[i]とcircle[j]が当たってるか判定、当たってれば速度を変え、いい感じにoverlapをなくす
    for (let i = 0; i < circles.length - 1; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (collisionDetection(circles[i], circles[j])) {
                let tmp_a = calcDirection(circles[i], circles[j]);
                let tmp_b = calcDirection(circles[j], circles[i]);
                [circles[i], circles[j]] = [tmp_a, tmp_b];
                preventCircleOverlap(circles[i], circles[j]);
            }
        }
    }
    let new_circles = [];
    for (let i = 0; i < circles.length; i++) {
        if (!isBallFall(circles[i])) {
            new_circles.push(circles[i]);
        }
    }
    circles = new_circles;
}

let mouseClicked = false;
let mouseClickedPosition = {};
let mouseCurrentPosition = {};

function mouseDown(event) {
    if (totalSpeed() !== 0) { return; }
    console.log("mouseDown");
    mouseClicked = true;
    let rect = event.target.getBoundingClientRect();
    mouseClickedPosition.x = event.clientX - rect.left;
    mouseClickedPosition.y = event.clientY - rect.top;
}

function moveMainBall(mainBall) {
    if (totalSpeed() !== 0) { return; }
    console.log("ballMove");
    let dx = -mouseCurrentPosition.x + mouseClickedPosition.x;
    let dy = -mouseCurrentPosition.y + mouseClickedPosition.y;
    mainBall.vx = dx / 10;
    mainBall.vy = dy / 10;
    console.log(mainBall)
}

function mouseMove(event) {
    let rect = event.target.getBoundingClientRect();
    mouseCurrentPosition.x = event.clientX - rect.left;
    mouseCurrentPosition.y = event.clientY - rect.top;
}

function mouseLine() {
    ctx.beginPath();
    ctx.moveTo(mouseClickedPosition.x, mouseClickedPosition.y);
    ctx.lineTo(mouseCurrentPosition.x, mouseCurrentPosition.y)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.stroke();
}

canvas.addEventListener("mousedown", mouseDown);

canvas.addEventListener("mouseup", () => {
    console.log("mouseUp")
    mouseClicked = false;
    moveMainBall(circles[0]);
});

canvas.addEventListener("mousemove", mouseMove);
ctx.closePath();

let interval = setInterval(() => {
    main();
    if (circles[0].id != 0) { clearInterval(interval); }
}, TIME);