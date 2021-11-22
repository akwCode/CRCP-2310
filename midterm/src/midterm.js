"use strict";

// CORE GLOBALS
    let canvas, gl;

    let buffers, attributes, uniforms;
    let modelViewMatrix, projectionMatrix;

    let theta = [0, 0, 0];
    let scroll = [1, 1, 1];


// ENTITY GLOBALS
    // Light Source
        let defaultLightSource = {
            "lPosition": vec4([...[Math.cos(.765), 1.0, Math.sin(.765)], 1.0]),
            "lAmbient": vec4(0.2, 0.2, 0.2, 1.0 ),
            "lDiffuse": vec4( 1.0, 1.0, 1.0, 1.0 ),
            "lSpecular": vec4( 1.0, 1.0, 1.0, 1.0 )
        }

        let lightSource = {};
        Object.assign(lightSource, defaultLightSource);

    // Terrain
        let grid = new Grid(16);
        grid.create();

        let terrain = new Entity(grid.getSquares());
        terrain.setLightSource(lightSource);
        terrain.setMaterial({
            "mAmbient": vec4( 1.0, 0.0, 1.0, 1.0 ),
            "mDiffuse": vec4( 178/255, 255/255, 102/255, 1.0),
            "mSpecular": vec4( 1.0, 0.8, 0.0, 1.0 ),
            "mShine": 20.0
        });

        let axisLines = {
            "indices": [
                0, 1,
                2, 3,
                4, 5
            ],
            "vertices": [
                // x axis
                -0.5, 0.0, 0.0,
                0.5, 0.0, 0.0,
                // y axis
                0.0, -0.5, 0.0,
                0.0, 0.5, 0.0,
                // z axis
                0.0, 0.0, -0.5,
                0.0, 0.0, 0.5
            ],
            "colors": [
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
            ],
            "normals": [

            ]
        }
        let axis = new Entity(axisLines);
        axis.eRotate(0, 0, 0);

        let gridSquaresToggle = true;

    // GLS (Graphics Lindenmayer System)
        // Predefined Grammars
            let grammars = {
                "default": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "F[+F][-F]"
                    },
                    "step": 0.1,
                    "radius": 0.02,
                    "gamma": 25.0,
                    "phi": 25.0
                },
                "tall-light-density": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "F[+F]F[-F]F"
                    },
                    "step": 0.05,
                    "radius": 0.005,
                    "gamma": 25.7,
                    "phi": 0.0
                },
                "tall-moderate-density": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "F[+F]F[-F][F]"
                    },
                    "step": 0.05,
                    "radius": 0.005,
                    "gamma": 20.0,
                    "phi": 0.0
                },
                "tall-heavy-density": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "FF-[-F+F+F]+[+F-F-F]"
                    },
                    "step": 0.05,
                    "radius": 0.005,
                    "gamma": 22.5,
                    "phi": 0.0
                },
                "natural-growth-1": {
                    "nonterminals": ["F", "X"],
                    "terminals": [],
                    "start": "X",
                    "productions": {
                        "X": "F[+X]F[-X]+X",
                        "F": "FF"
                    },
                    "step": 0.02,
                    "radius": 0.005,
                    "gamma": 22.5,
                    "phi": 0.0
                },
                "natural-growth-2": {
                    "nonterminals": ["F", "X"],
                    "terminals": [],
                    "start": "X",
                    "productions": {
                        "X": "F[+X][-X]FX",
                        "F": "FF"
                    },
                    "step": 0.02,
                    "radius": 0.005,
                    "gamma": 25.7,
                    "phi": 0.0
                },
                "natural-growth-3": {
                    "nonterminals": ["F", "X"],
                    "terminals": [],
                    "start": "X",
                    "productions": {
                        "X": "F-[[X]+X]+F[+FX]-X",
                        "F": "FF"
                    },
                    "step": 0.02,
                    "radius": 0.005,
                    "gamma": 22.5,
                    "phi": 0.0
                },
                "3d-1": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "F[&&+F]F[-F][$$F]"
                    },
                    "step": 0.05,
                    "radius": 0.005,
                    "gamma": 22.5,
                    "phi": 22.5
                },
                "3d-2": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "FF[$+F][&&++F][--F]"
                    },
                    "step": 0.06,
                    "radius": 0.01,
                    "gamma": 22.5,
                    "phi": 22.5
                },
                "3d-3": {
                    "nonterminals": ["F"],
                    "terminals": [],
                    "start": "F",
                    "productions": {
                        "F": "FF[$+F][&&++F][--F]"
                    },
                    "step": 0.05,
                    "radius": 0.005,
                    "gamma": 22.5,
                    "phi": 22.5
                },
                "3d-4": {
                    "nonterminals": ["F", "X"],
                    "terminals": [],
                    "start": "X",
                    "productions": {
                        "X": "F&[+X]$[+X][-X]FX",
                        "F": "FF"
                    },
                    "step": 0.02,
                    "radius": 0.005,
                    "gamma": 27.5,
                    "phi": 27.5
                }
            }

        // Flora
        let windMagnitude, windValue;
        let windSinValue = 0, wind_active = false;

        let gls = new Gls();
        gls.loadGrammar(grammars["default"]);
        gls.origin = [gls.origin[0]+grid.center[0], gls.origin[1]+grid.center[1], gls.origin[2]+grid.center[2], 0];

        let floraToggle = true;

        let tree = new Entity(gls.getEntity());

        let cylinder = new Entity(gls.getSegment());
        cylinder.setLightSource(lightSource);
        cylinder.setMaterial({
            "mAmbient": vec4( .5, 0.0, .5, 1.0 ),
            "mDiffuse": vec4( 87/255, 58/255, 28/255, 1.0),
            "mSpecular": vec4( .25, 0.25, 0.0, 1.0 ),
            "mShine": 1.0
        });

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 is not available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.83, 0.83, 0.83, 1.0);

    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Buffers
    buffers = {
        "vBuf": gl.createBuffer(),
        "nBuf": gl.createBuffer()
    }

    // Attributes
    attributes = {
        "aPos": gl.getAttribLocation(program, "aPosition"),
        "aCol": gl.getAttribLocation(program, "aColor"),
        "aNormal": gl.getAttribLocation(program, "aNormal")
    }

    // Uniforms
    uniforms = {
        "uLightPosition": gl.getUniformLocation(program, "uLightPosition"),
        "uAmbientProduct": gl.getUniformLocation(program, "uAmbientProduct"),
        "uDiffuseProduct": gl.getUniformLocation(program, "uDiffuseProduct"),
        "uSpecularProduct": gl.getUniformLocation(program, "uSpecularProduct"),
        "uShininess": gl.getUniformLocation(program, "uShininess"),
        "uProjectionMatrix": gl.getUniformLocation(program, "uProjectionMatrix"),
        "uModelViewMatrix": gl.getUniformLocation(program, "uModelViewMatrix"),
        "uNormalMatrix": gl.getUniformLocation(program, "uNormalMatrix")
    }

    // projection & model view matrices
    projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
    modelViewMatrix = scale(1, 1, 1);
    gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(uniforms.uModelViewMatrix, false, flatten(modelViewMatrix));

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
    addViewEventListeners();
    addEventListeners();
    render();
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // grid squares
    sendData(terrain, buffers, attributes, uniforms);
    if (gridSquaresToggle) {
        terrain.eRotate(...theta);
        terrain.eScale(...scroll);
        gl.uniformMatrix4fv(uniforms.uModelViewMatrix, false, flatten(terrain.getUMat()));
        gl.uniformMatrix3fv(uniforms.uNormalMatrix, false, flatten(normalMatrix(terrain.getUMat(), true)));
        gl.drawArrays(gl.TRIANGLES, 0, terrain.vertices.length);
    }

    if(floraToggle) {
        if (wind_active) {
            windSinValue += 0.017;
            windValue = Math.sin(windSinValue);
            tree = new Entity(gls.calcWind(gls.getPtStruct(), windValue, windMagnitude));
        }

        sendData(cylinder, buffers, attributes, uniforms);
        let r2, r3;
        for (let i = 0; i < tree.vertices.length; i += 2) {
            cylinder.eRotate(...calcRotVec(tree.gammaPhi[i + 1]), 0);
            r2 = cylinder.rMat;
            cylinder.eRotate(Math.PI / 2, 0, 0);
            r3 = cylinder.rMat;
            cylinder.eTranslate(...tree.vertices[i]);
            cylinder.eRotate(...theta);
            cylinder.eScale(...scroll);
            gl.uniformMatrix4fv(uniforms.uModelViewMatrix, false, flatten(mult(mult(r2, r3), cylinder.getUMat())));
            gl.uniformMatrix3fv(uniforms.uNormalMatrix, false, flatten(normalMatrix(mult(mult(r2, r3), cylinder.getUMat()), true)));
            gl.drawArrays(gl.TRIANGLES, 0, cylinder.vertices.length);
        }
    }
    // // axis lines
    // if (axisLinesToggle) {
    //     axis.eRotate(...theta);
    //     sendData(axis, buffers, attributes);
    //     gl.uniformMatrix4fv(rMatLoc, false, flatten(axis.rMat));
    //     gl.drawElements(gl.LINES, axis.indices.length, gl.UNSIGNED_SHORT, 0);
    // }

    requestAnimationFrame(render);
}

