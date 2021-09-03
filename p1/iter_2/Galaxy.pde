class Galaxy {
  PVector origin;
  int blackholeRadius;
  int padding;
  
  Blackhole b;
  ArrayList<Particle> particles;
  
  // default constructor
  Galaxy(){}
  
  Galaxy(PVector origin, int blackholeRadius, int padding, int numRings){
    this.origin = origin;
    this.blackholeRadius = blackholeRadius;
    this.padding = padding;
    
    
    this.b = new Blackhole(origin, blackholeRadius);
    this.particles = generateParticles(500);
  }
  
  PShape getBlackhole() {
    return this.b.create();
  }
  
  ArrayList<Particle> generateParticles(int numStars) {
    ArrayList<Particle> particles = new ArrayList<Particle>();
    
    for (int i = 0; i < numStars; i++) {
      int radius = int(random(40, 100));
      float position = random(0.0, 6.28);
      float speed = random(0.01, 0.02);
      particles.add( new Particle(origin, radius, position, speed)); 
    }
    
    return particles;
  }
  
}
