class OrbChain {

    constructor(springing, damping) {
        this.leader = new Orb(5, color(0, 0, 0), createVector(0, 0),
        createVector(-1.5, 0));
        this.followers = this.createFollowers();
        this.springing = springing;
        this.damping = damping;
    }

    move() {
        this.leader.move();
        for (let i = 0; i < this.followers.length; i++) {
            if (i == 0) {
                let deltaX = this.leader.position.x - this.followers[i].position.x;
                let deltaY = this.leader.position.y - this.followers[i].position.y;
                // create springing effect
                deltaX *= this.springing;
                deltaY *= this.springing;
                this.followers[i].speed.x += deltaX;
                this.followers[i].speed.y += deltaY;

                this.followers[i].move();

                // slow down springing
                this.followers[i].speed.x *= this.damping;
                this.followers[i].speed.y *= this.damping;
                
                noStroke();
                this.leader.draw();
                this.followers[i].draw();

            } else {
                let deltaX = this.followers[i - 1].position.x - this.followers[i].position.x;
                let deltaY = this.followers[i - 1].position.y - this.followers[i].position.y;

                // create springing effect
                deltaX *= this.springing;
                deltaY *= this.springing;
                this.followers[i].speed.x += deltaX;
                this.followers[i].speed.y += deltaY;

                this.followers[i].move();

                // slow down springing
                this.followers[i].speed.x *= this.damping;
                this.followers[i].speed.y *= this.damping;

                //this.leader.draw();
                this.followers[i].draw();

            }
        }
    }

    createFollowers() {
      let followers = [];
      let numPoints =70;
      let radiiFactor = 4.9 / numPoints;

      for (let i = 0; i < numPoints; i++) {
        followers[i] = new Orb(5-radiiFactor*i,
                            color(0, 0, 0),
                            createVector(0, 0),
                            createVector(0, 0));
      }
      return followers;
    }

    checkBoundsCollision(bounds) {
        this.leader.checkBoundsCollision(bounds);
        for (let i = 0; i < this.followers.length; i++) {
            this.followers[i].checkBoundsCollision(bounds);
        }
    }
}
