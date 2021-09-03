/*

Assignment 01 - Euler Integration
Iteration 01
Author - Alex Williams

*/

// Globals
PVector resolution = new PVector(512, 512);
int edgePadding = 20;

Galaxy g;


Particle p;
Blackhole b;

void setup() {
  size(512, 512);
  g = new Galaxy(new PVector(width/2, height/2), 50, 10, 1);
}

void draw() {
  background(0);
  shape(g.getBlackhole());
  for (int i = 0; i < g.particles.size(); i++) {
    g.particles.get(i).oscillate();
  }
}
