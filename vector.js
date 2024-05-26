class Vector {
    constructor(pX = 0, pY = 0) {
        this.x = pX;
        this.y = pY;
    }

    //? To copie the vector into a new one
    get() {
        return new Vector(this.x, this.y);
    }

    set(pX, pY = 0) {
        this.x = pX;
        this.y = pY;
    }

    add(pVector) {
        this.x += pVector.x;
        this.y += pVector.y;
    }
    static addition(pVec1, pVec2) {
        let newVector = new Vector(pVec1.x + pVec2.x, pVec1.y + pVec2.y);
        return newVector;
    }

    sub(pVector) {
        this.x -= pVector.x;
        this.y -= pVector.y;
    }
    static substract(pLocationVec1, pLocationVec2) {
        let newVector = new Vector(pLocationVec1.x - pLocationVec2.x, pLocationVec1.y - pLocationVec2.y);
        return newVector;
    }

    mult(pNumber) {
        this.x *= pNumber;
        this.y *= pNumber;
    }

    div(pNumber) {
        this.x /= pNumber;
        this.y /= pNumber;
    }

    mag(pOriginX = 0, pOriginY = 0) {
        return Math.sqrt(((this.x - pOriginX) ** 2) + ((this.y - pOriginY) ** 2));
    }

    //? Distance entre deux vecteurs :
    //? A (xa, ya) et B (xb, yb)
    //? AB = √( (xb - xa)² + (yb - ya)² )

    setMag(pNumber) {
        this.normalize();
        this.mult(pNumber);
    }

    normalize() {
        this.div(this.mag());
    }

    limit(pMax) {
        if (this.mag() > pMax) {
            this.normalize();
            this.mult(pMax);
        }
    }

    setNull() {
        this.x = 0; this.y = 0;
    }

    isNull() {
        return (this.x == 0 && this.y == 0); 
    }
    //! -------------------- Billiard simulation

    set2(v) {
        this.x = v.x; this.y = v.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    add2(v, s=1) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    }

    addVectors(a,b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    substract2(v, s=1) {
        this.x -= v.x * s;
        this.y -= v.y * s;
        return this;
    }

    substractVectors(a,b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }


}

//? Colinéarité de 2 vecteurs
/*

Soit u(xy) et v(x'y')
Dire que u et v sont colinéaires revient à dire que les coordonnées des deux vecteurs sont proportionnelles,
soit xy' - yx'= 0

Le nombre xy' - yx' est appelé "déterminant" des vecteurs u et v.
On note : det(u ; v) = |x  x'| = xy' - yx'
                       |y  y'|
Dire que x et v sont colinéaires revient à dire que det(u ; v) = 0

*/

//? Deux vecteurs u et v sont colinéaires si u = kv

// class Vector {
//     constructor(pX, pY) {
//         this.x = pX;
//         this.y = pY;
//         this.magnitude = this.mag();
//     }

//     //? To copie the vector into a new one
//     get() {
//         return new Vector(this.x, this.y);
//     }

//     set(pX, pY = 0) {
//         this.x = pX;
//         this.y = pY;
//     }

//     add(pVector, pOriginX = 0, pOriginY = 0) {
//         this.x -= pOriginX;
//         this.y -= pOriginY;

//         this.x += pVector.x;
//         this.y += pVector.y;
//     }

//     sub(pVector, pOriginX = 0, pOriginY = 0) {
//         this.x -= pOriginX;
//         this.y -= pOriginY;

//         this.x -= pVector.x;
//         this.y -= pVector.y;
//     }
//     static substract(pLocationVec1, pLocationVec2) {
//         let newVector = new Vector(pLocationVec1.x - pLocationVec2.x, pLocationVec1.y - pLocationVec2.y);
//         return newVector;
//     }

//     mult(pNumber, pOriginX = 0, pOriginY = 0) {        
//         this.x -= pOriginX;
//         this.y -= pOriginY;

//         this.x *= pNumber;
//         this.y *= pNumber;
//     }

//     div(pNumber, pOriginX = 0, pOriginY = 0) {
//         this.x -= pOriginX;
//         this.y -= pOriginY;

//         this.x /= pNumber;
//         this.y /= pNumber;
//     }

//     mag(pOriginX = 0, pOriginY = 0) {
//         return Math.sqrt( ((this.x - pOriginX) ** 2) + ((this.y - pOriginY) ** 2));
//     }

//     setMag(pNumber, pOriginX = 0, pOriginY = 0) {
//         this.normalize(pOriginX, pOriginY);
//         this.mult(pNumber, pOriginX, pOriginY);
//     }

//     normalize(pOriginX = 0, pOriginY = 0) {
//         let magnitude = this.mag(pOriginX, pOriginY);
//         this.div(magnitude, pOriginX, pOriginY);
//     }

//     limit(pMax, pOriginX = 0, pOriginY = 0) {
//         if (this.mag(pOriginX, pOriginY) > pMax) {
//             this.normalize(pOriginX, pOriginY);
//             this.mult(pMax, pOriginX, pOriginY);
//         }
//     }
// }