class Particle {
  PVector position;
  PVector speed;
  PVector radius;
  PVector osc;

  // constructor
  Particle(PVector speed, PVector radius) {
    this.osc = new PVector(0.0, 0.0);
    this.position = new PVector(width/2, height/2);
    this.speed = speed;
    this.radius = radius;
  }
 
  void oscillate() {
    pushMatrix();
    osc.x += speed.x;
    osc.y += speed.y;
    ellipse(this.position.x + this.radius.x*sin(osc.x), this.position.y + this.radius.y*cos(osc.y), 25, 25); 
    popMatrix();
  }
  
}
