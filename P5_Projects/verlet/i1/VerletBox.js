// Ira Greenberg
// Nature & Code
// Center of Creative Computation | SMU
// Fall, 2021

// Description:
// Creating an organism
// based on a Verlet Box

// To Do;
// Add diagnol supports for cube

/*
4*-------5*\
| \       | \
|  \*1----|-*0
|   |     |  |
7*--|---6*\  |
  \ |      \ |
   *2-------*3
*/
// Box indexing
// 12 Triangle faces
// CCW winding



class VerletBox {

    constructor(pos, sz, springiness, col) {
        this.pos = pos;
        this.sz = sz;
        this.springiness = springiness;
        this.col = col;
        console.log("typeof springiness = ", typeof this.springiness);

        // initialize styloe properties
        this.nodeRadius = 1;
        this.nodeCol = color(150, 34, 150);
        this.stickCol = color(150, 150, 0);


        this.indicies = [
            [0, 6, 7],
            [0, 1, 6],
            [1, 6, 8],
            [1, 8, 9],
            [1, 2, 9],
            [2, 3, 9],
            [3, 9, 10],
            [5, 8, 10],
            [5, 6, 8],
            [3, 5, 10],
            [3, 4, 5]
        ];

        this.stickIndices = [
            // MAIN
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 0],
            [8, 9],
            [9, 10],
            [10, 8],
            [1, 9],
            [2, 9],
            [0, 8],
            [10, 3],

            // SUPPORT
            [0, 11],
            [1, 11],
            [2, 11],
            [3, 11],
            [4, 11],
            [5, 11],
            [6, 11],
            [7, 11],
            [8, 11],
            [9, 11],
            [10, 11],
            [0, 12],
            [1, 12],
            [2, 12],
            [3, 12],
            [4, 12],
            [5, 12],
            [6, 12],
            [7, 12],
            [8, 12],
            [9, 12],
            [10, 12],

            [0, 13],
            [1, 13],
            [2, 13],
            [3, 13],
            [4, 13],
            [5, 13],
            [6, 13],
            [7, 13],
            [8, 13],
            [9, 13],
            [10, 13],
            [0, 14],
            [1, 14],
            [2, 14],
            [3, 14],
            [4, 14],
            [5, 14],
            [6, 14],
            [7, 14],
            [8, 14],
            [9, 14],
            [10, 14],
        ];

        this.vecs = [
          // MAIN
          createVector(80*-0.8,   80*1.0,   80*0.6),
          createVector(80*-0.2,    80*-1.0,    80*1.0),
          createVector(80*0.2,    80*-1.0,    80*1.0),
          createVector(80*0.8,   80*1.0,    80*0.6),
          createVector(80*0.4,   80*1.0,    80*0.6),
          createVector(80*0.25,   80*0.4,    80*0.72),
          createVector(80*-0.25,   80*0.4,    80*0.72),
          createVector(80*-0.4,   80*1.0,    80*0.6),
          createVector(80*-0.15,    80*-0.0,    80*0.8),
          createVector(80*0.0,    80*-0.6,    80*0.92),
          createVector(80*0.15,    80*-0.0,    80*0.8),

          // SUPPORT
          createVector(80*0.25,   80*0.4,    (80*0.72)-20),
          createVector(80*0.25,   80*0.4,    (80*0.72)+20),
          createVector(80*-0.25,   80*0.4,    (80*0.72)-20),
          createVector(80*-0.25,   80*0.4,    (80*0.72)+20),
        ]

        this.faces = [];
        for (let i = 0; i < this.indicies.length; i++) {
            this.faces[i] = new Face3(this.vecs[this.indicies[i][0]],
                this.vecs[this.indicies[i][1]],
                this.vecs[this.indicies[i][2]], this.col);
        }

        // verlet guts below
        this.nodes = [];
        for (let i = 0; i < this.vecs.length; i++) {
            this.nodes[i] = new VerletNode(this.vecs[i], this.nodeRadius, color(235, 235, 255));
        }

        this.sticks = [];
        for (let i = 0; i < this.stickIndices.length; i++) {
            if (i > 15) {
              this.sticks[i] = new VerletStick(this.nodes[this.stickIndices[i][0]], this.nodes[this.stickIndices[i][1]],
                1, 2, this.col);
            } else {
              this.sticks[i] = new VerletStick(this.nodes[this.stickIndices[i][0]], this.nodes[this.stickIndices[i][1]],
                this.springiness, 0, this.col);
            }
        }
    }

    nudge(index, offset) {
        this.nodes[index].pos.add(offset);
    }

    verlet() {

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }

    }

    setStyles(nodeRadius, nodeCol, stickCol) {
        this.nodeRadius = nodeRadius;
        this.nodeCol = nodeCol;
        this.stickCol = stickCol;

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].setStyle(this.nodeRadius, this.nodeCol);
        }

        // Stick colors
        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].setColor(stickCol);
        }
    }

    draw() {
        for (let i = 0; i < this.faces.length; i++) {
            this.faces[i].draw();
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw();
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].draw();
        }
    }

    boundsCollide(bounds) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].boundsCollide(bounds);
        }
    }
}

