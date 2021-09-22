class Orb {
  constructor(radius, color, position, speed) {
    this.radius = radius;
    this.color = color;
    this.position = position;
    this.speed = speed;
    this.osc = createVector(0, 0);
  }

  move() {
    this.position.add(this.speed);
  }

  draw() {
    push();
    translate(this.position.x + 5*Math.sin(this.osc.x), this.position.y + 5*Math.cos(this.osc.y));
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }
}