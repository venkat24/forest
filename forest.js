//Forest Simulation

//Canvas Boilerplate
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 6000;
canvas.height = 6000;
var boardN = 150;
var refreshRate = 20;
var blockSize = 10;

//Spawn Rates
var treeSpawnRate = 0.4;
var lumberJackSpawnRate = 0.03;
var bearSpawnRate = 0.01;
var saplingSpawnRate=0.3;

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
					context.fillStyle = 'brown'; break;
				case 'B':
					context.fillStyle = 'crimson'; break;
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
	var squares;
	var possibleSaplings=[];
	var repeat=3;
	for(var i = 0; i<boardN ; i++) {''
		for (var j = 0; j < boardN; j++) {
			if (forest[i][j] == 'T') {				//TREE MECHANISM
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
					forest[saplingCoords[0]][saplingCoords[1]]='S';
				}

			} else if (forest[i][j]=='L') {			//LUMBERJACK MECHANISM
				availableSquares = getAdjacentSquares(i,j);
				//console.log(availableSquares);
				var choppableTreeIndices = [];
				var movableTreeIndices = []
				var lumberJackChoppingPositionIndex = 0;
				var lumberJackMovementPositionIndex = 0;
				var treeToChop=[0,0];
				var positionToMove=[0,0];
				if (availableSquares.indexOf('T') >=0 || availableSquares.indexOf('E') >=0 ) {
					for(var k=0 ; k<4; k++ ) {
						if (availableSquares[k]=='T' || availableSquares[k]=='E') {
							choppableTreeIndices.push(k);
						}
						lumberJackChoppingPositionIndex = choppableTreeIndices[Math.floor(Math.random()*choppableTreeIndices.length)];
						switch(lumberJackChoppingPositionIndex) {
							case 0:treeToChop=[i,j-1]; break;
							case 1:treeToChop=[i,j+1]; break;
							case 2:treeToChop=[i+1,j]; break;
							case 3:treeToChop=[i-1,j]; break;
						}
						//CHOP THE TREE
						forest[treeToChop[0]][treeToChop[1]]='X';
						//break; //Enable ths after ading while loop
					}
				} else if (availableSquares.indexOf('X') >=0 ) {
					for(var k=0 ; k<4; k++ ) {
						if(availableSquares[k] == 'X') {
							movableTreeIndices.push(k);
						}
					}
					lumberJackMovementPositionIndex = movableTreeIndices[Math.floor(Math.random()*movableTreeIndices.length)];
					switch(lumberJackMovementPositionIndex) {
						case 0:positionToMove=[i,j-1]; break;
						case 1:positionToMove=[i,j+1]; break;
						case 2:positionToMove=[i+1,j]; break;
						case 3:positionToMove=[i-1,j]; break;
					}
					forest[positionToMove[0]][positionToMove[1]]='L';
					forest[i][j]='X';	
				}
			} else if (forest[i][j]=='B') {					//BEAR MECHANISM
				availableBearSquares=getAdjacentSquares(i,j);
				var maullableBearIndices = [];
				var movableBearIndices = [];
				var bearMaullingIndexPosition = 0;
				var bearMovingIndexPosition = 0;
				var positionToMaul = [0,0];
				var positionToMoveBear = [0,0];
				if (availableBearSquares.indexOf('L') >=0) {
					for(var k=0; k<4; k++) {
						if (availableBearSquares[k]=='L') {
							maullableBearIndices.push(k);
						}
					}
					bearMaullingIndexPosition = maullableBearIndices[Math.floor(Math.random()*maullableBearIndices.length)];
					switch(bearMaullingIndexPosition) {
							case 0:positionToMaul=[i,j-1]; break;
							case 1:positionToMaul=[i,j+1]; break;
							case 2:positionToMaul=[i+1,j]; break;
							case 3:positionToMaul=[i-1,j]; break;
					}
					forest[positionToMaul[0]][positionToMaul[1]]='B';
					forest[i][j]='X';
				} else {
					for(var k=0 ; k<4; k++ ) {
						if(availableBearSquares[k] == 'X') {
							movableBearIndices.push(k);
						}
					}
					if (movableBearIndices === undefined || movableBearIndices.length === 0) {
						continue;
					}
					bearMovingIndexPosition = movableBearIndices[Math.floor(Math.random()*movableBearIndices.length)];
					switch(bearMovingIndexPosition){
						case 0:positionToMoveBear=[i,j-1]; break;
						case 1:positionToMoveBear=[i,j+1]; break;
						case 2:positionToMoveBear=[i+1,j]; break;
						case 3:positionToMoveBear=[i-1,j]; break;
					}
					forest[positionToMoveBear[0]][positionToMoveBear[1]]='B';
					forest[i][j]='X';
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
setInterval(mainLoop,refreshRate);