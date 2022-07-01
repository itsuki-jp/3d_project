const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let canvasSize = [11, 11];
let [Y, X] = canvasSize;
let sizeRatio = [Y * 30, X * 30];
let [H, W] = sizeRatio;
canvas.width = W;
canvas.height = H;