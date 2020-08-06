const cvs = document.getElementById("tetris"); //create canvas
const ctx = cvs.getContext("2d"); //this gives us methods and properties that allow us to draw on the canvas

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "white"; //color of an empty square

//Draw a square
function drawSquare(x,y,color) {

	ctx.fillStyle = "white";
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
