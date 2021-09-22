class OrbChain {

  constructor(leadSpeed, springing, damping) {
      this.leader = new Orb(2.5, color(0, 0, 0), createVector(0, 0),
      leadSpeed);
      this.followers = this.createFollowers();
      this.springing = springing;
      this.damping = damping;
  }

  // modified from NatureandCode_P5_Springing03_segments (Author: Ira Greenberg)
  move() {
      this.leader.move();
      for (let i = 0; i < this.followers.length; i++) {
          if (i == 0) {
              let deltaX = this.leader.position.x - this.followers[i].position.x;
              let deltaY = this.leader.position.y - this.followers[i].position.y;

              deltaX *= this.springing;
              deltaY *= this.springing;
              this.followers[i].speed.x += deltaX;
              this.followers[i].speed.y += deltaY;

              this.followers[i].move();

              this.followers[i].osc.add(createVector(random(0.1, 0.5)*deltaY, random(0.1, 0.5)*deltaX))

              this.followers[i].speed.x *= this.damping;
              this.followers[i].speed.y *= this.damping;
              
              noStroke();
              // this.leader.draw();
              this.followers[i].draw();
          } else {
              let deltaX = this.followers[i - 1].position.x - this.followers[i].position.x;
              let deltaY = this.followers[i - 1].position.y - this.followers[i].position.y;

              deltaX *= this.springing;
              deltaY *= this.springing;
              this.followers[i].speed.x += deltaX;
              this.followers[i].speed.y += deltaY;

              this.followers[i].osc.add(createVector(random(0.1, 0.5)*deltaY, random(0.1, 0.5)*deltaX))

              this.followers[i].move();

              this.followers[i].speed.x *= this.damping;
              this.followers[i].speed.y *= this.damping;

              // this.leader.draw();
              this.followers[i].draw();

          }
      }
  }

  createFollowers() {
      let followers = [];
      let numPoints = 15;
      let radiiFactor = 2.4 / numPoints;

      for (let i = 0; i < numPoints; i++) {
        followers[i] = new Orb(2.5-radiiFactor*i,
                            color(242, 111, 7),
                            createVector(0, 0),
                            createVector(0, 0));
      }
      return followers;
  }
}
