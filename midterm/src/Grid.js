class Grid {
    constructor(size) {
        this.size = size;
        this.step = 1.0/size;
        this.center = [0, 0, 0];

        this.vertices = [];
    }

    create() {
        this.baseVertices = [];

        let terrain = [];
        for (let i = 0; i < this.size+1; i++) {
            let values = [];
            for (let j = 0; j < this.size+1; j++) {
                values.push(Math.random()/50);
            }
            terrain.push(values);
        }

        let min = -0.5;
        for (let i = 0; i < this.size+1; i++) {
            for (let j = 0; j < this.size+1; j++) {
               this.baseVertices.push([
                   min + this.step*i,
                   terrain[i][j],
                   min + this.step*j,
                   1.0
               ]);
               if ((i === this.size/2) && (j === this.size/2))
                    this.center = [...this.baseVertices[this.baseVertices.length-1], 0];
            }
        }
    }

    getPoints() {
        let indices = [];
        let colors = [];
        for (let i = 0; i < (this.size+1)*(this.size+1); i++) {
            indices.push(i);
            colors.push(...[0.0, 0.0, 0.0]);
        }

        return {
            "indices": indices,
            "vertices": this.vertices,
            "colors": colors,
            "normals": []
        }
    }

    getLines() {
        let vertices = [];
        let colors = [];
        let norms = [];
        for (let i = 1; i < (this.size+1)*(this.size+1); i++) {
            if (i%(this.size+1) !== 0) {
                vertices.push(...[
                    this.baseVertices[i-1],
                    this.baseVertices[i]
                ]);
            }
        }

        for (let i = 0; i < this.size+1; i++) {
            for (let j = 1; j < this.size+1; j++) {
                vertices.push(...[
                    this.baseVertices[i + ((j-1)*(this.size+1))],
                    this.baseVertices[i+ (j*(this.size+1))]
                ]);
            }
        }

        for (let i = 0; i < (this.size+1)*(this.size+1); i++) {
            norms.push(...[0, 0, 0, 0]);
            norms.push(...[0, 0, 0, 0]);
        }

        // console.log(vertices)
        // console.log(norms)
        return {
            "indices": [],
            "vertices": vertices,
            "colors": [],
            "normals": norms
        }
    }

    getSquares() {
        let vertices = [];
        let norms = [];

        for (let i = 1; i < this.size+1; i++) {
            for (let j = 1; j < this.size+1; j++) {

                let qN = this.getQuadAndNorms(
                    i + ((j-1)*(this.size+1)),
                    (i-1) + ((j-1)*(this.size+1)),
                    i + ((j)*(this.size+1)),
                    (i-1) + (j*(this.size+1)));
                vertices.push(...qN.vertices);
                norms.push(...qN.norms)
            }
        }

        return {
            "indices": [],
            "vertices": vertices,
            "colors": [],
            "normals": norms
        }
    }

    getQuadAndNorms(p1, p2, p3, p4) {
        let vertices = [];
        let norms = [];
        vertices.push(...[this.baseVertices[p1], this.baseVertices[p3], this.baseVertices[p2]]);
        vertices.push(...[this.baseVertices[p3], this.baseVertices[p4], this.baseVertices[p2]]);
        // noinspection DuplicatedCode
        let v1 = subtract(
            vec4(this.baseVertices[p2][0], this.baseVertices[p2][1], this.baseVertices[p2][2], 1.0),
            vec4(this.baseVertices[p1][0], this.baseVertices[p1][1], this.baseVertices[p1][2], 1.0));
        // noinspection DuplicatedCode
        let v2 = subtract(
            vec4(this.baseVertices[p3][0], this.baseVertices[p3][1], this.baseVertices[p3][2], 1.0),
            vec4(this.baseVertices[p1][0], this.baseVertices[p1][1], this.baseVertices[p1][2], 1.0));
        // noinspection DuplicatedCode
        let v3 = subtract(
            vec4(this.baseVertices[p4][0], this.baseVertices[p4][1], this.baseVertices[p4][2], 1.0),
            vec4(this.baseVertices[p3][0], this.baseVertices[p3][1], this.baseVertices[p3][2], 1.0),);
        // noinspection DuplicatedCode
        let v4 = subtract(
            vec4(this.baseVertices[p4][0], this.baseVertices[p4][1], this.baseVertices[p4][2], 1.0),
            vec4(this.baseVertices[p2][0], this.baseVertices[p2][1], this.baseVertices[p2][2], 1.0));

        // noinspection DuplicatedCode
        norms.push([...normalize(cross(v2, v1)), 0.0]);
        norms.push([...normalize(cross(v2, v1)), 0.0]);
        norms.push([...normalize(cross(v2, v1)), 0.0]);

        // noinspection DuplicatedCode
        norms.push([...normalize(cross(v4, v3)), 0.0]);
        norms.push([...normalize(cross(v4, v3)), 0.0]);
        norms.push([...normalize(cross(v4, v3)), 0.0]);
        return {
            "vertices": vertices,
            "norms": norms
        };
    }
}