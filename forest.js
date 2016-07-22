var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
var boardN = 10;
var blockSize = 40;
var dim = blockSize*boardN;
var incVal = 0.5;
var forest;
document.body.appendChild(canvas);

// Item Reference :
// Tree -> T
// Elder -> E
// Sapling -> S
// Lumberjack -> L
// Bear -> B
// Empty Tile -> X 

function makeBoard() {
	forest = new Array(boardN);
	for( var i=0;i<boardN;i++) {
		forest[i] = new Array(boardN);
	}
}
function drawGrid(){
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
function initialSpawn() {
	var chance = 0.5
	//Spawn Trees
	for(var i=0;i<boardN;i++) {
		for (var j = 0; j < boardN; j++) {
			chance = Math.random();
			if (chance < 0.5) {
				forest[i][j]='T';
			} else if (chance > 0.9) {
				forest[i][j]='L';
			} else if (chance > 0.5 && chance < 0.52) {
				forest[i][j]='B';
			} else {
				forest[i][j]='X';
			}
		}
	}
	console.log(forest);
}
function drawForest () {
	for(var i = 0; i<boardN ; i++) {
		for (var j = 0; j < boardN; j++) {
			context.beginPath();
			context.rect(blockSize*i,blockSize*j,blockSize,blockSize);
			switch(forest[i][j]) {
				case 'T':
					context.fillStyle = 'green'; break;
				case 'E':
					context.fillStyle = 'darkgreen'; break;
				case 'S':
					context.fillStyle = 'lightgreen'; break;
				case 'L':
					context.fillStyle = 'crimson'; break;
				case 'B':
					context.fillStyle = 'brown'; break;
				case 'X':
					context.fillStyle = 'lightgray'; break;
			}
			context.fill();
		}
	}
}
function mainLoop () {
	
}

drawGrid()
makeBoard();
initialSpawn();
drawForest();
while (true) {
	mainLoop();
}