const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const X = 500;
const Y = 500;
canvas.width = X;
canvas.height = Y;
const TIME = 5;

let circle1 = { x: 250, y: 40, vx: 1, vy: -10, r: 20, colour: "red", collision: 0 };
let circle2 = { x: 250, y: 400, vx: 0, vy: 1, r: 20, colour: "blue", collision: 0 };
let circle3 = { x: 150, y: 40, vx: 1, vy: 1, r: 20, colour: "yellow", collision: 0 };
let circles = [circle1, circle2, circle3];

function totalSpeed() {
    let total = 0;
    for (let i = 0; i < circles.length; i++) {
        total += circles[i].vx ** 2 + circles[i].vy ** 2;
    }
    console.log(total);
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

function dropSpeed(data) {
    data.vx *= 1;
    data.vy *= 1;
}

function collisionDetection(data1, data2) {
    let dist = ((data1.x - data2.x) ** 2 + (data1.y - data2.y) ** 2);
    let r = (data1.r + data2.r) ** 2;
    if (((data1.x - data2.x) ** 2 + (data1.y - data2.y) ** 2) <= (data1.r + data2.r) ** 2) {
        console.log("collided");
        return true;
    }
    return false;
}

function preventCircleOverlap(a, b) {

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
    if (!(0 <= (data.x - data.r)) || ((data.x + data.r) >= X)) {
        data.vx *= -1;
    }
    if (!(0 <= (data.y - data.r)) || ((data.y + data.r) >= Y)) {
        data.vy *= -1;
    }
}

function main() {
    init();
    totalSpeed();
    for (let i = 0; i < circles.length; i++) {
        drawCircle(circles[i]);
    }
    for (let i = 0; i < circles.length - 1; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (collisionDetection(circles[i], circles[j])) {
                let tmp_a = calcDirection(circles[i], circles[j]);
                let tmp_b = calcDirection(circles[j], circles[i]);
                [circles[i], circles[j]] = [tmp_a, tmp_b];
            }
        }
    }
}
setInterval(() => main(), TIME);
ctx.closePath();