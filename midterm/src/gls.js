
/*
+ : right increment
- : left increment
$ : front increment
& : back increment

[ : open branch
] : close branch
F : draw line
 */

class BranchPoint {
    constructor(pos, gamma, phi, strength) {
        this.pos = pos;
        this.children = [];

        this.gamma = gamma;
        this.phi = phi;

        this.strength = strength;
    }
}

class Gls {
    constructor() {
        this.operators = {
            "+": "",
            "-": "",
            "[": "",
            "]": "",
            "$": "",
            "&": ""
        };

        this.nonterminals = ["F"];
        this.terminals = [];
        this.start = "F";
        this.productions = {
            "F": "F[+F][-F]"
        };

        this.step = 0.05;
        this.segmentRadius = 0.02;
        this.gammaIncrement = 15.0;
        this.phiIncrement = 15.0;

        this.state = this.start;
        this.origin = [0, -0.01, 0, 0];
    }

    loadGrammar(grammar) {
        this.nonterminals = grammar.nonterminals;
        this.terminals = grammar.terminals;
        this.start = grammar.start;
        this.productions = grammar.productions;

        this.step = grammar.step;
        this.segmentRadius = grammar.radius;
        this.gammaIncrement = grammar.gamma;
        this.phiIncrement = grammar.phi;

        this.state = grammar.start;
    }

    parse(str) {
        let parsed = "";
        for (let i = 0; i < str.length; i++) {
            if (this.nonterminals.includes(str[i]))
                parsed += this.productions[str[i]];
            else if (this.terminals.includes(str[i]) || str[i] in this.operators)
                parsed += str[i]
            else
                console.log(`ERROR: INVALID SYMBOL ${str[i]}`);
        }
        return parsed;
    }

    getState() {
        return this.state;
    }

    iterate() {
        this.state = this.parse(this.state);
    }

    getEntity() {
        let vertices = [];
        let colors = [];
        let norms = [];
        let gammaPhi = [];
        let ptStruct = this.getPtStruct();

        this.branchPointsToEntity(ptStruct, vertices, colors, gammaPhi);

        for (let i = 0; i < vertices.length; i++) {
            norms.push([0, 0, 0, 1.0]);
        }

        return {
            "vertices": vertices,
            "colors": colors,
            "normals": norms,
            "gammaPhi": gammaPhi
        }
    }

    getPtStruct() {
        let stk = [];
        let index = 0;
        let origin = new BranchPoint(this.origin, 90, 90, this.state.length, index++);
        console.log(this.state.length)
        let root = origin;
        let pos = root.pos, gamma = root.gamma, phi = root.phi, strength = root.strength;
        let sentence = this.state.split('');
        let char;
        while(sentence.length) {
            char = sentence.shift();
            if (char === "F") {
                let doAppend = true;
                pos = [
                    pos[0] + (this.step*Math.cos(gamma*Math.PI/180)*Math.sin(phi*Math.PI/180)),
                    pos[1] + (this.step*Math.sin(gamma*Math.PI/180)*Math.sin(phi*Math.PI/180)),
                    pos[2] + (this.step*Math.cos(phi*Math.PI/180)),
                    0.0
                ];
                if(root.children.length) {
                    for (let i = 0; i < root.children.length; i++) {
                        if (this.arrayEquals(root.children[i].pos, pos)) {
                            doAppend = false;
                            root = root.children[i];
                            gamma = root.gamma, pos = root.pos, phi = root.phi, strength = root.strength;
                        }
                    }
                }
                if(doAppend) {
                    strength -= .5;
                    let bPt = new BranchPoint(pos, gamma, phi, strength, index++);
                    root.children.push(bPt);
                    root = root.children[root.children.length-1];
                }
            } else if (char === "-") {
                gamma -= this.gammaIncrement;
            } else if (char === "+") {
                gamma += this.gammaIncrement;
            } else if (char === "&") {
                phi += this.phiIncrement;
            } else if (char === "$") {
                phi -= this.phiIncrement;
            } else if (char === "[") {
                stk.push(root);
            } else if (char === "]") {
                root = stk.pop();
                // noinspection CommaExpressionJS
                gamma = root.gamma, pos = root.pos, phi = root.phi, strength = root.strength;
            }
        }
        return origin;
    }

