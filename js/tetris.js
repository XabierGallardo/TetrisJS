const cvs = document.getElementById("tetris"); //create canvas
const ctx = cvs.getContext("2d"); //this gives us methods and properties that allow us to draw on the canvas
const scoreElement = document.getElementById("score_result");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "#727374"; //color of an empty square


//Draw a square
function drawSquare(x,y,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

	ctx.strokeStyle = "black";
	ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}


//Create the board
let board = []; //2d array
for (r = 0; r < ROW; r++) { //rows
	
	board[r] = [];

	for(c = 0; c < COL; c++) { //columns
		
		board[r][c] = VACANT;
	}
}


//Draw the board to the canvas
function drawBoard() {
	for (r = 0; r < ROW; r++) { //rows
		for(c = 0; c < COL; c++) { //columns
			drawSquare(c,r,board[r][c]);
		}
	}
}

drawBoard();


//Pieces and colors
//Original tetris colors: purple, yellow, orange, blue, aqua, green, red
const PIECES = [
	[Z, "#fe0100"],
	[S, "#00ff01"],
	[T, "#ff00fe"],
	[O, "#ffff01"],
	[I, "aqua"],
	[J, "#010080"],
	[L, "#ff8001"]
];


//Generate random pieces
function randomPiece() {
	//Return numbers betweeen 0 and 6
	let r = randomN = Math.floor(Math.random() * PIECES.length);
	//new Piece(tetromino, color)
	return new Piece(PIECES[r][0],PIECES[r][1]); 
}


//Initiate a piece
let p = randomPiece();


//Object piece
function Piece(tetromino,color) {
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoN = 0; //Start from the first pattern
	this.activeTetromino = this.tetromino[this.tetrominoN];

	//Control the pieces
	this.x = 3;
	this.y = -2;
}


//Fill function
Piece.prototype.fill = function(color) {
	for(r = 0; r < this.activeTetromino.length; r++) {
		for(c = 0; c < this.activeTetromino.length; c++) {
			
			//Draw only occupied squares
			if(this.activeTetromino[r][c]) {
				drawSquare(this.x + c,this.y + r,color);	
			}
		}
	}
}

//Both draw and undraw function are the same but with different colors

//Draw piece to the board (apply color)
Piece.prototype.draw = function() {
	this.fill(this.color);
}


//Undraw a piece (remove color or apply vacant color)
Piece.prototype.unDraw = function() {
	this.fill(VACANT);
}


//Move Down the piece
Piece.prototype.moveDown = function() {
	if(!this.collision(0,1,this.activeTetromino)) {
		this.unDraw()
		this.y++;
		this.draw();	
	} else {
		//lock piece and generate a new one
		this.lock();
		p = randomPiece();
	}
}


//Move Right the piece
Piece.prototype.moveRight = function() {
	if(!this.collision(1,0,this.activeTetromino)) {
		this.unDraw()
		this.x++;
		this.draw();	
	} else {
		//lock piece and generate a new one
	}
}

//Move Left the piece
Piece.prototype.moveLeft = function() {
	if(!this.collision(-1,0,this.activeTetromino)) {
		this.unDraw()
		this.x--;
		this.draw();	
	} else {
		//lock piece and generate a new one
	}
}


//Rotate the piece
Piece.prototype.rotate = function() {
	let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length]
	let kick = 0; //to avoid non rotation next to the walls

	if(this.collision(0,0,nextPattern)) {
		if(this.x > COL/2) {
			//right wall
			kick = -1; //move piece to the left
		} else {
			//left wall
			kick = 1; //move piece to the right
		}
	}

	if(!this.collision(kick,0,nextPattern)) {
		this.unDraw();
		this.x += kick;
		this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; //(0+1)%4 => 1
		this.activeTetromino = this.tetromino[this.tetrominoN];
		this.draw();
	}
}

let score = 0; //Initial score

Piece.prototype.lock = function() {
	for(r = 0; r < this.activeTetromino.length; r++) {
		for(c = 0; c < this.activeTetromino.length; c++) {
			//skip vacant squares
			if(!this.activeTetromino[r][c]) {
				continue;
			}
			//pieces to lock on top = game over
			if(this.y + r < 0) {
				alert("Game Over");
				//stop request animation frame
				gameOver = true;
				break;
			}
			//lock the piece
			board[this.y + r][this.x + c] = this.color;
		}
	}
	//Eliminate a full row, moving rows down
	for(r = 0; r < ROW; r++) {
		let isRowFull = true;
		for(c= 0; c < COL; c++) {
			isRowFull = isRowFull && (board[r][c] != VACANT);
		}
		if(isRowFull) {
			//If the row is full, move all the rows above
			for(y = r; y > 1; y--) {
				for(c = 0; c < COL; c++) {
					board[y][c] = board[y-1][c];
				}
			}
			//the top row board[0][..] has no row above it
			for(c = 0; c < COL; c++) {
				for(c = 0; c < COL; c++) {
					board[0][c] = VACANT;
				}
				//Increment the score
				score += 10;
			}
		}
	}
	//Update the board (after removing the rows)
	drawBoard();

	//Update score
	scoreElement.innerHTML = score;
}


//Collision
Piece.prototype.collision = function(x,y,piece) {
	for(r = 0; r < piece.length; r++) {
		for(c = 0; c < piece.length; c++) {
			//if square is empty, skipy it
			if(!piece[r][c]) {
				continue;
			}
			//coordinates of the piece after movement
			let newX = this.x + c + x;
			let newY = this.y + r + y;

			//conditions
			if(newX < 0 || newX >= COL || newY >= ROW) {
				return true;
			}

			//skip newY < 0; board[-1] will crush our game
			if(newY < 0) {
				continue;
			} 

			//check if there is a locked piece already in place
			if(board[newY][newX] != VACANT) {
				return true;
			}
		}
	}
	return false;
}


//Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {

	if(event.keyCode == 37) { //left arrow key
		p.moveLeft();
		//As we move left or right, the piece won't go down
		dropStart = Date.now(); 

	} else if(event.keyCode == 38) { //up arrow key
		p.rotate();
		dropStart = Date.now();

	} else if(event.keyCode == 39) { //right arrow key
		p.moveRight();
		dropStart = Date.now();

	} else if(event.keyCode == 40) { //down arrow key
		p.moveDown();
	}
}


//Drop the piece every 1 sec
let dropStart = Date.now();
let gameOver = false;

function drop() {
	let now = Date.now();
	let delta = now - dropStart;
	if(delta > 1000) {
		p.moveDown();
		dropStart = Date.now();
	}
	if(!gameOver) {
		requestAnimationFrame(drop);
	}
}

drop();