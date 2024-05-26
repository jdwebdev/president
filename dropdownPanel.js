class DropdownPanel extends Panel {
    constructor(pSize, pX, pY, pParent, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {
        super(pSize, pX, pY, pParent, pType, pTypeState, pLabel, pId, pStaticSize);

        this.bScrollable = true;
        this.list = pLabel;
        this.currentPos = 0;

        this.maxScale = 0;
        this.cursorStartPos = 0;
        this.cursorContainer = null;
        this.cursor = null;
        this.cursorUp = null;
        this.cursorDown = null;
        this.limit = 0;
        this.hoverable = true;
        this.bOverflow = false;
        this.linesNumber = 8;
        this.textOffsetY = 14;
        this.spriteList = [];

    }

    setParameters() {

        if (this.list.length > this.linesNumber) {

            this.width = this.totalWidth;
            this.height = this.totalHeight;

            let cursorWidth = 3;
            let cursorUpDownHeight = 2;
            let cursorPosOffset = 4; //? décallage entre la position de cursorUp/Down par rapport au dropdown panel
            let cursorPosHorizontalOffset = 6; //? décallage entre la position de cursorUp/Down par rapport au dropdown panel
            let cursorContainerWidth = 3;
            let cursorContainerHeight = this.height - 8; //? -2 si on veut un espace d'1px entre le haut/bas du panel et le cursorContainer
            this.bOverflow = true;
            this.cursorStartPos = this.parent.y + this.offY + cursorPosOffset + cursorUpDownHeight;

            this.cursorContainer = new Sprite({ w: 1, h: 1 }, this.offX + this.width - cursorContainerWidth - cursorPosHorizontalOffset, this.offY + cursorPosOffset + cursorUpDownHeight, this.parent, "", { x: cursorContainerWidth, y: cursorContainerHeight - cursorUpDownHeight * 2 });
            this.cursorContainer.addAnimation("normal", { x: 642, y: 780 });
            this.cursorContainer.changeAnimation("normal");

            //?if > 8 ==> list length - 8  ==> ici 46 - 8 ==> 38 steps pour arriver à la fin, 
            //! this.cursorContainer.scaleY - (this.list.length - this.linesNumber)
            this.maxScale = this.cursorContainer.scaleY - (this.list.length - this.linesNumber);

            this.cursorContainerUp = new Sprite({ w: cursorContainerWidth, h: cursorUpDownHeight }, this.offX + this.width - cursorContainerWidth - cursorPosHorizontalOffset, this.cursorContainer.offY - cursorUpDownHeight, this.parent);
            this.cursorContainerUp.addAnimation("normal", { x: 642, y: 778 });
            this.cursorContainerUp.changeAnimation("normal");

            this.cursorContainerDown = new Sprite({ w: cursorContainerWidth, h: cursorUpDownHeight }, this.offX + this.width - cursorContainerWidth - cursorPosHorizontalOffset, this.cursorContainer.offY + this.cursorContainer.scaleY, this.parent);
            this.cursorContainerDown.addAnimation("normal", { x: 642, y: 781 });
            this.cursorContainerDown.changeAnimation("normal");


            this.cursor = new Sprite({ w: cursorWidth, h: 1 }, this.cursorContainer.x, this.offY + cursorPosOffset + cursorUpDownHeight, this.parent, "", { x: 1, y: this.maxScale }); //? 1-92 max pour le scale
            this.cursor.addAnimation("normal", { x: 646, y: 780 });
            this.cursor.changeAnimation("normal");

            this.cursorUp = new Sprite({ w: cursorWidth, h: cursorUpDownHeight }, this.cursorContainer.x, this.cursor.y - cursorUpDownHeight, this.parent);
            this.cursorUp.addAnimation("normal", { x: 646, y: 778 });
            this.cursorUp.changeAnimation("normal");

            this.cursorDown = new Sprite({ w: cursorWidth, h: cursorUpDownHeight }, this.cursorContainer.x, this.cursor.y + this.cursor.scaleY, this.parent);
            this.cursorDown.addAnimation("normal", { x: 646, y: 781 });
            this.cursorDown.changeAnimation("normal");
            this.limit = this.parent.y + this.cursorContainer.y + this.cursorContainer.height;

            this.spriteList.push(this.cursorContainer);
            this.spriteList.push(this.cursorContainerUp);
            this.spriteList.push(this.cursorContainerDown);
            this.spriteList.push(this.cursor);
            this.spriteList.push(this.cursorUp);
            this.spriteList.push(this.cursorDown);
        }

    }

    setLinesNumber(pValue) {
        this.linesNumber = pValue;
    }

    setList(pArray) {
        this.list = pArray;
    }

    setStartY(pValue) {
        this.startY = pValue;
    }

    deleteSprites() {
        if (this.list.length > this.linesNumber) {
            this.cursorContainer.delete = true;
            this.cursorContainerUp.delete = true;
            this.cursorContainerDown.delete = true;
            this.cursor.delete = true;
            this.cursorUp.delete = true;
            this.cursorDown.delete = true;

            this.cursorContainer = null;
            this.cursorContainerUp = null;
            this.cursorContainerDown = null;
            this.cursor = null;
            this.cursorUp = null;
            this.cursorDown = null;
            this.spriteList = [];
        }

        this.getSprite().delete = true;
    }

    drawLabel(ctx) {

        ctx.font = this.fontSize + "px " + this.font;
        if (this.fontSize == 32) {
            ctx.shadowOffsetY = 4;
        } else {
            ctx.shadowOffsetY = 2;
        }

        if (this.parent && this.parent.bFading) {
            this.updateAlpha();
        }

        ctx.fillStyle = this.fontMainColor;
        ctx.shadowColor = this.fontBackgroundColor;

        if (this.state == Panel.STATE.Hover) {
            ctx.fillStyle = this.hoverFontMainColor;
            ctx.shadowColor = this.hoverBackgroundColor;
        }

        let labelListOffsetY = 0;

        switch (this.alignText) {
            case this.ALIGN_TEXT.Left:
                ctx.textAlign = "left";
                for (let i = this.currentPos; i < this.currentPos + 8; i++) {
                    if (this.list[i] != undefined) {
                        ctx.fillText(this.list[i], this.x + this.textOffsetX, this.y + this.textOffsetY + labelListOffsetY);
                        labelListOffsetY += 12;
                    }
                }
                break;
            case this.ALIGN_TEXT.Center:
                ctx.textAlign = "center";
                for (let i = this.currentPos; i < this.currentPos + 8; i++) {
                    if (this.list[i] != undefined) {
                        ctx.fillText(this.list[i], this.x + (this.width * 0.5), this.y + this.textOffsetY + labelListOffsetY);
                        labelListOffsetY += 12;
                    }
                }
                break;
            case this.ALIGN_TEXT.Right:
                ctx.textAlign = "right";
                for (let i = this.currentPos; i < this.currentPos + 8; i++) {
                    if (this.list[i] != undefined) {
                        ctx.fillText(this.list[i], this.x + this.width - this.textOffsetX, this.y + this.textOffsetY + labelListOffsetY);
                        labelListOffsetY += 12;
                    }
                }
                break;
        }

        ctx.shadowOffsetY = 0;
        ctx.fillStyle = BLACK_COLOR;
        ctx.textAlign = "left";
    }

}

class ToastPanel extends Panel {

    constructor(pSize, pX, pY, pParent, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {
        super(pSize, pX, pY, pParent, pType, pTypeState, pLabel, pId, pStaticSize);

        this.bFadingOut = false;
        this.displayTimer = new Timer(2, this.startFading.bind(this));
        this.fadeTimer = new Timer(1, this.delete.bind(this));
    }

    setPanelSprites(pId, pSize = 4) {

        let x_l = 0;
        let y_t = 0;
        let hoverable = false;

        switch (pId) {
            case 0: //? Red Toast
                x_l = 48;
                y_t = 16;
                break;
            case 1: //? Green Toast
                x_l = 51;
                y_t = 16;
                break;
            case 11: //? Panel original + ombre 1px & petites améliorations
                x_l = 0;
                y_t = 68;
                break;
            case 12: //? Panel original + grosse ombre 2px & petites améliorations
                x_l = 13;
                y_t = 57;
                break;
            case 2: //? Panel transparent (v: 1)
                x_l = 44;
                y_t = 1;
                break;
            case 21: //? Panel sombre (v: 1)
                x_l = 44;
                y_t = 5;
                break;
            case 3: //? Panel kana (one lesson screen)
                x_l = 456;
                y_t = 748;
                hoverable = true;
                break;
            case 4: //? Panel background (one lesson screen)
                x_l = 456;
                y_t = 769;
                break;
            case 5: //? Panel title of panel tile id=1 "chooseType" (v: 16)
                x_l = 574;
                y_t = 748;
                break;
            case 6: //? Dialog panel, intro
                x_l = 583;
                y_t = 748;
                break;
            case 7: //? Panel chalkboard (v: 6)
                x_l = 112;
                y_t = 144;
                break;
            case 8: //? Keyboard Panel
                x_l = 928;
                y_t = 160;
                break;
            default: //? Panel original
                x_l = 0;
                y_t = 57;
        }

        let x_c = x_l + pSize;
        let x_r = x_c + 1;
        let y_c = y_t + pSize;
        let y_b = y_c + 1;

        this.sp.tl.addAnimation("normal", { x: x_l, y: y_t });
        this.sp.tl.changeAnimation("normal");
        this.sp.tr.addAnimation("normal", { x: x_r, y: y_t });
        this.sp.tr.changeAnimation("normal");
        this.sp.bl.addAnimation("normal", { x: x_l, y: y_b });
        this.sp.bl.changeAnimation("normal");
        this.sp.br.addAnimation("normal", { x: x_r, y: y_b });
        this.sp.br.changeAnimation("normal");
        this.sp.t.addAnimation("normal", { x: x_c, y: y_t });
        this.sp.t.changeAnimation("normal");
        this.sp.b.addAnimation("normal", { x: x_c, y: y_b });
        this.sp.b.changeAnimation("normal");
        this.sp.r.addAnimation("normal", { x: x_r, y: y_c });
        this.sp.r.changeAnimation("normal");
        this.sp.l.addAnimation("normal", { x: x_l, y: y_c });
        this.sp.l.changeAnimation("normal");
        this.sp.c.addAnimation("normal", { x: x_c, y: y_c });
        this.sp.c.changeAnimation("normal");
    }
    handleTempWordArr() {}

    startFading() {
        this.displayTimer.reset();
        this.fade(0.08, -1);
        this.bFadingOut = true;

    }

    delete() {
        this.removeFromList();
        this.removeFromCurrentList();
        this.sp.delete = true;
        // this = null;
    }

    update(dt) {
        if (this.bFading) {
            this.fading(dt);
        }

        if (this.bMoving) {
            if (this.speedCount <= this.movingSpeed) {

                // this.x = easeOutSin(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
                // this.y = easeOutSin(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                if (this.arriveDir) {
                    this.x = this.tweeningArrive(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
                    this.y = this.tweeningArrive(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                } else {
                    this.x = this.tweeningArrive(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
                    this.y = this.tweeningArrive(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                }

                this.speedCount += dt;

            } else {
                this.x = this.destination.x;
                this.y = this.destination.y;
                this.bMoving = false;
                this.speedCount = 0;

                if (this.leaveDir) {
                    this.removeFromList();
                    this.removeFromCurrentList();
                    this.getSprite().delete = true;
                }
                if (this.moveCB != null) {
                    if (Array.isArray(this.moveCB)) {
                        this.moveCB.forEach(cb => {
                            if (cb.arg !== null) {
                                cb.cb(cb.arg);
                            } else {
                                cb.cb();
                            }
                        })
                    } else {
                        if (this.moveCB.arg !== null) {
                            this.moveCB.cb(this.moveCB.arg);
                        } else {
                            this.moveCB.cb();
                        }
                    }
                }
            }

        } else {
            if (!this.bFadingOut) {
                this.displayTimer.update(dt);
            } else {
                this.fadeTimer.update(dt);
            }
        }

    }

    drawLabel(ctx) {

        ctx.font = this.fontSize + "px " + this.font;
        if (this.fontSize == 32) { // pgfont *2
            ctx.shadowOffsetY = 4;
        } else { // normal
            ctx.shadowOffsetY = currentScale;
        }

        ctx.fillStyle = this.fontMainColor;
        ctx.shadowColor = this.fontBackgroundColor;

        if (this.hoverable) {
            if (this.state == Panel.STATE.Hover) {
                ctx.fillStyle = this.hoverFontMainColor;
                ctx.shadowColor = this.hoverBackgroundColor;
            }
        }

        switch (this.alignText) {
            case this.ALIGN_TEXT.Center:
                ctx.textAlign = "center";
                ctx.fillText(this.label, this.x + (this.width * 0.5), this.y + this.textOffsetY);
                break;
        }

        ctx.shadowOffsetY = 0;
        ctx.fillStyle = BLACK_COLOR;
        ctx.textAlign = "left";
    }

}