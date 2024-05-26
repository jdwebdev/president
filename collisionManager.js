class CollisionManager {
    constructor() { }

    static AABBCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return (x1 < x2 + w2) &&
            (x2 < x1 + w1) &&
            (y1 < y2 + h2) &&
            (y2 < y1 + h1);
    }

    static MouseCollision(mX, mY, spX, spY, spW, spH) {

        // // Pour les transitions de type déplacement d'écran TODO : à changer un jour
        // if (spX >= CANVAS_WIDTH) spX -= CANVAS_WIDTH;
        // if (spY >= CANVAS_HEIGHT) spY -= CANVAS_HEIGHT;
        // if (spX + spW < 0) spX += CANVAS_WIDTH;
        // if (spY + spH < 0) spY += CANVAS_HEIGHT;
        // // -------------------------------------------------
        return (mX >= spX) &&
            (mX <= spX + spW-1) &&
            (mY >= spY) &&
            (mY <= spY + spH);
    }

    //? Avec origine en haut à droite
    static MouseCircleCollision(mX, mY, spX, spY, spW, spH) {
        let radius = spW / 2
        let distX = Math.abs(mX - (spX + (spW / 2)));
        let distY = Math.abs(mY - (spY + (spH / 2)));
        let hypotenuse = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        return hypotenuse <= radius;
        //return Math.sqrt(Math.pow(Math.abs(mX - (spX+(spW/2))), 2), Math.pow(Math.abs(mY - (spY+(spH/2))), 2)) <=  (spW / 2);
    }

    static vectorCircleCollision(pCircle, pVector) {
        //? pCircle has a location vector and a r parameter for radius
        let circleDistance = Vector.substract(pCircle.location, pVector.location);
        return (circleDistance.mag() < pCircle.r);
    }

    static CircleCollision(pC1, pC2) {
        // let pC1 = { r: 20, x: 5, y: 5 };
        // let pC2 = { r: 12, x: 10, y: 5 };

        let dx = pC1.x - pC2.x;
        let dy = pC1.y - pC2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pC1.r + pC2.r) {
            return true;
        } else {
            return false;
        }
    }

    static CircleCollisionVec(pC1, pC2) {
        // let pC1 = { r: 20, x: 5, y: 5 };
        // let pC2 = { r: 12, x: 10, y: 5 };

        let dx = pC1.loc.x - pC2.loc.x;
        let dy = pC1.loc.y - pC2.loc.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pC1.r + pC2.r) {
            return true;
        } else {
            return false;
        }
    }
}