class Particles {

    static list = [];

    constructor(pX, pY, pDx, pDy, pType, pSize, pLife) {
        this.x = pX;
        this.y = pY;
        this.dx = pDx;
        this.dy = pDy;
        this.type = pType;
        this.w = pSize.w;
        this.h = pSize.h;
        this.life = pLife;
        this.delete = false;
        this.timer = new Timer(0.1, this.decreaseLife.bind(this));
        this.speed = 0.2;

        this.body = { w: this.w, h: this.h };
        let num = rnd(0, 6);
        this.alpha = 1;

        let colorNum = 0;
        // switch (num) {
        //     case 0:
        //         colorNum = 255;
        //         break;
        //     case 1:
        //         colorNum = 200;
        //         break;
        //     case 2:
        //         colorNum = 150;
        //         break;
        //     case 3:
        //         colorNum = 100;
        //         break;
        //     case 4:
        //         colorNum = 50;
        //         break;
        //     case 5:
        //         colorNum = 0;
        //         break;
        // }

        this.color = "rgba(" + colorNum + "," + colorNum + "," + colorNum + "," + this.alpha + ")";


        Particles.list.push(this);
    }

    setColor(pNewColor) {
        this.color = pNewColor;
    }

    setSpeed(pNewSpeed) {
        this.speed = pNewSpeed;
    }

    update(dt) {
        if (this.life > 0 && !this.delete) {
            this.timer.update(dt);
            this.x += this.speed * this.dx * (60 * dt);
            this.y += this.speed * this.dy * (60 * dt);
        }
    }

    decreaseLife() {
        this.life--;
        if (this.life <= 0) {
            this.delete = true;
        }
    }

    draw(ctx) {
        if (!this.delete) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}