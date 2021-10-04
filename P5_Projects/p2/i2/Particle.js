class Particle {
  constructor(position, radius, v0) {
    this.p = position;
    this.p0 = position.sub(v0);
    this.r = radius;
  }
}