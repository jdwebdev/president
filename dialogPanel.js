class DialogPanel extends Panel {

    static list = [];
    static currentList = [];
    static STATE = Object.freeze({
        Normal: 0,
        Hover: 1,
        Inactive: 2
    });
    static pairChar = 0;

    constructor(pSize, pX, pY, pParent, pType = "normal", pTypeState = null, pLabel = "", pId = 0, pStaticSize = false) {

        super(pSize, pX, pY, pParent, pType, pTypeState, pLabel, pId, pStaticSize);

        this.bDialogType = false;
        this.bDialogStarted = false;
        this.bDialogEnd = false;
        this.currentLine = 0;
        this.currentChar = 0;
        this.dialogTimer = new Timer(0.01, this.updateDialog.bind(this));
        this.childButton = null;
        this.childSprite = null;

        this.labelArr = pLabel;
        this.currentPhrase = 0;
        if (this.labelArr[2]) {
            this.label = "";
        } else {
            this.label = this.labelArr[0] + this.currentPhrase;
        }
        this.handleTempWordArr();

        this.scriptCallback = null;
        this.endDialogCallback = null;
        this.stateList = "";
    }

    setStateList(pList) {
        this.stateList = pList;
    }

    setChildBtn(pBtn, pList) {
        this.childButton = pBtn;
        this.childButtonList = pList; // String: "lessonTutorial.main"
    }

    setChildSprite(pSprite, pList) {
        this.childSprite = pSprite;
        this.childSpriteList = pList;
    }

    setScriptCallback(pCB) {
        this.scriptCallback = pCB;
    }

    setEndDialogCallback(pCB) {
        this.endDialogCallback = pCB;
    }

    update(dt) {
        if (this.bDialogStarted && !this.bDialogEnd) {
            this.dialogTimer.update(dt);
        }

        if (this.bFading) {
            this.fading(dt);
        }

        if (this.bMoving) {

            if (this.speedCount <= this.movingSpeed) {

                // this.x = easeOutSin(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
                // this.y = easeOutSin(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                if (this.arriveDir) {
                    this.y = this.tweeningArrive(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                } else {
                    this.y = this.tweeningArrive(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);
                }

                this.speedCount += dt;

            } else {
                this.x = this.destination.x;
                this.y = this.destination.y;
                this.bMoving = false;
                this.speedCount = 0;

                if (this.leaveDir) {
                    this.changeDirection();
                    let tmpY = this.destination.y;
                    this.destination.y = this.startPos.y;
                    this.startPos.y = tmpY;
                }
            }

            this.children.forEach(c => {
                if (c instanceof Panel || c instanceof Button) {
                    c.updatePosition();
                }
            });
        }

    }

    updateDialog() {
        // this.lines[this.currentLine] += this.completeLines[this.currentLine][this.currentChar]; //! Version 1
        this.lines[this.currentLine] = this.lines[this.currentLine].substring(0, this.currentChar) + this.completeLines[this.currentLine][this.currentChar] + this.lines[this.currentLine].substring(this.currentChar + 1, this.lines[this.currentLine].length); //! Version 2

        this.currentChar++;
        DialogPanel.pairChar++;
        if (DialogPanel.pairChar % 5 == 0) {
            Sound.play("text");
        }
        if (this.currentChar == this.completeLines[this.currentLine].length) {
            this.currentChar = 0;
            this.currentLine++;
            if (this.currentLine == this.completeLines.length) {
                if (!this.bDialogEnd) {
                    this.switchButtons(true);
                    this.bDialogEnd = true;
                }

                if (this.childSprite) {
                    displayPanelChildSprite(this.childSprite, this.childSpriteList);
                }
                if (this.childButton) {
                    displayPanelChildBtn(this.childButton, this.childButtonList);
                }
            }
        }
    }

    nextPhrase() {
        this.currentPhrase++;
        if (this.currentPhrase < this.labelArr[1]) {
            this.label = this.labelArr[0] + this.currentPhrase;
            this.bDialogEnd = false;
            this.completeLines = [];
            this.lines = [];
            this.handleTempWordArr();
            this.dialogTimer.reset();
            this.currentLine = 0;
            this.currentChar = 0;
            this.switchButtons(false);
            // this.childSprite.delete = true;
            // this.childButton.getSprite().delete = true;
            // this.childButton.removeFromCurrentList();


            if (this.scriptCallback) {
                this.scriptCallback(this.currentPhrase);
            }
        } else { //? End of Dialog
            this.currentPhrase--;
            switch (this.stateList) {
                case "introduction":
                    Introduction.desactiveDialogButton();
                    break;
                case "lessonTutorial":
                    LessonTutorial.desactiveDialogButton();
                    break;
            }

            // this.childSprite.delete = true;
            // this.childButton.getSprite().delete = true;
            // this.childButton.removeFromCurrentList();
            this.changeDirection();
            let tmpY = this.destination.y;
            this.destination.y = this.startPos.y;
            this.startPos.y = tmpY;
            this.setMoving(true);
            this.fade(0.04, -1);
            this.endDialogCallback();
        }
    }

    speedPhrase() {
        for (let i = 0; i < this.completeLines.length; i++) {
            this.lines[i] = this.completeLines[i];
        }
        if (!this.bDialogEnd) {
            this.bDialogEnd = true;
            this.switchButtons(true);

        }
    }

    switchButtons(pSpeedToNext) {
        switch (this.stateList) {
            case "introduction":
                Introduction.switchButtons(pSpeedToNext);
                break;
            case "lessonTutorial":
                LessonTutorial.switchButtons(pSpeedToNext);
                break;
        }
    }

    startDialog() {
        this.label = this.labelArr[0] + this.currentPhrase;
        this.handleTempWordArr();
        this.bDialogStarted = true;
    }

    handleTempWordArr() {

        if (this.label != "") {
            this.wordsArr = LANG[this.label].split(' ');

            if (this.wordsArr.length == 1 && this.wordsArr[0] != "" && this.bFirstUC) this.wordsArr[0] = firstUC(this.wordsArr[0]);

            let line = "";
            let tmp = "";
            this.wordsArr.forEach((word, index) => { // contenu test du tooltip 23 * 5 = 115
                index == 0 ? tmp += word : tmp = line + " " + word;

                // if ((tmp.length * 5) > this.totalWidth - 20) {
                if ((tmp.length * 5) > this.totalWidth - 30) {
                    this.completeLines.push(line);
                    line = word;
                    tmp = "";
                } else {
                    index == 0 ? line += word : line += " " + word;
                }

                if (index == this.wordsArr.length - 1) {
                    this.completeLines.push(line);
                    tmp = "";
                }
            })

            for (let i = 0; i < this.completeLines.length; i++) {
                this.lines[i] = "";
                // For lines avec un nombre d'espace = au nb de chars dans une ligne //! Version 2
                for (let j = 0; j < this.completeLines[i].length; j++) {
                    this.lines[i] += " ";
                }
            }
        }
    }


    fading(dt) {
        this.fadingTimer.update(dt);
        if ((this.fadingIn && this.alpha >= 1)) {
            this.bFading = false;
            if (this.fadingIn) {
                this.startDialog();
            }
        } else if (!this.fadingIn && this.alpha <= 0) {
            this.alpha = 0;
            this.bFading = false;
            // this.changeDirection();
            // let tmpY = this.destination.y;
            // this.destination.y = this.startPos.y;
            // this.startPos.y = tmpY;
        }
    }

    drawLabel(ctx) {

        ctx.font = this.fontSize + "px " + this.font;
        if (this.fontSize == 32) { // pgfont *2
            ctx.shadowOffsetY = 4;
        } else { // normal
            ctx.shadowOffsetY = 2;
        }

        if (this.parent && this.parent.bFading) {
            this.updateAlpha();
        }

        ctx.fillStyle = this.fontMainColor;
        ctx.shadowColor = this.fontBackgroundColor;

        if (this.hoverable) {
            if (this.state == Panel.STATE.Hover) {
                ctx.fillStyle = this.hoverFontMainColor;
                ctx.shadowColor = this.hoverBackgroundColor;
            }
        }

        if (!this.textOverflow) {

            if (this.bDialogStarted) {

                // log(this.lines[0])
                for (let i = 0; i < this.lines.length; i++) {
                    switch (this.alignText) {
                        case this.ALIGN_TEXT.Left:
                            ctx.textAlign = "left";
                            ctx.fillText(this.lines[i], this.x + this.textOffsetX, this.y + this.textOffsetY);
                            break;
                        case this.ALIGN_TEXT.Center:
                            ctx.textAlign = "center";
                            ctx.fillText(this.lines[i], this.x + (this.totalWidth * 0.5), this.y + this.textOffsetY);
                            break;
                        case this.ALIGN_TEXT.Right:
                            ctx.textAlign = "right";
                            ctx.fillText(this.lines[i], this.x + this.width - this.textOffsetX, this.y + this.textOffsetY);
                            break;
                    }
                    this.textOffsetY += this.textLinesOffsetY;
                }
                this.textOffsetY = this.textOffsetYOrigin;
            }

        } else {
            switch (this.alignText) {
                case this.ALIGN_TEXT.Left:
                    ctx.textAlign = "left";
                    ctx.fillText(LANG[this.label], this.x + this.textOffsetX, this.y + this.textOffsetY);
                    break;
                case this.ALIGN_TEXT.Center:
                    ctx.textAlign = "center";
                    if (Array.isArray(this.id)) {
                        ctx.fillText(LANG[this.label], this.x + (this.totalWidth * 0.5), this.y + this.textOffsetY);
                    } else {
                        ctx.fillText(LANG[this.label], this.x + (this.width * 0.5), this.y + this.textOffsetY); // +0.5 Car en centrant le texte se retrouve entre deux pixels
                    }
                    break;
                case this.ALIGN_TEXT.Right:
                    ctx.textAlign = "right";
                    ctx.fillText(LANG[this.label], this.x + this.width - this.textOffsetX, this.y + this.textOffsetY);
                    break;
            }
        }


        ctx.shadowOffsetY = 0;

        ctx.fillStyle = BLACK_COLOR;

        ctx.textAlign = "left";
    }
}