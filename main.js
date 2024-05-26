
// TODO MAIN
//!---------------

// ♣♥♦♠
let log = console.log.bind(console);
let canvas = document.getElementById("canvas");
canvas.style.fontKerning = "none";
canvas.style.textRendering = "optimizeSpeed";
canvas.style.letterSpacing = 0;
let ctx0 = canvas.getContext("2d", { willReadFrequently: true });
const ctx = canvas.getContext("2d");
let canvas2 = document.getElementById("canvas2");
canvas2.style.fontKerning = "none";
canvas2.style.textRendering = "optimizeSpeed";
canvas2.style.letterSpacing = 0;
const ctx2 = canvas2.getContext("2d");

let yomiText = {
    element: document.getElementById("yomi"),
    x: 0,
    y: 0,
    size: 30,
    maxWidth: 300
}

let checkAssetsInterval = setInterval(checkAssetsLoading, 1000 / 60);
let interval;
// let lastUpdate = Date.now();
let lastUpdate = 0;
let BROWSER = window.navigator.userAgent;
if (BROWSER.includes("Firefox")) {
    BROWSER = "F";
} else if (BROWSER.includes("Edg")) { // "AppleWebKit" Chrome Safari Edg
    BROWSER = "E";
} else if (BROWSER.includes("Chrome") && BROWSER.includes("Safari")) { // "AppleWebKit" Chrome Safari
    BROWSER = "C"; //? = Brave / Opera
}

let MOBILE = false;
let PIXEL_MODE = 1;
let MENU = false;
let FRAME_BY_FRAME = false;
let DISPLAY_DEBUG = 0;
let DISPLAY_BOX_COLLIDER = 0;


const SCALE = Object.freeze({
    STATE_1: 1, //? 450x300
    STATE_2: 2, //? 900x600
    STATE_3: 3, //? 1350x900
    STATE_4: 4, //? 1800x1200
    STATE_5: 5, //? 2250x1500
    STATE_6: 6, //? 2700x1800
    STATE_7: 7  //? 3150x2100
});
const scaleList = [{}];
let offWidth = 376; //? 375*600 (iPhone 14)
let offHeight = 600;
let offSpeed = 0;
let offCanvasY = 0;
for (let i = 1; i <= 7; i++) {
    scaleList[i] = ({
        speed: 25 + offSpeed,
        canvasY: -300 + offCanvasY,
        width: offWidth,
        height: offHeight
    });
    offSpeed += 25;
    offCanvasY -= 300;
    offWidth += 376;
    offHeight += 350;
}

let currentScale = SCALE.STATE_2; //! AZE

let windowWidth = window.innerWidth;

if (windowWidth <= 1000) {
    currentScale = SCALE.STATE_1;
    if (PIXEL_MODE) currentScale = SCALE.STATE_2
    MOBILE = true;
    yomiText.x = 5;
    yomiText.y = 325;
    yomiText.size = 14;
} else {
    currentScale = SCALE.STATE_2;
    yomiText.x = 10;
    yomiText.y = 650;
    yomiText.size = 22;
    if (PIXEL_MODE) currentScale = SCALE.STATE_4
}

let SCALE_X = currentScale;
let SCALE_Y = currentScale;

if (PIXEL_MODE) {
    if (SCALE_X === 4) {
        canvas.width = scaleList[currentScale - 2].width;
        canvas.height = scaleList[currentScale - 2].height;
        if (MOBILE) {
            canvas.height = 948;
        } else {
            canvas.width = 1000;
            canvas.height = 916; //? Max Pour un écran de 1080p avec la barre de favoris de chrome. Sinon ça crée un ascenseur sur la page
        }
        // console.log("canvas.height: " + canvas.height);

    } else {
        canvas.width = scaleList[currentScale - 1].width;
        canvas.height = scaleList[currentScale - 1].height;
    }
} else {
    canvas.width = scaleList[currentScale].width;
    canvas.height = scaleList[currentScale].height;
}
canvas2.width = canvas.width;
canvas2.height = canvas.height;

//? scale 1 : 
//? scale 2 : 10 650

yomiText.element.style.fontSize = yomiText.size + "px";
yomiText.element.style.left = "" + (canvas.offsetLeft + yomiText.x) + "px";
yomiText.element.style.top = "" + yomiText.y + "px";
yomiText.element.style.maxWidth = canvas.width + "px";


let CANVAS_WIDTH = canvas.width / SCALE_X; //? 188!!!!
let CANVAS_HEIGHT = Math.ceil(canvas.height / SCALE_Y);
let FULLSCREEN = false;
// let CANVAS_SIZE
// canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)

const BLACK_COLOR = "rgba(0,0,0,1)";
const BLACK_COLOR_0 = "rgba(0,0,0,0)";
const WHITE_COLOR = "rgba(255,255,255,1)";
const WHITE_COLOR_0 = "rgba(255,255,255,0)";
const RED_COLOR = "rgba(255,0,0,1)";
const RED_COLOR_0 = "rgba(255,0,0,0)";

