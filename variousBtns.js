class KeyboardBtn extends Button {
    constructor(pSize, pX, pY, pParent, pCallback, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {
        super(pSize, pX, pY, pParent, pCallback, pType, pTypeState, pLabel, pId, pStaticSize);
    }
}

class SoundBtn extends Button {
    constructor(pSize, pX, pY, pParent, pCallback, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {
        super(pSize, pX, pY, pParent, pCallback, pType, pTypeState, pLabel, pId, pStaticSize);

        this.sound = "";
    }
}

class CheckboxBtn extends Button {

    static STATE = Object.freeze({
        Normal: 0,
        Hover: 1,
        Inactive: 2,
        C_Normal: 3,
        C_Hover: 4
    });

    static checklist = [];

    constructor(pSize, pX, pY, pParent, pCallback, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {
        super(pSize, pX, pY, pParent, pCallback, pType, pTypeState, pLabel, pId, pStaticSize);

        this.group = -1;
        this.bChecked = false;

        // CheckboxBtn.checklist.push(this);
    }

    setGroup(pId) {
        this.group = 0;
    }

    check() {
        CheckboxBtn.list.forEach(b => {
            if (b.group == this.group) {
                b.bChecked = false;
                b.setIdTest(-1);
                b.getSprite().changeAnimation("normal");
            }
        });
        this.bChecked = true;
        this.setIdTest("c");
        this.getSprite().changeAnimation("c_normal");
        MOUSE_SPRITE.changeAnimation("normal");
    }

    setAnimations(pCoord) { //? For static size & normal Buttons
        this.sp.getSprite().addAnimation("normal", { x: pCoord.x, y: pCoord.y });
        this.sp.getSprite().addAnimation("hover", { x: pCoord.x + this.width, y: pCoord.y });
        this.sp.getSprite().addAnimation("down", { x: pCoord.x + (this.width * 2), y: pCoord.y });

        this.sp.getSprite().addAnimation("c_normal", { x: pCoord.x, y: pCoord.y + this.height});
        this.sp.getSprite().addAnimation("c_hover", { x: pCoord.x + this.width, y: pCoord.y + this.height});
        this.sp.getSprite().addAnimation("c_down", { x: pCoord.x + (this.width * 2), y: pCoord.y + this.height});

        if (this.bInactiveAnimation) {
            this.sp.getSprite().addAnimation("inactive", { x: pCoord.x + (this.width * 3), y: pCoord.y });
        }

        this.sp.getSprite().changeAnimation("normal");
    }

    drawLabel(ctx) {

        if (this.parent && this.parent.bFading) {
            this.updateAlpha();
        }

        if (this.state == Button.STATE.Hover) {
            ctx.fillStyle = this.hoverFontMainColor;
            ctx.shadowColor = this.hoverBackgroundColor;
        } else if (this.bChecked) {
            ctx.fillStyle = "rgba(141,41,41,1)";
            ctx.shadowColor = this.hoverBackgroundColor;
        } else {
            ctx.fillStyle = this.fontMainColor;
            ctx.shadowColor = this.fontBackgroundColor;
        }

        ctx.font = this.fontSize + "px " + this.font;
        ctx.shadowOffsetY = currentScale;

        switch (this.alignText) {
            case this.ALIGN_TEXT.Left:
                ctx.textAlign = "left";
                ctx.fillText(LANG[this.label], this.x + 5, this.y + this.textOffsetY);
                break;
            case this.ALIGN_TEXT.Center:
                ctx.textAlign = "center";
                ctx.fillText(LANG[this.label], this.x + this.textOffsetX + (this.width * 0.5) + 0.5, this.y + this.textOffsetY); // +0.5 Car en centrant le texte se retrouve entre deux pixels
                break;
            case this.ALIGN_TEXT.Right:
                ctx.textAlign = "right";
                ctx.fillText(LANG[this.label], this.x + this.width - 5, this.y + this.textOffsetY);
                break;
        }

        ctx.shadowOffsetY = 0;
        ctx.fillStyle = BLACK_COLOR;
        ctx.textAlign = "left";
    }

}