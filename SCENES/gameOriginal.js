class Game {

    static STATE = Object.freeze({
        Main: 0,
        Ending: 1,
        CardExchange: 2
    });

    static currentState = Game.STATE.Main;
    static list = [];
    static exchangeList = [];
    static headerList = [];
    static menuList = [];
    
    static cardList = [];
    static lists = [];
    static DECK = null;
    static DECK2 = null;

    static DECK_TYPE = 0;
    static DECK2_TYPE = 1;
    static HEART_TYPE = 2;
    static SPADE_TYPE = 3;
    static DIAMOND_TYPE = 4;
    static CLUB_TYPE = 5;

    static HSDC_LIST = [];

    static bDeckHover = false;
    static bDeck2Hover = false;
    static hover = null;
    static bDisplayOkPanel = false;
    static listToGoTo = ""; 

    //? Ending
    static currentPosition = "";
    static timer = null;
    static timerBeforeEnd = null;
    static timerEnd = null;
    static timerLastCard = null;
    static timerPassExchange = null;
    static bStopDrawMouse = false;
    static bRestartPanelAlready = false;

    static bFirstTimeExchange = true;

    static movingList = [];
    static endingList = [];
    static recordSprites = [];

    static PLAYER_NUMBER = 5;

    static GAME_VOID = true;
    static putCards = [];
    static lastCard = {type: "", nb: 0};
    static lastPutPlayer = -1;
    

    constructor() {
    }

    static init() {

        if (Game.currentState === Game.STATE.Ending) {
            Game.currentState = Game.STATE.CardExchange;
        } else {
            Game.currentState = Game.STATE.Main;
        }

        canvas.style.backgroundColor = CANVAS_ORIGIN_COLOR;
        Card.list = [];
        Card.randomList = [];
        Game.movingList = [];
        Game.endingList = [];
        Card.inTransitionList = [];
        Game.list = [];
        Game.bRestartPanelAlready = false;

        
        Game.bStopDrawMouse = false;
        Button.list = [];
        Button.currentList = [];
        Panel.list = [];
        Panel.currentList = [];

        Game.currentPosition = "";
        Game.timer = null;
        Game.timerBeforeEnd = null;
        Game.timerEnd = null;
        Game.timerPassExchange = null;
        // Player.list = [];

        Game.lastCard = {type: "", nb: 0};

        let playerNb = Game.PLAYER_NUMBER;
        let orientation = "";
        let pos = "";
        let posFromCurrent;

        if (Player.list.length === 0) {
            for (let i = 0; i < playerNb; i++) {
                pos = "";
    
                if (i > Player.current) {
                    posFromCurrent = i - Player.current - 1;
                    pos = playerNb + "" + posFromCurrent;
                } else if (i !== Player.current) {
                    posFromCurrent = playerNb-1 - Player.current - 1;
                    posFromCurrent += i + 1;
                    pos = playerNb + "" + posFromCurrent;
                }
    
                if (posFromCurrent === 0 || posFromCurrent === 4 || posFromCurrent === 5) orientation = "h";
                
                switch(playerNb) {
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
    
                let player = new Player("P" + (i+1), orientation, pos);
                if (i === Player.current) player.setCurrent(true);
            }
        } else {
            Player.list.forEach(p => {
                p.setCurrent(false);
                p.bExchangeDone = false;
            });
            Player.current = Player.winList[Player.winList.length-1];
            Player.list[Player.current].setCurrent(true);
            Player.changePositions();
            // Player.winList = [];
        }

        if (0) { //? TEST RESULT PANEL
            let resultPanelHeight = (Player.list.length*14) + 8;
            Game.resultPanel = new Panel({ w: 180, h: resultPanelHeight }, centerX(180), centerY(resultPanelHeight)-10, null, "Game", Game.STATE.Main, "", Panel.TYPE.NormalShadowx2);
            Game.resultPanel.setIdTest("RESULT PANEL");
            Game.resultPanel.setDestination({ x: centerX(180), y: centerY(resultPanelHeight)});
            Game.resultPanel.setCanMove(true);
            Game.resultPanel.setMovingSpeed(0.8);
            Game.resultPanel.setMoving(true);
            Game.resultPanel.setAlpha(0);
            Game.resultPanel.fade(0.01);
            Panel.currentList.push(Game.resultPanel);
            Game.list.push(Game.resultPanel.getSprite());
    
            // log(Player.list.length)
            let offY = 1;
            let offX = 52;
            let animX = 80;
            let crownTachiY = 5;
            Player.list.forEach( (p,i) => {
                Game.PPanel = new Panel({ w: 10, h: 3 }, 10, offY, Game.resultPanel, "Game", Game.STATE.Main, "", Panel.TYPE.Transparent);
                Game.PPanel.setFreeLabel();
                Game.PPanel.setTextOverflow();
                Game.PPanel.changeLabel(p.name);
                Game.PPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
                Game.PPanel.setIdTest("P PANEL");
                Panel.currentList.push(Game.PPanel);
                Game.list.push(Game.PPanel.getSprite());
                offY += 14;
                animX = 80;
                offX = 45;
    
                let originSpX = 80 + (16*i);
                if (IN(i, [0,1,Player.list.length - 2, Player.list.length - 1])) {
                    if (i === Player.list.length - 2) originSpX = 80+(16*2);
                    if (i === Player.list.length - 1) originSpX = 80+(16*3);
                    let crown = new Sprite({ w: 16, h: 16 }, 22, crownTachiY, Game.resultPanel, "Game");
                    crown.setIdTest("crown");
                    crown.addAnimation("normal", { x: originSpX, y: 256 });
                    crown.changeAnimation("normal");
                    Game.list.push(crown);
                }
                for (let j = 0; j < 4; j++) {
                    let rightSprite = new Sprite({ w: 16, h: 16 }, offX, crownTachiY, Game.resultPanel, "Game");
                    rightSprite.setIdTest("rightSprite");
                    rightSprite.addAnimation("normal", { x: animX, y: 256 });
                    rightSprite.changeAnimation("normal");
                    Game.list.push(rightSprite);
    
                    let nbPanel = new Panel({ w: 20, h: 1 }, offX+12+(j>0?-2:0), crownTachiY, Game.resultPanel, "Game", Game.STATE.Main, "", Panel.TYPE.Transparent);
                    nbPanel.setFreeLabel();
                    nbPanel.setAlignText(0);
                    nbPanel.setTextOverflow();
                    nbPanel.setOffsets(4, 9)
                    nbPanel.changeLabel("x"+p.records[j]);
                    nbPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
                    nbPanel.setIdTest("nbPanel");
                    Panel.currentList.push(nbPanel);
                    Game.list.push(nbPanel.getSprite());
                    animX += 16;
                    offX += 32;
                }
    
                let verticalSeparation = new Sprite({ w: 1, h: 1 }, 39, 4, Game.resultPanel, "Game", {x: 1, y: Player.list.length*14});
                verticalSeparation.setIdTest("verticalSeparation");
                verticalSeparation.addAnimation("normal", { x: 44, y: 4 });
                verticalSeparation.changeAnimation("normal");
                Game.list.push(verticalSeparation);
    
    
                if (i < Player.list.length - 1) {
                    let separation = new Sprite({ w: 1, h: 1 }, 7, offY+2, Game.resultPanel, "Game", {x: 165, y: 1});
                    separation.setIdTest("SEPARATION");
                    separation.addAnimation("normal", { x: 44, y: 4 });
                    separation.changeAnimation("normal");
                    Game.list.push(separation);
                }
    
                crownTachiY += 14;
            });
        }

        if (1) { //? BUTTONS
            // let openMenuBtn = new Button({ w: 46, h: 24, v: 7}, 140, 2, null, { cb: Game.openMenu, arg: ""}, "Game", Game.STATE.Main, "MENU", 1); 
            // openMenuBtn.setIdTest("Open Menu");
            // openMenuBtn.setFreeLabel();
            // openMenuBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            // openMenuBtn.setTextCenterY();
            // Game.list.push(openMenuBtn.getSprite());
    
            // let goBtn = new Button({ w: 30, h: 20, v: 7}, 35, 180, null, { cb: Game.setChoosableCards, arg: ""}, "Game", Game.STATE.Main, "go", 1);
            // goBtn.setFreeLabel();
            // goBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            // goBtn.setTextCenterY();
            // Game.list.push(goBtn.getSprite());
    
            //TODO
            //! Si aucun choix possible => NO BTN => pass auto
            /*
            Si aucun choix possible => NO BTN => pass auto
            BTN :
                Si choix possible (no chosen)
                    => "PASS"
                    si firstTurn => NO BTN
                Si choix en cours (chosen) 
                    Chosen = nbPutCards && !FirstTurn => "PUT"
                    Chosen != nbPutCards => NO BTN
                    Chosen != nbPutCards && FirstTurn => "PUT"
            */

            Game.putPassBtn = new Button({ w: 40, h: 20, v: 7}, centerX(40), 160, null, { cb: Game.putCard, arg: ""}, "Game", Game.STATE.Main, "Put", 1);
            Game.putPassBtn.setIdTest("Put BTN");
            Game.putPassBtn.setFreeLabel();
            Game.putPassBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.putPassBtn.setTextCenterY();
            Game.list.push(Game.putPassBtn.getSprite());
            Game.putPassBtn.state = Button.STATE.Invisible;
    
            Game.validExchangeBtn = new Button({ w: 40, h: 20, v: 7}, centerX(40), 160, null, { cb: Game.nextPlayerExchange, arg: ""}, "CardExchange", Game.STATE.CardExchange, "Valid", 1);
            Game.validExchangeBtn.setIdTest("Valid BTN");
            Game.validExchangeBtn.setFreeLabel();
            Game.validExchangeBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.validExchangeBtn.setTextCenterY();
            Game.validExchangeBtn.state = Button.STATE.Invisible;
            Game.exchangeList.push(Game.validExchangeBtn.getSprite());

            let barre = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", {x: CANVAS_WIDTH, y: 29});
            barre.addAnimation("normal", { x: 48, y: 0 });
            barre.changeAnimation("normal");
            Game.headerList.push(barre);

            let pyBtn = 5;
            let p4Btn = new Button({ w: 20, h: 20, v: 7}, 5, pyBtn, null, { cb: Game.changePlayerNb, arg: 4}, "Game", Game.STATE.Main, "4", 1);
            p4Btn.setFreeLabel();
            p4Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            p4Btn.setTextCenterY();
            Game.headerList.push(p4Btn.getSprite());
    
            let p5Btn = new Button({ w: 20, h: 20, v: 7}, 30, pyBtn, null, { cb: Game.changePlayerNb, arg: 5}, "Game", Game.STATE.Main, "5", 1);
            p5Btn.setFreeLabel();
            p5Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            p5Btn.setTextCenterY();
            Game.headerList.push(p5Btn.getSprite());
    
            let p6Btn = new Button({ w: 20, h: 20, v: 7}, 55, pyBtn, null, { cb: Game.changePlayerNb, arg: 6}, "Game", Game.STATE.Main, "6", 1);
            p6Btn.setFreeLabel();
            p6Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            p6Btn.setTextCenterY();
            Game.headerList.push(p6Btn.getSprite());
    
            let p7Btn = new Button({ w: 20, h: 20, v: 7}, 80, pyBtn, null, { cb: Game.changePlayerNb, arg: 7}, "Game", Game.STATE.Main, "7", 1);
            p7Btn.setFreeLabel();
            p7Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            p7Btn.setTextCenterY();
            Game.headerList.push(p7Btn.getSprite());
    
        }


        let count = 1;
        let originX = 0;
        let originY = 0;
        let yOffset = 70;
        let testX = 0
        for (let card in Card.CARD_LIST) {
            let c = Card.CARD_LIST[card];
            count++
            let newCard = new Card("", c.name, c.type, c.x, c.y);
            newCard.getSprite().setParent(newCard);
            newCard.getSprite().setIdTest(count);
        }
        
        let testArr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
        let newRndArr = Card.randomizer(testArr, testArr.length);

        //! TESTING ---------
        //! 3 : 1 15 28 41
        // newRndArr = [0,1,15, 28,    2,3,4,5,6,7,8,9,10,11,12,13,  41, 52,14,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46,47,48,49,50,51,53];
        // newRndArr = [0,1,15, 28,    2,3,4,5,6,7,8,9,10,11,12,13,  41, 52,14,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46,47,48,49,50,51,53];
        //! -----------------

        //? Contient le nombre de joueurs de 0 à nbJoueurs-1
        testArr = [];
        for (let i = 0; i < Player.list.length; i++) {
            testArr.push(i);
        }
        //? Array random de 0 à nbJoueurs-1, ex: 4 2 0 3 1 pour 5 joueurs 
        testArr = randomizer(testArr, testArr.length);
        // log(testArr);

        //? Permet ensuite une distribution aléatoire du nombre de cartes
        //? Ex : Pour 4 joueurs : 14 14 13 13 => 14 13 13 14 ou 13 13 14 14 etc.
        //? Afin d'éviter que ce soit toujours les mêmes joueurs qui aient le plus ou le moins de cartes
        let distributionCardList = [];
        for (let i = 0; i < testArr.length; i++) {
            distributionCardList.push(Card.cardDistribution[Player.list.length][testArr[i]]);
        }

        let distributedCards = 0
        let currentPlayer = 0;


        // log("Distribution card list : ");
        // log(distributionCardList);


        // for (let i = 0; i < 54; i++) {
        //     Card.randomList.push(Card.list[newRndArr[i]]);
        //     Player.list[currentPlayer].cardList.push(Card.list[newRndArr[i]]);
        //     distributedCards++;
        //     if (distributedCards === distributionCardList[currentPlayer]) {
        //         distributedCards = 0;
        //         currentPlayer++;
        //     }
        // }

        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        // let forDebugList = [2,3,4,5]
        // let forDebugList = [2,3,4,5,6,7,8,9]
        currentPlayer = 0;
        let nbOfCards = Game.PLAYER_NUMBER*3; //? 12 pour 4 | 15 pour 5 etc.   *3 pour le nb de carte par joueur
        for (let i = 0; i < nbOfCards; i++) {
            Card.randomList.push(Card.list[newRndArr[i]]);
            Player.list[currentPlayer].cardList.push(Card.list[newRndArr[i]]);
            // Player.list[currentPlayer].cardList.push(Card.list[forDebugList[i]]); //! forDebugList !
            distributedCards++;
            if (distributedCards === (nbOfCards/Game.PLAYER_NUMBER)) {
                distributedCards = 0;
                currentPlayer++;
            }
        }
        //!----------------


        // log(Card.randomList);
        // log(Player.list);

        Player.list.forEach(p => {
            // log(p.cardList);
            let newArray = [];
            p.sortCards(p.cardList, newArray);
            p.cardList = newArray;
        });

        // Game.test = new Sprite({ w: 1, h: 1 }, 30, 109, null, "", {x: 30, y: 2});
        // Game.test.addAnimation("normal", { x: 48, y: 0 });
        // Game.test.changeAnimation("normal");
        // Game.list.push(Game.test);

        Game.recordSprites = [];
        let animX = 0
        for (let i = 0; i < 4; i++) {
            let record = new Sprite({ w: 16, h: 16 }, 30, 109, null, "");
            record.addAnimation("normal", { x: 80+animX, y: 256 });
            record.changeAnimation("normal");
            Game.recordSprites.push(record);
            animX += 16;
        }

        Game.goldCrown = new Sprite({ w: 22, h: 21 });
        Game.goldCrown.addAnimation("normal", {x: 80, y: 272 });
        Game.goldCrown.changeAnimation("normal");

        Game.silverCrown = new Sprite({ w: 22, h: 21 });
        Game.silverCrown.addAnimation("normal", {x: 102, y: 272 });
        Game.silverCrown.changeAnimation("normal");

        //!---

        Game.cardHorizontal = new Sprite({ w: 34, h: 24 }, -19, 30, null);
        Game.cardHorizontal.addAnimation("normal", { x: 368, y: 96 });
        Game.cardHorizontal.changeAnimation("normal");

        Game.cardVertical = new Sprite({ w: 24, h: 34 }, 100, 10, null);
        Game.cardVertical.addAnimation("normal", { x: 368, y: 120 });
        Game.cardVertical.changeAnimation("normal");

        Game.choosableCard = new Sprite({ w: 25, h: 37 }, 100, 10, null);
        Game.choosableCard.addAnimation("normal", { x: 240, y: 59 });
        Game.choosableCard.changeAnimation("normal");

        Game.chosenCard = new Sprite({ w: 25, h: 37 }, 100, 10, null);
        Game.chosenCard.addAnimation("normal", { x: 265, y: 59 });
        Game.chosenCard.changeAnimation("normal");


        Game.initCardPositions();
        if (Game.currentState === Game.STATE.Main) {
            Game.setChoosableCards();
            Button.resetTypeState("Game", Game.STATE.Main);
            Panel.resetTypeState("Game", Game.STATE.Main);
        } else if (Game.currentState === Game.STATE.CardExchange) {
            Game.setChoosableForExchangeCard();
            Button.resetTypeState("CardExchange", Game.STATE.CardExchange);
            Panel.resetTypeState("CardExchange", Game.STATE.CardExchange);
        }

    }

    static nextPlayer() {
        Game.resetAllCardsState();

        Player.list.forEach(p => {
            p.setCurrent(false);
        });
        let bEnd = false;
        while(!bEnd) {
            Player.current++;
            if (Player.current === Game.PLAYER_NUMBER) {
                Player.current = 0;
            }
            if (Player.list[Player.current].cardList.length > 0) {
                Player.list[Player.current].setCurrent(true);
                bEnd = true;
            }
            if (Game.lastPutPlayer === Player.current) {
                TRANSITION = true;
                Game.timerLastCard = new Timer(1, Game.samePlayerAfterTimer.bind(Game));
            }
        }
        
        Player.changePositions();
        Game.initCardPositions();
        
        Game.setChoosableCards();

        Player.list[Player.current].cardList.forEach(c => {
            if (c.boxCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y)) {
                // log("Collision with: " + c.infos());
                c.state = Card.STATE.Hover;
                c.y = c.hoverY;
            }
        });
    }
    static resetAllCardsState() {
        Player.list[Player.current].cardList.forEach(c => {
            c.state = Card.STATE.Normal;
        });
    }

    static putCard() {

        if (Card.selectedCards.length === 0 || Card.selectedCards.length < Game.putCards.length) { //? PASS
            Game.nextPlayer();
            return;
        }

        Game.lastPutPlayer = Player.current;

        Game.putCards = [];
        Player.list[Player.current].cardList = Player.list[Player.current].cardList.filter(c => {
            if (c.state === Card.STATE.Chosen) Game.putCards.push(c);
            return c.state !== Card.STATE.Chosen;
        });
        Card.selectedCards = [];

        let bEnd = false;
        if (Player.list[Player.current].cardList.length === 0) {
            // log("P" + Player.current + " END ! ");
            
            Player.winList.push(Player.current);
            
            if (Player.winList.length === (Player.list.length - 1)) {
                bEnd = true;
                for (let i = 0; i < Player.list.length; i++) {
                    if(!Player.winList.includes(i)) Player.winList.push(i);
                }
                // MOUSE_SPRITE.changeAnimation("normal");
                Game.timerEnd = new Timer(0.5, Game.end.bind(Game));
            }

        }

        if (!bEnd) {
            if (IN(Card.selectedType,["2","JB","JR"])) {
                TRANSITION = true;
                Card.selectedType = "";
                Game.initCardPositions();
                Game.timerLastCard = new Timer(1, Game.samePlayerAfterTimer.bind(Game));
            } else {
                Card.selectedType = "";
                Game.nextPlayer();
            }
        }

        // Game.initCardPositions();
    }

    static setChoosableCards() {
        // log("----- setChoosableCards -----");

        let notJokerCard = 0;
        let jokerCard = 0;
        let jokerPositions = [];

        if (Game.putCards.length === 0) {
            // Game.nextBtn.state = Button.STATE.Invisible;
            Game.putPassBtn.state = Button.STATE.Invisible;
        } else {
            // Game.nextBtn.state = Button.STATE.Normal;
            Game.putPassBtn.setLabel("Pass");
            Game.putPassBtn.state = Button.STATE.Normal;
        }
        // log("player current : " + Player.current);
        Player.list[Player.current].cardList.forEach( (c,i) => {
            if (Game.putCards.length === 0) {
                if (c.state === Card.STATE.Normal) {
                    // log("ALL to Choosable")
                    c.state = Card.STATE.Choosable;
                }
            } else {
                if (Card.bestList[c.name] > Card.bestList[Game.putCards[0].name]) {
                    // log("sup > card : " + Card.bestList[c.name] + " > " + Card.bestList[Game.putCards[0].name])
                    if (Game.nbOfOneCard(c.name) >= Game.putCards.length || IN(c.name,["JB","JR"])) {
                        if (c.state !== Card.STATE.Chosen) { //! check down
                            c.state = Card.STATE.Choosable;
                            if (!IN(c.name,["JR","JB"])) notJokerCard++;
                            if (IN(c.name,["JR","JB"])) jokerCard++; jokerPositions.push(i);
                        }
                    }
                }
            }
        });

        // log("JOKER : " + jokerCard);
        // log("NOT JOKER : " + notJokerCard);
        if (jokerCard > 0 && jokerCard+notJokerCard < Game.putCards.length) { //? jokerCard > 0 que si s'il est choosable
            jokerPositions.forEach(i => {
                Player.list[Player.current].cardList[i].state = Card.STATE.Normal;
            });
        }
    }

    static setChoosableForExchangeCard() {
        // log("----- setChoosableForExchangeCard -----");
        let lastRecord = Player.list[Player.current].lastRecord;

        // log("Current: " + Player.current);
        // log("Last record : " + lastRecord);

        Player.list[Player.current].cardList.forEach( (c,i) => {
            switch(lastRecord) {
                case 0:
                    if (c.state !== Card.STATE.Chosen) c.state = Card.STATE.Choosable;
                    break;
                case 1:
                    if (c.state !== Card.STATE.Chosen) c.state = Card.STATE.Choosable;
                    break;
                case 2:
                    if (i === Player.list[Player.current].cardList.length - 1) {
                        c.y = c.chosenY;
                        c.state = Card.STATE.Chosen;
                        Player.list[Player.current].cardToExchange.push(c);
                    }
                    break;
                case 3:
                    if (IN(i, [Player.list[Player.current].cardList.length - 2, Player.list[Player.current].cardList.length - 1])) {
                        c.y = c.chosenY;
                        c.state = Card.STATE.Chosen;
                        Player.list[Player.current].cardToExchange.push(c);
                        TRANSITION = true;
                        Game.timerPassExchange = new Timer(1,Game.nextPlayerExchange.bind(Game));
                    }
                    break;
                case -1:
                    TRANSITION = true;
                    Game.timerPassExchange = new Timer(1,Game.nextPlayerExchange.bind(Game));
                    break;
            }

        });
        Player.list[Player.current].bExchangeDone = true;
    }

    static nextPlayerExchange() {

        Game.validExchangeBtn.state = Button.STATE.Invisible;

        Card.selectedCards = [];

        Game.timerPassExchange = null;
        TRANSITION = false;

        Player.list[Player.current].cardList = Player.list[Player.current].cardList.filter(c => {
            return c.state !== Card.STATE.Chosen;
        });

        Card.list.forEach(c => {
            c.state = Card.STATE.Normal;
        });

        Player.list.forEach(p => {
            p.setCurrent(false);
        });


        Player.current++;
        if (Player.current > Player.list.length-1) {
            Player.current = 0;
        }
        Player.list[Player.current].setCurrent(true);
        if (Player.list[Player.current].bExchangeDone) { //? Player déjà "Done", donc échange terminé

            let firstPlayer = Player.list[Player.winList[0]];
            let secondPlayer = Player.list[Player.winList[1]];
            let penulPlayer = Player.list[Player.winList[Player.list.length-2]];
            let lastPlayer = Player.list[Player.winList[Player.list.length-1]];
            Player.winList = [];

            //! give players their cards => animation => fin => transition new game
            firstPlayer.cardList.push(lastPlayer.cardToExchange.pop());
            firstPlayer.cardList.push(lastPlayer.cardToExchange.pop());

            secondPlayer.cardList.push(penulPlayer.cardToExchange.pop());

            penulPlayer.cardList.push(secondPlayer.cardToExchange.pop());

            lastPlayer.cardList.push(firstPlayer.cardToExchange.pop());
            lastPlayer.cardList.push(firstPlayer.cardToExchange.pop());

            //? Uniquement Player current
            Game.resetAllCardsState();

            //? re-sort the cards for each player
            Player.list.forEach(p => {
                let newArray = [];
                p.sortCards(p.cardList, newArray);
                p.cardList = newArray;
            });

            Player.list.forEach(p => {
                p.bExchangeDone = false;
                p.cardList.forEach( (c,i) => {
                    if (i < p.cardList.length-1) {
                        c.setNotRightBoxColliders();
                    }
                });
            });
            

            Game.currentState = Game.STATE.Main;
            
            Card.selectedType = "";
            Player.changePositions();
            Game.initCardPositions();
            Game.setChoosableCards();

            Button.resetTypeState("Game", Game.STATE.Main);
            Panel.resetTypeState("Game", Game.STATE.Main);

        } else {

            // if (Player.list[Player.current].lastRecord === Player.list.length -2) {
            if (Player.list[Player.current].lastRecord === 2) { //? Avant dernier
                // log(Player.list[Player.current].name + ": PLAYER LAST RECORD === PLAYER LIST LENGTH -2");
                TRANSITION = true;
                Game.timerPassExchange = new Timer(1,Game.nextPlayerExchange.bind(Game));
            }

            Card.selectedType = "";
            Player.changePositions();
            Game.initCardPositions();
            Game.setChoosableForExchangeCard();
        }

    }

    static nbOfOneCard(pName) {
        let count = 0;
        Player.list[Player.current].cardList.forEach(c => {

            //? if JOKER ?

            if (c.name === pName || IN(c.name,["JB","JR"])) {
                count++
            }
        });
        // log("before return count : " + pName + " x" + count);
        return count;
    }

    static samePlayerAfterTimer() {
        TRANSITION = false;
        Game.timerLastCard = null;
        Game.putCards = [];

        if (Player.list[Player.current].cardList.length === 0) {
            Card.selectedType = "";
            Game.nextPlayer();
        } else {
            
            Game.setChoosableCards();
            Player.list[Player.current].cardList.forEach(c => {
                if (c.boxCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y)) {
                    c.state = Card.STATE.Hover;
                    c.y = c.hoverY;
                }
            });
        }

    }

    static initCardPositions() {
        // let index = 0;
        let space;
        let offX; let offY;
        let cardX;

        Player.list.forEach( (p, index) => {
            if (index === Player.current) {
                space = 12;
                offX = centerX(space * (p.cardList.length+1)); 
                p.setCenterPos({x:centerX(16), y:CANVAS_HEIGHT - 55});
                p.cardList.forEach( (c, i) => {
                    c.x = offX;
                    c.y = CANVAS_HEIGHT - 30;
                    c.setYPositions(c.y);
                    offX += space;
                    if (i === p.cardList.length-1) {
                        c.setMostRightBoxColliders();
                    }
                });
            } else {
                if (p.orientation === "h") {
                    space = IN(p.pos, ["40","50","42","53","64"]) ? 10 : 6;
                    cardX = IN(p.pos[1], ["0","1"]) ? -17 : CANVAS_WIDTH -16;

                    p.offsetCrown.x = IN(p.pos,["40","50","60","61","70","71"]) ? 1 : CANVAS_WIDTH - 24;

                    if (IN(p.pos, ["40","50","42","53","64"])) { //! +0 POS[4][0] ; POS[5][0] ; POS[4][2] ; POS[5][3] ; POS[6][4] 
                        offY = centerY(space * (p.cardList.length));
                        p.setCenterPos({x:cardX < 0 ? cardX+40 : cardX -20, y:offY + (space * (p.cardList.length)/2)});
                    } else if (IN(p.pos, ["60","70","75"])) { //! +1 POS[6][0] ; POS[7][0] ; POS[7][5]
                        offY = centerY(space * (p.cardList.length+1), CANVAS_WIDTH*0.25, 1);
                        p.setCenterPos({x:cardX < 0 ? cardX+40 : cardX -20, y:offY + (space * (p.cardList.length+1)/2)});
                    } else if (IN(p.pos, ["61","71","74"])) { //! -2 POS[6][1] ; POS[7][1] ; POS[7][4]
                        offY = centerY(space * (p.cardList.length-2), CANVAS_WIDTH*0.25);
                        // p.setCenterPos({x:cardX < 0 ? cardX+40 : cardX -20, y:offY + (space * (p.cardList.length-2)/2)});
                        p.setCenterPos({x:cardX < 0 ? cardX+40 : cardX -20, y:offY + (space * (p.cardList.length+1)/2)});
                    }
                    p.cardList.forEach(c => {
                        c.x = cardX;
                        c.y = offY;
                        offY += space;
                    });
                } else if (p.orientation === "v") {
                    space = (Game.PLAYER_NUMBER === 4) ? 10 : 6;

                    if (p.pos === "41") { //! +2 POS[4][1]
                        offX = centerX(space * (p.cardList.length+2));
                        p.setCenterPos({x:(offX+space * (p.cardList.length+2)/2)-8, y:50});
                    } else if (IN(p.pos,["51","62","72"])) { //! +2  POS[5][1] ; POS[6][2] ; POS[7][2]
                        offX = centerX(space * (p.cardList.length+2), CANVAS_WIDTH*0.25);
                        p.setCenterPos({x:(offX+space * (p.cardList.length+2)/2)-8, y:50});
                    } else if (IN(p.pos,["52","63","73"])) { //! +3  POS[5][2] ; POS[6][3] ; POS[7][3]
                        offX = centerX(space * (p.cardList.length+3), CANVAS_WIDTH*0.25,1);
                        p.setCenterPos({x:(offX+space * (p.cardList.length+3)/2)-8, y:50});
                    }
                    
                    p.cardList.forEach(c => {
                        c.x = offX;
                        c.y = 10;
                        offX += space;
                    });
                }
            }
            // index++;
        });
    }

    static changePlayerNb(pNb) {
        Game.currentState = Game.STATE.Main
        Player.list = [];
        Player.winList = [];
        Game.PLAYER_NUMBER = pNb;
        Game.init();
    }

    static openMenu() {

        MENU = true;

        Game.BG = new Sprite({ w: 1, h: 1 }, 0, 0, null, "MENU", { x: CANVAS_WIDTH, y: CANVAS_HEIGHT });
        Game.BG.addAnimation("normal", { x: 160, y: 0 });
        Game.BG.changeAnimation("normal");
        Game.BG.setAlpha(0);
        Game.BG.fade(0.01);
        Game.menuList.push(Game.BG);

        //?{ w: 170, h: 70, v: 7 }, centerX(170), -10
        Game.menuPanel = new Panel({ w: 170, h: 70, v: 7 }, centerX(170), -70, null, "MENU", Game.STATE.Main, "", Panel.TYPE.Normal);
        Game.menuPanel.setIdTest("menu PANEL");

        Game.menuPanel.setDestination({ x: centerX(170), y: -10});
        Game.menuPanel.setCanMove(true);
        Game.menuPanel.setMovingSpeed(0.3);
        Game.menuPanel.setMoving(true);

        Panel.currentList.push(Game.menuPanel);
        Game.menuList.push(Game.menuPanel.getSprite());


        Game.NormalModeBtn = new Button({ w: 60, h: 24, v: 7}, 19, 14, Game.menuPanel, { cb: Game.menuCB, arg: 1}, "MENU", Game.STATE.Main, "NORMAL", 1); //? 1 : btn style CARD
        Game.NormalModeBtn.setIdTest("Normal");
        Game.NormalModeBtn.setFreeLabel();
        Game.NormalModeBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        Game.NormalModeBtn.setTextCenterY();
        Button.currentList.push(Game.NormalModeBtn);
        Game.menuList.push(Game.NormalModeBtn.getSprite());

        Button.currentList.forEach(b => {
            if (b.type != "MENU") {
                b.setState(Button.STATE.Inactive);
            }
        });

    }

    static closeMenu() {
        MENU = false;
        Game.menuPanel.setMoveCB(Game.menuPanel.delete.bind(Game.menuPanel), "");
        Game.menuPanel.setStartPos({x: centerX(170), y: -10});
        Game.menuPanel.setDestination({x: centerX(170), y: -70}); //? centerX(300), -100
        Game.menuPanel.setCanMove(true);
        Game.menuPanel.setMoving(true);

        Game.BG.delete = true;
        Button.currentList.forEach(b => {
            b.setState(Button.STATE.Normal);
        });
    }

    static menuCB(nBtn) {}

    static checkEnd() {}

    static end() {
        MOUSE_SPRITE.changeAnimation("normal");
        Game.timerEnd = null;
        let winList = "";
        Player.winList.forEach(p => {
            winList += "" + p;
        });

        Game.currentState = Game.STATE.Ending;
        Player.list.forEach(p => {
            p.cardList = [];
        })
        Game.putCards = [];

        let resultPanelHeight = (Player.list.length*14) + 8;
        Game.resultPanel = new Panel({ w: 180, h: resultPanelHeight }, centerX(180), centerY(resultPanelHeight)-10, null, "Ending", Game.STATE.Ending, "", Panel.TYPE.NormalShadowx2);
        Game.resultPanel.setIdTest("RESULT PANEL");
        Game.resultPanel.setDestination({ x: centerX(180), y: centerY(resultPanelHeight)});
        Game.resultPanel.setCanMove(true);
        Game.resultPanel.setMovingSpeed(0.8);
        Game.resultPanel.setMoving(true);
        Game.resultPanel.setAlpha(0);
        Game.resultPanel.fade(0.01);
        Panel.currentList.push(Game.resultPanel);
        Game.endingList.push(Game.resultPanel.getSprite());
        
        let offY = 1;
        let offX = 52;
        let animX = 80;
        let crownTachiY = 5;
        Player.winList.forEach( (p,i) => {
            Game.PPanel = new Panel({ w: 10, h: 3 }, 10, offY, Game.resultPanel, "Ending", Game.STATE.Ending, "", Panel.TYPE.Transparent);
            Game.PPanel.setFreeLabel();
            Game.PPanel.setTextOverflow();
            Game.PPanel.changeLabel(Player.list[p].name);
            Game.PPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
            Game.PPanel.setIdTest("P PANEL");
            Panel.currentList.push(Game.PPanel);
            Game.endingList.push(Game.PPanel.getSprite());
            offY += 14;
            animX = 80;
            offX = 45;

            let originSpX = 80 + (16*i);
            if (IN(i, [0,1,Player.list.length - 2, Player.list.length - 1])) {
                // log("IN 01 23")
                if (i === 0) {
                    Player.list[p].records[0]++;
                    Player.list[p].lastRecord = 0;
                }
                if (i === 1) {
                    Player.list[p].records[1]++;
                    Player.list[p].lastRecord = 1;
                }
                if (i === Player.list.length - 2) {
                    originSpX = 80+(16*2);
                    Player.list[p].records[2]++;
                    Player.list[p].lastRecord = 2;
                }
                if (i === Player.list.length - 1) {
                    originSpX = 80+(16*3);
                    Player.list[p].records[3]++;
                    Player.list[p].lastRecord = 3;
                }
                let crown = new Sprite({ w: 16, h: 16 }, 22, crownTachiY, Game.resultPanel, "Ending");
                crown.setIdTest("crown");
                crown.addAnimation("normal", { x: originSpX, y: 256 });
                crown.changeAnimation("normal");
                Game.endingList.push(crown);
            } else {
                Player.list[p].lastRecord = -1;
            }
            for (let j = 0; j < 4; j++) {
                let rightSprite = new Sprite({ w: 16, h: 16 }, offX, crownTachiY, Game.resultPanel, "Ending");
                rightSprite.setIdTest("rightSprite");
                rightSprite.addAnimation("normal", { x: animX, y: 256 });
                rightSprite.changeAnimation("normal");
                Game.endingList.push(rightSprite);

                let nbPanel = new Panel({ w: 20, h: 1 }, offX+12+(j>0?-2:0), crownTachiY, Game.resultPanel, "Ending", Game.STATE.Ending, "", Panel.TYPE.Transparent);
                nbPanel.setFreeLabel();
                nbPanel.setAlignText(0);
                nbPanel.setTextOverflow();
                nbPanel.setOffsets(4, 9)
                nbPanel.changeLabel("x"+Player.list[p].records[j]);
                nbPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
                nbPanel.setIdTest("nbPanel");
                Panel.currentList.push(nbPanel);
                Game.endingList.push(nbPanel.getSprite());
                animX += 16;
                offX += 32;
            }

            let verticalSeparation = new Sprite({ w: 1, h: 1 }, 39, 4, Game.resultPanel, "Ending", {x: 1, y: Player.list.length*14});
            verticalSeparation.setIdTest("verticalSeparation");
            verticalSeparation.addAnimation("normal", { x: 44, y: 4 });
            verticalSeparation.changeAnimation("normal");
            Game.endingList.push(verticalSeparation);


            if (i < Player.list.length - 1) {
                let separation = new Sprite({ w: 1, h: 1 }, 7, offY+2, Game.resultPanel, "Ending", {x: 165, y: 1});
                separation.setIdTest("SEPARATION");
                separation.addAnimation("normal", { x: 44, y: 4 });
                separation.changeAnimation("normal");
                Game.endingList.push(separation);
            }

            crownTachiY += 14;
        });

        let newBtn = new Button({ w: 30, h: 20, v: 7}, 35, 180, null, { cb: Game.init, arg: ""}, "Ending", Game.STATE.Ending, "new", 1);
        newBtn.setFreeLabel();
        newBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        newBtn.setTextCenterY();
        Game.endingList.push(newBtn.getSprite());


        Button.resetTypeState("Ending", Game.STATE.Ending);
        Panel.resetTypeState("Ending", Game.STATE.Ending);
    }

    static stopTimerBeforeEnd() {

        Game.currentState = Game.STATE.Ending;
        Game.timerBeforeEnd = null;

        canvas2.style.display = "block";
    }

    static throwCard() {

        if (Game.lists["♥"].length === 0 &&
        Game.lists["♠"].length === 0 &&
        Game.lists["♦"].length === 0 &&
        Game.lists["♣"].length === 0) {
            Game.timer = null;
            return;
        }

        if (Game.currentPosition !== "") {
            switch(Game.currentPosition) {
                case "♥": Game.currentPosition = "♠"; break;
                case "♠": Game.currentPosition = "♦"; break;
                case "♦": Game.currentPosition = "♣"; break;
                case "♣": Game.currentPosition = "♥"; break;
            }
        } else {
            Game.currentPosition = "♥";
        }

        let card = Game.lists[Game.currentPosition][Game.lists[Game.currentPosition].length-1].parent;

        let newSprite = new Sprite({ w: 24, h: 32 }, card.x, card.y, null, "end"); //? Moving Card
        newSprite.addAnimation("normal", { x: card.sp.getAnimation("normal").origin.x, y: card.sp.getAnimation("normal").origin.y});
        newSprite.changeAnimation("normal");
        newSprite.sx = rnd(3, 26) / 10; //! sx = (-0.5 => -2.5 || 0.5 => 2.5)
        if (isPair(rnd(1,101))) newSprite.sx *= -1;
        newSprite.sy = (rnd(10, 41) / 10) *-1; //! sy = (-1.0 => -4.0)
        Game.endingList.push(newSprite);

        Game.lists[Game.currentPosition].pop();

        if (!Game.bRestartPanelAlready) {
            Game.bRestartPanelAlready = true;
            Game.restartPanel = new Panel({ w: 90, h: 44 }, centerX(90), CANVAS_HEIGHT + 44, null, "all", 0, "", 0, true);
            Game.restartPanel.setIdTest("RESTART PANEL");
            Game.restartPanel.getSprite().addAnimation("normal", {x: 144, y: 16});
            Game.restartPanel.getSprite().changeAnimation("normal");
            Game.restartPanel.setDestination({ x: centerX(90), y: 170});
            Game.restartPanel.setCanMove(true);
            Game.restartPanel.setMovingSpeed(0.5);
            Game.restartPanel.setMoving(true);
            Panel.currentList.push(Game.restartPanel);

            Game.restartBtn = new Button({ w: 60, h: 24, v: 7}, 14, 9, Game.restartPanel, { cb: Game.init, arg: ""}, "Game", Game.STATE.Main, "RESTART", 1); //? 1 : btn style CARD
            Game.restartBtn.setFreeLabel();
            Game.restartBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.restartBtn.setTextCenterY();
            Button.currentList.push(Game.restartBtn);
            // Game.restartBtn.setState(Button.STATE.Inactive);
        }
    }

    static getLastOf(pList) {
        return Game.lists[pList][Game.lists[pList].length-1].getParent();
    }

    static getStateInfo() {
        switch(Game.currentState) {
            case Game.STATE.Main: return "Main"; break;
            case Game.STATE.Ending: return "Ending"; break;
            case Game.STATE.CardExchange: return "Exchange"; break;
            default: return "Unknown State: " + Game.currentState;
        }
    }

    static update(dt) {

        if (Game.timer !== null && Game.currentState === Game.STATE.Ending) Game.timer.update(dt);
        if (Game.timerBeforeEnd !== null) Game.timerBeforeEnd.update(dt);
        if (Game.timerLastCard !== null) Game.timerLastCard.update(dt);
        if (Game.timerEnd !== null) Game.timerEnd.update(dt);
        if (Game.timerPassExchange !== null) Game.timerPassExchange.update(dt);

        Player.list[Player.current].cardList.forEach(c => {
            
        });

        Sprite.manageBeforeUpdating(Game.cardList, dt);
        switch(Game.currentState) {
            case Game.STATE.Main:
                Sprite.manageBeforeUpdating(Game.list, dt);
                break;
            case Game.STATE.Ending:
                Sprite.manageBeforeUpdating(Game.endingList, dt);
                break;
            case Game.STATE.CardExchange:
                Sprite.manageBeforeUpdating(Game.exchangeList, dt);
                break;
        }
        Sprite.manageBeforeUpdating(Game.movingList, dt);
        // Sprite.manageBeforeUpdating(Game.endingList, dt);
        Sprite.manageBeforeUpdating(Game.menuList, dt);
        Sprite.manageBeforeUpdating(Game.headerList, dt);

        Panel.currentList.forEach(p => {
            p.update(dt)
        });

        Game.cardList = Game.cardList.filter(sp => {
            return !sp.delete;
        });
        Game.list = Game.list.filter(sp => {
            return !sp.delete;
        });
        Game.movingList = Game.movingList.filter(sp => {
            return !sp.delete;
        });
        Game.endingList = Game.endingList.filter(sp => {
            return !sp.delete;
        });
        Game.exchangeList = Game.exchangeList.filter(sp => {
            return !sp.delete;
        });
        Game.menuList = Game.menuList.filter(sp => {
            return !sp.delete;
        });
        Game.headerList = Game.headerList.filter(sp => {
            return !sp.delete;
        });
    }

    static draw(ctx) {
        // Panel.currentList.forEach(p => {
        //     p.update(dt)
        // });
        ctx.font = "10px jpfont";

        let bOk = true;

        if (Game.currentState != Game.STATE.Ending) {
            Player.list.forEach( (p,i) => {
                bOk = true;
                if (Game.currentState === Game.STATE.Main) {
                    if (Player.winList.length >= 1) {
                        if (Player.winList[0] === i) {
                            if (p.orientation === "h") {
                                Game.goldCrown.x = p.offsetCrown.x;
                                Game.goldCrown.y = p.centerPos.y-3;
                            } else {
                                Game.goldCrown.x = p.centerPos.x-3;
                                Game.goldCrown.y = 30;
                            }
                            if (Game.timerLastCard !== null && Player.winList.length === 1) {
                                if (Game.putCards.length > 0 && !IN(Game.putCards[0].name,["2","JB","JR"])) {
                                    // log("putCards length > 0! + NOT INT 2 JB JR ??? : " + Game.putCa)
                                    Game.goldCrown.draw(ctx);
                                }
                            } else {
                                Game.goldCrown.draw(ctx);
                            }
                            bOk = false;
                        }
                    }
                    if (Player.winList.length >= 2) {
                        if (Player.winList[1] === i) {
                            if (p.orientation === "h") {
                                Game.silverCrown.x = p.offsetCrown.x;
                                Game.silverCrown.y = p.centerPos.y-3;
                            } else {
                                Game.silverCrown.x = p.centerPos.x-3;
                                Game.silverCrown.y = 30;
                            }
                            if (Game.timerLastCard !== null && Player.winList.length === 2) {
                                if (Game.putCards.length > 0 && !IN(Game.putCards[0].name,["2","JB","JR"])) {
                                    Game.silverCrown.draw(ctx);
                                }
                            } else {
                                Game.silverCrown.draw(ctx);
                            }
                            bOk = false;
                        }
                    }
                }

                if (p.bCurrent) {
                    p.cardList.forEach(c => {
                        c.getSprite().draw(ctx);
                        if (c.state === Card.STATE.Choosable) {
                            Game.choosableCard.x = c.x;
                            Game.choosableCard.y = c.y;
                            Game.choosableCard.draw(ctx);
                        } else if (c.state === Card.STATE.Hover) {
                            Game.choosableCard.x = c.x;
                            Game.choosableCard.y = c.y;
                            Game.choosableCard.draw(ctx);
                        } else if (c.state === Card.STATE.Chosen) {
                            Game.chosenCard.x = c.x;
                            Game.chosenCard.y = c.y;
                            Game.chosenCard.draw(ctx);
                        }
                    });
                    if (p.lastRecord >= 0) {
                        text(ctx, p.name, p.centerPos.x-16, p.centerPos.y+10);
                    } else {
                        text(ctx, p.name, p.centerPos.x+3, p.centerPos.y+8);
                    }
                } else {
                    p.cardList.forEach(c => {
                        if (p.orientation === "v") {
                            Game.cardVertical.x = c.x;
                            Game.cardVertical.y = c.y;
                            Game.cardVertical.draw(ctx);
                        } else {
                            Game.cardHorizontal.x = c.x;
                            Game.cardHorizontal.y = c.y;
                            Game.cardHorizontal.draw(ctx);
                        }
                    });
                    if (p.orientation === "v") {
                        // text(ctx, p.name, p.centerPos.x-16, p.centerPos.y+8);
                        if (p.lastRecord >= 0 && bOk) {
                            text(ctx, p.name, p.centerPos.x-8, p.centerPos.y+9);
                        } else {
                            text(ctx, p.name, p.centerPos.x +3, p.centerPos.y+12);
                        }
                    } else {
                        if (p.lastRecord >= 0 && bOk) {
                            text(ctx, p.name, p.centerPos.x+2, p.centerPos.y-2);
                        } else {
                            if (IN(p.pos,["40","50","60","61","70","71"])) {
                                text(ctx, p.name, p.centerPos.x+3, p.centerPos.y+10);
                            } else {
                                text(ctx, p.name, p.centerPos.x, p.centerPos.y+10);
                            }
                        }
                    }
                    // text(ctx,Player.list[i].name, Player.list[i].cardList[0].x+20, 40, WHITE_COLOR);
                }
                if (p.lastRecord >= 0) {
                    if (IN(p.pos,["51","62","72","52","63","73"])) {
                        Game.recordSprites[p.lastRecord].x = p.centerPos.x+8;
                    } else {
                        Game.recordSprites[p.lastRecord].x = p.centerPos.x;
                    }
                    Game.recordSprites[p.lastRecord].y = p.centerPos.y;
                    // Game.recordSprites[p.lastRecord].draw(ctx);
                }
                

                

                if (bOk && p.lastRecord >= 0) Game.recordSprites[p.lastRecord].draw(ctx);
                
            });
        }

        if (Game.currentState === Game.STATE.CardExchange) {

            ctx.textAlign = "center";
            if (Player.list[Player.current].lastRecord === 0) {
                text(ctx, "Choose two cards to give", centerX(),centerY()+30);
            }
            if (Player.list[Player.current].lastRecord === 1) {
                text(ctx, "Choose one card to give", centerX(),centerY()+30);
            }
        }

        let x = centerX(22*Game.putCards.length);
        Game.putCards.forEach(c => {
            c.x = x;
            x += 22;
            c.y = centerY(38);
            c.getSprite().draw(ctx);
        });

        switch(Game.currentState) {
            case Game.STATE.Main:
                Sprite.manageBeforeDrawing(Game.list);
                break;
            case Game.STATE.Ending:
                Sprite.manageBeforeDrawing(Game.endingList);
                break;
            case Game.STATE.CardExchange:
                Sprite.manageBeforeDrawing(Game.exchangeList);
                break;
        }
        Sprite.manageBeforeDrawing(Game.movingList);
        Sprite.manageBeforeDrawing(Game.menuList);
        Sprite.manageBeforeDrawing(Game.headerList);
    }

}