const GREY_100_COLOR = "rgba(100,100,100,1)";
const GREY_150_COLOR = "rgba(150,150,150,1)"; //? endGameMark shadow???
const GREY_150_COLOR_0 = "rgba(150,150,150,0)";
const GREY_162_COLOR = "rgba(162,162,162,1)"; //? keyboard instructions panel shadow
const GREY_192_COLOR_0 = "rgba(192,192,192,0)"; //? login/signup title shadow
const GREY_200_COLOR = "rgba(200,200,200,1)";

const RED_BTN_SDW_COLOR = "rgba(142,45,45,1)";
const RED_SCREENSHAKE_COLOR = "rgba(255,50,50,1)";

const TEST_BTN_SDW_COLOR = "rgba(228,223,192,1)";
const TEST_BTN_HVR_COLOR = "rgba(172,50,50,1)";

const CARD_BTN_SDW_COLOR = "rgba(29,122,66,1)";

const ENTRYFIELD_SDW_COLOR_0 = "rgba(200,200,200,0)";
const ENTRYFIELD_HVR_SDW_COLOR_0 = "rgba(100,100,100,0)";

const CHOOSETYPE_SDW_COLOR = "rgba(217,213,188,1)";
const CHOOSETYPE_SDW_COLOR_0 = "rgba(217,213,188,0)"; //? choose type title panel shadow
const ENDGAMEMARK_COLOR = "rgba(215,30,30,1)";
const INACTIVE_SDW_COLOR = "rgba(181,205,190,1)"; //? shadow (quand "inactif") (switch buttons)


const CANVAS_ORIGIN_COLOR = "rgba(213,210,193,1)";
let MUSIC_VOLUME = 0;
let SFX_VOLUME = 0.1;
let TRANSITION = false;
let SCREEN_SHAKE = false;
let SCREEN_SHAKE_X = 5;
let SCREEN_SHAKE_Y = 5;
let SCREEN_SHAKE_RED = true;
let screenShakeTimer = new Timer(0.1, { cb: setScreenShake, arg: false });
let SAVING = false;
let SAVING_SPRITE = null;

//? SETTINGS ---------------
let SETTINGS = false;
let MAIN_SPRITE_LIST = [];
let BG;
let SETTINGS_PANEL;
let SETTINGS_BTN;
let RESOLUTION_BTN;

let MUSIC_SPEAKER;
let SFX_SPEAKER;
let MUSIC_SPRITE;
let SFX_SPRITE;
let MUSIC_DOWN_BTN;
let MUSIC_UP_BTN;
let SFX_DOWN_BTN;
let SFX_UP_BTN;

let CLOSE_SETTINGS_BTN;
let FULLSCREEN_BTN;
let SETTINGS_PANEL_DATA = {
    x: 110,
    y: 0,
    w: 231,
    h: 56
}

let RESOLUTION_SETTINGS = false;
let RESOLUTION_PANEL;
let RESOLUTION_ANIM;
let RESOLUTION_PANEL_DATA = {
    x: 146,
    y: 84,
    w: 161,
    h: 121
}
//? ---------------------------

let MOUSE_SPRITE = new Sprite({ w: 8, h: 9 }, centerX(8), centerY(8));
MOUSE_SPRITE.addAnimation("normal", { x: 114, y: 34 });
MOUSE_SPRITE.addAnimation("hover", { x: 124, y: 34 });
MOUSE_SPRITE.addAnimation("down", { x: 134, y: 34 });
MOUSE_SPRITE.addAnimation("entry", { x: 144, y: 34 });
MOUSE_SPRITE.addAnimation("error", { x: 154, y: 34 });
MOUSE_SPRITE.changeAnimation("normal");


/**
 * DEBUG
 */

let titleSpeed = 2; // 0.2 - 2

let bStatsDebug = 0;
let debugDt = 0;
let debug_STOP = false;
let shortcut_tomainmenu = 0; //! ------ ------------------------------------
let boolTest = false;
let imageData = null;
let imageDatasArr = [];
// ---------------- END DEBUG

const MAIN_STATE = Object.freeze({
    TitleScreen: 0,
    Splash: 1,
    MainScreen: 2,
    Game: 3,
    Transition: 4,
})

let mainState = 3;
if (shortcut_tomainmenu) {
    mainState = MAIN_STATE.Menu;
} else {

    mainState = MAIN_STATE.Game;
    // mainState = MAIN_STATE.TitleScreen;
    // TitleScreenMode();
}

function checkAssetsLoading() {
    if (ASSETS_READY) {
        clearInterval(checkAssetsInterval);
        console.log("--- Assets loaded ---");
        init();
    } else {
        console.log("Assets not loaded yet");
    }
}

function init() {

    console.log("------------------------");
    console.log("init");

    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx2.imageSmoothingEnabled = false;
    ctx2.msImageSmoothingEnabled = false;
    ctx2.webkitImageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;

    // ARROWS = new Sprite({w: 450, h: 300}, 0, 0, null);
    // ARROWS.addAnimation("normal", {x: 1152, y: 944});
    // ARROWS.changeAnimation("normal");
    // MAIN_SPRITE_LIST.push(ARROWS.getSprite());

    if (shortcut_tomainmenu) {
        MainMenu.init();
        toMainMenu()
    } else {
        Card.initCardList();
        Game.init();
    }

    //! interval = setInterval(run, 1000 / 60);

    requestAnimationFrame(run);
}

