class SplashScreen {
    constructor() { }

    static init() {

        Button.currentList = Button.currentList.filter(b => {
            return b.type != "all";
        });

        mainState = MAIN_STATE.Splash;

        canvas.style.backgroundColor = "black";

        // TODO Change "toMainMenu"
        this.timer = new Timer(1, SplashScreen.toNextScene);
        this.bTransition = false;

        this.jadona = new Sprite({ w: 37, h: 34 }, centerX(37), centerY(34), null, "jadona");
        this.jadona.addAnimation("normal", { x: 0, y: 0 });
        this.jadona.changeAnimation("normal");

        FadeEffect.fade({ callback: { cb: SplashScreen.playSound.bind(this), arg: null }, direction: "in", maxTimer: 0.1 });
    }

    static toNextScene() {
        changeMainState(MAIN_STATE.MainScreen);
    }

    static playSound() {
        this.bTransition = true;
        FadeEffect.bActive = false;
        Sound.play("jadona");
    }

    static update(dt) {
        if (this.bTransition) {
            this.timer.update(dt);
        }
        if (FadeEffect.bActive) {
            FadeEffect.update(dt);
        }
    }

    static draw(ctx) {
        this.jadona.draw(ctx);
        if (FadeEffect.bActive) {
            FadeEffect.draw(ctx);
        }
    }
}