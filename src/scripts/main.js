// ~~~~~~~~~~~~~~~ INITIALISE VARIABLES ~~~~~~~~~~~~~~~

var canvas = document.getElementById("game-window");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 7;
var collisionRadius = ballRadius*Math.sqrt(2);
var dx = 3;
var dy = -4;

var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width-paddleWidth)/2;
var paddledx =  4;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var remainingBricks = brickColumnCount*brickRowCount;

var leftPressed = false;
var rightPressed = false;

var lives = 3;
var score = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Paddle left and right movement handler:
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
// Mouse control movement handler:


function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            // status = 1 --> visible & collidable:
            if(bricks[c][r].status == 1) {
                var brickX = brickOffsetLeft+(c*(brickWidth+brickPadding));
                var brickY = brickOffsetTop+(r*(brickHeight+brickPadding));
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = '#d2d';
    ctx.fill();
    ctx.closePath();
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight-5, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fill();
    ctx.closePath();
};

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if (x+collisionRadius >= b.x && x-collisionRadius <= b.x+brickWidth && y+collisionRadius>=b.y  && y-collisionRadius<= b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    remainingBricks--;
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawlives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives Remaining: "+lives, canvas.width-145, 20);
}

function drawGameOver() {
    ctx.beginPath();
    ctx.rect(140, 100, 200, 120);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(140, 100, 200, 120);
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.stroke();
    ctx.closePath();
    ctx.font = "28px Arial";
    ctx.fillStyle = "#DD2222";
    ctx.fillText("GAME OVER!", 150, 140);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Final Score: "+score, 165, 190)
}

function drawWin() {
    ctx.beginPath();
    ctx.rect(140, 100, 200, 120);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(140, 100, 200, 120);
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.stroke();
    ctx.closePath();
    ctx.font = "32px Arial";
    ctx.fillStyle = "#2222DD";
    ctx.fillText("YOU WIN!", 164, 145);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Final Score: "+score, 165, 190)
}

function draw() {
        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collision detection with walls:
    if(x+ballRadius > canvas.width || x-ballRadius < 0) {
        dx = -dx;
    }
    if(y-ballRadius < 0) {
        dy = -dy;
    }

    // Collision detection with paddle:
    if((y+ballRadius > canvas.height-15 && y+ballRadius < canvas.height-5) && ((x >= paddleX) && (x <= paddleX+paddleWidth))) {
     dy = -dy;
     console.log('Should hit paddle!')
    }

    // Movement:
    if(paddleX+paddleWidth < canvas.width && rightPressed) {
        paddleX += paddledx;
    } 
    if(paddleX > 0 && leftPressed) {
        paddleX -= paddledx;
    }

    x += dx;
    y += dy;

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawlives();

    // LOSE Condition:
    if(y > canvas.height-ballRadius) {
        lives--;
        // Reset ball position:
        x = canvas.width/2;
        y = canvas.height-30;
        // Reset ball speed & direction:
        dx = 3;
        dy = -4
        // Reset paddle position:
        paddleX = (canvas.width-paddleWidth)/2;
        // window.setTimeout(draw(), 2000)
    }
    if(lives<0) {
        drawGameOver();
        return;
    } else if(remainingBricks == 0) {
        drawWin(); 
    } else {
        requestAnimationFrame(draw)
    }
};


//~~~~~~~~~~~~~~~~ Key Press Event Handlers: ~~~~~~~~~~~~~~~~

// switch (event.key) {
//     case "ArrowDown":
//       // Do something for "down arrow" key press.
//       break;
//     case "ArrowUp":
//       // Do something for "up arrow" key press.
//       break;
//     case "ArrowLeft":
//       // Do something for "left arrow" key press.
//       break;
//     case "ArrowRight":
//       // Do something for "right arrow" key press.
//       break;
//     case "Enter":
//       // Do something for "enter" or "return" key press.
//       break;
//     case "Escape":
//       // Do something for "esc" key press.
//       break;
//     default:
//       return; // Quit when this doesn't handle the key event.
//   }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// At game load:
// while(lives>0) {draw()};
draw();

// On life lost:


// At game over, if "play again?" selected:
