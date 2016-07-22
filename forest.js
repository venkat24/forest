var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
var dim = 40;
var incVal = 0.5;
document.body.appendChild(canvas);
function drawBoard(){
for (var x = 0; x <= dim; x += 40) {
    context.moveTo(incVal + x, 0);
    context.lineTo(incVal + x, dim);
}
for (var x = 0; x <= dim; x += 40) {
    context.moveTo(0, incVal + x);
    context.lineTo(dim, incVal + x);
}
context.strokeStyle = "black";
context.stroke();
}
drawBoard();
