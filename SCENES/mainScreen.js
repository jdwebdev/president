class MainScreen {

    static STATE = Object.freeze({
        Main: 0,
    });

    static currentState = MainScreen.STATE.Main;

    static list = [];

    constructor() {
    }

    static init() {
        canvas.style.backgroundColor = CANVAS_ORIGIN_COLOR;

        let JS_ENGINE = new Sprite({ w: 144, h: 16 }, centerX(144), 30, null, "jadona");
        JS_ENGINE.addAnimation("normal", { x: 64, y: 0 });
        JS_ENGINE.changeAnimation("normal");
        MainScreen.list.push(JS_ENGINE);

        let testBtn = new Button({ w: 80, h: 23, v: 6}, centerX(80), centerY(40, 30), null, { cb: log, arg: "Hello World"}, "MainScreen", MainScreen.STATE.Main, "Hello World", 0); //? 0 : btn style par défaut
        testBtn.setFreeLabel();
        testBtn.setFontColor(RED_BTN_SDW_COLOR);
        MainScreen.list.push(testBtn.getSprite());

        Button.resetTypeState("MainScreen", MainScreen.STATE.Main);
    }



    static update(dt) {

        Sprite.manageBeforeUpdating(MainScreen.list, dt);

        Panel.currentList.forEach(p => {
            p.update(dt)
        });

        MainScreen.list = MainScreen.list.filter(sp => {
            return !sp.delete;
        });
    }

    static draw(ctx) {
        Sprite.manageBeforeDrawing(MainScreen.list);
    }

}