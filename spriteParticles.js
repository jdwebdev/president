class SpriteParticles extends Particles {

    static list = [];

    constructor(pX, pY, pDx, pDy, pType, pSize, pLife, pGravity = 0) { 
        super(pX, pY, pDx, pDy, pType, pSize, pLife, pGravity);

        // this.sprite = new Sprite({w: this.w, h:this.h}, this.x, this.y);
        this.sprite = new Sprite({w: this.w, h:this.h}, this.x, this.y);


    }

    getSprite() {
        return this.sprite;
    }

    update(dt) {
        let diff = this.totalLife - this.life;
        let limit = this.totalLife/3;
        
        if (diff > limit*2) {
            if (this.sprite.getAnimation().name == "2") {
                this.sprite.changeAnimation("3");
            }
        } else if (diff > limit) {
            if (this.sprite.getAnimation().name == "1") {
                this.sprite.changeAnimation("2");
            }
        }

        if (this.life > 0 && !this.delete) {
            this.timer.update(dt);
            // this.x += this.speed * this.dx * (60*dt);
            // this.y += this.speed * this.dy * (60*dt);

            this.sprite.x += this.speed * this.dx * (60*dt);
            this.sprite.y += this.speed * this.dy * (60*dt);

            this.dy += this.gravity;
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
            // ctx.fillStyle = this.color;
            // ctx.fillRect(this.x, this.y, this.w, this.h);
            this.sprite.draw(ctx);
        }
    }
}