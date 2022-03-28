// now add an image of an rocketship:
// https://i1.sndcdn.com/artworks-j8xjG7zc1wmTeO7b-O6l83w-t500x500.jpg
var rocketship = document.createElement("img");
rocketship.src = "https://i1.sndcdn.com/artworks-j8xjG7zc1wmTeO7b-O6l83w-t500x500.jpg";
document.body.appendChild(rocketship);

// make it be smallish
rocketship.style.width = "50px";
rocketship.style.height = "50px";

// crop it circularly
rocketship.style.borderRadius = "50%";

// make it be vertically centered; put on the left side of the page
rocketship.style.position = "absolute";
rocketship.style.top = "50%";
rocketship.style.left = "0px";
rocketship.style.marginTop = "-25px";

// define speed variable for movement
var speed = 10;

// animate the rocketship horizontally, bouncing off the left/right walls
setInterval(function() {
    var currentLeft = parseInt(rocketship.style.left);
    var newLeft = currentLeft + speed;
    if (newLeft > window.innerWidth - 50) {
        newLeft = window.innerWidth - 50;
        speed = -speed;
    }
    if (newLeft < 0) {
        newLeft = 0;
        speed = -speed;
    }
    rocketship.style.left = newLeft + "px";
}, 10);

// go quarter speed
speed /= 4;

// disable scrollbars
document.body.style.overflow = "hidden";

// now set background to the color of space
document.body.style.background = "black";

// when the rocket is clicked, temporarily display some text saying "Firing thrusters!" in white on the current location -- and temporarily speed up by 4x for 0.25 second.
// then, after 0.25 seconds, revert to the original speed.
rocketship.onclick = function() {
    var text = document.createElement("div");
    text.style.position = "absolute";
    text.style.top = rocketship.style.top;
    text.style.left = rocketship.style.left;
    text.style.color = "white";
    text.innerHTML = "Firing thrusters!";
    document.body.appendChild(text);
    setTimeout(function() {
        text.parentNode.removeChild(text);
        speed /= 4;
    }, 250);
    speed *= 4;
};

// now add an image of an asteroid:
// https://d.newsweek.com/en/full/1721338/asteroid.jpg?w=1600&h=1600&q=88&f=9d82d35c9de96a82b3fcaf7705eb325b
var asteroid = document.createElement("img");
asteroid.src = "https://d.newsweek.com/en/full/1721338/asteroid.jpg?w=1600&h=1600&q=88&f=9d82d35c9de96a82b3fcaf7705eb325b";
document.body.appendChild(asteroid);

// make it be the size of the rocketship times 0.75
asteroid.style.width = (rocketship.offsetWidth * 0.75) + "px";
asteroid.style.height = (rocketship.offsetHeight * 0.75) + "px";

// circularly crop it
asteroid.style.borderRadius = "50%";

// position it absolutely randomly
asteroid.style.position = "absolute";
asteroid.style.top = Math.random() * (window.innerHeight - asteroid.offsetHeight) + "px";
asteroid.style.left = Math.random() * (window.innerWidth - asteroid.offsetWidth) + "px";

// animate the asteroid to move both horizontally and vertically. use our own speed variables/function name for asteroid movement.
var asteroidSpeedX = Math.random() * 10 - 5;
var asteroidSpeedY = Math.random() * 10 - 5;
setInterval(function() {
    var currentTop = parseInt(asteroid.style.top);
    var newTop = currentTop + asteroidSpeedY;
    if (newTop > window.innerHeight - asteroid.offsetHeight) {
        newTop = window.innerHeight - asteroid.offsetHeight;
        asteroidSpeedY = -asteroidSpeedY;
    }
    if (newTop < 0) {
        newTop = 0;
        asteroidSpeedY = -asteroidSpeedY;
    }
    asteroid.style.top = newTop + "px";

    var currentLeft = parseInt(asteroid.style.left);
    var newLeft = currentLeft + asteroidSpeedX;
    if (newLeft > window.innerWidth - asteroid.offsetWidth) {
        newLeft = window.innerWidth - asteroid.offsetWidth;
        asteroidSpeedX = -asteroidSpeedX;
    }
    if (newLeft < 0) {
        newLeft = 0;
        asteroidSpeedX = -asteroidSpeedX;
    }
    asteroid.style.left = newLeft + "px";
}, 10);

