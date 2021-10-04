class Vorb {
  constructor(position, radius, v0) {
    this.p = position;
    this.p0 = createVector(this.p.x-v0.x, this.p.y-v0.y);
    this.r = radius;
  }

  verlet() {
    let pT = createVector(this.p.x, this.p.y);

    this.p.x +=  (this.p.x - this.p0.x);
		this.p.y += (this.p.y - this.p0.y);

    this.p0.set(pT);
  }

  draw() {
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
  }
}