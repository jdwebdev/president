class Player {
    static list = [];
    static current = 0;
    static POSITIONS = [];
    static winList = [];

    constructor(pName, pOrientation, pPos) {
        this.name = pName;
        this.cardList = [];
        this.orientation = pOrientation //? "v", "h". Vertical Horizontal
        this.pos = pPos
        this.bCurrent = false;
        this.bPass = false;
        this.records = [0,0,0,0];
        this.lastRecord = -1;
        this.centerPos = {x:0,y:0};
        this.labelPos = {x:0,y:0};
        this.offsetCrown = {x:0,y:0};
        this.bExchangeDone = false;
        this.cardToExchange = [];

        //? Avec CPU, désigne le joueur, toujours draw en bas :
        this.bPlayer = false;

        Player.list.push(this);
    }

    setPlayer() {
        this.bPlayer = true;
    }

    setCurrent(pBool) {
        this.bCurrent = pBool;
    }

    sortCards(pArray, pSortedArray, bAscending = true) {
        for (let i = pArray.length-1; i >= 0; i--) {
            if (i !== 0) {
                if (Card.bestList[pArray[i].name] < Card.bestList[pArray[i-1].name]) {
                    let tmp = pArray[i];
                    pArray[i] = pArray[i-1];
                    pArray[i-1] = tmp;
                }
            } else {
                if (bAscending) {
                    pSortedArray.push(pArray.shift());
                } else {
                    pSortedArray.unshift(pArray.shift());
                }
                if (pArray.length === 0) {
                    return pSortedArray;
                }
            }
        }
    
        this.sortCards(pArray, pSortedArray, bAscending);
    }

    setPosition(pNewPos) {
        this.pos = pNewPos;
    }
    setCenterPos(pPos) {
        this.centerPos.x = pPos.x;
        this.centerPos.y = pPos.y;
    }

    static changePositions() {

        let pos = "";
        let orientation = "";
        let posFromCurrent = "";
        for (let i = 0; i < Game.PLAYER_NUMBER; i++) {
            pos = "";

            if (i > Player.current) {
                posFromCurrent = i - Player.current - 1;
                pos = Game.PLAYER_NUMBER + "" + posFromCurrent;
            } else if (i !== Player.current) {
                posFromCurrent = Game.PLAYER_NUMBER-1 - Player.current - 1;
                posFromCurrent += i + 1;
                pos = Game.PLAYER_NUMBER + "" + posFromCurrent;
            }

            if (posFromCurrent === 0 || posFromCurrent === 4 || posFromCurrent === 5) orientation = "h";
            
            switch(Game.PLAYER_NUMBER) {
                case 4:
                    if (posFromCurrent === 1) orientation = "v";
                    if (posFromCurrent === 2) orientation = "h";
                    break;
                case 5: 
                    if (posFromCurrent === 1) orientation = "v";
                    if (posFromCurrent === 2) orientation = "v";
                    if (posFromCurrent === 3) orientation = "h";
                    break;
                case 6: 
                    if (posFromCurrent === 1) orientation = "h";
                    if (posFromCurrent === 2) orientation = "v";
                    if (posFromCurrent === 3) orientation = "v";
                    break;
                case 7: 
                    if (posFromCurrent === 1) orientation = "h";
                    if (posFromCurrent === 2) orientation = "v";
                    if (posFromCurrent === 3) orientation = "v";
                    break;
            }

            if (i === Player.current) orientation = "";

            Player.list[i].orientation = orientation;
            Player.list[i].pos = pos;

            // let player = new Player("P" + (i+1), orientation, pos);
        }
    }
    

    static setPositions() {
        let cardMiddle = 19;
        let offYTopCards = 10;

        Player.POSITIONS = {
            4: [{x: -cardMiddle, y: centerY()}, 
                {x: centerX(), y: offYTopCards}, 
                {x: CANVAS_WIDTH - cardMiddle, y: centerY()}
            ],
            5: [{x: -cardMiddle, y: centerY()}, 
                {x: centerX(0, CANVAS_WIDTH*0.25), y: offYTopCards}, 
                {x: centerX(0, CANVAS_WIDTH*0.25, 1), y: offYTopCards},
                {x: CANVAS_WIDTH - cardMiddle, y: centerY()}
            ],
            6: [{x: -cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25,1)}, 
                {x: -cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25)}, 
                {x: centerX(0, CANVAS_WIDTH*0.25), y: offYTopCards}, 
                {x: centerX(0, CANVAS_WIDTH*0.25, 1), y: offYTopCards},
                {x: CANVAS_WIDTH - cardMiddle, y: centerY()}
            ],
            7: [{x: -cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25,1)}, 
                {x: -cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25)},
                {x: centerX(0, CANVAS_WIDTH*0.25), y: offYTopCards},
                {x: centerX(0, CANVAS_WIDTH*0.25, 1), y: offYTopCards},
                {x: CANVAS_WIDTH - cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25)}, 
                {x: CANVAS_WIDTH - cardMiddle, y: centerY(0, CANVAS_HEIGHT*0.25,1)}
            ]
        };
    }
}