function openSettings() {

    let offsetY = 0;

    SETTINGS = true;
    SETTINGS_BTN.setState(Button.STATE.Inactive);
    SETTINGS_BTN.getSprite().changeAnimation("inactive");
    Button.currentList.forEach(b => {
        if (b.type != "all") {
            b.setState(Button.STATE.Inactive);
        }
    });

    BG = new Sprite({ w: 1, h: 1 }, 0, 0 + offsetY, null, "normal", { x: CANVAS_WIDTH, y: CANVAS_HEIGHT });
    BG.addAnimation("normal", { x: 38, y: 3 });
    BG.changeAnimation("normal");
    BG.setIdTest("BG");
    BG.setAlpha(0);
    BG.fade(0.01);
    MAIN_SPRITE_LIST.push(BG);

    SETTINGS_PANEL = new Panel({ w: 231, h: 56 }, centerX(230), -56 + offsetY, null, "all", 0, "", 0, true);
    SETTINGS_PANEL.setIdTest("SETTINGS PANEL");
    SETTINGS_PANEL.getSprite().addAnimation("normal", { x: 1696, y: 128 });
    SETTINGS_PANEL.getSprite().changeAnimation("normal");
    SETTINGS_PANEL.setDestination({ x: centerX(230), y: 0 + offsetY });
    SETTINGS_PANEL.setCanMove(true);
    SETTINGS_PANEL.setMovingSpeed(0.2);
    SETTINGS_PANEL.setMoving(true);
    Panel.currentList.push(SETTINGS_PANEL);
    MAIN_SPRITE_LIST.push(SETTINGS_PANEL.getSprite());

    RESOLUTION_BTN = new Button({ w: 32, h: 30 }, 11, 8, SETTINGS_PANEL, { cb: openResolutionPanel, arg: "" }, "all", "", "", 0, true);
    RESOLUTION_BTN.setIdTest("reso");
    RESOLUTION_BTN.setAnimatedBtnAnimations({ x: 1472, y: 0 }, 7, [0.2, 0.1, 0.15, 0.2, 0.1, 0.15, 0.4]);
    RESOLUTION_BTN.getSprite().setIdTest("reso");
    Button.currentList.push(RESOLUTION_BTN);
    MAIN_SPRITE_LIST.push(RESOLUTION_BTN.getSprite());

    MUSIC_SPEAKER = new Sprite({ w: 16, h: 14 }, 67, 5, SETTINGS_PANEL);
    MUSIC_SPEAKER.setIdTest("bgm speaker");
    MUSIC_SPEAKER.addAnimation("normal", { x: 203, y: 96 });
    MUSIC_SPEAKER.addAnimation("mute", { x: 219, y: 96 });
    if (MUSIC_VOLUME === 0) {
        MUSIC_SPEAKER.changeAnimation("mute");
    } else {
        MUSIC_SPEAKER.changeAnimation("normal");
    }
    MAIN_SPRITE_LIST.push(MUSIC_SPEAKER.getSprite());

    SFX_SPEAKER = new Sprite({ w: 16, h: 14 }, 67, 25, SETTINGS_PANEL);
    SFX_SPEAKER.setIdTest("sfx speaker");
    SFX_SPEAKER.addAnimation("normal", { x: 203, y: 96 });
    SFX_SPEAKER.addAnimation("mute", { x: 219, y: 96 });
    if (SFX_VOLUME === 0) {
        SFX_SPEAKER.changeAnimation("mute");
    } else {
        SFX_SPEAKER.changeAnimation("normal");
    }
    MAIN_SPRITE_LIST.push(SFX_SPEAKER.getSprite());

    MUSIC_SPRITE = new Sprite({ w: 60, h: 16 }, 108, 4, SETTINGS_PANEL);
    MUSIC_SPRITE.setIdTest("bgm sp");
    MUSIC_SPRITE.addAnimation("0", { x: 672, y: 768 });
    MUSIC_SPRITE.addAnimation("1", { x: 672 + 60, y: 768 });
    MUSIC_SPRITE.addAnimation("2", { x: 672 + 60 * 2, y: 768 });
    MUSIC_SPRITE.addAnimation("3", { x: 672 + 60 * 3, y: 768 });
    MUSIC_SPRITE.addAnimation("4", { x: 672 + 60 * 4, y: 768 });
    MUSIC_SPRITE.addAnimation("5", { x: 672 + 60 * 5, y: 768 });
    MUSIC_SPRITE.addAnimation("6", { x: 672 + 60 * 6, y: 768 });
    MUSIC_SPRITE.addAnimation("7", { x: 672 + 60 * 7, y: 768 });
    MUSIC_SPRITE.addAnimation("8", { x: 672 + 60 * 8, y: 768 });
    MUSIC_SPRITE.addAnimation("9", { x: 672 + 60 * 9, y: 768 });
    MUSIC_SPRITE.addAnimation("10", { x: 672 + 60 * 10, y: 768 });
    MUSIC_SPRITE.changeAnimation(MUSIC_VOLUME * 10);
    MAIN_SPRITE_LIST.push(MUSIC_SPRITE);

    SFX_SPRITE = new Sprite({ w: 60, h: 16 }, 108, 24, SETTINGS_PANEL);
    SFX_SPRITE.setIdTest("sfx sp");
    SFX_SPRITE.addAnimation("0", { x: 672, y: 768 });
    SFX_SPRITE.addAnimation("1", { x: 672 + 60, y: 768 });
    SFX_SPRITE.addAnimation("2", { x: 672 + 60 * 2, y: 768 });
    SFX_SPRITE.addAnimation("3", { x: 672 + 60 * 3, y: 768 });
    SFX_SPRITE.addAnimation("4", { x: 672 + 60 * 4, y: 768 });
    SFX_SPRITE.addAnimation("5", { x: 672 + 60 * 5, y: 768 });
    SFX_SPRITE.addAnimation("6", { x: 672 + 60 * 6, y: 768 });
    SFX_SPRITE.addAnimation("7", { x: 672 + 60 * 7, y: 768 });
    SFX_SPRITE.addAnimation("8", { x: 672 + 60 * 8, y: 768 });
    SFX_SPRITE.addAnimation("9", { x: 672 + 60 * 9, y: 768 });
    SFX_SPRITE.addAnimation("10", { x: 672 + 60 * 10, y: 768 });
    SFX_SPRITE.changeAnimation(SFX_VOLUME * 10);
    MAIN_SPRITE_LIST.push(SFX_SPRITE);

    MUSIC_DOWN_BTN = new Button({ w: 17, h: 17 }, 88, 4, SETTINGS_PANEL, Sound.decreaseMusicVolume, "all", "", "", 0, true);
    MUSIC_DOWN_BTN.setIdTest("bgm down");
    MUSIC_DOWN_BTN.setAnimations({ x: 0, y: 95 });
    Button.currentList.push(MUSIC_DOWN_BTN);
    MAIN_SPRITE_LIST.push(MUSIC_DOWN_BTN.getSprite());

    MUSIC_UP_BTN = new Button({ w: 17, h: 17 }, 172, 4, SETTINGS_PANEL, Sound.increaseMusicVolume, "all", "", "", 0, true);
    MUSIC_UP_BTN.setIdTest("bgm up");
    MUSIC_UP_BTN.setAnimations({ x: 51, y: 95 });
    Button.currentList.push(MUSIC_UP_BTN);
    MAIN_SPRITE_LIST.push(MUSIC_UP_BTN.getSprite());

    SFX_DOWN_BTN = new Button({ w: 17, h: 17 }, 88, 24, SETTINGS_PANEL, Sound.decreaseSfxVolume, "all", "", "", 0, true);
    SFX_DOWN_BTN.setIdTest("sfx down");
    SFX_DOWN_BTN.setAnimations({ x: 0, y: 95 });
    Button.currentList.push(SFX_DOWN_BTN);
    MAIN_SPRITE_LIST.push(SFX_DOWN_BTN.getSprite());

    SFX_UP_BTN = new Button({ w: 17, h: 17 }, 172, 24, SETTINGS_PANEL, Sound.increaseSfxVolume, "all", "", "", 0, true);
    SFX_UP_BTN.setIdTest("sfx up");
    SFX_UP_BTN.setAnimations({ x: 51, y: 95 });
    Button.currentList.push(SFX_UP_BTN);
    MAIN_SPRITE_LIST.push(SFX_UP_BTN.getSprite());

    FULLSCREEN_BTN = new Button({ w: 23, h: 22 }, 198, 19, SETTINGS_PANEL, toggleFullScreen, "all", "", "", 0, true);
    FULLSCREEN_BTN.setIdTest("fullscreen");
    if (FULLSCREEN) {
        FULLSCREEN_BTN.setAnimations({ x: 1344, y: 54 });
    } else {
        FULLSCREEN_BTN.setAnimations({ x: 1344, y: 32 });
    }
    Button.currentList.push(FULLSCREEN_BTN);
    MAIN_SPRITE_LIST.push(FULLSCREEN_BTN.getSprite());

    CLOSE_SETTINGS_BTN = new Button({ w: 25, h: 11 }, 197, 0, SETTINGS_PANEL, { cb: closeSettings, arg: "" }, "all", "", "", 0, true);
    CLOSE_SETTINGS_BTN.setIdTest("close");
    CLOSE_SETTINGS_BTN.setAnimations({ x: 1776, y: 96 });
    Button.currentList.push(CLOSE_SETTINGS_BTN);
    MAIN_SPRITE_LIST.push(CLOSE_SETTINGS_BTN.getSprite());

}

