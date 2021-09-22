// globals
let speed;
let bounds;
let triggerCount;
let triggerRadius;
let cullRadius;
let orbChain;
let orbChains;

function setup() {
  createCanvas(400, 400);
  speed = 1.0
  bounds = createVector(400, 400);
  triggerCount = 0;
  triggerRadius = 50;
  cullRadius = 325;
  maxRadius = Math.sqrt(Math.pow(bounds.x, 2) + Math.pow(bounds.y, 2)) + 275;
  orbChains = [];
  orbChains.push(initOrbs(16));

}

function draw() {
  fill(0,20);
  rect(0,0,width,height);
  background(249, 250, 210);
  translate(width/2, height/2);

  if (triggerCount >= triggerRadius) {
    orbChains.unshift(initOrbs(16));
    triggerCount = 0;
  } else {
    triggerCount += speed;
  }

  if ((orbChains[orbChains.length-1][0].leader.position.x >= cullRadius) 
  || (orbChains[orbChains.length-1][0].leader.position.x >= cullRadius)) {
    orbChains.pop();
  }

  for (let i = 0; i < orbChains.length; i++) {
    for (let j = 0; j < orbChains[i].length; j++) {
      rotate((Math.PI / 8));
      orbChains[i][j].move();
    }
  }

  drawBounds();
  fill(255, 215, 83)
  noStroke();
  ellipse(0, 0, 50, 50);
}

function drawBounds() {
  noFill();
  stroke(255, 105, 105);
  strokeWeight(11);
  rect(-bounds.x/2,-bounds.y/2, bounds.x, bounds.y);
}

function initOrbs(numOrbChains) {
  chain = [];
  for (let i = 0; i< numOrbChains; i++) {
    chain.push(new OrbChain(createVector(speed, 0), .16, .5))
  }
  return chain;
}