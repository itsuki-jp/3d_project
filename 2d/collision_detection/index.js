const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const X = 800;
const Y = 500;
canvas.width = X;
canvas.height = Y;
const TIME = 50;
let counter = 0;
const BALL_RADIUS = 20;
const buff = 5;
class Circle {
    constructor(x, y, vx, vy, r, colour) {
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

//　必要なボールのオブジェクト作成 
let circle1 = { x: X / 4 * 3 + 30, y: Y / 2, vx: -10, vy: 0, r: BALL_RADIUS, colour: "red" };
let circle2 = { x: X / 5 * 2 + 5, y: Y / 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "blue" };
let circle3 = {
    x: X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2),
    y: Y / 2 + BALL_RADIUS,
    vx: 0,
    vy: 0,
    r: BALL_RADIUS,
    colour: "yellow"
};
let circle4 = {
    x: X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2),
    y: Y / 2 - BALL_RADIUS,
    vx: 0,
    vy: 0,
    r: BALL_RADIUS,
    colour: "purple"
};
let circle5 = { x: X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2 - 5, y: Y / 2 + BALL_RADIUS * 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "white" };
let circle6 = { x: X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2 - 5, y: Y / 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "pink" };
let circle7 = { x: X / 5 * 2 - Math.sqrt(3 * BALL_RADIUS ** 2) * 2 - 5, y: Y / 2 - BALL_RADIUS * 2, vx: 0, vy: 0, r: BALL_RADIUS, colour: "green" };

let circles = [circle1, circle2, circle3, circle4, circle5, circle6, circle7];

function totalSpeed() {
    let total = 0;
    for (let i = 0; i < circles.length; i++) {
        total += circles[i].vx ** 2 + circles[i].vy ** 2;
    }
}

function init() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, X, Y);
}

function drawCircle(data) {
    ctx.beginPath();
    onBoard(data);
    dropSpeed(data);
    ctx.fillStyle = data.colour;
    data.x += data.vx;
    data.y += data.vy;
    ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2);
    ctx.fill();
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
        datas[i].vx *= 0.95;
        datas[i].vy *= 0.95;
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
    //totalSpeed();
    for (let i = 0; i < circles.length; i++) {
        drawCircle(circles[i]);
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
}
setInterval(() => main(), TIME);
ctx.closePath();