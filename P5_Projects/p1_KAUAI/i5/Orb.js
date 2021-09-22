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
    translate(this.position.x + 5*Math.sin(this.osc.x), this.position.y + 5*Math.sin(this.osc.y));
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }

  checkBoundsCollision(bounds) {
    if (this.position.x > bounds.x / 2 - this.radius) {
        this.position.x = bounds.x / 2 - this.radius;
        this.speed.x *= -1;
    }
    else if (this.position.x < -bounds.x / 2 + this.radius) {
        this.position.x = -bounds.x / 2 + this.radius;
        this.speed.x *= -1;
    }

    if (this.position.y > bounds.y / 2 - this.radius) {
        this.position.y = bounds.y / 2 - this.radius;
        this.speed.y *= -1;
    }
    else if (this.position.y < -bounds.y / 2 + this.radius) {
        this.position.y = -bounds.y / 2 + this.radius;
        this.speed.y *= -1;
    }
  }
}