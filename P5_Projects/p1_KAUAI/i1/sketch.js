// globals
let bounds;
let orbChain;

function setup() {
  createCanvas(600, 600);
  bounds = createVector(400, 400);
  orbChain = new OrbChain(.16, .5);
}

function draw() {
  background(255);
  translate(width/2, height/2);
  drawBounds();
  
  orbChain.move();
  orbChain.checkBoundsCollision(bounds);
}

function drawBounds() {
  noFill();
  stroke(0);
  rect(-bounds.x/2, -bounds.y/2, bounds.x, bounds.y);
}

