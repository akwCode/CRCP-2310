/*

Assignment 01 - Euler Integration
Iteration 01
Author - Alex Williams

*/


Particle p;

void setup() {
  size(512, 512);
  p = new Particle(new PVector(0.10, 0.10), new PVector(50, 50));
}

void draw() {
  background(0);
  p.oscillate();
}