function sendData(entity, buffers, attributes, uniforms) {
    // OBJECT DATA
        // Vertex Data
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(entity.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attributes.aPos, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributes.aPos);

        // Normal Data
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nBuf);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(entity.normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attributes.aNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributes.aNormal);

    // MATERIAL DATA
    gl.uniform4fv(uniforms.uAmbientProduct, mult(entity.lightSource.lAmbient, entity.material.mAmbient));
    gl.uniform4fv(uniforms.uDiffuseProduct, mult(entity.lightSource.lDiffuse, entity.material.mDiffuse));
    gl.uniform4fv(uniforms.uSpecularProduct, mult(entity.lightSource.lSpecular, entity.material.mSpecular));
    gl.uniform4fv(uniforms.uLightPosition, entity.lightSource.lPosition);
    gl.uniform1f(uniforms.uShininess, entity.material.mShine);

}

function addEventListeners() {
    // document.getElementById("toggle-axis-lines").onclick = function () {
    //     if (this.checked)
    //         axisLinesToggle = true;
    //     else
    //         axisLinesToggle = false;
    // }

    document.getElementById("toggle-light").onclick = function () {
        if (this.checked) {
            terrain.setLightSource(defaultLightSource);
            cylinder.setLightSource(defaultLightSource);
        } else {
            let noLight = {
                "lPosition": vec4(0.0, 0.0, 0.0, 1.0 ),
                "lAmbient": vec4(0.0, 0.0, 0.0, 1.0 ),
                "lDiffuse": vec4( 0.0, 0.0, 0.0, 1.0 ),
                "lSpecular": vec4( 0.0, 0.0, 0.0, 1.0 )
            }
            terrain.setLightSource(noLight);
            cylinder.setLightSource(noLight);
        }
    }

    document.getElementById("light-position-slider").onchange = function () {
        lightSource.lPosition = vec4([...[
            Math.cos(this.value),
            1.0,
            Math.sin(this.value)
        ], 1.0]);
        console.log(lightSource.lPosition)
        terrain.setLightSource(lightSource);
        cylinder.setLightSource(lightSource);
    }

    document.getElementById("light-reset").onclick = function () {
        document.getElementById("light-position-slider").value = .765;
        document.getElementById("light-ambient-slider").value = defaultLightSource.lAmbient[0];
        document.getElementById("light-diffuse-slider").value = defaultLightSource.lDiffuse[0];
        document.getElementById("light-specular-slider").value = defaultLightSource.lSpecular[0];

        Object.assign(lightSource, defaultLightSource);
        terrain.setLightSource(lightSource);
        cylinder.setLightSource(lightSource);
    }

    document.getElementById("toggle-terrain").onclick = function () {
        if (this.checked)
            gridSquaresToggle = true;
        else
            gridSquaresToggle = false;
    }

    document.getElementById("toggle-flora").onclick = function () {
        if (this.checked)
            floraToggle = true;
        else
            floraToggle = false;
    }

    document.getElementById("production-rule-selection").onchange = function () {
        gls.loadGrammar(grammars[this.value]);
        tree = new Entity(gls.getEntity());
        cylinder = new Entity(gls.getSegment());
        cylinder.setLightSource(lightSource);
        cylinder.setMaterial({
            "mAmbient": vec4( .5, 0.0, .5, 1.0 ),
            "mDiffuse": vec4( 87/255, 58/255, 28/255, 1.0),
            "mSpecular": vec4( .25, 0.25, 0.0, 1.0 ),
            "mShine": 1.0
        });
    }

    document.getElementById("grow").onclick = function () {
        gls.iterate();
        tree = new Entity(gls.getEntity());
    }

    document.getElementById("flora-reset").onclick = function () {
        gls.state = gls.start;
        tree = new Entity(gls.getEntity());
    }

    document.getElementById("wind-slider").onchange = function () {
        if (this.value === 0) {
            wind_active = false;
            tree = new Entity(gls.getEntity());
        }
        windMagnitude = this.value;
        wind_active = true;
    }
}