function closeSettings() {
    let offsetY = 0;

    SETTINGS_PANEL.setMoveCB(SETTINGS_PANEL.delete.bind(SETTINGS_PANEL), "");
    SETTINGS_PANEL.setStartPos({ x: centerX(230), y: 0 + offsetY });
    SETTINGS_PANEL.setDestination({ x: centerX(230), y: -56 + offsetY });
    SETTINGS_PANEL.setCanMove(true);
    SETTINGS_PANEL.setMoving(true);
    BG.delete = true;
    MUSIC_SPEAKER.delete = true;
    SFX_SPEAKER.delete = true;
    MUSIC_SPRITE.delete = true;
    SFX_SPRITE.delete = true;

    SETTINGS_BTN.setState(Button.STATE.Normal);
    SETTINGS_BTN.getSprite().changeAnimation("normal");
    SETTINGS = false;
    Button.currentList.forEach(b => {
        b.setState(Button.STATE.Normal);
    });
}

function openResolutionPanel() {

    let offsetY = 0;

    Button.currentList.forEach(b => {
        if (b.type == "all") {
            b.setState(Button.STATE.Inactive);
        }
    });

    RESOLUTION_SETTINGS = true;

    RESOLUTION_PANEL = new Sprite({ w: 450, h: 300 }, 0, 0 + offsetY, null, "all");
    RESOLUTION_PANEL.addAnimation("normal", { x: 1152, y: 944 });
    RESOLUTION_PANEL.changeAnimation("normal");
    MAIN_SPRITE_LIST.push(RESOLUTION_PANEL);

    RESOLUTION_ANIM = new Sprite({ w: 63, h: 70 }, 230, 106 + offsetY);
    RESOLUTION_ANIM.addAnimation("normal", { x: 1152, y: 1244 }, 6, [0.5, 0.2, 0.1, 0.5, 0.2, 0.1]);
    RESOLUTION_ANIM.changeAnimation("normal");
    MAIN_SPRITE_LIST.push(RESOLUTION_ANIM);

    let offY = 0;
    for (let i = 1; i <= 7; i++) {
        CHECK = new CheckboxBtn({ w: 8, h: 9 }, 160, 100 + offY + offsetY, null, { cb: changeResolution, arg: i }, "all", "", "SCALE_" + i, 0, true);
        CHECK.setBoxCollider(54, 9, 0, 0);
        CHECK.setGroup(1);
        CHECK.setAnimations({ x: 1728, y: 96 });
        CHECK.setOffsets(30, 8);
        CHECK.setFontColor("rgba(191,188,168,1)", BLACK_COLOR, "rgba(191,188,168,1)", WHITE_COLOR);
        Button.currentList.push(CHECK);
        MAIN_SPRITE_LIST.push(CHECK.getSprite());
        offY += 12;
        CheckboxBtn.checklist[CHECK.label] = CHECK;
    }
    CheckboxBtn.checklist["SCALE_" + currentScale].check();
}

