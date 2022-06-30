const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let canvasSize = [101, 101];
let [Y, X] = canvasSize;
let sizeRatio = [Y * 3, X * 3];
let [H, W] = sizeRatio;
canvas.width = W;
canvas.height = H;
const newMaze = new Maze(Y, X);
newMaze.drawOnCanvas(ctx, canvasSize, sizeRatio);
newMaze.drawPath(newMaze.getShortestPath([1, 1], canvasSize), ctx, canvasSize, sizeRatio);
const player = new Player(1, 1, newMaze.mazeMap);

document.onkeydown = event => {
    if (player.isAvailable(event)) {
        newMaze.drawOnCanvas(ctx, canvasSize, sizeRatio);
        player.move(event);
        player.drawPlayer();
    }
}