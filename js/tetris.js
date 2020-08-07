const cvs = document.getElementById("tetris"); //create canvas
const ctx = cvs.getContext("2d"); //this gives us methods and properties that allow us to draw on the canvas

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "#636161"; //color of an empty square

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
	[Z, "red"],
	[S, "green"],
	[T, "purple"],
	[O, "yellow"],
	[I, "aqua"],
	[J, "blue"],
	[L, "orange"]
];

//Initiate a piece
let p = new Piece(PIECES[0][0],PIECES[0][1]); //new Piece(tetromino, color)

//Object piece
function Piece(tetromino,color) {
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoN = 0; //Start from the first pattern
	this.activeTetromino = this.tetromino[this.tetrominoN];

	//Control the pieces
	this.x = 2;
	this.y = 4;
}

//Draw piece to the board
Piece.prototype.draw = function() {
	for(r = 0; r < this.activeTetromino.length; r++) {
		for(c = 0; c < this.activeTetromino.length; c++) {
			
			//Draw only occupied squares
			if(this.activeTetromino[r][c]) {
				drawSquare(this.x + c,this.y + r,this.color);	
			}
		}
	}
}

p.draw();