function closeResolutionPanel() {
    for (let i = 1; i <= 7; i++) {
        CheckboxBtn.checklist["SCALE_" + i].delete();
    }
    CheckboxBtn.checklist = CheckboxBtn.checklist.filter(b => {
        return b.group != 1;
    });
    RESOLUTION_PANEL.delete = true;
    RESOLUTION_ANIM.delete = true;

    RESOLUTION_SETTINGS = false;

    Button.currentList.forEach(b => {
        if (b.type == "all") {
            if (b.id_test != "S") b.setState(Button.STATE.Normal);
        }
    });
}

function testToast(a) {
    // toast("Toast !", "d", 0);
    // toast("Toast !", "d", 0);
}

function showUserAgent(pArg) {
    // log(pArg);
    // toast(window.innerWidth);
    toast(window.navigator.userAgent);
    log(window.navigator.userAgent);
    log(window.navigator.vendor);
}

function run(pTime) { //? Time est envoyé automatiquement par "requestAnimationFrame"
    requestAnimationFrame(run);
    if (debug_STOP && FRAME_BY_FRAME) return;

    //! let now = Date.now();
    //! let dt = (now - lastUpdate) / 1000;
    let dt = (pTime - lastUpdate) / 1000;

    if (dt < (1 / 60) - 0.001) {
        return;
    }
    //! lastUpdate = now;
    lastUpdate = pTime;
    debugDt = dt;

    if (SCREEN_SHAKE) {
        screenShakeTimer.update(dt);
    }

    switch (mainState) {
        case MAIN_STATE.TitleScreen:
            TitleScreen.update(dt);
            break;
        case MAIN_STATE.Splash:
            SplashScreen.update(dt);
            break;
        case MAIN_STATE.MainScreen:
            MainScreen.update(dt);
            break;
        case MAIN_STATE.Game:
            Game.update(dt);
            break;
    }
    if (SAVING) SAVING_SPRITE.update(dt);

    Button.currentList.forEach(b => {
        if (b.bMoving) {
            b.update(dt);
        }
    });



    Sprite.manageBeforeUpdating(MAIN_SPRITE_LIST, dt);
    MAIN_SPRITE_LIST = MAIN_SPRITE_LIST.filter(sp => {
        return !sp.delete;
    });

    MOUSE_SPRITE.update(dt);
    if (Sound.bPlayingKana) {
        if (Sound.list[Sound.currentPlayingKana].sound.ended) {
            Sound.bPlayingKana = false;
            Sound.currentPlayingKana = "";
            Button.currentList.forEach(b => {
                if (b instanceof SoundBtn) {
                    b.setState(Button.STATE.Normal);
                    b.getSprite().changeAnimation("normal");
                }
            });
        }
    }

    //! ------------------- DRAW -------------------
    Sprite.debug_drawcalls = 0;

    // if (Game.currentState === Game.STATE.Ending) {
    //     ctx2.clearRect(0,0,canvas2.width, canvas2.height);
    //     ctx2.save();
    //     ctx2.scale(SCALE_X, SCALE_Y)
    // }


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.save();
    ctx.scale(SCALE_X, SCALE_Y);


    if (SCREEN_SHAKE) {
        screenShake(ctx, SCREEN_SHAKE_X, SCREEN_SHAKE_Y);
    }

    switch (mainState) {
        case MAIN_STATE.TitleScreen:
            TitleScreen.draw(ctx);
            break;
        case MAIN_STATE.Splash:
            SplashScreen.draw(ctx);
            break;
        case MAIN_STATE.MainScreen:
            MainScreen.draw(ctx);
            break;
        case MAIN_STATE.Game:
            Game.draw(ctx);
            break;
    }

    if (SCREEN_SHAKE && SCREEN_SHAKE_RED) {
        canvas.style.backgroundColor = RED_SCREENSHAKE_COLOR;
    }

    let offset = 10;
    if (DISPLAY_DEBUG) {
        ctx.textAlign = "left";
        ctx.font = "5px jpfont";
        ctx.fillText("Drawcalls: " + Sprite.debug_drawcalls, 0, 10 + offset);
        ctx.fillText("fps: " + Math.floor((1000 / dt) / 1000), 0, 20 + offset);

        let originX = 20
        let originY = 60
        // ctx.fillText("P: " + Player.list.length, originX, originY + offset); offset += 10;
        text(ctx, "State: " + Game.getStateInfo(), originX, originY + offset); offset += 5;
        ctx.fillText("CurrentP: " + Player.list[Player.current].name, originX, originY + offset); offset += 5;
        ctx.fillText("SelectedCards: " + Card.selectedCards.length, originX, originY + offset); offset += 5;

        let cards = ""
        Player.list.forEach(p => {
            cards = "";
            p.cardList.forEach(c => {
                if (c.state === Card.STATE.Choosable) {
                    cards += "(" + c.infos() + ")";
                } else if (c.state === Card.STATE.Chosen) {
                    cards += "[[" + c.infos() + "]]";
                } else {
                    cards += c.infos();
                }
            });
            ctx.fillText(p.name + ": " + cards, originX, originY + offset); offset += 5;
        });


        // for (let i = 0; i < Player.list.length; i++) {
        //     if (i === Player.current) {
        //         ctx.fillText("P" + i + ": cur (" + Player.list[i].cardList.length + ") " + Player.list[i].bCurrent, originX, originY + offset); offset += 5;
        //     } else {
        //         ctx.fillText("P" + i + ": " + Player.list[i].orientation + " " + Player.list[i].pos + " (" + Player.list[i].cardList.length + ") " + Player.list[i].bCurrent, originX, originY + offset); offset += 5;
        //     }
        // }

        if (Game.currentState === Game.STATE.Main) {
            let cardList = Player.list[Player.current].cardList;
            if (cardList.length > 0) {
                // ctx.fillText(cardList[cardList.length-1].infos() + ": " + cardList[cardList.length-1].getStateInfo(), originX, originY + offset); offset += 5;
            }
            ctx.fillText("Select Type: " + Card.selectedType, originX, originY + offset); offset += 5;
            // ctx.fillText("Select Type: " + Card.selectedType, originX, originY + offset); offset += 5;
            if (Game.lastPutPlayer >= 0) {
                ctx.fillText("Put player: " + Player.list[Game.lastPutPlayer].name, originX, originY + offset); offset += 5;
            }
            if (Game.putCards.length > 0) {
                ctx.fillText("Last card: " + Game.putCards[0].name, originX, originY + offset); offset += 5;
            }

            ctx.fillText("Game.p4Btn:  " + Game.p4Btn.state, originX, originY + offset); offset += 5;
        } else if (Game.currentState === Game.STATE.CardExchange) {
            let cardExchange = "";
            ctx.fillText("To Exchange: ", originX, originY + offset); offset += 5;
            Player.list[Player.current].cardToExchange.forEach(c => {
                ctx.fillText("c: " + c.infos(), originX, originY + offset); offset += 5;
            });
            // ctx.fillText("Put player: " + Game.lastPutPlayer, originX, originY + offset); offset += 5;
        }



        // let debugCard = Game.lists["c1"][0].getParent()
        // ctx.fillText("card: " + debugCard.name + debugCard.type, 0, 200 + offset);
        // ctx.fillText("hover: " + debugCard.bHovering, 0, 210 + offset);
        // ctx.fillText("select: " + debugCard.bSelect, 0, 220 + offset);


        // if (Card.inTransition !== null) {
        //     ctx.fillText("CARD transition: " + Card.inTransition.name + Card.inTransition.type, 0, 220 + offset);
        // }
        // if (Card.selected != null) {
        //     ctx.fillText("CARD SELECT: " + Card.selected.name + Card.selected.type, 0, 230 + offset);
        //     ctx.fillText("CARD list to go : " + Game.listToGoTo, 0, 240 + offset);

        // }
        // ctx.fillText("CARD multiHover : " + Card.multiHover, 0, 250 + offset);
        // ctx.fillText("CARD multiSelect : " + Card.multiSelect, 0, 260 + offset);
        // ctx.fillText("CARD multiHoverPos : " + Card.multiHoverPos, 0, 270 + offset);
        // ctx.fillText("CARD multiSelectPos : " + Card.multiSelectPos, 0, 280 + offset);
        // ctx.fillText("CARD multiTransition : " + Card.multiTransition, 0, 290 + offset);
        // ctx.fillText("CARD inTransitionList : " + Card.inTransitionList.length, 0, 300 + offset);
        // ctx.fillText("CARD MovingList : " + Game.movingList.length, 0, 310 + offset);



        // let CardQS = Card.getCard("Q♠");
        // ctx.fillText("Q♠ Hover: " + CardQS.bHovering, 0, 290 + offset);

    }

    if (DISPLAY_BOX_COLLIDER) {
        let color1 = "b";
        let color2 = "r";
        let color = color1;
        if (Player.list.length > 0 && Player.current === 0 && Player.current <= Player.list.length) {
            Player.list[Player.current].cardList.forEach((c, i) => {
                if (c.state === Card.STATE.Hover) {
                    boxColliderDisplay(ctx, c.x, c.y, c.boxLeft.w - 1, c.boxLeft.h, color);
                    boxColliderDisplay(ctx, c.x, c.y, c.boxTop.w - 1, c.boxTop.h, color);
                } else if (c.state === Card.STATE.Choosable || c.state === Card.STATE.Chosen) {
                    boxColliderDisplay(ctx, c.x, c.y, c.boxLeft.w - 1, c.boxLeft.h, color);
                    boxColliderDisplay(ctx, c.x, c.y, c.boxTop.w - 1, c.boxTop.h, color);
                }
                if (isPair(i)) {
                    color = color2;
                } else {
                    color = color1;
                }
            });
        }
    }

    if (bStatsDebug) {
        ctx.fillStyle = WHITE_COLOR;
        ctx.fillText("ButtonList : " + Button.list.length, 0, 50 + offset);
        ctx.fillText("ButtonCurrent : " + Button.currentList.length, 0, 60 + offset);
        ctx.fillText("PanelList : " + Panel.list.length, 0, 70 + offset);
        ctx.fillText("PanelCurrent : " + Panel.currentList.length, 0, 80 + offset);
        ctx.fillText("MAIN_SPRITE : " + MAIN_SPRITE_LIST.length, 0, 90 + offset);
    }

    ctx.font = "10px jpfont";

    if (!Transition.bActive) {
        //? Mouse display

        if (mainState != MAIN_STATE.Load
            && mainState != MAIN_STATE.Error
            && mainState != MAIN_STATE.Splash) {
            Sprite.manageBeforeDrawing(MAIN_SPRITE_LIST);
        }
        if (!MOBILE) {
            ctx.font = "5px jpfont";
            // text(ctx, MOUSE_SPRITE.x + ":" + MOUSE_SPRITE.y + " ||| " + Math.floor(MOUSE_SPRITE.x) + ":" + Math.floor(MOUSE_SPRITE.y),10, CANVAS_HEIGHT - 35);
            MOUSE_SPRITE.ox = MOUSE_SPRITE.currentAnimation.origin.x + (MOUSE_SPRITE.width * MOUSE_SPRITE.currentFrame);
            ctx.drawImage(SS, MOUSE_SPRITE.ox, MOUSE_SPRITE.currentAnimation.origin.y, MOUSE_SPRITE.width, MOUSE_SPRITE.height, Math.floor(MOUSE_SPRITE.x), Math.floor(MOUSE_SPRITE.y), MOUSE_SPRITE.width * MOUSE_SPRITE.scaleX, MOUSE_SPRITE.height * MOUSE_SPRITE.scaleY);
        }
    }

    if (FadeEffect.bActive) {
        FadeEffect.draw(ctx);
    }

    if (Transition.bActive) {
        Transition.draw(ctx);
    }

    ctx.restore();

    // if (Game.currentState === Game.STATE.Ending) {
    //     ctx2.restore();
    // }

    //? TEST
    // ctx2.imageSmoothingEnabled = true;
    // ctx2.msImageSmoothingEnabled = true;
    // ctx2.webkitImageSmoothingEnabled = true;
    // ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    // ctx2.save();
    // ctx2.scale(1, 1);

    // ctx2.fillStyle = BLACK_COLOR;
    // ctx2.font = "50px kyokasho";
    // ctx2.fillText("TEST: " + "漢字", 0, 500);

    // ctx2.restore();

    if (debug_STOP) {
        FRAME_BY_FRAME = true;
    };

}

