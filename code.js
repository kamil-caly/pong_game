const bodyHeigth = document.body.scrollHeight;
const bodyWidth = document.body.scrollWidth;

const padle1 = document.getElementById("p1");
const padle2 = document.getElementById("p2");

const padleClass = document.getElementsByClassName("padle");
const padle1Style = window.getComputedStyle(padle1, null);
const padle2Style = window.getComputedStyle(padle2, null);

const points = document.getElementById("points");

const ball = document.getElementById("ball");
ballStyle = window.getComputedStyle(ball, null);

let ballTop = parseInt(ballStyle.getPropertyValue("top"));
let ballLeft = parseInt(ballStyle.getPropertyValue("left"));
let padle2Top = parseInt(padle2Style.getPropertyValue("top"));
let padle2Left = parseInt(padle2Style.getPropertyValue("left"));

let padleHeight = parseInt(padle2Style.getPropertyValue("height"));
let padleWidth = parseInt(padle2Style.getPropertyValue("width"))

let padle1Top = parseInt(padle1Style.getPropertyValue("top"));
let padle1Left = parseInt(padle1Style.getPropertyValue("left"));

document.addEventListener("keydown", (e) => {

    switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
            movePadle(e.key === "ArrowUp" ? "up" : "down", padle2, padle2Style);
            break;
        default:
            break;
    }
});

const movePadle = (dir, padle, padleStyle) => {
    if (dir === "up") {
        let padleTop = parseInt(padleStyle.getPropertyValue("top")) - 100;
        padle.style.top = padleTop + "px";

        if (parseInt(padleStyle.getPropertyValue("top")) <= 0) {
            padle.style.top = 0 + "px";
        }
    } else {
        let padleTop = parseInt(padleStyle.getPropertyValue("top")) + 100;
        padle.style.top = padleTop + "px";

        if (parseInt(padleStyle.getPropertyValue("top")) + parseInt(padleStyle.getPropertyValue("height")) >= bodyHeigth) {
            padle.style.top = bodyHeigth - parseInt(padleStyle.getPropertyValue("height")) + "px";
        }
    }
}

const mainLoop = () => {
    checkBallColision();
    moveBall();
    movePadleAI();
}

setInterval(mainLoop, 5);

const movePadleAI = () => {

    if (ballLeft > bodyWidth / 2)
        return;

    if (ballLeft > bodyWidth / 4) {

        if (ballTop > padle1Top + parseInt(padleHeight / 2)) {
            padle1.style.top = parseInt(padle1Top + 2) + "px";
        } else {
            padle1.style.top = parseInt(padle1Top - 2) + "px";
        }

    } else {

        if (ballTop > padle1Top + parseInt(padleHeight / 2)) {
            padle1.style.top = parseInt(padle1Top + 3) + "px";
        } else {
            padle1.style.top = parseInt(padle1Top - 3) + "px";
        }

    }

    updateElementsDimensions();

    if (padle1Top <= 0) {
        padle1.style.top = 0 + "px";
    } else if (padle1Top + padleHeight >= bodyHeigth) {
        padle1.style.top = parseInt(bodyHeigth - padleHeight) + "px";
    }

    updateElementsDimensions();
}

const updateElementsDimensions = () => {
    ballTop = parseInt(ballStyle.getPropertyValue("top"));
    ballLeft = parseInt(ballStyle.getPropertyValue("left"));

    padle2Top = parseInt(padle2Style.getPropertyValue("top"));
    padle2Left = parseInt(padle2Style.getPropertyValue("left"));

    padle1Top = parseInt(padle1Style.getPropertyValue("top"));
    padle1Left = parseInt(padle1Style.getPropertyValue("left"));
}

let ballSpeedX = -2;
let ballSpeedY = -2;

const moveBall = () => {

    let newBallLeft = ballLeft + ballSpeedX;
    let newBallTop = ballTop + ballSpeedY;

    ball.style.left = newBallLeft + "px";
    ball.style.top = newBallTop + "px";

    updateElementsDimensions();
}

const resetBall = () => {
    ballSpeedX = 2;
    ballSpeedY = 2;

    ball.style.left = parseInt(bodyWidth / 2 - 25) + "px";
    ball.style.top = parseInt(bodyHeigth / 2 - 25) + "px";
    updateElementsDimensions();
}

const checkBallColision = () => {

    // dół i góra ekranu
    if (ballTop + 50 > bodyHeigth || ballTop <= 0) {
        switchBallSpeedY();
    }

    // prawa paletka    
    if (ballTop + 50 >= padle2Top
        && ballTop <= padle2Top + padleHeight
        && ballLeft + 50 >= padle2Left) {
        console.log("right padle")
        padleHit();
        // lewa paletka   
    } else if (ballTop + 50 >= padle1Top
        && ballTop <= padle1Top + padleHeight
        && ballLeft <= padle1Left + 50) {
        padleHit();
    }

    if (ballLeft >= bodyWidth - padleWidth / 2) {
        updatePoints("player2");
        resetBall();
    } else if (ballLeft <= padleWidth / 2) {
        updatePoints("player1");
        resetBall();
    }

    updateElementsDimensions();
}

const switchBallSpeedY = () => ballSpeedY = -ballSpeedY;

const padleHit = () => {

    ballSpeedX = -ballSpeedX;
    if (ballSpeedX > 0)
        ballSpeedX = ballSpeedX + 1;
    else
        ballSpeedX = ballSpeedX - 1;

    if (ballSpeedY > 0)
        ballSpeedY = Math.floor(Math.random() * 3) + 1;
    else
        ballSpeedY = -Math.floor(Math.random() * 3) + 1;
}

const updatePoints = (player) => {
    player === "player1" ? points.innerHTML = (points.innerHTML.split("-")[0] + "-" + (parseInt(points.innerHTML.split("-")[1]) + 1))
        : points.innerHTML = ((parseInt(points.innerHTML.split("-")[0]) + 1) + "-" + points.innerHTML.split("-")[1]);

    checkGameOver();
}

const checkGameOver = () => {
    if (points.innerHTML.split("-")[0] >= 10) {
        alert("Player 1 win!");
        resetPoints();
    } else if (points.innerHTML.split("-")[1] >= 10) {
        alert("Player 2 win!");
        resetPoints();
    }
}

const resetPoints = () => {
    points.innerHTML = "0-0";
}