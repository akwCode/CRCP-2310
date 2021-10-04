
let bounds;
let vOrb;
let vSquare;

function setup() {
  createCanvas(600, 600);
  bounds = createVector(400, 400);
  vOrb = new Vorb(createVector(-200, 0), 5, createVector(.5, 0));
  vSquare = new VerletSquare(createVector(0, 0), 50);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  drawBounds();
}

function drawBounds() {
  noFill();
  stroke(0);
  rect(-bounds.x / 2, -bounds.y / 2, bounds.x, bounds.y);

  // bounds check
  if (((vSquare.xBounds.x < vOrb.p.x) && (vOrb.p.x < vSquare.xBounds.y))
  && ((vSquare.yBounds.x < vOrb.p.y) && (vOrb.p.y < vSquare.yBounds.y)))
    vOrb.p.add(createVector(0, -0.01))

  vOrb.verlet();
  vOrb.draw();
  vSquare.draw();
}