function addViewEventListeners() {
    let clickOrigin;
    let magnitudeStateVector;

    function printXY(coords) {
        if (Math.abs(coords.y-clickOrigin[1]) < magnitudeStateVector[1])
            theta[0] += (coords.y - clickOrigin[1])/(512*5);
        else
            theta[0] -= (coords.y - clickOrigin[1])/(512*5);
        magnitudeStateVector[1] = Math.abs(coords.y-clickOrigin[1]);

        if (Math.abs(coords.x-clickOrigin[0]) < magnitudeStateVector[0])
            theta[1] += (coords.x - clickOrigin[0])/(512*5);
        else
            theta[1] -= (coords.x - clickOrigin[0])/(512*5);
        magnitudeStateVector[0] = Math.abs(coords.x-clickOrigin[0]);
    }

    document.getElementById("gl-canvas").onwheel = function(event) {
        event.preventDefault();
        scroll[0] += event.deltaY*0.0005;
        scroll[1] += event.deltaY*0.0005;
        scroll[2] += event.deltaY*0.0005;
    }
    document.getElementById("gl-canvas").onmousedown = function (mouseDownEvent) {
        clickOrigin = [mouseDownEvent.x, mouseDownEvent.y];
        magnitudeStateVector = [0.0, 0.0];
        document.addEventListener("mousemove", printXY)
    }
    document.getElementById("gl-canvas").onmouseup = function () {
        document.removeEventListener("mousemove", printXY);
    }
    document.getElementById("gl-canvas").onmouseleave = function () {
        document.removeEventListener("mousemove", printXY);
    }
}

function calcRotVec(gammaPhi) {
    // let xRot = degToRad(gammaPhi[1]);
    // let yRot = degToRad(gammaPhi[0]-90);

    let xRot = degToRad(gammaPhi[1]-90);
    let yRot = degToRad(gammaPhi[0]-90);

    let zRot = degToRad(0);
    return [ xRot, yRot, zRot];
}

function degToRad(deg) {
    return deg*Math.PI/180;
}