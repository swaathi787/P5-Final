var jellyfishImage;
var jellyfishes = [];
var sharkImage;
var reefBackground;
let xPosition = 0;
let yPosition = 0;
var x = 300;
var y;
var speed = 1;
var numRowFish;

function preload() {
    jellyfishImage = loadImage("jellyfish.png");
    sharkImage = loadImage("sharky.png");
    reefBackground = loadImage("reef.png");
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    helperSunlight();
}

function helperSunlight() {
    numRowFish = random(7,15);
    for (var j = 0; j < numRowFish; j++) {
        // Create a random x coordinate
        x = random(-20, width - 20);
        // Assign the y coordinate based on the order
        y = map(j, 0, numRowFish, -100, height - 200);
        jellyfishes[j] = new Jellyfish(jellyfishImage, x, y);
        jellyfishImage.resize(0,90);     
    } 
}

function draw() {  
   sunlight();
}

function sunlight() {
    background(137, 207, 240);
    background(reefBackground);
    
    push();
    fishSwim();
    ellipse(x, 60, 20, 20);
    pop();
   
    // moving our shark around
    xPosition = lerp(xPosition, mouseX, 0.04);
    yPosition = lerp(yPosition, mouseY, 0.05);


     // setting our shark into the waters
     image(sharkImage, xPosition, yPosition);
     sharkImage.resize(250,250);

    // adding jellyfish to our screen
    for (var i = 0; i < jellyfishes.length; i++) {
        jellyfishes[i].update();
        jellyfishes[i].display();
    } 
}


// function that lets our fish swim across the screen
function fishSwim() {
    x = x + speed;
    if (x > width) {
        speed *= -1;
    }
    if (x == 0) {
        speed *= -1;
    }    
}

// this is the a jellyfish class
function Jellyfish(img, tempX, tempY) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.angle = random(0, TWO_PI);
    this.botImage = img;
    this.yoffset = 0.0;
    this.update = function () {
        this.angle += 0.05;
        this.yoffset = sin(this.angle) * 10;
    }
    this.display = function () {
        image(this.botImage, this.xpos, this.ypos + this.yoffset);
    }
}