// ~~~~~~~~~~~~~~~ INITIALISE VARIABLES ~~~~~~~~~~~~~~~

$(document).ready(function() {
    $('.replay-wrapper').on('click', 'button', function() {
        console.log('DOM ready button pressed.');
        $('.replay-wrapper').html('');
        // Handle the below in functions rather than recalling explicitly:
        lives = 5;
        score = 0;
        bricks = [];
        for(c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 3 };
            }
        }
        draw();
    })
});

var canvas = document.getElementById("game-window");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 7;
var collisionRadius = ballRadius*Math.sqrt(2);
var dx = 2;
// var dx = (Math.random()*6)-3;   // A future implementation way to have initial x-velocity between -3 and +3...
var dy = -3;

var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width-paddleWidth)/2;
var paddledx =  10;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var remainingBricks = 3*brickColumnCount*brickRowCount;
// Hardcoded remainingBricks here. TODO define this dynamically at level load.

var leftPressed = false;
var rightPressed = false;
var mouseX = 0;

var lives = 3;
var score = 0;

var brickAudio = new Audio('sounds/sfx_menu_move4.wav');
var paddleAudio = new Audio('sounds/sfx_menu_move5.wav');
// var paddleAudio = document.getElementById("audio"); 

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 3 };
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
function mouseMoveHandler(e) {
    mouseX = e.clientX - canvas.offsetLeft - paddleWidth/2;
    //if relative X inside canvas..
    if(mouseX > 0 && mouseX < canvas.width-paddleWidth) {
        paddleX = mouseX;
    } else if(mouseX < 0) {
        paddleX = 0;
    } else if(mouseX > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            // status = 1 --> visible & collidable:
            if(bricks[c][r].status > 0) {
                var brickX = brickOffsetLeft+(c*(brickWidth+brickPadding));
                var brickY = brickOffsetTop+(r*(brickHeight+brickPadding));
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if(bricks[c][r].status == 3) {
                    ctx.fillStyle = "#BB2385";
                } else if(bricks[c][r].status == 2) {
                    ctx.fillStyle = "#BB95DD";
                } else {ctx.fillStyle = "#0095DD";}
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
            if(b.status > 0) {
                if (x+collisionRadius >= b.x && x-collisionRadius <= b.x+brickWidth && y+collisionRadius>=b.y  && y-collisionRadius<= b.y+brickHeight) {
                    brickAudio.play();
                    dy *= -1.04;
                    dx *= 1.04
                    b.status--;
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
    if(lives==0) {
        ctx.fillStyle = "#ff0000";
    };
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
    var replayWrapper = $('.replay-wrapper');
    var replayButton = $('<button class="replay">Play Again?</button>');
    replayButton.appendTo(replayWrapper);
}

$('.replay').click(function() {
    // document.reload()
    console.log('should replay');
    $('.replay-wrapper').html('');
    draw();
    
});

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
    ctx.fillText("Final Score: "+score, 163, 190)
}

function replay() {
    // document.reload()
    console.log('should replay');
    $('.replay-wrapper').html('');
    draw();
    
}

function draw() {
        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collision detection with walls:
    if(x+ballRadius > canvas.width || x-ballRadius < 0) {
        paddleAudio.play();
        dx = -dx;
    }
    if(y-ballRadius < 0) {
        paddleAudio.play();
        dy = -dy;
    }

    // Collision detection with paddle:
    if((y+ballRadius > canvas.height-15 && y+ballRadius < canvas.height-5) && ((x >= paddleX) && (x <= paddleX+paddleWidth))) {
    paddleAudio.play();
    dy = -Math.abs(dy);
     var reflectX = 2*((x-paddleX)/paddleWidth)-1;
     // This is imperfect.. TODO improve ball-paddle reflection X-velocity:
     dx += reflectX;
     console.log('reflectX (should be between -1 and 1): ', reflectX);
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
