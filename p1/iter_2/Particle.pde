class Particle {
  PVector origin;
  float speed;
  int radius;
  float position;

  // default constructor
  Particle() {}

  // constructor
  Particle(PVector origin, int radius, float position, float speed) {
    this.origin = origin;
    this.radius = radius;
    this.position = position;
    this.speed = speed;
  }
 
  void oscillate() {
    pushMatrix();
    position += speed;
    println(position);
    ellipse(this.origin.x + this.radius*sin(position), this.origin.y + this.radius*cos(position), 3, 3); 
    popMatrix();
  }
  
}
