/* 
    Author: Swaathi Raghunandhan
    Professor Kevin Patton
    Creative Coding with Getting Started with P5.js by Lauren McCarthy, Casey Reas & Ben Fry
    December 16, 2022
    
    This project allows users to explore the zones of the ocean by toggling between different screens based on keyboard inputs
    that are listed as follows:

    "1": The Sunlight Zone where users can see sharks and jellyfish among the coral reefs (see "sunlight.js")
    "2": The Twilight Zone where users can explore particle micro-organisms and add plankton (see "finalProjectTwilight.js")
    "3": The Midnight Zone where users can give the giant squid tentacles by clicking and drawing across the screen (see "midnight.js")
    "4": The Abyss Zone where users can explore the darkness with a mysterious brush

    Sources include:
    The generative design library: http://www.generative-gestaltung.de/2/.
    Delaunay Fast Algorithm by Jay LaPorte: https://github.com/darkskyapp/delaunay-fast/blob/master/delaunay.js.
    Frozen Brush by Jason Labbe: https://jasonlabbe3d.com/. 
       
    
 */

// overall system
var mode = 1;

// twilight zone
let systems;
let planktons = [];
var planktonImg;
let image_array = [];

// sunlight zone
var x = 300;
var xSpeed = 1;
var y;
var numRowFish;
var speed = 1;
var jellyfishImage;
var jellyfishes = [];
var sharkImage;
var reefBackground;
var xPosition;
var yPosition;
var yPos;

// abyss zone
var allParticles = [];
var maxLevel = 7;
var useFill = true;
var data = [1];

// midnight zone
var modules = [];

var tileSize = 30;
var gridResolutionX;
var gridResolutionY;
var tiles = [];
var w;
var h;

var doDrawGrid = true;
var isDebugMode = false;
var squidImg;


function setup() {
    createCanvas(windowWidth, windowHeight);
    
    textSize(30);
    text("Come explore the ocean! Press 1, 2, 3, and 4 to toggle");

    /* Formatting for sunlight zone */
    if (mode == 1) {
        fill(137, 207, 240);
        helperSunlight();
    }
    if (mode == 0) {
        background(137, 207, 240);
    }

    /* Formatting for twilight zone */
    systems = [];
    numRowFish = random(7, 15);
    for (let i = 0; i < width / 10; i++) {
        planktons.push(new Plankton());
    }

    /* Formatting for midnight zone  */
    cursor(CROSS);
    rectMode(CENTER);
    strokeWeight(5);
    textSize(8);
    textAlign(CENTER, CENTER);

    gridResolutionX = round(windowWidth / tileSize) + 2;
    gridResolutionY = round(windowHeight / tileSize) + 2;

    initTiles();
}

function preload() {

    planktonImg = loadImage("Plankton_Artwork.png");
    jellyfishImage = loadImage("jellyfish.png");
    sharkImage = loadImage("sharky.png");
    reefBackground = loadImage("reef.png");
    
  for (var k = 0; k < 16; k++) {
    modules[k] = loadImage('data/' + nf(k, 2) + '.svg');
  } 

}

/* Toggle between the screens (zones) using inputs "1", "2", "3", and "4" */
function draw() {
    if (mode == 1) {
        sunlight();
        console.log(mode);
    } else if (mode == 2) {
        twilight();
        console.log(mode);
    } else if (mode == 3) {
        midnight();
        console.log(mode);
    } else if (mode == 4) {
        abyss();
        console.log(mode);
    }
}

/* Key input reader to change screens */
function keyTyped() {
    if (key === "1") {
        mode = 1;
    } else if (key === "2") {
        mode = 2;
    } else if (key === "3") {
        mode = 3;
    } else if (key === "4") {
        value = 30;
        mode = 4;
    } else {
        mode = 0;
    }
    return false;
}


