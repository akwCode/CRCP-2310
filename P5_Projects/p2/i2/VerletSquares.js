class VerletSquares {
  constructor(boundSize, gridSize) {
    this.squareArray = [];
    this.squareSize = boundSize/gridSize;

    let topLeftOrigin = createVector(-boundSize/2, -boundSize/2);
    let offset = this.squareSize/2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        this.squareArray.push(createVector(topLeftOrigin.x+(i*this.squareSize)+offset, 
                                          topLeftOrigin.y+(j*this.squareSize)+offset));
      }
    }
  }
  
  createSquares() {

  }


  verlet(particle) {
    let pT = createVector(particle.p.x, this.particle.p.y);
    particle.p.x += (particle.p.x - particle.p0.x);
    particle.p.y += (particle.p.y - particle.p0.y);
    particle.p0.set(pT);
  }

  draw() {
    for (let i = 0; i < this.squareArray.length; i++) {
      ellipse(this.squareArray[i].x, this.squareArray[i].y, this.squareSize, this.squareSize);
      square(this.squareArray[i].x-(this.squareSize/2), this.squareArray[i].y-(this.squareSize/2), this.squareSize);
    }
    
    // fill('rgba(147, 219, 222, .38)')
  }

  debugDraw() {
    ellipse(this.origin.x, this.origin.y, this.size, this.size);
  }
}