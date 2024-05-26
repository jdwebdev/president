class EntryField {

    static list = [];
    static currentList = [];
    static STATE = Object.freeze({
        Normal: 0,
        Hover: 1,
        Focus: 2,
        Inactive: 3
    });

    constructor(pSize, pX, pY, pParent, pCallback, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {

        this.offX = pX;
        this.offY = pY;

        this.width = pSize.w;
        this.height = pSize.h;
        this.corner = pSize.v;

        this.parent = pParent;

        if (this.parent) {
            this.parent.setChild(this);
            this.x = this.parent.x + this.offX;
            this.y = this.parent.y + this.offY;
        } else {
            this.x = pX;
            this.y = pY;
        }

        this.id = pId;

        this.startPos = { x: pX, y: pY };
        this.destination = { x: 0, y: 0 };
        this.direction = 1;
        this.bMoving = false;
        this.bCanMove = false;
        this.speedCount = 0;
        this.movingSpeed = 1;

        this.type = pType;
        this.staticSize = pStaticSize;

        if (!this.staticSize) {
            pSize = { corner: { w: pSize.v, h: pSize.v }, t: { w: 1, h: pSize.v }, r: { w: pSize.v, h: 1 }, b: { w: 1, h: pSize.v }, l: { w: pSize.v, h: 1 }, c: { w: 1, h: 1 } };
            this.internWidth = this.width - pSize.corner.w;
            this.internHeight = this.height - pSize.corner.h;

            this.sp = {
                tl: new Sprite({ w: pSize.corner.w, h: pSize.corner.h }, 0, 0, this, this.type),
                tr: new Sprite({ w: pSize.corner.w, h: pSize.corner.h }, 0 + this.internWidth, 0, this, this.type),
                bl: new Sprite({ w: pSize.corner.w, h: pSize.corner.h }, 0, 0 + this.internHeight, this, this.type),
                br: new Sprite({ w: pSize.corner.w, h: pSize.corner.h }, 0 + this.internWidth, 0 + this.internHeight, this, this.type),
                t: new Sprite({ w: pSize.t.w, h: pSize.t.h }, 0 + pSize.corner.w, 0, this, this.type, { x: this.internWidth - pSize.corner.w, y: 1 }),
                r: new Sprite({ w: pSize.r.w, h: pSize.r.h }, 0 + this.internWidth, 0 + pSize.corner.h, this, this.type, { x: 1, y: this.internHeight - pSize.corner.h }),
                b: new Sprite({ w: pSize.b.w, h: pSize.b.h }, 0 + pSize.corner.w, 0 + this.internHeight, this, this.type, { x: this.internWidth - pSize.corner.w, y: 1 }),
                l: new Sprite({ w: pSize.l.w, h: pSize.l.h }, 0, 0 + pSize.corner.h, this, this.type, { x: 1, y: this.internHeight - pSize.corner.h }),
                c: new Sprite({ w: pSize.c.w, h: pSize.c.h }, 0 + pSize.corner.w, 0 + pSize.corner.h, this, this.type, { x: this.internWidth - pSize.corner.w, y: this.internHeight - pSize.corner.h }),
                cursor: new Sprite({ w: 1, h: 14 }, 13, 6, this, this.type),
                class: 9,
                parent: this,
                delete: false
            }
            this.setEntryFieldSprites(pId, pSize.corner.w);
        } else {
            this.sp = new Sprite(pSize, 0, 0, this, this.type);
            this.sp.setClass("EntryField");
        }

        this.boxCollider = null;

        this.state = EntryField.STATE.Normal;
        this.previousState = EntryField.STATE.Normal;
        this.font = "jpfont";
        this.fontSize = 10;
        this.fontMainColor = BLACK_COLOR;
        this.fontBackgroundColor = GREY_100_COLOR;
        this.hoverFontMainColor = BLACK_COLOR;
        this.hoverBackgroundColor = GREY_100_COLOR;
        if (this.parent) {
            this.setAlpha(this.parent.alpha);
        } else {
            this.setAlpha(1);
        }

        this.typeState = pTypeState;

        this.label = pLabel;

        this.callback = pCallback;
        this.hoverCB = null;
        this.focusCB = null;

        this.bToDelete = false;

        this.ALIGN_TEXT = Object.freeze({
            Left: 0,
            Center: 1,
            Right: 2
        });
        this.alignText = this.ALIGN_TEXT.Left;
        this.textOffsetX = 0;
        this.textOffsetY = 14;
        this.textOffsetXOrigin = this.textOffsetX;
        this.textOffsetYOrigin = this.textOffsetY;
        this.textOffsetXHover = this.textOffsetX - 1;
        this.textOffsetYHover = this.textOffsetY - 1;
        this.textOffsetXFocus = this.textOffsetX - 1;
        this.textOffsetYFocus = this.textOffsetY - 1;
        this.textOffsetXDown = this.textOffsetX + 2;
        this.textOffsetYDown = this.textOffsetY + 2;
        this.bTextOffsetChanged = false;

        this.cursorPosX = 13;
        this.cursorPosY = 6;
        this.cursorPosXOrigin = this.cursorPosX;
        this.cursorPosYOrigin = this.cursorPosY;
        this.cursorPosXFocus = this.cursorPosX - 1;
        this.cursorPosYFocus = this.cursorPosY - 1;

        this.tooltip = [];
        this.hoverOffset = null;

        this.bPasswordField = false;
        this.bPassword = false;

        EntryField.list.push(this);
    }

    setWidthForDynamicEntryFields(pOriginWidth) {
        for (const s in this.sp) {
            if (this.sp[s] instanceof Sprite) {
                this.sp[s].originWidth = pOriginWidth;
            }
        }
    }

    setEntryFieldSprites(pId, pSize) {

        let x_l = 0;
        let y_t = 0;

        this.sp.cursor.addAnimation("normal", { x: 464, y: 128 }, 2, 0.5);
        this.sp.cursor.addAnimation("none", { x: 465, y: 128 });
        this.sp.cursor.changeAnimation("none");

        switch (pId) {
            case 1:  //? Login/Signup Form
                x_l = 464;
                y_t = 144;
                break;
        }

        let x_c = x_l + pSize;
        let x_r = x_c + 1;
        let x_l_h = x_l + (pSize * 2) + 1;
        let x_c_h = x_l_h + pSize;
        let x_r_h = x_c_h + 1;
        let x_l_d = x_l_h + (pSize * 2) + 1;
        let x_c_d = x_l_d + pSize;
        let x_r_d = x_c_d + 1;
        let y_c = y_t + pSize;
        let y_b = y_c + 1;

        this.sp.tl.addAnimation("normal", { x: x_l, y: y_t });
        this.sp.tl.addAnimation("hover", { x: x_l_h, y: y_t });
        this.sp.tl.addAnimation("focus", { x: x_l_d, y: y_t });
        this.sp.tl.changeAnimation("normal");

        this.sp.tr.addAnimation("normal", { x: x_r, y: y_t });
        this.sp.tr.addAnimation("hover", { x: x_r_h, y: y_t });
        this.sp.tr.addAnimation("focus", { x: x_r_d, y: y_t });
        this.sp.tr.changeAnimation("normal");

        this.sp.bl.addAnimation("normal", { x: x_l, y: y_b });
        this.sp.bl.addAnimation("hover", { x: x_l_h, y: y_b });
        this.sp.bl.addAnimation("focus", { x: x_l_d, y: y_b });
        this.sp.bl.changeAnimation("normal");

        this.sp.br.addAnimation("normal", { x: x_r, y: y_b });
        this.sp.br.addAnimation("hover", { x: x_r_h, y: y_b });
        this.sp.br.addAnimation("focus", { x: x_r_d, y: y_b });
        this.sp.br.changeAnimation("normal");

        this.sp.t.addAnimation("normal", { x: x_c, y: y_t });
        this.sp.t.addAnimation("hover", { x: x_c_h, y: y_t });
        this.sp.t.addAnimation("focus", { x: x_c_d, y: y_t });
        this.sp.t.changeAnimation("normal");

        this.sp.r.addAnimation("normal", { x: x_r, y: y_c });
        this.sp.r.addAnimation("hover", { x: x_r_h, y: y_c });
        this.sp.r.addAnimation("focus", { x: x_r_d, y: y_c });
        this.sp.r.changeAnimation("normal");

        this.sp.b.addAnimation("normal", { x: x_c, y: y_b });
        this.sp.b.addAnimation("hover", { x: x_c_h, y: y_b });
        this.sp.b.addAnimation("focus", { x: x_c_d, y: y_b });
        this.sp.b.changeAnimation("normal");

        this.sp.l.addAnimation("normal", { x: x_l, y: y_c });
        this.sp.l.addAnimation("hover", { x: x_l_h, y: y_c });
        this.sp.l.addAnimation("focus", { x: x_l_d, y: y_c });
        this.sp.l.changeAnimation("normal");

        this.sp.c.addAnimation("normal", { x: x_c, y: y_c });
        this.sp.c.addAnimation("hover", { x: x_c_h, y: y_c });
        this.sp.c.addAnimation("focus", { x: x_c_d, y: y_c });
        this.sp.c.changeAnimation("normal");
    }

    reset() {
        this.setState(EntryField.STATE.Inactive);
        this.changeSpriteAnimation("normal");
        this.sp.cursor.changeAnimation("none");
        this.sp.cursor.offX = this.cursorPosXOrigin + this.label.length * 5
    }

    setPassword(pBool = true) {
        this.bPasswordField = true;
        this.bPassword = pBool;
    }

    static resetTypeState(pType, pTypeState, pTypeState2 = -1) {
        EntryField.currentList = EntryField.list.filter(b => {
            return (b.type == pType && b.typeState == pTypeState) || b.type == pType && b.typeState == pTypeState2;
        });
    }

    setAnimations(pCoord) { //? For static size & normal EntryFields
        this.sp.getSprite().addAnimation("normal", { x: pCoord.x, y: pCoord.y });
        this.sp.getSprite().addAnimation("hover", { x: pCoord.x + this.width, y: pCoord.y });
        this.sp.getSprite().addAnimation("focus", { x: pCoord.x + (this.width * 2), y: pCoord.y });
        this.sp.getSprite().changeAnimation("normal");
    }

    resetAnimations(pId) {
        if (!this.staticSize) {
            for (const s in this.sp) {
                if (this.sp[s] instanceof Sprite) {
                    this.sp[s].animation = [];
                }
            }
            this.setEntryFieldSprites(pId);
        }
    }

    getSprite() {
        return this.sp;
    }

    getPosition() {
        if (this.boxCollider) {
            return { x: this.x + this.boxCollider.offX, y: this.y + this.boxCollider.offY };
        } else {
            return { x: this.x, y: this.y };
        }
    }

    getSize() {
        if (this.boxCollider) {
            return { w: this.boxCollider.w, h: this.boxCollider.h };
        } else {
            return { w: this.width, h: this.height };
        }
    }

    getTooltip() {
        return this.tooltip;
    }

    setTooltip(pTooltip) {
        this.tooltip.push(pTooltip);
    }

    setBoxCollider(pW, pH, pX = 0, pY = 0) {
        this.boxCollider = {
            w: pW,
            h: pH,
            offX: pX,
            offY: pY
        }
    }

    getHoverOffset() {
        return this.hoverOffset;
    }

    setHoverOffset(pOffset) {
        this.hoverOffset = { ...pOffset };
    }

    setDestination(pDestination) {
        this.destination = {
            x: pDestination.x,
            y: pDestination.y
        };
    }

    setDirection(pDirection) {
        this.direction = pDirection;
    }

    resetPosition() {
        this.x = this.startPos.x;
        this.y = this.startPos.y;
        this.speedCount = 0;
    }

    setCanMove(pBool) {
        this.bCanMove = pBool;
    }

    setMoving(pBool) {
        if (this.bCanMove) {
            this.bMoving = pBool;
        }
    }

    setMovingSpeed(pValue) {
        this.movingSpeed = pValue;
    }

    setToDelete() {
        this.bToDelete = true;
    }

    removeFromList() {
        EntryField.list = EntryField.list.filter(b => {
            return b != this;
        });
    }

    removeFromCurrentList() {
        EntryField.currentList = EntryField.currentList.filter(b => {
            return b != this;
        });
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = newState;
    }

    setAlignText(pAlign) {
        this.alignText = pAlign;
    }

    setOffsets(pX = 0, pY = 13, pDown = 2, pHover = -1) {
        this.textOffsetX = pX;
        this.textOffsetY = pY;
        this.textOffsetXOrigin = pX;
        this.textOffsetYOrigin = pY;
        this.textOffsetXHover = this.textOffsetX + pHover;
        this.textOffsetYHover = this.textOffsetY + pHover;
        this.textOffsetXDown = this.textOffsetX + pDown;
        this.textOffsetYDown = this.textOffsetY + pDown;
        this.textOffsetXFocus = this.textOffsetX + pHover;
        this.textOffsetYFocus = this.textOffsetY + pHover;
    }

    resetOffsets() {
        this.bTextOffsetChanged = false;
        this.textOffsetX = this.textOffsetXOrigin;
        this.textOffsetY = this.textOffsetYOrigin;
    }

    setLabel(pNewLabel) {
        this.label = pNewLabel;
    }

    setTextCenterY() {
        this.textOffsetY = Math.floor(this.height * 0.5) + 2;
    }


    setFont(pFont) {
        this.font = pFont;
    }

    setFontSize(pSize) {
        this.fontSize = pSize;
    }

    setFontColor(pBack = "rgba(100,100,100," + this.alpha + ")", pMain = "rgba(0,0,0," + this.alpha + ")", pHoverBack = GREY_100_COLOR, pHoverMain = WHITE_COLOR) {
        this.fontMainColor = pMain;
        this.fontBackgroundColor = pBack;
        this.hoverBackgroundColor = pHoverBack;
        this.hoverFontMainColor = pHoverMain;
    }

    setCallbackArg(pArg) {
        this.callback.arg = pArg;
    }

    setHoverCB(pCallback, pParam) {
        this.hoverCB = {
            cb: pCallback,
            arg: pParam
        }
    }

    setFocusCB(pCallback, pParam) {
        this.focusCB = {
            cb: pCallback,
            arg: pParam
        };
    }

    setTextCase(pCase) {
        switch (pCase) {
            case "first":
                this.label = firstUC(this.label);
                break;
            case "all":
                this.label = this.label.toUpperCase();
                break;
            case "normal":
                this.label = this.label.toLowerCase();
                break;
        }
    }

    changeSpriteAnimation(pName) {
        if (!this.staticSize) {
            for (const sp in this.getSprite()) {
                if (this.getSprite()[sp] instanceof Sprite) {
                    if (sp != "cursor") {
                        this.getSprite()[sp].changeAnimation(pName);
                    }
                }
            }
        } else {
            this.getSprite().changeAnimation(pName);
        }
    }

    update(dt) {
        if (this.speedCount <= this.movingSpeed) {

            this.x = easeOutSin(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
            this.y = easeOutSin(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);

            this.speedCount += dt;
        } else {
            this.x = this.destination.x;
            this.y = this.destination.y;
            this.bMoving = false;
            this.speedCount = 0;
            if (this.label == "Credits") {
                TRANSITION = false;
            }
        }
    }

    updatePosition() {
        this.x = this.parent.x + this.offX;
        this.y = this.parent.y + this.offY;
    }

    setAlpha(pNewValue) {
        this.alpha = pNewValue;
        this.fontMainColor = this.fontMainColor.split(",");
        this.fontMainColor = this.fontMainColor[0] + "," + this.fontMainColor[1] + "," + this.fontMainColor[2] + "," + this.alpha + ")";
        this.fontBackgroundColor = this.fontBackgroundColor.split(",");
        this.fontBackgroundColor = this.fontBackgroundColor[0] + "," + this.fontBackgroundColor[1] + "," + this.fontBackgroundColor[2] + "," + this.alpha + ")";
    }

    updateAlpha(pNewValue = 0) {
        if (this.parent) {
            this.alpha = this.parent.alpha;
        } else {
            this.alpha += pNewValue;
        }
        this.fontMainColor = this.fontMainColor.split(",");
        this.fontMainColor = this.fontMainColor[0] + "," + this.fontMainColor[1] + "," + this.fontMainColor[2] + "," + this.alpha + ")";
        this.fontBackgroundColor = this.fontBackgroundColor.split(",");
        this.fontBackgroundColor = this.fontBackgroundColor[0] + "," + this.fontBackgroundColor[1] + "," + this.fontBackgroundColor[2] + "," + this.alpha + ")";
    }

    static draw() {

        EntryField.currentList.forEach(e => {
            if (e.state == EntryField.STATE.Hover && e.hoverCB) {
                e.hoverCB.cb(e.hoverCB.arg);
            }
            if (!e.staticSize) {
                for (const sp in e.getSprite()) {
                    e.getSprite()[sp].draw(ctx);
                }
            } else {
                e.getSprite().draw(ctx);
            }
            if (e.label != "") {
                e.drawLabel(ctx);
            }
            if (e.state == EntryField.STATE.Hover && e.hoverCB) {
                e.hoverCB.cb(e.hoverCB.arg);
            }
        });
    }

    drawLabel(ctx) {

        if (this.state == EntryField.STATE.Hover) {
            ctx.fillStyle = this.hoverFontMainColor;
            ctx.shadowColor = this.hoverBackgroundColor;
        } else {
            ctx.fillStyle = this.fontMainColor;
            ctx.shadowColor = this.fontBackgroundColor;
        }

        ctx.font = this.fontSize + "px " + this.font;
        ctx.shadowOffsetY = 2;

        switch (this.alignText) {
            case this.ALIGN_TEXT.Left:
                ctx.textAlign = "left";
                if (this.bPassword) {
                    let star = "";
                    for (let i = 0; i < this.label.length; i++) {
                        star += "*";
                    }
                    ctx.fillText(star, this.x + this.textOffsetX, this.y + this.textOffsetY);
                } else {
                    ctx.fillText(this.label, this.x + this.textOffsetX, this.y + this.textOffsetY);
                }
                break;
            case this.ALIGN_TEXT.Center:
                ctx.textAlign = "center";
                ctx.fillText(this.label, this.x + this.textOffsetX + (this.width * 0.5) + 0.5, this.y + this.textOffsetY); // +0.5 Car en centrant le texte se retrouve entre deux pixels
                break;
            case this.ALIGN_TEXT.Right:
                ctx.textAlign = "right";
                ctx.fillText(this.label, this.x + this.width - 5, this.y + this.textOffsetY);
                break;
        }

        ctx.shadowOffsetY = 0;
        ctx.fillStyle = BLACK_COLOR;
        ctx.textAlign = "left";
    }
}