const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let [Y, X] = [5, 5];
let [H, W] = [Y * 30, X * 30];
canvas.width = W;
canvas.height = H;
const newMaze = new Maze(Y, X);
newMaze.drawOnCanvas(ctx);
const player = new Player(1, 1, newMaze.mazeMap);

document.onkeydown = event => {
    if (player.isAvailable(event)) {
        newMaze.drawOnCanvas(ctx);
        player.move(event);
        player.drawPlayer();
    }
}