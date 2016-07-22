//Forest Simulation

//Canvas Boilerplate
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 4000;
canvas.height = 4000;
var boardN = 100;
var blockSize = 40;

//Spawn Rates
var treeSpawnRate = 0.3;
var lumberJackSpawnRate = 0.05;
var bearSpawnRate = 0.02;
var saplingSpawnRate=0.05;

//Global Vars
var treeLifeList = new Array(boardN);
for( var i=0;i<boardN;i++) {
		treeLifeList[i] = new Array(boardN);
}
var saplingLifeList = new Array(boardN);
for( var i=0;i<boardN;i++) {
		saplingLifeList[i] = new Array(boardN);
}
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

function setTreeLifeList () {
	for(var i = 0; i<boardN ; i++) {
		for (var j = 0; j < boardN; j++) {
			treeLifeList[i][j]=0;
		}
	}
	for(var i = 0; i<boardN ; i++) {
		for (var j = 0; j < boardN; j++) {	
			saplingLifeList[i][j]=0;
		}
	}
}
function updateTreeLifeList () {
	for(var i = 0; i<boardN ; i++) {
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'T') {
				treeLifeList[i][j]++;
			} else {
				treeLifeList[i][j]=0;
			}
			if (treeLifeList[i][j]>119) {
				forest[i][j] = 'E';
				treeLifeList[i][j]=0;
			}
		}
	}
	for(var i = 0; i<boardN ; i++) {
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'S') {
				saplingLifeList[i][j]++;
			} else {
				saplingLifeList[i][j]=0;
			}
			if(saplingLifeList[i][j]>11) {
				forest[i][j]='T';
				saplingLifeList[i][j]=0;
			}
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
	var squares;
	var possibleSaplings=[];
	for(var i = 0; i<boardN ; i++) {''
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'T') {
				squares = getAdjacentSquares(i,j);
				possibleSaplings=[];
				for(var k = 0; k<4 ; k++) {
					if(squares[k]=='X') {
						var addRelativePos = [0,0];
						switch(k){
							case 0:addRelativePos=[i,j-1]; break;
							case 1:addRelativePos=[i,j+1]; break;
							case 2:addRelativePos=[i+1,j]; break;
							case 3:addRelativePos=[i-1,j]; break;
						}
						possibleSaplings.push(addRelativePos);
					}
				}
				var saplingCoords = possibleSaplings[Math.floor(Math.random()*possibleSaplings.length)];
				if (saplingCoords != null && Math.random() < saplingSpawnRate) {
					if (forest[saplingCoords[0]][saplingCoords[1]]=='X') {
						forest[saplingCoords[0]][saplingCoords[1]]='S';
					}
				}
			}
		}
	}
	updateTreeLifeList();
	drawForest();
	months++;
	document.getElementById("month_counter").innerHTML="Months = "+ months;
}
drawGrid()
makeBoard();
setTreeLifeList();
initialSpawn();
drawForest();
mainLoop();
setInterval(mainLoop,10);