/* Sunlighter helper function to set the jellyfish in random positions  */
function helperSunlight() {
    background(137, 207, 240);
    numRowFish = random(7, 15);
    for (var j = 0; j < numRowFish; j++) {
        // Create a random x coordinate
        x = random(-20, width - 20);
        // Assign the y coordinate based on the order
        y = map(j, 0, numRowFish, -100, height - 200);
        jellyfishes[j] = new Jellyfish(jellyfishImage, x, y);
        jellyfishImage.resize(0, 90);
    }
}

/* Lets the sharks swim across the screen */
function fishSwim() {
    xSpeed = xSpeed + speed;
    if (xSpeed > width) {
        speed *= -1;
    }
    if (xSpeed == 0) {
        speed *= -1;
    }
}

/* Sunlight Zone function */
function sunlight() {
    background(137, 207, 240);
    background(reefBackground);

    textAlign(windowWidth/2, windowHeight/2);
    textSize(20);
    text('Welcome to the sunlight zone!\nToggle between zones by pressing 1, 2, 3, or 4', 
        windowWidth/2, windowHeight - 600);
    fill(0, 102, 153);

    push();
    fishSwim();
    image(sharkImage, xSpeed, 10);
    image(sharkImage, xSpeed + 100, 400);
    pop();

    // moving our sharks around
    xPosition = lerp(xPosition, mouseX, 0.04);
    yPosition = lerp(yPosition, mouseY, 0.05);

    // setting our shark into the waters
    image(sharkImage, xPosition, yPosition);
    sharkImage.resize(100, 100);

    // adding jellyfish to our screen
    for (var i = 0; i < jellyfishes.length; i++) {
        jellyfishes[i].update();
        jellyfishes[i].display();
    }
}



/* Function for the twilight zone */
function twilight() {
    background(5, 16, 73);
    image(planktonImg, 0, 0);

    textAlign(windowWidth/2, windowHeight/2);
    textSize(20);
    text('Welcome to the twilight zone!\nexplore the micro-organisms', 
        windowWidth/2, windowHeight - 600);


    for (i = 0; i < 10; i++) {
        //systems[i].run();
        //systems[i].addParticle();

        planktons[i].createPlankton();
        planktons[i].movePlankton();
        planktons[i].joinPlankton(planktons.slice(i));
    }
    console.log(planktons.length);
    if (systems.length == 0) {
        fill("rgb(0,255,0)");
        textAlign(CENTER);
        textSize(20);
        // text("click mouse to add plankton", width / 2, height / 2);
    }
    // if (mouseisPressed()) {
    //     this.p = new ParticleSystem(createVector(mouseX, mouseY));
    //     systems.push(p);
    //   }
}

/* Midnight zone code */
function midnight() {
    textAlign(windowWidth/2, windowHeight/2);
    textSize(20);
    text('Welcome to the twilight zone!\nExplore the micro-organisms', 
        windowWidth/2, windowHeight - 600);

    if (mouseIsPressed) {
        if (mouseButton == LEFT) setTile();
        if (mouseButton == RIGHT) unsetTile();
    }

    if (doDrawGrid) drawGrid();
    drawModules();

}

function initTiles() {
    for (var gridX = 0; gridX < gridResolutionX; gridX++) {
        tiles[gridX] = [];
        for (var gridY = 0; gridY < gridResolutionY; gridY++) {
            tiles[gridX][gridY] = 0;
        }
    }
}

function setTile() {
    // convert mouse position to grid coordinates
    var gridX = floor(mouseX / tileSize) + 1;
    gridX = constrain(gridX, 1, gridResolutionX - 2);
    var gridY = floor(mouseY / tileSize) + 1;
    gridY = constrain(gridY, 1, gridResolutionY - 2);
    tiles[gridX][gridY] = 1;
}

function unsetTile() {
    var gridX = floor(mouseX / tileSize) + 1;
    gridX = constrain(gridX, 1, gridResolutionX - 2);
    var gridY = floor(mouseY / tileSize) + 1;
    gridY = constrain(gridY, 1, gridResolutionY - 2);
    tiles[gridX][gridY] = 0;
}

