// globals
let speed;
let bounds;

let triggerMonitor;
let triggerRadius;
let cullRadius;

let orbChains;

// text
let title = "K  A  U  A  I";
let subheader_1 = "WITH JADEN SMITH AS";
let subheader_2 = "\"THE BOY\"";
let artist = "G  A  M  B  I  N  O";

function setup() {
  createCanvas(400, 400);
  speed = 1.0
  bounds = createVector(400, 400);
  triggerMonitor = 0;
  triggerRadius = 75;
  cullRadius = 300;
  orbChains = [];
  orbChains.push(initOrbs(16));
}

function draw() {
  background(251,235,148);
  translate(width/2, height/2);

  fill(0);
  noStroke();
  textAlign(CENTER);

  textSize(16);
  text(title, 0, -170);
  text(artist, 0, -135);

  textSize(6);
  text(subheader_1, 0, -160);
  text(subheader_2, 0, -150);

  if (triggerMonitor >= triggerRadius) {
    orbChains.unshift(initOrbs(16));
    triggerMonitor = 0;
  } else {
    triggerMonitor += speed;
  }

  if ((orbChains[orbChains.length-1][0].leader.position.x >= cullRadius) 
  || (orbChains[orbChains.length-1][0].leader.position.y >= cullRadius)) {
    orbChains.pop();
  }

  for (let i = 0; i < orbChains.length; i++) {
    for (let j = 0; j < orbChains[i].length; j++) {
      rotate((Math.PI / 8));
      orbChains[i][j].move();
    }
  }

  fill(242, 111, 7)
  noStroke();
  ellipse(0, 0, 80, 80);
  
  fill(164,211,243);
  noStroke();
  rect(-bounds.x/2, 0, 400, 200);

  drawBounds();
  console.log(orbChains.length);
}

function drawBounds() {
  noFill();
  rect(-bounds.x/2,-bounds.y/2, bounds.x, bounds.y);
}

function initOrbs(numOrbChains) {
  chain = [];
  for (let i = 0; i< numOrbChains; i++) {
    chain.push(new OrbChain(createVector(speed, 0), .16, .5))
  }
  return chain;
}