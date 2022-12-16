/*
Frozen brush: jasonlabbe3d.com

Makes use of a delaunay algorithm to create crystal-like shapes.
The delaunay library was developed by Jay LaPorte at https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
 
*/

var allParticles = [];
var maxLevel = 7;
var useFill = true;

var data = [1];


// AbyssParticle Class
// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function AbyssParticle(x, y, level) {
  this.level = level;
  this.life = 1;
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));
  
  this.move = function() {
    this.life++;
    
    // Add friction.
    this.vel.mult(0.9);
    
    this.pos.add(this.vel);
    
    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new AbyssParticle(this.pos.x, this.pos.y, this.level-1);
        allParticles.push(newParticle);
      }
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);  
} 


function draw() { 
  abyss();       
}

function abyss() {
   background(0);
   colorMode(HSB, 360);

   // Create fade effect.
   noStroke();
   fill(0, 500);
   rect(0, 0, width, height);
   
   // Move and spawn particles.
   // Remove any that is below the velocity threshold.
   for (var i = allParticles.length-1; i > -1; i--) {
     allParticles[i].move();
     
     if (allParticles[i].vel.mag() < 0.01) {
       allParticles.splice(i, 1);
     }
   }
   
   if (allParticles.length > 0) {
     // Run script to get points to create triangles with.
     data = Delaunay.triangulate(allParticles.map(function(pt) {
       return [pt.pos.x, pt.pos.y];
     }));
     
     strokeWeight(0.4);
     
     // Display triangles individually.
     for (var i = 0; i < data.length; i += 3) {
       // Collect particles that make this triangle.
       var p1 = allParticles[data[i]];
       var p2 = allParticles[data[i+1]];
       var p3 = allParticles[data[i+2]];
       
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
       
       // Base its hue by the particle's life.
       if (useFill) {
         noStroke();
         fill(100+p1.life*1.5, 360, 360);
       } else {
         noFill();
         stroke(200+p1.life*1.5, 360, 360);
       }
       
       triangle(p1.pos.x, p1.pos.y, 
                p2.pos.x, p2.pos.y, 
                p3.pos.x, p3.pos.y);
     }
   }
   
   noStroke();
   fill(2505);
   textAlign(CENTER);
   text("Welcome to the Abyss\nClick and drag the mouse to discover secrets\nContinue pressing keys", width/2, height/2 - 250);

}

function mouseDragged() {
  allParticles.push(new AbyssParticle(mouseX, mouseY, maxLevel));
}

function keyPressed() {
  useFill = ! useFill;
}