function drawGrid() {
    for (var gridX = 0; gridX < gridResolutionX; gridX++) {
        for (var gridY = 0; gridY < gridResolutionY; gridY++) {
            var posX = tileSize * gridX - tileSize / 2;
            var posY = tileSize * gridY - tileSize / 2;
            //fill(255);
            fill(5, 16, 73);
            if (isDebugMode) {
                if (tiles[gridX][gridY] == 1) fill(220);
            }
            rect(posX, posY, tileSize, tileSize);
        }
    }
}

function drawHead() {
    textAlign(windowWidth/2, windowHeight/2);
    textSize(20);
    text('Welcome to the midnight zone!\nclick and drag to draw the squids tentacles', 
        windowWidth/2, windowHeight - 620); 

    w = windowWidth;
    h = windowHeight;
    triangle(w / 2 - 50, h / 2, w / 2 + 100, h / 2, w / 2 + 25, h / 2 - 200);
    rect(w / 2 + 25, h / 2, 50, 100);
}

function drawModules() {
    background(0, 103, 205);
    drawHead();

    for (var gridX = 0; gridX < gridResolutionX - 1; gridX++) {
        for (var gridY = 0; gridY < gridResolutionY - 1; gridY++) {
            // this uses the current tiles
            if (tiles[gridX][gridY] == 1) {
                // check the four neightbours, each can be true or false
                var NORTH = str(tiles[gridX][gridY - 1]);
                var WEST = str(tiles[gridX - 1][gridY]);
                var SOUTH = str(tiles[gridX][gridY + 1]);
                var EAST = str(tiles[gridX + 1][gridY]);

                // create binary result out of it
                var binaryResult = NORTH + WEST + SOUTH + EAST;

                // convert binary string to a decimal value from 0 - 15
                var decimalResult = parseInt(binaryResult, 2);

                var posX = tileSize * gridX - tileSize / 2;
                var posY = tileSize * gridY - tileSize / 2;

                // decimalResult is also the index for the shape array
                image(modules[decimalResult], posX, posY, tileSize, tileSize);

                if (isDebugMode) {
                    text(decimalResult + '\n' + binaryResult, posX, posY);
                }
            }
        }
    }
}

/* This is the Abyss function */
function abyss() {
    background(0); 
    
    // HSB for fun color coding
    push();
    colorMode(HSB, 360);
    pop();

    // This creates a fade effect
    noStroke();
    fill(0, 500);
    rect(0, 0, width, height);

    // Move and spawn particles
    // Remove any that is below the velocity threshold
    for (var i = allParticles.length - 1; i > -1; i--) {
        allParticles[i].move();

        if (allParticles[i].vel.mag() < 0.01) {
            allParticles.splice(i, 1);
        }
    }

    if (allParticles.length > 0) {
        // Run Delaunay algorithm to get points to create triangles with
        data = Delaunay.triangulate(
            allParticles.map(function (pt) {
                return [pt.pos.x, pt.pos.y];
            })
        );

        strokeWeight(0.4);

        // Display triangles individually.
        for (var i = 0; i < data.length; i += 3) {
            // Collect particles that make this triangle.
            var p1 = allParticles[data[i]];
            var p2 = allParticles[data[i + 1]];
            var p3 = allParticles[data[i + 2]];

            // Don't draw triangle if its area is too big.
            var distThresh = 75;

            if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
                continue;
            }

            if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
                continue;
            }

            if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
                continue;
            }

            // Base its hue by the particle's life
            if (useFill) {
                noStroke();
                fill(100 + p1.life * 1.5, 360, 360);
            } else {
                noFill();
                stroke(200 + p1.life * 1.5, 360, 360);
            }

            triangle(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y);
        }
    }

    noStroke();
    fill(250);

    text("Welcome to the Abyss");
    text("Welcome to the Abyss, click, drag, and press 4",
        width / 2,
        height / 2 - 250
    );
}