// set the asteroid speeds to be 1.1x the spaceship's speed
asteroidSpeedX = speed * 1.1;
asteroidSpeedY = speed * 1.1;

// now track a score. display the current score in the top right, with the label Score:
var score = 0;
var scoreDiv = document.createElement("div");
scoreDiv.style.position = "absolute";
scoreDiv.style.top = "0px";
scoreDiv.style.right = "0px";
scoreDiv.style.color = "white";
scoreDiv.innerHTML = "Score: " + score;
document.body.appendChild(scoreDiv);

// make the score font color visible
scoreDiv.style.fontSize = "2em";

// make the score 2x bigger.
scoreDiv.style.fontSize = "2em";

// increment the score by 1 point, every 500ms
setInterval(function() {
    score++;
    scoreDiv.innerHTML = "Score: " + score;
}, 500);

// add a variable for recording whether the asteroid is overlapping the ship
var asteroidOverlapsShip = false;

// now add a function to check for overlap between the asteroid and the rocketship
function checkOverlap(el1, el2) {
    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

// check for overlap every 10ms
setInterval(function() {
    asteroidOverlapsShip = checkOverlap(asteroid, rocketship);
}, 10);

// add a second variable recording whether, last time we looked, the asteroid was overlapping the ship
var asteroidOverlapsShipLastTime = false;

// add another timer checking if the asteroid switched from not overlapping to overlapping. You lose 5 points if so, and a red message is displayed at that location saying "Collision! -5"
setInterval(function() {
    if (asteroidOverlapsShip && !asteroidOverlapsShipLastTime) {
        score -= 5;
        var text = document.createElement("div");
        text.style.position = "absolute";
        text.style.top = asteroid.style.top;
        text.style.left = asteroid.style.left;
        text.style.color = "red";
        text.innerHTML = "Collision! -5";
        document.body.appendChild(text);
        setTimeout(function() {
            text.parentNode.removeChild(text);
        }, 1000);
    }
    asteroidOverlapsShipLastTime = asteroidOverlapsShip;
}, 10);

// record start time and whether the player has already won
var startTime = new Date();
var playerHasWon = false;

// once the player reaches 250 points, they win! (1) Clear the document, (2) Tell them how long it took in seconds, in green.
setInterval(function() {
    if (score >= 250 && !playerHasWon) {
        playerHasWon = true;
        document.body.innerHTML = "";
        var endTime = new Date();
        var timeTaken = (endTime - startTime) / 1000;
        var text = document.createElement("div");
        text.style.position = "absolute";
        text.style.top = "0px";
        text.style.left = "0px";
        text.style.color = "green";
        text.innerHTML = "You won in " + timeTaken + " seconds!";
        document.body.appendChild(text);
    }
}, 10);

// add a place for the rules at the bottom left side of the page. make it 10pt and light gray font
var rules = document.createElement("div");
rules.style.position = "absolute";
rules.style.bottom = "0px";
rules.style.left = "0px";
rules.style.color = "lightgray";
rules.style.fontSize = "10pt";
rules.innerHTML = "Rules:<br>- Move the ship with the arrow keys<br>- Avoid the asteroids<br>- You lose 5 points for every collision<br>- You win when you reach 250 points";
document.body.appendChild(rules);

// create a game name involving running away, placed at the top left of the page in 20pt white.
var gameName = document.createElement("div");
gameName.style.position = "absolute";
gameName.style.top = "0px";
gameName.style.left = "0px";
gameName.style.color = "white";
gameName.style.fontSize = "20pt";
gameName.innerHTML = "Running Away";
document.body.appendChild(gameName);

