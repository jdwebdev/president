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

    static putCards = [];
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

        Game.putCards = [];
        Game.lastPutPlayer = -1;

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
        Game.timerReflexion = null;
        // Player.list = [];

        let playerNb = Game.PLAYER_NUMBER;
        let orientation = "";
        let pos = "";
        let posFromCurrent;

        Game.ptHorizontalCenter = centerY() + 7;
        Game.ptHorizontalTop = centerY(0, CANVAS_HEIGHT * 0.25) + 29 - 2;
        Game.ptHorizontalBottom = centerY(0, CANVAS_HEIGHT * 0.25, 1) - 6;
        Game.ptVerticalCenter = centerX();
        Game.ptVerticalLeft = centerX(0, CANVAS_WIDTH * 0.25);
        Game.ptVerticalRight = centerX(0, CANVAS_WIDTH * 0.25, 1);
        if (0) { //? DEBUG POSITIONS

            /*
                Game.ptHorizontalCenter
                Game.ptHorizontalTop
                Game.ptHorizontalBottom
                
                Game.ptVerticalCenter
                Game.ptVerticalLeft
                Game.ptVerticalRight
            */

            // Game.TESTEST = new Sprite({ w: 1, h: 1 }, 0, 30);
            // Game.TESTEST.addAnimation("normal", {x: 48, y: 6 });
            // Game.TESTEST.changeAnimation("normal");
            // Game.TESTEST.setScale(CANVAS_WIDTH,1);
            // Game.list.push(Game.TESTEST);

            //! HORIZONTAL
            Game.pt4050_425364sp = new Sprite({ w: 1, h: 1 }, 0, Game.ptHorizontalCenter);
            Game.pt4050_425364sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt4050_425364sp.changeAnimation("normal");
            Game.pt4050_425364sp.setScale(CANVAS_WIDTH, 1);
            Game.list.push(Game.pt4050_425364sp);

            Game.pt6171_74sp = new Sprite({ w: 1, h: 1 }, 0, Game.ptHorizontalTop);
            Game.pt6171_74sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt6171_74sp.changeAnimation("normal");
            Game.pt6171_74sp.setScale(CANVAS_WIDTH, 1);
            Game.list.push(Game.pt6171_74sp);

            Game.pt6070_75sp = new Sprite({ w: 1, h: 1 }, 0, Game.ptHorizontalBottom);
            Game.pt6070_75sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt6070_75sp.changeAnimation("normal");
            Game.pt6070_75sp.setScale(CANVAS_WIDTH, 1);
            Game.list.push(Game.pt6070_75sp);

            //! VERTICAL
            Game.pt41sp = new Sprite({ w: 1, h: 1 }, Game.ptVerticalCenter, 0);
            Game.pt41sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt41sp.changeAnimation("normal");
            Game.pt41sp.setScale(1, CANVAS_HEIGHT);
            Game.list.push(Game.pt41sp);

            Game.pt516272sp = new Sprite({ w: 1, h: 1 }, Game.ptVerticalLeft, 0);
            Game.pt516272sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt516272sp.changeAnimation("normal");
            Game.pt516272sp.setScale(1, 179);
            Game.list.push(Game.pt516272sp);

            Game.pt526373sp = new Sprite({ w: 1, h: 1 }, Game.ptVerticalRight, 0);
            Game.pt526373sp.addAnimation("normal", { x: 48, y: 6 });
            Game.pt526373sp.changeAnimation("normal");
            Game.pt526373sp.setScale(1, 179);
            Game.list.push(Game.pt526373sp);
        }

        if (Player.list.length === 0) {
            for (let i = 0; i < playerNb; i++) {
                pos = "";

                // if (i > Player.current) {
                //     posFromCurrent = i - Player.current - 1;
                //     pos = playerNb + "" + posFromCurrent;
                // } else if (i !== Player.current) {
                //     posFromCurrent = playerNb-1 - Player.current - 1;
                //     posFromCurrent += i + 1;
                //     pos = playerNb + "" + posFromCurrent;
                // }
                if (i > 0) {
                    pos = playerNb + "" + (i - 1);
                }

                if (i === 1 || i === 5 || i === 6) orientation = "h";

                switch (playerNb) {
                    case 4:
                        if (i === 2) orientation = "v";
                        if (i === 3) orientation = "h";
                        break;
                    case 5:
                        if (i === 2) orientation = "v";
                        if (i === 3) orientation = "v";
                        if (i === 4) orientation = "h";
                        break;
                    case 6:
                        if (i === 2) orientation = "h";
                        if (i === 3) orientation = "v";
                        if (i === 4) orientation = "v";
                        break;
                    case 7:
                        if (i === 2) orientation = "h";
                        if (i === 3) orientation = "v";
                        if (i === 4) orientation = "v";
                        break;
                }

                if (i === 0) orientation = "";

                let player = new Player("P" + (i + 1), orientation, pos);
                if (i === 0) player.setPlayer();

                if (player.orientation === "h") {
                    let cardX = IN(player.pos[1], ["0", "1"]) ? +33 : CANVAS_WIDTH - 33;
                    if (IN(player.pos, ["40", "50", "42", "53", "64"])) {
                        player.setCenterPos({ x: cardX, y: Game.ptHorizontalCenter });
                    } else if (IN(player.pos, ["60", "70", "75"])) {
                        player.setCenterPos({ x: cardX, y: Game.ptHorizontalBottom });
                    } else if (IN(player.pos, ["61", "71", "74"])) {
                        player.setCenterPos({ x: cardX, y: Game.ptHorizontalTop });
                    }
                } else if (player.orientation === "v") {
                    if (player.pos === "41") {
                        player.setCenterPos({ x: Game.ptVerticalCenter, y: 50 });
                    } else if (IN(player.pos, ["51", "62", "72"])) {
                        player.setCenterPos({ x: Game.ptVerticalLeft, y: 50 });
                    } else if (IN(player.pos, ["52", "63", "73"])) {
                        player.setCenterPos({ x: Game.ptVerticalRight, y: 50 });
                    }
                }

                if (i === Player.current) player.setCurrent(true);
            }
        } else {
            Player.list.forEach(p => {
                p.setCurrent(false);
                p.bExchangeDone = false;
            });
            Player.current = Player.winList[Player.winList.length - 1];
            Player.list[Player.current].setCurrent(true);
            // Player.changePositions();
            // Player.winList = [];
        }

        if (0) { //? TEST RESULT PANEL
            let resultPanelHeight = (Player.list.length * 14) + 8;
            Game.resultPanel = new Panel({ w: 180, h: resultPanelHeight }, centerX(180), centerY(resultPanelHeight) - 10, null, "Game", Game.STATE.Main, "", Panel.TYPE.NormalShadowx2);
            Game.resultPanel.setIdTest("RESULT PANEL");
            Game.resultPanel.setDestination({ x: centerX(180), y: centerY(resultPanelHeight) });
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
            Player.list.forEach((p, i) => {
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

                let originSpX = 80 + (16 * i);
                if (IN(i, [0, 1, Player.list.length - 2, Player.list.length - 1])) {
                    if (i === Player.list.length - 2) originSpX = 80 + (16 * 2);
                    if (i === Player.list.length - 1) originSpX = 80 + (16 * 3);
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

                    let nbPanel = new Panel({ w: 20, h: 1 }, offX + 12 + (j > 0 ? -2 : 0), crownTachiY, Game.resultPanel, "Game", Game.STATE.Main, "", Panel.TYPE.Transparent);
                    nbPanel.setFreeLabel();
                    nbPanel.setAlignText(0);
                    nbPanel.setTextOverflow();
                    nbPanel.setOffsets(4, 9)
                    nbPanel.changeLabel("x" + p.records[j]);
                    nbPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
                    nbPanel.setIdTest("nbPanel");
                    Panel.currentList.push(nbPanel);
                    Game.list.push(nbPanel.getSprite());
                    animX += 16;
                    offX += 32;
                }

                let verticalSeparation = new Sprite({ w: 1, h: 1 }, 39, 4, Game.resultPanel, "Game", { x: 1, y: Player.list.length * 14 });
                verticalSeparation.setIdTest("verticalSeparation");
                verticalSeparation.addAnimation("normal", { x: 44, y: 4 });
                verticalSeparation.changeAnimation("normal");
                Game.list.push(verticalSeparation);


                if (i < Player.list.length - 1) {
                    let separation = new Sprite({ w: 1, h: 1 }, 7, offY + 2, Game.resultPanel, "Game", { x: 165, y: 1 });
                    separation.setIdTest("SEPARATION");
                    separation.addAnimation("normal", { x: 44, y: 4 });
                    separation.changeAnimation("normal");
                    Game.list.push(separation);
                }

                crownTachiY += 14;
            });
        }

        //? BOX COLLIDER
        Game.lineBlue1 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineBlue1.addAnimation("normal", { x: 48, y: 7 });
        Game.lineBlue1.changeAnimation("normal");
        Game.lineBlue2 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineBlue2.addAnimation("normal", { x: 48, y: 7 });
        Game.lineBlue2.changeAnimation("normal");
        Game.lineBlue3 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineBlue3.addAnimation("normal", { x: 48, y: 7 });
        Game.lineBlue3.changeAnimation("normal");
        Game.lineBlue4 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineBlue4.addAnimation("normal", { x: 48, y: 7 });
        Game.lineBlue4.changeAnimation("normal");

        Game.lineRed1 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineRed1.addAnimation("normal", { x: 49, y: 7 });
        Game.lineRed1.changeAnimation("normal");
        Game.lineRed2 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineRed2.addAnimation("normal", { x: 49, y: 7 });
        Game.lineRed2.changeAnimation("normal");
        Game.lineRed3 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineRed3.addAnimation("normal", { x: 49, y: 7 });
        Game.lineRed3.changeAnimation("normal");
        Game.lineRed4 = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: 1, y: 1 });
        Game.lineRed4.addAnimation("normal", { x: 49, y: 7 });
        Game.lineRed4.changeAnimation("normal");

        if (1) { //? BUTTONS

            Game.putPassBtn = new Button({ w: 40, h: 20, v: 7 }, centerX(40), CANVAS_HEIGHT - 80, null, { cb: Game.putOrPass, arg: "" }, "Game", Game.STATE.Main, "Put", 1);
            Game.putPassBtn.setIdTest("Put BTN");
            Game.putPassBtn.setFreeLabel();
            Game.putPassBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.putPassBtn.setTextCenterY();
            Game.list.push(Game.putPassBtn.getSprite());
            Game.putPassBtn.state = Button.STATE.Invisible;

            Game.validExchangeBtn = new Button({ w: 60, h: 20, v: 7 }, centerX(60), CANVAS_HEIGHT - 80, null, { cb: Game.nextPlayerExchange, arg: "" }, "CardExchange", Game.STATE.CardExchange, "Validate", 1);
            Game.validExchangeBtn.setIdTest("Valid BTN");
            Game.validExchangeBtn.setFreeLabel();
            Game.validExchangeBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.validExchangeBtn.setTextCenterY();
            Game.validExchangeBtn.state = Button.STATE.Invisible;
            Game.exchangeList.push(Game.validExchangeBtn.getSprite());

            let barre = new Sprite({ w: 1, h: 1 }, 0, 0, null, "", { x: CANVAS_WIDTH, y: 29 });
            barre.addAnimation("normal", { x: 48, y: 0 });
            barre.changeAnimation("normal");
            Game.headerList.push(barre);

            let pyBtn = 5;
            Game.p4Btn = new Button({ w: 20, h: 20, v: 7 }, 5, pyBtn, null, { cb: Game.changePlayerNb, arg: 4 }, "Game", Game.STATE.Main, "4", 1);
            Game.p4Btn.setIdTest("p4Btn");
            Game.p4Btn.setFreeLabel();
            Game.p4Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.p4Btn.setTextCenterY();
            Game.headerList.push(Game.p4Btn.getSprite());

            Game.p5Btn = new Button({ w: 20, h: 20, v: 7 }, 30, pyBtn, null, { cb: Game.changePlayerNb, arg: 5 }, "Game", Game.STATE.Main, "5", 1);
            Game.p5Btn.setIdTest("p5Btn");
            Game.p5Btn.setFreeLabel();
            Game.p5Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.p5Btn.setTextCenterY();
            Game.headerList.push(Game.p5Btn.getSprite());

            Game.p6Btn = new Button({ w: 20, h: 20, v: 7 }, 55, pyBtn, null, { cb: Game.changePlayerNb, arg: 6 }, "Game", Game.STATE.Main, "6", 1);
            Game.p6Btn.setIdTest("p6Btn");
            Game.p6Btn.setFreeLabel();
            Game.p6Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.p6Btn.setTextCenterY();
            Game.headerList.push(Game.p6Btn.getSprite());

            Game.p7Btn = new Button({ w: 20, h: 20, v: 7 }, 80, pyBtn, null, { cb: Game.changePlayerNb, arg: 7 }, "Game", Game.STATE.Main, "7", 1);
            Game.p7Btn.setIdTest("p7Btn");
            Game.p7Btn.setFreeLabel();
            Game.p7Btn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
            Game.p7Btn.setTextCenterY();
            Game.headerList.push(Game.p7Btn.getSprite());

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

        let testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53];
        let newRndArr = Card.randomizer(testArr, testArr.length);

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

        //! ------- Version normale -------
        //! ------- Version normale -------
        //! ------- Version normale -------
        //! ------- Version normale -------
        //! ------- Version normale -------
        for (let i = 0; i < 54; i++) {
            Card.randomList.push(Card.list[newRndArr[i]]);
            Player.list[currentPlayer].cardList.push(Card.list[newRndArr[i]]);
            distributedCards++;
            if (distributedCards === distributionCardList[currentPlayer]) {
                distributedCards = 0;
                currentPlayer++;
            }
        }
        //!-----------------------


        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //! ------- TEST ---------
        //?  0: A♥ |  1: 2♥ |  2: 3♥ |  3: 4♥ |  4: 5♥ |  5: 6♥ |  6: 7♥ |  7: 8♥ |  8: 9♥ |  9: 10♥ | 10: J♥ | 11: Q♥ | 12: K♥ 
        //? 13: A♠ | 14: 2♠ | 15: 3♠ | 16: 4♠ | 17: 5♠ | 18: 6♠ | 19: 7♠ | 20: 8♠ | 21: 9♠ | 22: 10♠ | 23: J♠ | 24: Q♠ | 25: K♠
        //? 26: A♦ | 27: 2♦ | 28: 3♦ | 29: 4♦ | 30: 5♦ | 31: 6♦ | 32: 7♦ | 33: 8♦ | 34: 9♦ | 35: 10♦ | 36: J♦ | 37: Q♦ | 38: K♦
        //? 39: A♣ | 40: 2♣ | 41: 3♣ | 42: 4♣ | 43: 5♣ | 44: 6♣ | 45: 7♣ | 46: 8♣ | 47: 9♣ | 48: 10♣ | 49: J♣ | 50: Q♣ | 51: K♣
        //? 52: JRR | 53: JBB
        //                //? 3 3 4      4 4 J       5 5 5       6 7 JRR    8 9 JBB
        // let forDebugList = [2,15,3,    16,29,10,   4,17,30,    5,6,52,    7,8,53        ];
        //                //? 2 2 2     
        // let forDebugList = [1,14,27,    16,28,52,   4,17,30,    5,6,10,    7,8,53        ];

        // let forDebugList = [0,14,27,    39,1,52,   4,17,30,    5,6,10,    7,8,53        ];
        //                //? 3 3 3       4 4 4       5 5 5       6 6 6       7 7 7
        // let forDebugList = [2, 15, 28, 3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 32];
        // let forDebugList = [2, 15, 12, 3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 32];
        //                 //? 3 3        4 4        5 5        6 6        7 7 
        // let forDebugList = [2,15,    3,16,   4,17,    5,18,    6,19,        ];

        // currentPlayer = 0;
        // let nbOfCards = Game.PLAYER_NUMBER * 3; //? 12 pour 4 | 15 pour 5 etc.   *3 pour le nb de carte par joueur
        // for (let i = 0; i < nbOfCards; i++) {
        //     Card.randomList.push(Card.list[newRndArr[i]]);
        //     // Player.list[currentPlayer].cardList.push(Card.list[newRndArr[i]]);
        //     Player.list[currentPlayer].cardList.push(Card.list[forDebugList[i]]); //! forDebugList !
        //     distributedCards++;
        //     if (distributedCards === (nbOfCards / Game.PLAYER_NUMBER)) {
        //         distributedCards = 0;
        //         currentPlayer++;
        //     }
        // }
        //!-----------------------


        // log(Card.randomList);
        // log(Player.list);

        Player.list.forEach(p => {
            let newArray = [];
            p.sortCards(p.cardList, newArray);
            p.cardList = newArray;
        });

        Game.recordSprites = [];
        let animX = 0
        for (let i = 0; i < 4; i++) {
            let record = new Sprite({ w: 16, h: 16 }, 30, 109, null, "");
            record.addAnimation("normal", { x: 80 + animX, y: 256 });
            record.changeAnimation("normal");
            Game.recordSprites.push(record);
            animX += 16;
        }

        Game.goldCrown = new Sprite({ w: 22, h: 21 });
        Game.goldCrown.addAnimation("normal", { x: 80, y: 272 });
        Game.goldCrown.changeAnimation("normal");

        Game.silverCrown = new Sprite({ w: 22, h: 21 });
        Game.silverCrown.addAnimation("normal", { x: 102, y: 272 });
        Game.silverCrown.changeAnimation("normal");

        //!---

        Game.cardHorizontal = new Sprite({ w: 34, h: 24 }, -19, 30, null);
        Game.cardHorizontal.addAnimation("normal", { x: 368, y: 96 });
        Game.cardHorizontal.changeAnimation("normal");

        Game.cardVertical = new Sprite({ w: 24, h: 34 }, 100, 10, null);
        Game.cardVertical.addAnimation("normal", { x: 368, y: 120 });
        Game.cardVertical.changeAnimation("normal");

        Game.choosableCard = new Sprite({ w: 25, h: 37 }, 100, 10, null);
        Game.choosableCard.addAnimation("normal", { x: 240, y: 59 }, 9, [1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
        Game.choosableCard.changeAnimation("normal");

        Game.chosenCard = new Sprite({ w: 25, h: 37 }, 100, 10, null);
        Game.chosenCard.addAnimation("normal", { x: 465, y: 59 }, 9, [1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
        Game.chosenCard.changeAnimation("normal");

        Game.passTop = new Sprite({ w: 28, h: 17 }, 0, 0, null);
        Game.passTop.addAnimation("normal", { x: 480, y: 112 });
        Game.passTop.changeAnimation("normal");
        Game.passTop.y = 50;

        Game.passBottom = new Sprite({ w: 28, h: 17 }, 0, 0, null);
        Game.passBottom.addAnimation("normal", { x: 508, y: 112 });
        Game.passBottom.changeAnimation("normal");

        Game.passLeft = new Sprite({ w: 28, h: 16 }, 0, 0, null);
        Game.passLeft.addAnimation("normal", { x: 536, y: 112 });
        Game.passLeft.changeAnimation("normal");
        Game.passLeft.x = 25;

        Game.passRight = new Sprite({ w: 28, h: 16 }, 0, 0, null);
        Game.passRight.addAnimation("normal", { x: 564, y: 112 });
        Game.passRight.changeAnimation("normal");
        Game.passRight.x = CANVAS_WIDTH - 50;

        Game.initCardPositions();
        if (Game.currentState === Game.STATE.Main) {
            Game.setChoosableCards();
            Button.resetTypeState("Game", Game.STATE.Main);
            Panel.resetTypeState("Game", Game.STATE.Main);
        } else if (Game.currentState === Game.STATE.CardExchange) {
            Game.p4Btn.state = Button.STATE.Invisible;
            Game.p5Btn.state = Button.STATE.Invisible;
            Game.p6Btn.state = Button.STATE.Invisible;
            Game.p7Btn.state = Button.STATE.Invisible;
            Game.setChoosableForExchangeCard();
            Button.resetTypeState("CardExchange", Game.STATE.CardExchange);
            Panel.resetTypeState("CardExchange", Game.STATE.CardExchange);
        }

    }

    static nextPlayer() {
        // log("----- NEXT PLAYER -----");
        let bSamePlayerNotSetChoosable = false;
        Game.resetAllCardsState();

        Player.list.forEach(p => {
            p.setCurrent(false);
        });
        let bEnd = false;
        while (!bEnd) {
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
                bSamePlayerNotSetChoosable = true;
                Game.timerLastCard = new Timer(1, Game.samePlayerAfterTimer.bind(Game));
            }
        }

        if (!bSamePlayerNotSetChoosable) {
            Game.setChoosableCards();
        }

        if (Player.current === 0) {
            Player.list[Player.current].cardList.forEach(c => {
                if (c.boxCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y) && c.state === Card.STATE.Choosable) {
                    c.state = Card.STATE.Hover;
                    c.y = c.hoverY;
                }
            });
            if (!MOBILE && !TRANSITION) checkMouseHover(Game.putPassBtn);
        } else {
            //! Ici : l'IA décide de la carte à poser :
            if (Game.timerLastCard === null) {
                Game.AIChooseCard();
            }
        }
    }

    static AIChooseCard() {
        let chosenNb = 0;
        let bTypeDone = false;
        let bDone = false;

        Player.list[Player.current].cardList.forEach((c, i) => {
            if (c.state === Card.STATE.Choosable && !bDone) {
                c.state = Card.STATE.Chosen;
                if (Game.putCards.length > 1) {
                    if (!bTypeDone) {
                        bTypeDone = true;
                        Card.selectedType = c.name;
                    }
                } else {
                    if (!bTypeDone) {
                        bTypeDone = true;
                        Card.selectedType = c.name;
                    }
                }
                Card.selectedCards.push(c);
                Card.checkOtherCards("u");
                chosenNb++;
                if (chosenNb === 4) bDone = true; //? Limite à 4 cartes max
                if (Game.putCards.length > 0) {
                    if (chosenNb === Game.putCards.length) {
                        bDone = true;
                    }
                } else {

                }

                //? Moving 関係 ----
                c.bFaceDownMove = true;
                c.startPos.x = c.x;
                c.startPos.y = c.y;
                if (Player.list[Player.current].orientation === "v") {
                    c.destination.x = c.x;
                    c.destination.y = c.y + 10;
                } else {
                    c.destination.y = c.y;
                    if (IN(Player.list[Player.current].pos, ["40", "50", "60", "61", "70", "71"])) {
                        c.destination.x = c.x + 10;
                    } else {
                        c.destination.x = c.x - 10;
                    }
                }
                c.movingSpeed = 0.2;
            }
            // log("Card: " + c.name + c.type + " " + c.getStateInfo());
        });
        if (chosenNb > 0) bDone = true;

        if (bDone) {
            Game.timerReflexion = new Timer(1, Game.putCard.bind(Game));
        } else {
            // if (Player.list[Player.current].)
            Player.list[Player.current].bPass = true;
            Game.timerReflexion = new Timer(1, Game.putOrPass.bind(Game)); //! AI Pass
        }

    }

    static resetAllCardsState() {
        Player.list[Player.current].cardList.forEach(c => {
            c.state = Card.STATE.Normal;
        });
    }

    static putOrPass() {
        if (Card.selectedCards.length === 0 || Card.selectedCards.length < Game.putCards.length) { //? PASS
            Player.list[Player.current].bPass = false;
            Game.timerReflexion = null;
            Game.nextPlayer();
        } else {
            Game.putCard();
        }
    }

    static putCard() {
        Game.timerReflexion = null;
        // if (Card.selectedCards.length === 0 || Card.selectedCards.length < Game.putCards.length) { //? PASS
        //     Game.nextPlayer();
        //     return;
        // }

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
                    if (!Player.winList.includes(i)) Player.winList.push(i);
                }
                // MOUSE_SPRITE.changeAnimation("normal");
                Game.timerEnd = new Timer(0.5, Game.end.bind(Game));
            }

        }

        if (!bEnd) {
            if (IN(Card.selectedType, ["2", "JB", "JR"])) {
                // log("IN 2, Joker");
                TRANSITION = true;
                Card.selectedType = "";
                Game.initCardPositions();
                Game.timerLastCard = new Timer(1, Game.samePlayerAfterTimer.bind(Game));
            } else {
                Card.selectedType = "";
                Game.initCardPositions();
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
            Game.putPassBtn.state = Button.STATE.Invisible;
        } else if (!TRANSITION) {
            Game.putPassBtn.setLabel("Pass");
            Game.putPassBtn.state = Button.STATE.Normal;
        }

        if (Player.current !== 0) {
            Game.putPassBtn.state = Button.STATE.Invisible;
        }
        Player.list[Player.current].cardList.forEach((c, i) => {
            if (Game.putCards.length === 0) {
                if (c.state === Card.STATE.Normal) {
                    c.state = Card.STATE.Choosable;
                }
            } else {
                if (Card.bestList[c.name] > Card.bestList[Game.putCards[0].name]) {
                    if (Game.nbOfOneCard(c.name) >= Game.putCards.length || IN(c.name, ["JB", "JR"])) {
                        if (c.state !== Card.STATE.Chosen) { //! check down
                            c.state = Card.STATE.Choosable;
                            if (!IN(c.name, ["JR", "JB"])) notJokerCard++;
                            if (IN(c.name, ["JR", "JB"])) jokerCard++; jokerPositions.push(i);
                        }
                    }
                }
            }
        });

        if (jokerCard > 0 && jokerCard + notJokerCard < Game.putCards.length) { //? jokerCard > 0 que si s'il est choosable
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

        Player.list[Player.current].cardList.forEach((c, i) => {
            switch (lastRecord) {
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
                        Game.timerPassExchange = new Timer(1, Game.nextPlayerExchange.bind(Game));
                    }
                    break;
                case -1:
                    TRANSITION = true;
                    Game.timerPassExchange = new Timer(1, Game.nextPlayerExchange.bind(Game));
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
        if (Player.current > Player.list.length - 1) {
            Player.current = 0;
        }
        Player.list[Player.current].setCurrent(true);

        //! IF => next game ! Nouvelle partie
        if (Player.list[Player.current].bExchangeDone) { //? Player déjà "Done", donc échange terminé

            let firstPlayer = Player.list[Player.winList[0]];
            let secondPlayer = Player.list[Player.winList[1]];
            let penulPlayer = Player.list[Player.winList[Player.list.length - 2]];
            let lastPlayer = Player.list[Player.winList[Player.list.length - 1]];
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
                p.cardList.forEach((c, i) => {
                    if (i < p.cardList.length - 1) {
                        c.setNotRightBoxColliders();
                    }
                });
            });


            Game.currentState = Game.STATE.Main;

            Card.selectedType = "";
            // Player.changePositions();
            Game.initCardPositions();
            Game.setChoosableCards();

            if (Player.current !== 0) {
                Game.AIChooseCard();
            }

            Game.p4Btn.state = Button.STATE.Normal;
            Game.p5Btn.state = Button.STATE.Normal;
            Game.p6Btn.state = Button.STATE.Normal;
            Game.p7Btn.state = Button.STATE.Normal;

            Button.resetTypeState("Game", Game.STATE.Main);
            Panel.resetTypeState("Game", Game.STATE.Main);

        } else {

            //! --------

            // if (Player.list[Player.current].lastRecord === Player.list.length -2) {
            if (Player.list[Player.current].lastRecord === 2) { //? Avant dernier
                // log(Player.list[Player.current].name + ": PLAYER LAST RECORD === PLAYER LIST LENGTH -2");
                TRANSITION = true;
                Game.timerPassExchange = new Timer(1, Game.nextPlayerExchange.bind(Game));
            }

            Card.selectedType = "";
            // Player.changePositions();
            Game.initCardPositions();
            Game.setChoosableForExchangeCard();

            //??? ici IA ?
            if (IN(Player.list[Player.current].lastRecord, [0, 1]) && Player.current !== 0) {
                Game.AIChooseCardToGive();
            }

        }
    }
    static AIChooseCardToGive() {
        Player.list[Player.current].cardList.forEach((c, i) => {
            if (Player.list[Player.current].lastRecord === 0) {
                if (i === 0 || i === 1) {
                    c.state = Card.STATE.Chosen;
                    Player.list[Player.current].cardToExchange.push(c);
                    TRANSITION = true;
                    Game.timerPassExchange = new Timer(1, Game.nextPlayerExchange.bind(Game));
                }
            } else { //? 1
                if (i === 0) {
                    c.state = Card.STATE.Chosen;
                    Player.list[Player.current].cardToExchange.push(c);
                    TRANSITION = true;
                    Game.timerPassExchange = new Timer(1, Game.nextPlayerExchange.bind(Game));
                }
            }
        });
    }

    static nbOfOneCard(pName) {
        let count = 0;
        Player.list[Player.current].cardList.forEach(c => {

            //? if JOKER ?

            if (c.name === pName || IN(c.name, ["JB", "JR"])) {
                count++
            }
        });
        // log("before return count : " + pName + " x" + count);
        return count;
    }

    static samePlayerAfterTimer() {
        // log("------ Same player after timer -----");
        TRANSITION = false;

        Game.lastPutPlayer = -1;


        Game.timerLastCard = null;
        Game.putCards = [];

        Card.selectedType = "";

        if (Player.list[Player.current].cardList.length === 0) {
            Card.selectedType = "";
            Game.nextPlayer();
        } else {
            Game.setChoosableCards();
            if (Player.current === 0) {
                Player.list[Player.current].cardList.forEach(c => {
                    if (c.boxCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y)) {
                        c.state = Card.STATE.Hover;
                        c.y = c.hoverY;
                    }
                });
            } else {
                Game.AIChooseCard();
            }
        }

    }


    static initCardPositions() {
        // let index = 0;
        let space;
        let offX; let offY;
        let cardX;
        let otherCardsWidth = 24;
        let heightAllCards;
        let widthAllCards;

        Player.list.forEach((p, index) => {
            if (p.bPlayer) {
                space = 12;
                offX = centerX(space * (p.cardList.length - 1) + 26);
                p.setCenterPos({ x: centerX(), y: CANVAS_HEIGHT - 55 }); //? Sert à afficher "P1" et autres crowns
                p.cardList.forEach((c, i) => {
                    c.x = offX;
                    c.y = CANVAS_HEIGHT - 30;
                    c.setYPositions(c.y);
                    offX += space;
                    if (i === p.cardList.length - 1) {
                        c.setMostRightBoxColliders();
                    }
                });
            } else {
                if (p.orientation === "h") {
                    space = IN(p.pos, ["40", "50", "42", "53", "64"]) ? 10 : 6;
                    cardX = IN(p.pos[1], ["0", "1"]) ? -17 : CANVAS_WIDTH - 16;
                    heightAllCards = space * (p.cardList.length - 1) + otherCardsWidth;

                    p.offsetCrown.x = IN(p.pos, ["40", "50", "60", "61", "70", "71"]) ? 1 : CANVAS_WIDTH - 24;

                    if (IN(p.pos, ["40", "50", "42", "53", "64"])) {
                        offY = centerPoint(heightAllCards, Game.ptHorizontalCenter);
                    } else if (IN(p.pos, ["60", "70", "75"])) {
                        offY = centerPoint(heightAllCards, Game.ptHorizontalBottom);
                    } else if (IN(p.pos, ["61", "71", "74"])) {
                        offY = centerPoint(heightAllCards, Game.ptHorizontalTop);
                    }
                    p.cardList.forEach(c => {
                        c.x = cardX;
                        c.y = offY;
                        offY += space;
                    });
                } else if (p.orientation === "v") {
                    space = (Game.PLAYER_NUMBER === 4) ? 10 : 6;
                    widthAllCards = space * (p.cardList.length - 1) + otherCardsWidth; //? Une largeur (24) + space (6 ou 10) * (nbCard-1). Nb de cartes

                    if (p.pos === "41") {
                        offX = centerX(widthAllCards); //? 44 (pour 3) => une largeur (24 + 10*(nbCard-1))
                    } else if (IN(p.pos, ["51", "62", "72"])) {
                        offX = centerPoint(widthAllCards, Game.ptVerticalLeft);
                    } else if (IN(p.pos, ["52", "63", "73"])) {
                        offX = centerPoint(widthAllCards, Game.ptVerticalRight);
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
        Game.currentState = Game.STATE.Main;
        Player.list = [];
        Player.winList = [];
        Player.current = 0;
        Card.selectedCards = [];
        Card.selectedType = ""
        
        Game.PLAYER_NUMBER = pNb;
        Game.init();
    }

    

    static checkEnd() { }

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
            p.bPass = false;
        })
        Game.putCards = [];
        Game.lastPutPlayer = -1;

        let resultPanelHeight = (Player.list.length * 14) + 8;
        Game.resultPanel = new Panel({ w: 180, h: resultPanelHeight }, centerX(180), centerY(resultPanelHeight) - 10, null, "Ending", Game.STATE.Ending, "", Panel.TYPE.NormalShadowx2);
        Game.resultPanel.setIdTest("RESULT PANEL");
        Game.resultPanel.setDestination({ x: centerX(180), y: centerY(resultPanelHeight) });
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
        Player.winList.forEach((p, i) => {
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

            let originSpX = 80 + (16 * i);
            if (IN(i, [0, 1, Player.list.length - 2, Player.list.length - 1])) {
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
                    originSpX = 80 + (16 * 2);
                    Player.list[p].records[2]++;
                    Player.list[p].lastRecord = 2;
                }
                if (i === Player.list.length - 1) {
                    originSpX = 80 + (16 * 3);
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

                let nbPanel = new Panel({ w: 20, h: 1 }, offX + 12 + (j > 0 ? -2 : 0), crownTachiY, Game.resultPanel, "Ending", Game.STATE.Ending, "", Panel.TYPE.Transparent);
                nbPanel.setFreeLabel();
                nbPanel.setAlignText(0);
                nbPanel.setTextOverflow();
                nbPanel.setOffsets(4, 9)
                nbPanel.changeLabel("x" + Player.list[p].records[j]);
                nbPanel.setFontColor(BLACK_COLOR, WHITE_COLOR);
                nbPanel.setIdTest("nbPanel");
                Panel.currentList.push(nbPanel);
                Game.endingList.push(nbPanel.getSprite());
                animX += 16;
                offX += 32;
            }

            let verticalSeparation = new Sprite({ w: 1, h: 1 }, 39, 4, Game.resultPanel, "Ending", { x: 1, y: Player.list.length * 14 });
            verticalSeparation.setIdTest("verticalSeparation");
            verticalSeparation.addAnimation("normal", { x: 44, y: 4 });
            verticalSeparation.changeAnimation("normal");
            Game.endingList.push(verticalSeparation);


            if (i < Player.list.length - 1) {
                let separation = new Sprite({ w: 1, h: 1 }, 7, offY + 2, Game.resultPanel, "Ending", { x: 165, y: 1 });
                separation.setIdTest("SEPARATION");
                separation.addAnimation("normal", { x: 44, y: 4 });
                separation.changeAnimation("normal");
                Game.endingList.push(separation);
            }

            crownTachiY += 14;
        });

        let newBtn = new Button({ w: 60, h: 20, v: 7 }, centerX(60), CANVAS_HEIGHT - 50, null, { cb: Game.init, arg: "" }, "Ending", Game.STATE.Ending, "Next game", 1);
        newBtn.setFreeLabel();
        newBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        newBtn.setTextCenterY();
        Game.endingList.push(newBtn.getSprite());

        Button.resetTypeState("Ending", Game.STATE.Ending);
        Button.currentList.push(Game.p4Btn);
        Button.currentList.push(Game.p5Btn);
        Button.currentList.push(Game.p6Btn);
        Button.currentList.push(Game.p7Btn);
        // Game.p4Btn.state = Button.STATE.Invisible;
        // Game.p5Btn.state = Button.STATE.Invisible;
        // Game.p6Btn.state = Button.STATE.Invisible;
        // Game.p7Btn.state = Button.STATE.Invisible;
        Panel.resetTypeState("Ending", Game.STATE.Ending);
    }

    static getStateInfo() {
        switch (Game.currentState) {
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
        if (Game.timerReflexion !== null) Game.timerReflexion.update(dt);

        if (Player.current !== 0) {
            Player.list[Player.current].cardList.forEach(c => {
                if (c.bFaceDownMove) {
                    c.update(dt);
                }
            });
        }

        Sprite.manageBeforeUpdating(Game.cardList, dt);
        switch (Game.currentState) {
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

        Game.choosableCard.update(dt);
        Game.chosenCard.update(dt);

        Panel.currentList.forEach(p => {
            p.update(dt)
        });


        //? Delete Sprites
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
            Player.list.forEach((p, i) => {
                bOk = true;

                //? Affichage du last record (à partir de la 2ème partie)
                if (p.lastRecord >= 0) {
                    if (IN(p.pos, ["41", "51", "62", "72", "52", "63", "73"])) { //? "v"
                        Game.recordSprites[p.lastRecord].x = p.centerPos.x;
                        Game.recordSprites[p.lastRecord].y = p.centerPos.y + 2;
                    } else if (!p.bPlayer) { //? "h"
                        Game.recordSprites[p.lastRecord].x = p.centerPos.x - 7;
                        Game.recordSprites[p.lastRecord].y = p.centerPos.y;
                    } else {
                        Game.recordSprites[p.lastRecord].x = p.centerPos.x;
                        Game.recordSprites[p.lastRecord].y = p.centerPos.y + 2;
                    }
                    // Game.recordSprites[p.lastRecord].draw(ctx);
                }

                //? Affichage des Gold & Silver Crowns ----
                if (Game.currentState === Game.STATE.Main) {
                    if (Player.winList.length >= 1) {
                        if (Player.winList[0] === i) {
                            if (Player.winList[0] === 0) {
                                Game.goldCrown.x = centerPoint(Game.goldCrown.width, p.centerPos.x);
                                Game.goldCrown.y = CANVAS_HEIGHT - 30;
                            } else {
                                if (p.orientation === "h") {
                                    Game.goldCrown.x = p.offsetCrown.x;
                                    Game.goldCrown.y = centerPoint(Game.goldCrown.height, p.centerPos.y);
                                } else {
                                    Game.goldCrown.x = centerPoint(Game.goldCrown.width, p.centerPos.x);
                                    Game.goldCrown.y = 30;
                                }
                            }

                            if (Game.timerLastCard !== null && Player.winList.length === 1) {
                                if (Game.putCards.length > 0 && !IN(Game.putCards[0].name, ["2", "JB", "JR"])) {
                                    Game.goldCrown.draw(ctx);
                                } else {
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
                            if (Player.winList[1] === 0) {
                                Game.silverCrown.x = centerPoint(Game.silverCrown.width, p.centerPos.x);
                                Game.silverCrown.y = CANVAS_HEIGHT - 30;
                            } else {
                                if (p.orientation === "h") {
                                    Game.silverCrown.x = p.offsetCrown.x;
                                    Game.silverCrown.y = centerPoint(Game.silverCrown.height, p.centerPos.y);
                                } else {
                                    Game.silverCrown.x = centerPoint(Game.silverCrown.width, p.centerPos.x);
                                    Game.silverCrown.y = 30;
                                }
                            }
                            if (Game.timerLastCard !== null && Player.winList.length === 2) {
                                if (Game.putCards.length > 0 && !IN(Game.putCards[0].name, ["2", "JB", "JR"])) {
                                    Game.silverCrown.draw(ctx);
                                } else {
                                    Game.silverCrown.draw(ctx);
                                }
                            } else {
                                Game.silverCrown.draw(ctx);
                            }
                            bOk = false;
                        }
                    }
                }
                //? ---------------------------------------

                if (bOk && !p.bPass && p.lastRecord >= 0) Game.recordSprites[p.lastRecord].draw(ctx);

                let color = BLACK_COLOR;
                if (Player.current === i) color = RED_COLOR;

                ctx.textAlign = "center";
                if (p.bPlayer) {
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

                    if (p.lastRecord >= 0 && bOk) {
                        // text(ctx, p.name, p.centerPos.x-16, p.centerPos.y+10, color);
                        text(ctx, p.name, p.centerPos.x - 8, p.centerPos.y + 12, color);
                    } else {
                        ctx.textAlign = "center";
                        text(ctx, p.name, p.centerPos.x + 1, p.centerPos.y + 8, color);
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
                        if (p.bPass) {
                            Game.passTop.x = centerPoint(Game.passTop.width, p.centerPos.x);
                            Game.passTop.draw(ctx);
                        } else {
                            if (p.lastRecord >= 0 && bOk) {
                                text(ctx, p.name, p.centerPos.x - 8, p.centerPos.y + 12, color);
                            } else {
                                text(ctx, p.name, p.centerPos.x + 1, p.centerPos.y + 12, color); //! Normal
                            }
                        }
                    } else { //? "h"

                        if (p.bPass) {
                            if (IN(p.pos, ["40", "50", "60", "61", "70", "71"])) {
                                Game.passLeft.y = centerPoint(Game.passLeft.height, p.centerPos.y);
                                Game.passLeft.draw(ctx);
                            } else {
                                Game.passRight.y = centerPoint(Game.passRight.height, p.centerPos.y);
                                Game.passRight.draw(ctx);
                            }
                        } else {
                            if (p.lastRecord >= 0 && bOk) {
                                text(ctx, p.name, p.centerPos.x, p.centerPos.y - 2, color);
                            } else {
                                if (IN(p.pos, ["40", "50", "60", "61", "70", "71"])) {
                                    text(ctx, p.name, p.centerPos.x, p.centerPos.y + 4, color); //! Normal
                                } else {
                                    text(ctx, p.name, p.centerPos.x, p.centerPos.y + 4, color); //! Normal
                                }
                            }
                        }

                    }
                    // text(ctx,Player.list[i].name, Player.list[i].cardList[0].x+20, 40, WHITE_COLOR);
                }
            });
        }

        if (Game.currentState === Game.STATE.CardExchange) {
            ctx.textAlign = "center";
            text(ctx, "< CARD EXCHANGE >", centerX(), centerY() - 30);
            if (Player.list[Player.current].lastRecord === 0 && Player.current === 0) {
                text(ctx, "Choose two cards to give", centerX(), centerY() + 30);
            }
            if (Player.list[Player.current].lastRecord === 1 && Player.current === 0) {
                text(ctx, "Choose one card to give", centerX(), centerY() + 30);
            }
        }

        if (Game.lastPutPlayer > -1) {
            text(ctx, Player.list[Game.lastPutPlayer].name, centerX() + 1, centerY(38) - 5);
        }
        // let x = centerX(22 * Game.putCards.length);
        let x = centerX((22 * Game.putCards.length) + 2); //? Bien au centre arbitraite (en enlevant l'ombre notamment)
        Game.putCards.forEach(c => {
            c.x = x;
            x += 22;
            c.y = centerY(38);
            c.getSprite().draw(ctx);
        });

        switch (Game.currentState) {
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


        // Game.passTop.x = centerX(0,CANVAS_WIDTH*0.25,1);
        // Game.passTop.y = 50;
        // Game.passTop.draw(ctx);
    }

}