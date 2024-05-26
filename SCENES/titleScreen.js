class TitleScreen {

    static STATE = Object.freeze({
        Main: 0,
    });

    static currentState = TitleScreen.STATE.Main;

    static list = [];

    constructor() {
    }

    static init() {
        canvas.style.backgroundColor = CANVAS_ORIGIN_COLOR;

        let originX = 320;
        let offX = 0;
        let y = 10;
        let offY = 3; 
        for (let i = 0; i < 9; i++) {
            let letter = new Sprite({ w: 26, h: 36 }, 1+offX, y+offY, null, "TitleScreen");
            letter.addAnimation("normal", { x: originX, y: 384 });
            letter.changeAnimation("normal");
            
            if (isPair(i)) {
                letter.setOriginPos({ x: 1+offX, y: y+offY });
                letter.setOriginDestination({ x: 1+offX, y: y-3 });
                letter.setMovingType(Sprite.MOVING_TYPE.ComeAndGo);
                letter.setDestination({ x:  1+offX, y: y-3 });  
            } else {
                letter.setOriginPos({ x: 1+offX, y: y+offY });
                letter.setOriginDestination({ x: 1+offX, y: y+3 });
                letter.setMovingType(Sprite.MOVING_TYPE.ComeAndGo);
                letter.setDestination({ x:  1+offX, y: y+3 });
            }
            offY = -offY;

            TitleScreen.list.push(letter);
            originX += 26;
            offX += 20;
        }

        let by = new Sprite({ w: 9, h: 10 }, 132, 67, null, "TitleScreen");
        by.addAnimation("normal", { x: 0, y: 52 });
        by.changeAnimation("normal");
        TitleScreen.list.push(by);

        let jadona = new Sprite({ w: 38, h: 35 }, 148, 54, null, "TitleScreen");
        jadona.addAnimation("normal", { x: 0, y: 0 });
        jadona.changeAnimation("normal");
        TitleScreen.list.push(jadona);

        let normalBtn = new Button({ w: 60, h: 24, v: 7}, centerX(60), 100, null, { cb: TitleScreen.start, arg: 1 }, "TitleScreen", TitleScreen.STATE.Main, "NORMAL", 1);
        normalBtn.setFreeLabel();
        normalBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        normalBtn.setTextCenterY();
        TitleScreen.list.push(normalBtn.getSprite());
        
        let firstFrameSpeed = 1;

        let normalBtnLeft = new Sprite({ w: 17, h: 17 }, -20, 3, normalBtn, "TitleScreen");
        normalBtnLeft.addAnimation("normal", { x: 0, y: 544 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        normalBtnLeft.changeAnimation("normal");
        TitleScreen.list.push(normalBtnLeft);
        let normalBtnRight = new Sprite({ w: 17, h: 17 }, normalBtn.width + 3, 3, normalBtn, "TitleScreen");
        normalBtnRight.addAnimation("normal", { x: 0, y: 544 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        normalBtnRight.changeAnimation("normal");
        TitleScreen.list.push(normalBtnRight);


        let pixelBtn = new Button({ w: 60, h: 24, v: 7}, centerX(60), 130, null, { cb: TitleScreen.start, arg: 2 }, "TitleScreen", TitleScreen.STATE.Main, "PIXEL", 1);
        pixelBtn.setFreeLabel();
        pixelBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        pixelBtn.setTextCenterY();
        TitleScreen.list.push(pixelBtn.getSprite());

        let pixelBtnLeft = new Sprite({ w: 17, h: 17 }, -20, 3, pixelBtn, "TitleScreen");
        pixelBtnLeft.addAnimation("normal", { x: 0, y: 561 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        pixelBtnLeft.changeAnimation("normal");
        TitleScreen.list.push(pixelBtnLeft);
        let pixelBtnRight = new Sprite({ w: 17, h: 17 }, pixelBtn.width + 3, 3, pixelBtn, "TitleScreen");
        pixelBtnRight.addAnimation("normal", { x: 0, y: 561 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        pixelBtnRight.changeAnimation("normal");
        TitleScreen.list.push(pixelBtnRight);


        let kanjiBtn = new Button({ w: 60, h: 24, v: 7}, centerX(60), 160, null, { cb: TitleScreen.start, arg: 3 }, "TitleScreen", TitleScreen.STATE.Main, "漢字", 1);
        kanjiBtn.setFreeLabel();
        kanjiBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        kanjiBtn.setTextCenterY();
        TitleScreen.list.push(kanjiBtn.getSprite());

        let kanjiBtnLeft = new Sprite({ w: 17, h: 17 }, -20, 3, kanjiBtn, "TitleScreen");
        kanjiBtnLeft.addAnimation("normal", { x: 0, y: 578 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        kanjiBtnLeft.changeAnimation("normal");
        TitleScreen.list.push(kanjiBtnLeft);
        let kanjiBtnRight = new Sprite({ w: 17, h: 17 }, kanjiBtn.width + 3, 3, kanjiBtn, "TitleScreen");
        kanjiBtnRight.addAnimation("normal", { x: 0, y: 578 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        kanjiBtnRight.changeAnimation("normal");
        TitleScreen.list.push(kanjiBtnRight);


        let hanziBtn = new Button({ w: 60, h: 24, v: 7}, centerX(60), 190, null, { cb: TitleScreen.start, arg: 4 }, "TitleScreen", TitleScreen.STATE.Main, "中文", 1);
        hanziBtn.setFreeLabel();
        hanziBtn.setFontColor(CARD_BTN_SDW_COLOR, BLACK_COLOR, CARD_BTN_SDW_COLOR);
        hanziBtn.setTextCenterY();
        TitleScreen.list.push(hanziBtn.getSprite());

        let hanziBtnLeft = new Sprite({ w: 17, h: 17 }, -20, 3, hanziBtn, "TitleScreen");
        hanziBtnLeft.addAnimation("normal", { x: 0, y: 595 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        hanziBtnLeft.changeAnimation("normal");
        TitleScreen.list.push(hanziBtnLeft);
        let hanziBtnRight = new Sprite({ w: 17, h: 17 }, hanziBtn.width + 3, 3, hanziBtn, "TitleScreen");
        hanziBtnRight.addAnimation("normal", { x: 0, y: 595 }, 4, [firstFrameSpeed, 0.05, 0.1, 0.05]);
        hanziBtnRight.changeAnimation("normal");
        TitleScreen.list.push(hanziBtnRight);


        Button.resetTypeState("TitleScreen", TitleScreen.STATE.Main);
    }

    static start(pArg) {
        switch(pArg) {
            case 1:
                mainState = MAIN_STATE.Game;
                Game.currentGameType = Game.GAME_TYPE.Normal;
                PIXEL_MODE = 1;
                Card.initCardList();
                changeMode();
                break;
            case 2:
                changeMode();
                break;
            case 3:
                mainState = MAIN_STATE.Game;
                Game.currentGameType = Game.GAME_TYPE.Kanji;
                PIXEL_MODE = 1;
                Card.initCardList();
                changeMode();
                break;
            case 4:
                mainState = MAIN_STATE.Game;
                Game.currentGameType = Game.GAME_TYPE.Hanzi;
                PIXEL_MODE = 1;
                Card.initCardList();
                changeMode();
                break;
        }
    }

    static update(dt) {

        Sprite.manageBeforeUpdating(TitleScreen.list, dt);

        Panel.currentList.forEach(p => {
            p.update(dt)
        });

        TitleScreen.list = TitleScreen.list.filter(sp => {
            return !sp.delete;
        });
    }

    static draw(ctx) {
        Sprite.manageBeforeDrawing(TitleScreen.list);
    }

}