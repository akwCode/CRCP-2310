// globals
let bounds;
let orbChain;
let orbChains;

let radius = 0;
let speed = 1.0

function setup() {
  createCanvas(600, 600);
  bounds = createVector(400, 400);
  orbChains = initOrbs();

}

function draw() {
  background(255);
  translate(width/2, height/2);
  drawBounds();
  
  if (radius <= bounds.x)
    radius += speed;
  else {
    radius = 0;
    orbChains = initOrbs();
  }
  
  stroke(0);
  strokeWeight(11);
  ellipse(0, 0, radius, radius);

  for (let i = 0; i < orbChains.length; i++) {
    rotate(Math.PI / 4);
    orbChains[i].move();
  }
}

function drawBounds() {
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(-bounds.x/2, -bounds.y/2, bounds.x, bounds.y);
}

function initOrbs() {
  return [
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
    orbChain = new OrbChain(createVector(speed/2, 0), .16, .5),
  ];
}