//? ctx, c.x, c.y, c.boxLeft.w, c.boxLeft.h, color
function boxColliderDisplay(ctx, pX, pY, pW, pH, pColor) {
    if (pColor === "r") {
        Game.lineRed1.x = pX; //? Horizontal Top
        Game.lineRed1.y = pY;
        Game.lineRed1.setScale(pW, 1);
        Game.lineRed1.draw(ctx);
        Game.lineRed2.x = pX + pW; //? Vertical Right
        Game.lineRed2.y = pY;
        Game.lineRed2.setScale(1, pH);
        Game.lineRed2.draw(ctx);
        Game.lineRed3.x = pX; //? Horizontal Bottom
        Game.lineRed3.y = pY + pH;
        Game.lineRed3.setScale(pW, 1);
        Game.lineRed3.draw(ctx);
        Game.lineRed4.x = pX; //? Vertical Left
        Game.lineRed4.y = pY;
        Game.lineRed4.setScale(1, pH);
        Game.lineRed4.draw(ctx);
    } else if (pColor === "b") {
        Game.lineBlue1.x = pX; //? Horizontal Top
        Game.lineBlue1.y = pY;
        Game.lineBlue1.setScale(pW, 1);
        Game.lineBlue1.draw(ctx);
        Game.lineBlue2.x = pX + pW; //? Vertical Right
        Game.lineBlue2.y = pY;
        Game.lineBlue2.setScale(1, pH);
        Game.lineBlue2.draw(ctx);
        Game.lineBlue3.x = pX; //? Horizontal Bottom
        Game.lineBlue3.y = pY + pH;
        Game.lineBlue3.setScale(pW, 1);
        Game.lineBlue3.draw(ctx);
        Game.lineBlue4.x = pX; //? Vertical Left
        Game.lineBlue4.y = pY;
        Game.lineBlue4.setScale(1, pH);
        Game.lineBlue4.draw(ctx);
    }
}

