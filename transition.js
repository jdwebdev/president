class Transition {
    constructor() { }

    static init(pDatas) {
        if (this.bActive) {
            this.bActive == false;
        }
        this.circle = {
            x: 50,
            y: 50,
            r: 10,
            originR: 10,
            maxR: 450,
            speed: pDatas.speed,
            speedCount: 0
        };
        this.bActive = false;
        this.bStopEffect = pDatas.stopEffect;
        this.type = pDatas.type;
        this.bStartOpen = false;
        this.stopTimer = null;
        if (0) { //? If this.type == "文字"
            this.stopTimer = new Timer(1, this.updateStopTimer.bind(Transition));
        }
        this.bHeight = pDatas.height;
        this.callback = pDatas.callback;
        Transition.active(pDatas.pos.x, pDatas.pos.y, pDatas.pos.r, pDatas.pos.maxR);
    }

    static active(pX, pY, pR, pMaxR = 0) {
        this.bActive = true;
        this.circle.x = pX;
        this.circle.y = pY;
        this.circle.r = pR;
        this.circle.originR = pR;
        this.circle.maxR = pMaxR;
    }

    static updateStopTimer() { //? Si s'ouvre après un certain temps
        this.bStartOpen = true;
    }

    static startOpen() { //? Ouvrir à un moment précis
        this.bStartOpen = true;
        this.circle.speedCount = 0;
        let tmp = 450
        this.circle.r = this.circle.maxR;
        this.circle.originR = this.circle.r;
        this.circle.maxR = tmp;
    }



    static drawCircleTransition(ctx) {
        if (!this.bHeight) {
            ctx.fillStyle = BLACK_COLOR_0;
            ctx.fillRect(0, 0, 450, 300);

            ctx.beginPath();

            ctx.moveTo(CANVAS_WIDTH + 1, -1);
            ctx.lineTo(-1, -1);
            ctx.lineTo(-1, this.circle.y);
            ctx.lineTo(this.circle.x - this.circle.r, this.circle.y);
            ctx.arc(this.circle.x, this.circle.y, this.circle.r, 9.45, Math.PI * 2);
            ctx.lineTo(CANVAS_WIDTH + 1, this.circle.y);
            ctx.lineTo(CANVAS_WIDTH + 1, -1);

            ctx.moveTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT + 1);
            ctx.lineTo(-1, CANVAS_HEIGHT + 1);
            ctx.lineTo(-1, this.circle.y);
            ctx.lineTo(this.circle.x - this.circle.r, this.circle.y);
            ctx.arc(this.circle.x, this.circle.y, this.circle.r, 9.45, Math.PI * 2, true);
            ctx.lineTo(CANVAS_WIDTH + 1, this.circle.y);
            ctx.lineTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT + 1);

            ctx.clip();
            ctx.fillStyle = "black";   // DE CE RECTANGLE JE NE VEUX GARDER QUE La forme DU DESSUS, LE RESTE EST TRANSPARENT
            ctx.fillRect(0, 0, 450, 300);
        } else {
            ctx.fillStyle = BLACK_COLOR_0;
            ctx.fillRect(0, CANVAS_HEIGHT, 450, 300);

            ctx.beginPath();

            ctx.moveTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT);
            ctx.lineTo(-1, CANVAS_HEIGHT);
            ctx.lineTo(-1, this.circle.y);
            ctx.lineTo(this.circle.x - this.circle.r, this.circle.y);
            ctx.arc(this.circle.x, this.circle.y, this.circle.r, 9.45, Math.PI * 2);
            ctx.lineTo(CANVAS_WIDTH + 1, this.circle.y);
            ctx.lineTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT);

            ctx.moveTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT + CANVAS_HEIGHT);
            ctx.lineTo(-1, CANVAS_HEIGHT + CANVAS_HEIGHT);
            ctx.lineTo(-1, this.circle.y);
            ctx.lineTo(this.circle.x - this.circle.r, this.circle.y);
            ctx.arc(this.circle.x, this.circle.y, this.circle.r, 9.45, Math.PI * 2, true);
            ctx.lineTo(CANVAS_WIDTH + 1, this.circle.y);
            ctx.lineTo(CANVAS_WIDTH + 1, CANVAS_HEIGHT + CANVAS_HEIGHT);

            ctx.clip();
            ctx.fillStyle = "black";   // DE CE RECTANGLE JE NE VEUX GARDER QUE La forme DU DESSUS, LE RESTE EST TRANSPARENT
            ctx.fillRect(0, CANVAS_HEIGHT, 450, 300);

        }
    }


    // FERMETURE !!!
    //     pos: { x: centerX(), y: this.chooseTypePanel.y + 70, r: 450, maxR: 0 },
    // speed: 1,
    //     stopEffect: false,
    //         height: true
    //     }


    static update(dt) {

        if (this.stopTimer != null) {
            this.stopTimer.update(dt);
        }

        if (this.type == "l") { //? LessonBtn show

            if (this.bStartOpen) {

                this.circle.speedCount += dt;
                if (this.circle.speedCount >= this.circle.speed) {
                    if (this.circle.maxR > this.circle.originR) { //? Callback Ouverture

                        this.circle.speedCount = 0;
                        this.circle.r = this.circle.originR;
                        this.bActive = false;

                    } else {
                        // if (this.bStopEffect) {
                        //     if (this.circle.speedCount >= this.circle.speed + 1) {
                        //         this.circle.r -= 100 * dt;
                        //         if (this.circle.r <= 0) { // Callback fermeture
                        //             this.circle.speedCount = 0;
                        //             this.circle.r = this.circle.originR;
                        //             this.bActive = false;
                        //             Transition.active(this.circle.x, this.circle.y, 0, 450);
                        //         }
                        //     }
                        // } else {
                        //     this.circle.r -= 100 * dt;
                        //     if (this.circle.r <= 0) { // Callback fermeture
                        //         this.circle.speedCount = 0;
                        //         this.circle.r = this.circle.originR;
                        //         this.bActive = false;

                        //         this.bHeight = false;
                        //         this.circle.y = this.circle.y - CANVAS_HEIGHT;

                        //         Transition.active(this.circle.x, this.circle.y, 0, 450);
                        //         if (this.callback) {
                        //             this.callback.cb(Transition.callback.arg);
                        //         }
                        //     }
                        // }
                    }
                } else {
                    if (this.circle.maxR > this.circle.originR) {
                        this.circle.r = easeInSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                    } else {
                        this.circle.r = easeOutSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                    }
                }

            } else {

                //? Fermeture 
                this.circle.speedCount += dt;
                if (this.circle.speedCount >= this.circle.speed) {

                } else {
                    if (this.circle.maxR > this.circle.originR) {
                        this.circle.r = easeInSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                    } else {
                        this.circle.r = easeOutSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                    }
                }

            }

        } else {
            this.circle.speedCount += dt;
            if (this.circle.speedCount >= this.circle.speed) {
                if (this.circle.maxR > this.circle.originR) { // Callback Ouverture
                    this.circle.speedCount = 0;
                    this.circle.r = this.circle.originR;
                    this.bActive = false;

                } else {
                    if (this.bStopEffect) {
                        if (this.circle.speedCount >= this.circle.speed + 1) {
                            this.circle.r -= 100 * dt;
                            if (this.circle.r <= 0) { // Callback fermeture
                                this.circle.speedCount = 0;
                                this.circle.r = this.circle.originR;
                                this.bActive = false;
                                Transition.active(this.circle.x, this.circle.y, 0, 450);
                            }
                        }
                    } else {
                        this.circle.r -= 100 * dt;
                        if (this.circle.r <= 0) { // Callback fermeture
                            this.circle.speedCount = 0;
                            this.circle.r = this.circle.originR;
                            this.bActive = false;

                            this.bHeight = false;
                            this.circle.y = this.circle.y - CANVAS_HEIGHT;

                            Transition.active(this.circle.x, this.circle.y, 0, 450);
                            if (this.callback) {
                                this.callback.cb(Transition.callback.arg);
                            }
                        }
                    }
                }

            } else {
                if (this.circle.maxR > this.circle.originR) {
                    this.circle.r = easeInSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                } else {
                    this.circle.r = easeOutSin(this.circle.speedCount, this.circle.originR, this.circle.maxR - this.circle.originR, this.circle.speed);
                }
            }
        }
    }


    static draw(ctx) {
        Transition.drawCircleTransition(ctx);
    }

}