    getSegment() {
        let vertices = [];
        let colors = [];
        let norms = [];

        let numPoints = 7;
        let radius = this.segmentRadius;
        let height = this.step;

        let spacing = 360/numPoints;
        let origin = [0.0, 0.0, 0.0, 1.0], origin2 = [0.0, 0.0, height, 1.0];

        let tN;

        //bottom
        let botVertices = [];
        for (let i = 0; i < numPoints; i++) {
            botVertices.push([
                origin[0] + (radius*Math.cos((i*spacing)*Math.PI/180)),
                origin[1] + (radius*Math.sin((i*spacing)*Math.PI/180)),
                origin[2],
                1.0
            ])
        }
        for (let i = 1; i < botVertices.length; i++) {
            let tN = this.getTriangleAndNorms(
                origin,
                botVertices[i],
                botVertices[i-1]
            )
            vertices.push(...tN.vertices);
            norms.push(...tN.norms);
        }
        tN = this.getTriangleAndNorms(
            origin,
            botVertices[0],
            botVertices[botVertices.length-1]
        )
        vertices.push(...tN.vertices);
        norms.push(...tN.norms);

        // top
        let topVertices = [];
        for (let i = 0; i < numPoints; i++) {
            topVertices.push([
                origin2[0] + (radius*Math.cos((i*spacing)*Math.PI/180)),
                origin2[1] + (radius*Math.sin((i*spacing)*Math.PI/180)),
                origin2[2],
                1.0
            ])
        }
        for (let i = 1; i < topVertices.length; i++) {
            let tN = this.getTriangleAndNorms(
                origin2,
                topVertices[i-1],
                topVertices[i]
            )
            vertices.push(...tN.vertices);
            norms.push(...tN.norms);
        }
        tN = this.getTriangleAndNorms(
            origin2,
            topVertices[topVertices.length-1],
            topVertices[0]
        )
        vertices.push(...tN.vertices);
        norms.push(...tN.norms);

        //sides
        for (let i = 1; i < topVertices.length; i++) {
            let qN = this.getQuadAndNorms(
                topVertices[i-1],
                topVertices[i],
                botVertices[i-1],
                botVertices[i]
            )
            vertices.push(...qN.vertices);
            norms.push(...qN.norms);
        }
        let qN = this.getQuadAndNorms(
            topVertices[topVertices.length-1],
            topVertices[0],
            botVertices[botVertices.length-1],
            botVertices[0]
        )
        vertices.push(...qN.vertices);
        norms.push(...qN.norms);

        return {
            "vertices": vertices,
            "colors": colors,
            "normals": norms
        }
    }

    branchPointsToEntity(branchPts, vertices, colors, gammaPhi) {
        for (let i = 0; i < branchPts.children.length; i++) {
            vertices.push(branchPts.pos);
            gammaPhi.push([branchPts.gamma, branchPts.phi]);
            vertices.push(branchPts.children[i].pos);
            gammaPhi.push([branchPts.children[i].gamma, branchPts.children[i].phi]);
            colors.push([0.0, 0.0, 0.0]);
            colors.push([0.0, 0.0, 0.0]);
            if (branchPts.children.length)
                this.branchPointsToEntity(branchPts.children[i], vertices, colors, gammaPhi);
        }
    }

    getQuadAndNorms(p1, p2, p3, p4) {
        let vertices = [];
        let norms = [];
        vertices.push(...[p1, p3, p2]);
        vertices.push(...[p3, p4,p2]);

        let v1 = subtract(vec4([...p2, 1.0]), vec4([...p1, 1.0]));
        let v2 = subtract(vec4([...p3, 1.0]), vec4([...p1, 1.0]));
        let v3 = subtract(vec4([...p4, 1.0]), vec4([...p3, 1.0]));
        let v4 = subtract(vec4([...p4, 1.0]), vec4([...p2, 1.0]));

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

    getTriangleAndNorms(p1, p2, p3) {
        let vertices = [];
        let norms = [];
        vertices.push(...[p1, p2, p3]);

        let v1 = subtract(vec4([...p2, 1.0]), vec4([...p1, 1.0]));
        let v2 = subtract(vec4([...p3, 1.0]), vec4([...p1, 1.0]));

        norms.push([...normalize(cross(v1, v2)), 0.0]);
        norms.push([...normalize(cross(v1, v2)), 0.0]);
        norms.push([...normalize(cross(v1, v2)), 0.0]);

        return {
            "vertices": vertices,
            "norms": norms
        };
    }

    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }

    calcWind(branchPts, windValue, windMagnitude) {
        let vertices = [];
        let colors = [];
        let gammaPhi = [];
        this.wind(branchPts, vertices, colors, gammaPhi, windValue, windMagnitude/Math.sqrt(this.state.length));

        return {
            "vertices": vertices,
            "colors": colors,
            "gammaPhi": gammaPhi
        }
    }

    wind(branchPts, vertices, colors, gammaPhi, windValue, windMagnitude) {
        let newPos;
        for (let i = 0; i < branchPts.children.length; i++) {
            newPos = this.calcNewPoint(branchPts, branchPts.children[i], windValue, windMagnitude)
            vertices.push(branchPts.pos);
            gammaPhi.push([branchPts.gamma, branchPts.phi]);
            vertices.push(newPos);
            gammaPhi.push([branchPts.children[i].gamma, branchPts.children[i].phi]);
            branchPts.children[i].pos = newPos;
            colors.push([0.0, 0.0, 0.0]);
            colors.push([0.0, 0.0, 0.0]);
            if (branchPts.children.length)
                this.wind(branchPts.children[i], vertices, colors, gammaPhi, windValue, windMagnitude);
        }
    }

    calcNewPoint(prev, curr, windValue, windMagnitude) {
        let offset = (windValue*windMagnitude/gls.step)*(this.state.length-curr.strength);
        curr.gamma = (curr.gamma+offset);
        curr.phi = (curr.phi+offset);
        return [
            prev.pos[0] + (gls.step*Math.cos(curr.gamma*Math.PI/180)*Math.sin(curr.phi*Math.PI/180)),
            prev.pos[1] + (gls.step*Math.sin(curr.gamma*Math.PI/180)*Math.sin(curr.phi*Math.PI/180)),
            prev.pos[2] + (gls.step*Math.cos(curr.phi*Math.PI/180))];
    }
}
