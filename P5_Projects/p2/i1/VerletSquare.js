class VerletSquare {
  constructor(origin, size) {
    this.origin = origin;
    this.size = size;
    this.xBounds = createVector(origin.x-(this.size/2), origin.x+(this.size/2));
    this.yBounds = createVector(origin.y-(this.size/2), origin.y+(this.size/2));
  }
  
  draw() {
    square(this.xBounds.x, this.yBounds.x, this.size);
  }

}