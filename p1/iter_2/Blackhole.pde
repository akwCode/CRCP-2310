class Blackhole {
  PVector origin;
  float r;
  
  
  // default constructor
  Blackhole(){}
  
  Blackhole(PVector origin, float radius) {
    this.origin = origin;
    this.r = radius;
  }
  
  PShape create() {
    PShape finalShape = createShape(GROUP);
    
    PShape singularity;
    if (this.r > 0.0) {
      singularity = createShape(ELLIPSE, this.origin.x, this.origin.y, this.r - (this.r*.1), this.r - (this.r*.1));
    } else {
      singularity = createShape(ELLIPSE, this.origin.x, this.origin.y, 0, 0);
    }
    
    PShape eventHorizon = createShape(ELLIPSE, this.origin.x, this.origin.y, this.r, this.r);
    
    singularity.setFill(color(0));
    eventHorizon.setFill(color(255));
    
    finalShape.addChild(eventHorizon);
    finalShape.addChild(singularity);
    
    return finalShape;
  }
}
