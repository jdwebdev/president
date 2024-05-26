class Card {
    // ♦♥♣♠
    // clubs (♣), diamonds (♦), hearts (♥), spades (♠).
    static CARD_LIST = [];
    static POSITIONS = [];
    static inTransition = null;
    static inTransitionList = [];
    static multiTransition = false;
    static selected = null;
    static multiHover = false;
    static multiHoverPos = "";
    static multiSelect = false;
    static multiSelectPos = "";
    static list = [];
    static randomList = [];
    static STATE = Object.freeze({
        Normal: 0,
        Hover: 1,
        FaceDown: 2,
        Choosable: 3,
        Chosen: 4
    });
    static COL_OFFSET = 68;
    static bestList = [];
    static cardDistribution = [];
    static selectedType = "";
    static selectedCards = [];

    static font = "24px kyokasho";

    constructor(pPosition, pName, pType, pAnimX, pAnimY, pKanji) {
        this.state = Card.STATE.Normal;
        this.name = pName;
        this.type = pType;
        this.x = 0;
        this.y = 0;
        this.width = 26;
        this.height = 38;
        this.position = pPosition;

        this.faceDownMoveX = 0;
        this.faceDownMoveY = 0;
        this.bFaceDownMove = false;
        
        //? Box colliders
        //? Origin　一般
        this.boxLeft = {w: 12, h: 38};
        this.boxTop = {w: 12, h: 11};
        //? Origin2 (一番右)
        // this.boxLeft = {w: 26, h: 38};
        // this.boxTop = {w: 26, h: 38};
        //? Chosen
        // this.boxLeft = {w: 12, h: 38};
        // this.boxTop = {w: 26, h: 11};

        this.boxNormalLeft = {w: 12, h: 38};
        this.boxNormalTop = {w: 12, h: 11};
        this.boxChosenLeft = {w: 12, h: 38};
        this.boxChosenTop = {w: 26, h: 11};

        
        this.bHovering = false;
        this.bSelect = false;
        this.bMoving = false;
        this.bChoosable = false;
        this.bRemoveFromExchange = false;
        this.bRemoveFromPlayer = false;

        this.normalY;
        this.hoverY;
        this.chosenY;

        this.tweeningArrive = easeOutSin;
        this.startPos = { x: 0, y: 0 };
        this.destination = { x: 0, y: 0 };
        this.direction = 1;
        this.bMoving = false;
        this.bCanMove = false;
        this.speedCount = 0;
        this.movingSpeed = 1;
        this.tweeningArrive = easeOutSin;
        this.tweeningLeave = easeInSin;
        this.arriveDir = true;
        this.leaveDir = false;

        this.sp = new Sprite({w: this.width, h: this.height}, this.x, this.y, null, "c");
        this.sp.addAnimation("normal", { x: pAnimX, y: pAnimY });
        if (mainState === MAIN_STATE.Game) {
            this.sp.addAnimation("faceDown", { x: 0, y: 64 });
        } else {
            this.sp.addAnimation("faceDown", { x: 0, y: 384 });
        }
        this.sp.changeAnimation("normal");

        Card.list.push(this);
    }

    getSprite() {
        return this.sp;
    }

    getStateInfo() {
        switch(this.state) {
            case Card.STATE.Normal: return "Normal"; break;
            case Card.STATE.Hover: return "Hover"; break;
            case Card.STATE.FaceDown: return "FaceDown"; break;
            case Card.STATE.Choosable: return "Choosable"; break;
            case Card.STATE.Chosen: return "Chosen"; break;
        }
    }

    setYPositions(pY) {
        this.normalY = pY;
        this.hoverY = pY-1;
        this.chosenY = pY-11;
    }

    setBoxColliders(pTopBox, pLeftBox = {w: 12, h: 38}) {
        this.boxLeft = pLeftBox;
        this.boxTop = pTopBox;
    }
    resetBoxColliders(pArg) {
        if (pArg === "c") { //? Chosen
            this.boxLeft = this.boxChosenLeft;
            this.boxTop = this.boxChosenTop;
        } else { //? Normal
            this.boxLeft = this.boxNormalLeft;
            this.boxTop = this.boxNormalTop;
        }
    }
    setNotRightBoxColliders() {
        this.boxLeft = {w: 12, h: 38};
        this.boxTop = {w: 12, h: 11};
        this.boxNormalLeft = {w: 12, h: 38};
        this.boxNormalTop = {w: 12, h: 11};
        this.boxChosenLeft = {w: 12, h: 38};
        this.boxChosenTop = {w: 26, h: 11};
    }
    setMostRightBoxColliders() {
        this.boxLeft = {w: this.width, h: this.height};
        this.boxTop = {w: this.width, h: this.height};
        this.boxNormalLeft = {w: this.width, h: this.height};
        this.boxNormalTop = {w: this.width, h: this.height};
        this.boxChosenLeft = {w: this.width, h: this.height};
        this.boxChosenTop = {w: this.width, h: this.height};
    }

    static getCard(pName) {
        let cardToReturn = null;
        Card.list.forEach(c => {
            if (c.name + "" + c.type === pName) {
                cardToReturn = c;
            }
        });
        return cardToReturn;
    }

    static randomizer(pArr, pNumber) {
        let arr = [];
        for (let i = 0; i < pNumber; i++) {
            let rndNumber = rnd(0, pArr.length);
            if (arr.includes(pArr[rndNumber])) {
                i--;
            } else {
                arr.push(pArr[rndNumber]);
            }
        }
        return arr;
    }

    static check(pName, pType, pReceiverName, pReceiverType, pC123) {
        let bOk = false;
        return false;
    }
    static checkType(pType1, pType2) {
        
    }

    boxCollision(pMX, pMY) {
        return ((CollisionManager.MouseCollision(Math.floor(pMX), Math.floor(pMY), this.x, this.y, this.boxTop.w, this.boxTop.h)) || (CollisionManager.MouseCollision(Math.floor(pMX), Math.floor(pMY), this.x, this.y, this.boxLeft.w, this.boxLeft.h)));
        // return (CollisionManager.MouseCollision(pMX, pMY, this.x, this.y, this.boxLeft.w, this.boxLeft.h) || (CollisionManager.MouseCollision(pMX, pMY, this.x, this.y, this.boxTop.w, this.boxTop.h)));
    }

    static checkOtherCards(pDirection) {
        let bAllToNormal = false;
        if (pDirection === "u") { //? Up : card chosen
            // log("----- UP CHECK OTHER CARDS -----");
            // log(Card.selectedCards.length + " === " + Game.putCards.length);
            if (Card.selectedCards.length === Game.putCards.length) {
                bAllToNormal = true;
                // log("ALL TO NORMAL");
            }
            Player.list[Player.current].cardList.forEach(c => {
                if (bAllToNormal && c.state !== Card.STATE.Chosen) {
                    // log("All to normal && !Chosen");
                    c.state = Card.STATE.Normal;
                } else if (c.name !== Card.selectedType && !IN(c.name,["JB","JR"]) && !IN(Card.selectedType,["JB","JR"])) {
                    if (c.state === Card.STATE.Choosable) {
                        // log(c.infos() +  ": c.name= != selectedType");
                        c.state = Card.STATE.Normal;
                    }
                }
            });
        } else if (pDirection === "d") { //? Card Down && at least another card is Chosen

            let bNormalCard = false;
            // log("----- DOWN CHECK OTHER CARDS -----");
            Player.list[Player.current].cardList.forEach(c => {
                if (c.state === Card.STATE.Chosen) {
                    if (!IN(c.name, ["JB","JR"])) {
                        bNormalCard = true;
                    }
                }
            });
            if (!bNormalCard) {
                Card.selectedType = "JB";

                Game.setChoosableCards();
            } else {
                Player.list[Player.current].cardList.forEach(c => {
                    if (c.state !== Card.STATE.Chosen) {
                        if (c.name === Card.selectedType || IN(c.name,["JB","JR"]) ) {
                            // log(c.infos() + " To choosable");
                            c.state = Card.STATE.Choosable;
                        }
                    }
                });
            }
        }
    }

    static checkCardToExchangeNb() {
        // log("------ checkCardToExchangeNb ------");
        let limit = Player.list[Player.current].lastRecord === 0 ? 2 : 1;
        // log("limit: " + limit);
        // log("selectedCards LENGTH: " + Card.selectedCards.length);
        if (Card.selectedCards.length >= limit) {
            // log("----------------------------------------------------");
            // log("------ LIMITE ATTEINTE - AUTORISER VALIDATION ------");
            // log("----------------------------------------------------");
            Game.validExchangeBtn.state = Button.STATE.Normal;
            Player.list[Player.current].cardList.forEach(c => {
                if (c.state !== Card.STATE.Chosen) {
                    c.state = Card.STATE.Normal;
                }
            });
        } else {
            // log("----------------------------------------------------");
            // log("------ !!!!! INVISIBLE !!!!! ------");
            // log("----------------------------------------------------");
            Game.validExchangeBtn.state = Button.STATE.Invisible;
            Player.list[Player.current].cardList.forEach(c => {
                if (c.state !== Card.STATE.Chosen) {
                    c.state = Card.STATE.Choosable;
                }
            });
        }
    }

    infos() {
        return this.name + "" + this.type;
    }
    nameType() {
        return this.name + "" + this.type;
    }

    setStartPos(pStartPos) {
        this.startPos = {
            x: pStartPos.x,
            y: pStartPos.y
        };
    }

    setOriginPos(pPos) {
        this.originPos = {
            x: pPos.x,
            y: pPos.y
        };
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

    setMovingType(pType) {
        this.movingType = pType;
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
    
    setMoveCB(pCallback, pParam = "") {
        if (pCallback == null) {
            this.moveCB = null;
        } else if (Array.isArray(pCallback)) {
            this.moveCB = [];
            pCallback.forEach(c => {
                this.moveCB.push({
                    cb: c.cb,
                    arg: c.arg
                });
            });
        } else {
            this.moveCB = {
                cb: pCallback,
                arg: pParam
            }
        }
    }

    // setDestination({ x: 0, y: CANVAS_HEIGHT - 124 });
    // setCanMove(true);
    // setMovingSpeed(0.6);
    // setMoveCB(Input.activeKeyboardBtn.bind(this), "");

    static setCardDitribution() {
        Card.cardDistribution["4"] = [14, 14, 13, 13];
        Card.cardDistribution["5"] = [11, 11, 11, 11, 10];
        Card.cardDistribution["6"] = [ 9,  9,  9,  9,  9,  9];
        Card.cardDistribution["7"] = [ 8,  8,  8,  8,  8,  7,  7];
    }

    static initCardList() {
        Card.bestList["3"] = 1;
        Card.bestList["4"] = 2;
        Card.bestList["5"] = 3;
        Card.bestList["6"] = 4;
        Card.bestList["7"] = 5;
        Card.bestList["8"] = 6;
        Card.bestList["9"] = 7;
        Card.bestList["10"] = 8;
        Card.bestList["J"] = 9;
        Card.bestList["Q"] = 10;
        Card.bestList["K"] = 11;
        Card.bestList["A"] = 12;
        Card.bestList["2"] = 13;
        Card.bestList["JR"] = 14;
        Card.bestList["JB"] = 15;

        Card.CARD_LIST = [];
        
        if (mainState === MAIN_STATE.Game) {

            Card.CARD_LIST["A♥"] = {name: "A",type: "♥",x: 0, y: 96};
            Card.CARD_LIST["2♥"] = {name: "2",type: "♥",x: 26,y: 96};
            Card.CARD_LIST["3♥"] = {name: "3",type: "♥",x: 52,y: 96};
            Card.CARD_LIST["4♥"] = {name: "4",type: "♥",x: 78,y: 96};
            Card.CARD_LIST["5♥"] = {name: "5",type: "♥",x: 104,y: 96};
            Card.CARD_LIST["6♥"] = {name: "6",type: "♥",x: 130,y: 96};
            Card.CARD_LIST["7♥"] = {name: "7",type: "♥",x: 156,y: 96};
            Card.CARD_LIST["8♥"] = {name: "8",type: "♥",x: 182,y: 96};
            Card.CARD_LIST["9♥"] = {name: "9",type: "♥",x: 208,y: 96};
            Card.CARD_LIST["10♥"] ={name: "10",type: "♥",x: 234,y: 96};
            Card.CARD_LIST["J♥"] = {name: "J",type: "♥",x: 260,y: 96};
            Card.CARD_LIST["Q♥"] = {name: "Q",type: "♥",x: 286,y: 96};
            Card.CARD_LIST["K♥"] = {name: "K",type: "♥",x: 312,y: 96};
            Card.CARD_LIST["A♠"] = {name: "A",type: "♠",x: 0, y: 134};
            Card.CARD_LIST["2♠"] = {name: "2",type: "♠",x: 26,y: 134};
            Card.CARD_LIST["3♠"] = {name: "3",type: "♠",x: 52,y: 134};
            Card.CARD_LIST["4♠"] = {name: "4",type: "♠",x: 78,y: 134};
            Card.CARD_LIST["5♠"] = {name: "5",type: "♠",x: 104,y: 134};
            Card.CARD_LIST["6♠"] = {name: "6",type: "♠",x: 130,y: 134};
            Card.CARD_LIST["7♠"] = {name: "7",type: "♠",x: 156,y: 134};
            Card.CARD_LIST["8♠"] = {name: "8",type: "♠",x: 182,y: 134};
            Card.CARD_LIST["9♠"] = {name: "9",type: "♠",x: 208,y: 134};
            Card.CARD_LIST["10♠"] ={name: "10",type: "♠",x: 234,y: 134};
            Card.CARD_LIST["J♠"] = {name: "J",type: "♠",x: 260,y: 134};
            Card.CARD_LIST["Q♠"] = {name: "Q",type: "♠",x: 286,y: 134};
            Card.CARD_LIST["K♠"] = {name: "K",type: "♠",x: 312,y: 134};
            Card.CARD_LIST["A♦"] = {name: "A",type: "♦",x: 0, y: 172};
            Card.CARD_LIST["2♦"] = {name: "2",type: "♦",x: 26,y: 172};
            Card.CARD_LIST["3♦"] = {name: "3",type: "♦",x: 52,y: 172};
            Card.CARD_LIST["4♦"] = {name: "4",type: "♦",x: 78,y: 172};
            Card.CARD_LIST["5♦"] = {name: "5",type: "♦",x: 104,y: 172};
            Card.CARD_LIST["6♦"] = {name: "6",type: "♦",x: 130,y: 172};
            Card.CARD_LIST["7♦"] = {name: "7",type: "♦",x: 156,y: 172};
            Card.CARD_LIST["8♦"] = {name: "8",type: "♦",x: 182,y: 172};
            Card.CARD_LIST["9♦"] = {name: "9",type: "♦",x: 208,y: 172};
            Card.CARD_LIST["10♦"] ={name: "10",type: "♦",x: 234,y: 172};
            Card.CARD_LIST["J♦"] = {name: "J",type: "♦",x: 260,y: 172};
            Card.CARD_LIST["Q♦"] = {name: "Q",type: "♦",x: 286,y: 172};
            Card.CARD_LIST["K♦"] = {name: "K",type: "♦",x: 312,y: 172};
            Card.CARD_LIST["A♣"] = {name: "A",type: "♣",x: 0, y: 210};
            Card.CARD_LIST["2♣"] = {name: "2",type: "♣",x: 26,y: 210};
            Card.CARD_LIST["3♣"] = {name: "3",type: "♣",x: 52,y: 210};
            Card.CARD_LIST["4♣"] = {name: "4",type: "♣",x: 78,y: 210};
            Card.CARD_LIST["5♣"] = {name: "5",type: "♣",x: 104,y: 210};
            Card.CARD_LIST["6♣"] = {name: "6",type: "♣",x: 130,y: 210};
            Card.CARD_LIST["7♣"] = {name: "7",type: "♣",x: 156,y: 210};
            Card.CARD_LIST["8♣"] = {name: "8",type: "♣",x: 182,y: 210};
            Card.CARD_LIST["9♣"] = {name: "9",type: "♣",x: 208,y: 210};
            Card.CARD_LIST["10♣"] ={name: "10",type: "♣",x: 234,y: 210};
            Card.CARD_LIST["J♣"] = {name: "J",type: "♣",x: 260,y: 210};
            Card.CARD_LIST["Q♣"] = {name: "Q",type: "♣",x: 286,y: 210};
            Card.CARD_LIST["K♣"] = {name: "K",type: "♣",x: 312,y: 210};
            Card.CARD_LIST["JR"] = {name: "JR",type: "R",x: 338,y: 96};
            Card.CARD_LIST["JB"] = {name: "JB",type: "B",x: 338,y: 134};
        }
    }

    update(dt) {
        if (this.bFaceDownMove) {
            if (this.speedCount <= this.movingSpeed) {
                this.x = this.tweeningLeave(this.speedCount, this.startPos.x, this.destination.x - this.startPos.x, this.movingSpeed);
                this.y = this.tweeningArrive(this.speedCount, this.startPos.y, this.destination.y - this.startPos.y, this.movingSpeed);

                this.speedCount += dt;
                if (this.speedCount > this.movingSpeed) {
                    this.x = this.destination.x;
                    this.y = this.destination.y;
                    this.bFaceDownMove = false;
                }
            }
        }
        if (this.bMoving) {
            // log("moving !! : " + this.infos());

            if (this.speedCount <= this.movingSpeed) {
                // log("speedcount < moving speed")

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

            }

        }
    }
}

Card.setCardDitribution();