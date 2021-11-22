class Entity {
    constructor(objData) {
        // raw object data
        this.indices = objData.indices;
        this.vertices = objData.vertices;
        this.colors = objData.colors;
        this.normals = objData.normals;
        this.gammaPhi = objData.gammaPhi;

        // RTS matrices
        this.rMat = mat4();
        this.tMat = mat4();
        this.sMat = mat4();

        // Default material (no surface properties)
        this.material = {
            "mAmbient": vec4( 0.0, 0.0, 0.0, 1.0 ),
            "mDiffuse": vec4( 0.0, 0.0, 0.0, 1.0),
            "mSpecular": vec4( 0.0, 0.0, 0.0, 1.0 ),
            "mShine": 0.0
        }

        // Default light source (no emission, origin: [1.0, 1.0, 1.0, 1.0])
        this.lightSource = {
            "lPosition": vec4(1.0, 1.0, 1.0, 1.0 ),
            "lAmbient": vec4(0.0, 0.0, 0.0, 1.0 ),
            "lDiffuse": vec4( 0.0, 0.0, 0.0, 1.0 ),
            "lSpecular": vec4( 0.0, 0.0, 0.0, 1.0 )
        }
    }

    eRotate(x, y, z) {
        let rx = mat4(
            1.0,            0.0,            0.0,            0.0,
            0.0,            Math.cos(x),    -Math.sin(x),   0.0,
            0.0,            Math.sin(x),    Math.cos(x),    0.0,
            0.0,            0.0,            0.0,            1.0
        );

        let ry = mat4(
            Math.cos(y),    0.0,            Math.sin(y),   0.0,
            0.0,            1.0,            0.0,            0.0,
            -Math.sin(y),    0.0,           Math.cos(y),    0.0,
            0.0,            0.0,            0.0,            1.0
        );

        let rz = mat4(
            Math.cos(z),    -Math.sin(z),    0.0,            0.0,
            Math.sin(z),   Math.cos(z),    0.0,            0.0,
            0.0,            0.0,            1.0,            0.0,
            0.0,            0.0,            0.0,            1.0
        );

        this.rMat = mult(mult(rx, ry), rz);
    }

    eTranslate(x, y, z) {
        this.tMat = mat4(
            1.0,            0.0,            0.0,            0.0,
            0.0,            1.0,            0.0,            0.0,
            0.0,            0.0,            1.0,            0.0,
            x,              y,              z,              1.0
        )
    }

    eScale(x, y, z) {
        this.sMat = mat4(
            x,              0.0,            0.0,            0.0,
            0.0,            y,              0.0,            0.0,
            0.0,            0.0,            z,              0.0,
            0.0,            0.0,            0.0,            1.0
        );
    }

    getUMat() {
        return mult(mult(this.tMat,this.sMat), this.rMat);
    }

    setMaterial(material) {
        this.material = material;
    }

    getMaterial() {
        return this.material;
    }

    setLightSource(lightSource) {
        this.lightSource = lightSource;
    }

    getLightSource() {
        return this.lightSource;
    }


}