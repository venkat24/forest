//Forest Simulation

//Canvas Boilerplate
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 3000;
canvas.height = 3000;
var boardN = 10;
var blockSize = 40;

//Spawn Rates
var treeSpawnRate = 0.3;
var lumberJackSpawnRate = 0.05;
var bearSpawnRate = 0.02;
var saplingSpawnRate=0.1;

//Global Vars
var treeLifeList = new Array(boardN*boardN);
var saplingLifeList = new Array(boardN*boardN);
var dim = blockSize*boardN;
var incVal = 0.5;
var forest;
var lumberCount=0;
var months=0;
document.body.appendChild(canvas);

// Item Reference :
// Tree -> T
// Elder -> E
// Sapling -> S
// Lumberjack -> L
// Bear -> B
// Empty Tile -> X 
// Undefined Tile -> O

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
	var chance = 0.5;
	//Spawn Trees
	for(var i=0;i<boardN;i++) {
		for (var j = 0; j < boardN; j++) {
			chance = Math.random();
			if (chance < treeSpawnRate) {
				forest[i][j]='T';
			} else if (chance > (1-lumberJackSpawnRate)) {
				forest[i][j]='L';
			} else if (chance > 0.5 && chance < 0.5+bearSpawnRate) {
				forest[i][j]='B';
			} else {
				forest[i][j]='X';
			}
		}
	}
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

function updateTreeLifeList () {
	var treeCounter=0;
	for(var i = 0; i<boardN ; i++) {''
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'T') {
				treeLifeList[treeCounter]={
					ipos:i,
					jpos:j,
					lifeVal:0
				}
			}
			treeCounter++;
		}
	}
	var saplingCounter=0;
	for(var i = 0; i<boardN ; i++) {''
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'S') {
				saplingLifeList[saplingCounter]={
					ipos:i,
					jpos:j,
					lifeVal:0
				}
			}
		 	saplingCounter++;
		}
	}
}
function getAdjacentSquares (x,y) {
	var n = !!forest[x][y-1]?forest[x][y-1]:'O';
	var s = !!forest[x][y+1]?forest[x][y+1]:'O';
	var e = !!forest[x-1]?forest[x-1][y]:'O';
	var w = !!forest[x+1]?forest[x+1][y]:'O'; 
	return [n,s,w,e];
}
function mainLoop () {
	//Tree Logic
	treeLifeList = new Array(boardN*boardN);
	var squares;
	var possibleSaplings = new Array(4);
	for(var i = 0; i<boardN ; i++) {''
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'T') {
				squares = getAdjacentSquares(i,j);
				for(var k = 0; k<4 ; k++) {
					if(squares[k]=='X') {
						var addRelativePos = [0,0];
						switch(k){
							case 0:addRelativePos=[i,j-1]; break;
							case 1:addRelativePos=[i,j+1]; break;
							case 2:addRelativePos=[i-1,j]; break;
							case 3:addRelativePos=[i+1,j]; break;
						}
						possibleSaplings.push(addRelativePos);
					}
				}
				console.log(possibleSaplings);
				var saplingCoords = possibleSaplings[Math.floor(Math.random()*possibleSaplings.length)];
				if (saplingCoords != null && Math.random() < saplingSpawnRate) {
					forest[saplingCoords[0]][saplingCoords[1]]='S';
				}
			}
		}
	}
	drawForest();
	months++;
	//document.getElementById("month_counter").innerHTML=("<h2>Months = "+ months +"</h2>");
}

drawGrid()
makeBoard();
initialSpawn();
drawForest();
updateTreeLifeList();
mainLoop();
setInterval(mainLoop,15000);