function changeMainState(pNewState) {

    if (FadeEffect.bActive) FadeEffect.bActive = false;
    mainState = pNewState;

    switch (mainState) {
        case MAIN_STATE.MainScreen:
            MainScreen.init();
            break;
        case MAIN_STATE.Game:
            Game.init();
            break;
    }
}

function changeMode() {
    PIXEL_MODE = PIXEL_MODE === 0 ? 1 : 0
    if (windowWidth <= 1000) {
        currentScale = SCALE.STATE_1;
        if (PIXEL_MODE) currentScale = SCALE.STATE_2
        MOBILE = true;
    } else {
        currentScale = SCALE.STATE_2;
        if (PIXEL_MODE) currentScale = SCALE.STATE_4
    }

    SCALE_X = currentScale;
    SCALE_Y = currentScale;

    if (PIXEL_MODE) {
        if (SCALE_X === 4) {
            canvas.width = scaleList[currentScale - 2].width;
            canvas.height = scaleList[currentScale - 2].height;
        } else {
            canvas.width = scaleList[currentScale - 1].width;
            canvas.height = scaleList[currentScale - 1].height;
        }
    } else {
        canvas.width = scaleList[currentScale].width;
        canvas.height = scaleList[currentScale].height;
    }
    canvas2.width = canvas.width;
    canvas2.height = canvas.height;

    CANVAS_WIDTH = canvas.width / SCALE_X; //? 188!!!!
    CANVAS_HEIGHT = canvas.height / SCALE_Y;

    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    ctx2.imageSmoothingEnabled = false;
    ctx2.msImageSmoothingEnabled = false;
    ctx2.webkitImageSmoothingEnabled = false;

    changeMainState(MAIN_STATE.Game);
    Card.initCardList();
    Game.init();

}

function TitleScreenMode() {
    if (windowWidth <= 1000) {
        currentScale = SCALE.STATE_2
    } else {
        currentScale = SCALE.STATE_4
    }

    SCALE_X = currentScale;
    SCALE_Y = currentScale;

    if (SCALE_X === 4) {
        canvas.width = scaleList[currentScale - 2].width;
        canvas.height = scaleList[currentScale - 2].height;
    } else {
        canvas.width = scaleList[currentScale - 1].width;
        canvas.height = scaleList[currentScale - 1].height;
    }

    canvas2.width = canvas.width;
    canvas2.height = canvas.height;

    CANVAS_WIDTH = canvas.width / SCALE_X; //? 188!!!!
    CANVAS_HEIGHT = canvas.height / SCALE_Y;

    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    ctx2.imageSmoothingEnabled = false;
    ctx2.msImageSmoothingEnabled = false;
    ctx2.webkitImageSmoothingEnabled = false;
}