// Helper functions for the abyss zone

function mouseDragged() {
    allParticles.push(new AbyssParticle(mouseX, mouseY, maxLevel));
}

function keyPressed() {
    useFill = !useFill;
}


/* 
    AbyssParticle Class
    Moves to a random direction and particle comes to a halt
    The Particle grows and spans within a threshold lifetime
*/
function AbyssParticle(x, y, level) {
    this.level = level;
    this.life = 1;

    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

    this.move = function () {
        this.life++;

        // Add friction.
        this.vel.mult(0.9);

        this.pos.add(this.vel);

        // Spawn a new particle if conditions are met.
        if (this.life % 10 == 0) {
            if (this.level > 0) {
                this.level -= 1;
                var newParticle = new AbyssParticle(
                    this.pos.x,
                    this.pos.y,
                    this.level - 1
                );
                allParticles.push(newParticle);
            }
        }
    };
}

/* 
    Plankton Class: Builds the coordinates, radius, and speed of particles in the matrix space.
    plankton set into motion and lines are connected.
 */

class Plankton {
    constructor() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.r = random(1, 8);
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-1, 1.5);
    }

    // Creation of the plankton
    createPlankton() {
        noStroke();
        fill(57, 255, 20);
        ellipse(this.x, this.y, this.r);
    }

    // Setting the plankton in motion
    movePlankton() {
        if (this.x < 0 || this.x > width) this.xSpeed *= -1;
        if (this.y < 0 || this.y > height) this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    // Creates the connections(lines) between planktons which are less than a certain distance apart
    joinPlankton(planktons) {
        planktons.forEach((element) => {
            let dis = dist(this.x, this.y, element.x, element.y);
            if (dis < 85) {
                push();
                stroke(57, 255, 20);
                
                line(this.x, this.y, element.x, element.y);
                pop();
            }
        });
    }
}

/* Particle Class */
let Particle = function (position) {
    this.acceleration = createVector(0, 0.1);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255.0;
};

Particle.prototype.run = function () {
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function () {
    stroke(20, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
};

// Checks if the particle is still alive
Particle.prototype.isDead = function () {
    if (this.lifespan < 0) {
        return true;
    } else {
        return false;
    }
};

let ParticleSystem = function (position) {
    this.origin = position.copy();
    this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
    // Add either a Particle or CrazyParticle to the system
    if (int(random(0, 2)) == 0) {
        p = new Particle(this.origin);
    } else {
        p = new CrazyParticle(this.origin);
    }
    this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
    for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.run();
        if (p.isDead()) {
            this.particles.splice(i, 1);
        }
    }
};

/* Sublass of Particle */

function CrazyParticle(origin) {
    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    Particle.call(this, origin);

    // Initialize our added properties
    this.theta = 0.0;
}

CrazyParticle.prototype = Object.create(Particle.prototype); 

// Sets the constructor property for CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// Notice we don't have the method run() here; it is inherited from Particle

// // This update function overrides the parent class update function
CrazyParticle.prototype.update = function () {
    Particle.prototype.update.call(this);
    // Increment rotation based on horizontal velocity
    this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
};

// This display function overrides the parent class display function
CrazyParticle.prototype.display = function () {
    // Renders the ellipse just like in a regular particle
    Particle.prototype.display.call(this);
    // Adds a rotating line
    push();
    translate(this.position.x, this.position.y);
    rotate(this.theta);
    stroke(20, this.lifespan);
    line(0, 0, 25, 0);
    pop();
};

/* Jellyfish Class- sets the jellyfish into motion based on a random position */
function Jellyfish(img, tempX, tempY) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.angle = random(0, TWO_PI);
    this.botImage = img;
    this.yoffset = 0.0;
    this.update = function () {
        this.angle += 0.05;
        this.yoffset = sin(this.angle) * 10;
    };
    this.display = function () {
        image(this.botImage, this.xpos, this.ypos + this.yoffset);
    };
}
