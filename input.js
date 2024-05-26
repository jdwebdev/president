class Input {
    static MOUSE_MOVE = true;
    static MOUSE_WHEEL = false;
    static MOUSE_DOWN = true;
    static MOUSE_CLICK = true;
    static KEYBOARD_KEYDOWN = false;
    static KEYBOARD_KEYUP = true;
    static CONTEXT_MENU = true;

    static bDownKey = false;
    static bUpKey = false;
    static bEnterKey = false;
    static bIsKeyDown = false;

    static passwordTimer = null;

    static bKeyboardClose = true;
    static bKeyboardActive = false; //? Général
    static keyboardSpriteList = [];
    static keyboardList = [];

    static LC_alphabet = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    static UC_alphabet = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
    static num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    static bCaps = true;

    constructor() { }

    static init() {


        this.keyboardPanel = new Panel({ w: 450, h: 124, v: 6 }, 0, 300, null, "", null, "", 8);
        this.keyboardPanel.setDestination({ x: 0, y: CANVAS_HEIGHT - 124 });
        this.keyboardPanel.setCanMove(true);
        this.keyboardPanel.setMovingSpeed(0.6);
        this.keyboardPanel.setMoveCB(Input.activeKeyboardBtn.bind(this), "");
        Input.keyboardSpriteList.push(this.keyboardPanel.getSprite());

        this.keyboardSprite = new Sprite({ w: 33, h: 24 }, 10, 8, this.keyboardPanel);
        this.keyboardSprite.addAnimation("normal", { x: 931, y: 90 });
        this.keyboardSprite.addAnimation("nope", { x: 964, y: 90 }, 4, 0.4, false);
        this.keyboardSprite.setAnimationCB("nope", { cb: Input.hideCloseKeyboardMessage.bind(this), arg: "" });
        this.keyboardSprite.changeAnimation("normal");
        Input.keyboardSpriteList.push(this.keyboardSprite);

        this.keyboardInstructionPanel = new Panel({ w: 150, h: 20 }, 50, 5, this.keyboardPanel, "", null, "keyboard_instruction", 0, true);
        this.keyboardInstructionPanel.getSprite().addAnimation("normal", { x: 352, y: 208 }); //? Espace vide dans la sprite sheet
        this.keyboardInstructionPanel.getSprite().changeAnimation("normal");
        this.keyboardInstructionPanel.setFontColor(GREY_162_COLOR, RED_COLOR);
        this.keyboardInstructionPanel.setAlpha(0);
        this.keyboardInstructionPanel.setAlignText(0);
        Input.keyboardSpriteList.push(this.keyboardInstructionPanel.getSprite());

        let originX = centerX(91, 1, 1);
        let originY = CANVAS_HEIGHT - 36;
        let originDestinationX = originX;
        let originDestinationY = CANVAS_HEIGHT - 26;

        this.virtualKeyboardMessage = new Panel({ w: 91, h: 18 }, originX, originY, null, "", null, "virtual_keyboard", 0, true);
        this.virtualKeyboardMessage.getSprite().addAnimation("normal", { x: 862, y: 72 });
        this.virtualKeyboardMessage.getSprite().changeAnimation("normal");
        this.virtualKeyboardMessage.setFontColor(TEST_BTN_HVR_COLOR);
        this.virtualKeyboardMessage.setAlignText(1);
        this.virtualKeyboardMessage.setTextOverflow(true);
        this.virtualKeyboardMessage.setOffsets(5, 10);
        this.virtualKeyboardMessage.setMovingType(Panel.MOVING_TYPE.ComeAndGo);
        this.virtualKeyboardMessage.setOriginPos({ x: originX, y: originY });
        this.virtualKeyboardMessage.setOriginDestination({ x: originDestinationX, y: originDestinationY });
        this.virtualKeyboardMessage.beginMoving({ x: originDestinationX, y: originDestinationY }, 1);
        Input.keyboardSpriteList.push(this.virtualKeyboardMessage.getSprite());

        let capsBtn = new KeyboardBtn({ w: 44, h: 22 }, 200, 10, this.keyboardPanel, Input.caps, "", null, "", 0, true);
        capsBtn.setAnimations({ x: 560, y: 144 });
        Input.keyboardSpriteList.push(capsBtn.getSprite());
        Input.keyboardList.push(capsBtn);

        let delBtn = new KeyboardBtn({ w: 42, h: 22 }, 251, 10, this.keyboardPanel, { cb: Input.handleKeyboardClick, arg: -1 }, "", null, "", 0, true);
        delBtn.setAnimations({ x: 560, y: 166 });
        Input.keyboardSpriteList.push(delBtn.getSprite());
        Input.keyboardList.push(delBtn);

        let leftBtn = new KeyboardBtn({ w: 23, h: 22 }, 278, 90, this.keyboardPanel, { cb: Input.moveCursor, arg: false }, "", null, "", 0, true);
        leftBtn.setAnimations({ x: 692, y: 144 });
        Input.keyboardSpriteList.push(leftBtn.getSprite());
        Input.keyboardList.push(leftBtn);

        let rightBtn = new KeyboardBtn({ w: 23, h: 22 }, 330, 90, this.keyboardPanel, { cb: Input.moveCursor, arg: true }, "", null, "", 0, true);
        rightBtn.setAnimations({ x: 692, y: 166 });
        Input.keyboardSpriteList.push(rightBtn.getSprite());
        Input.keyboardList.push(rightBtn);

        let upBtn = new KeyboardBtn({ w: 23, h: 22 }, 304, 65, this.keyboardPanel, { cb: Input.changeFocus, arg: false }, "", null, "", 0, true);
        upBtn.setAnimations({ x: 761, y: 144 });
        Input.keyboardSpriteList.push(upBtn.getSprite());
        Input.keyboardList.push(upBtn);

        let downBtn = new KeyboardBtn({ w: 23, h: 22 }, 304, 90, this.keyboardPanel, { cb: Input.changeFocus, arg: true }, "", null, "", 0, true);
        downBtn.setAnimations({ x: 761, y: 166 });
        Input.keyboardSpriteList.push(downBtn.getSprite());
        Input.keyboardList.push(downBtn);

        let nextBtn = new KeyboardBtn({ w: 29, h: 27 }, 302, 20, this.keyboardPanel, { cb: Input.changeFocus, arg: true }, "", null, "", 0, true);
        nextBtn.setAnimations({ x: 832, y: 144 });
        Input.keyboardSpriteList.push(nextBtn.getSprite());
        Input.keyboardList.push(nextBtn);

        this.openKeyboardBtn = new Button({ w: 51, h: 8 }, centerXElement(this.keyboardPanel, 51), -8, this.keyboardPanel, Input.openKeyboard.bind(this), "", null, "", 0, true);
        this.openKeyboardBtn.setAnimations({ x: 626, y: 120 });
        this.openKeyboardBtn.setIdTest("key");
        Input.keyboardSpriteList.push(this.openKeyboardBtn.getSprite());
        Input.keyboardList.push(this.openKeyboardBtn);

        originX = 45;
        originY = 40;
        let x = originX;
        let y = originY;

        for (let i = 0; i < 26; i++) {
            if (i == 10) {
                x = originX + 11;
                y += 25;
            } else if (i == 19) {
                x = originX + 36;
                y += 25;
            }

            let alphabetBtn = new KeyboardBtn({ w: 23, h: 22 }, x, y, this.keyboardPanel, { cb: Input.handleKeyboardClick, arg: i }, "", null, "alpha_" + Input.LC_alphabet[i], 0, true);
            alphabetBtn.setAnimations({ x: 862, y: 92 });
            alphabetBtn.setFontColor(RED_BTN_SDW_COLOR);
            alphabetBtn.setOffsets(-1, 13);
            alphabetBtn.setTextCase("all");
            Input.keyboardSpriteList.push(alphabetBtn.getSprite());
            Input.keyboardList.push(alphabetBtn);

            x += 25;
        }

        originX = 406;
        x = originX;
        y = 15;

        for (let i = 9; i >= 0; i--) {

            if (i == 6 || i == 3) {
                x = originX;
                y += 25;
            }
            if (i == 0) {
                x = originX - 25;
                y += 25;
            }

            let numBtn = new KeyboardBtn({ w: 23, h: 22 }, x, y, this.keyboardPanel, { cb: Input.handleKeyboardClick, arg: "num_" + i }, "", null, "num_" + i, 0, true);
            numBtn.setAnimations({ x: 862, y: 92 });
            numBtn.setFontColor(RED_BTN_SDW_COLOR);
            numBtn.setOffsets(-1, 13);
            Input.keyboardSpriteList.push(numBtn.getSprite());
            Input.keyboardList.push(numBtn);

            x -= 25;
        }

        Input.keyboardList.forEach(b => {
            b.setState(Button.STATE.Inactive);
        });
    }

    static resetKeyboardPosition() {
        Input.bKeyboardClose = true;
        this.keyboardPanel.x = this.keyboardPanel.startPos.x;
        this.keyboardPanel.y = this.keyboardPanel.startPos.y;
        this.keyboardPanel.children.forEach(c => {
            c.updatePosition();
        });

        this.keyboardList.forEach(b => {
            b.setState(Button.STATE.Inactive);
        });

        this.openKeyboardBtn.setAnimations({ x: 626, y: 120 });
        this.openKeyboardBtn.setState(Button.STATE.Normal);
        this.openKeyboardBtn.getSprite().changeAnimation("Normal");

        this.keyboardSprite.changeAnimation("normal");
        this.keyboardInstructionPanel.setAlpha(0);

    }

    //?! Handle l'insertion d'un char dans les EntryField
    static handleEntryField(pKey) {
        EntryField.currentList.every(e => {
            if (e.getState() == EntryField.STATE.Focus) {
                if (pKey === -1) { //? Remove
                    if (e.label != "" && e.sp.cursor.offX != e.cursorPosXOrigin) {
                        Sound.play("typingdelete");
                        if (e.sp.cursor.offX == e.cursorPosXOrigin + (e.label.length * 5)) { //? Si le cursor est à la fin du label
                            e.label = e.label.slice(0, e.label.length - 1);
                            e.sp.cursor.offX -= 5;
                        } else {
                            let char = (e.sp.cursor.offX - e.cursorPosXOrigin) / 5;
                            if (char == 1) {
                                e.label = e.label.substring(1, e.label.length);
                                e.sp.cursor.offX = e.cursorPosXOrigin;
                            } else {
                                e.label = e.label.substring(0, char - 1) + e.label.substring(char, e.label.length);
                                e.sp.cursor.offX -= 5;
                            }
                        }
                        e.sp.cursor.changeAnimation("normal");
                    }
                } else { //? Add new char

                    if (e.label.length < 20) {
                        Sound.play("typing");
                        if (e.sp.cursor.offX == e.cursorPosXOrigin + (e.label.length * 5)) { //? Si le cursor est à la fin du label                    
                            e.label += pKey;
                            e.sp.cursor.offX += 5;
                        } else {
                            let char = (e.sp.cursor.offX - e.cursorPosXOrigin) / 5;
                            if (e.sp.cursor.offX == e.cursorPosXOrigin) {
                                e.label = pKey + e.label;
                                e.sp.cursor.offX += 5;
                            } else {
                                e.label = e.label.slice(0, char) + pKey + e.label.slice(char, e.label.length);
                                e.sp.cursor.offX += 5;
                            }
                        }
                    }
                    e.sp.cursor.changeAnimation("normal");
                }
                return false;
            }
            return true;
        });
    }

    //? Right/Left
    static moveCursor(pRight) {
        Sound.play("entry");
        EntryField.currentList.forEach(e => {
            if (e.getState() == EntryField.STATE.Focus) {
                if (pRight) {
                    e.sp.cursor.offX += 5;
                    if (e.sp.cursor.offX > e.cursorPosXOrigin + (e.label.length * 5)) {
                        e.sp.cursor.offX = e.cursorPosXOrigin + (e.label.length * 5);
                    }
                } else {
                    e.sp.cursor.offX -= 5;
                    if (e.sp.cursor.offX < e.cursorPosXOrigin) {
                        e.sp.cursor.offX = e.cursorPosXOrigin;
                    }
                }
                e.sp.cursor.changeAnimation("normal");
            }
        });
    }

    //? Next, Up/Down, Tab physic key
    static changeFocus(pDown) {
        let newIndex = -1;
        let oldIndex = -1;
        EntryField.currentList.forEach((e, index) => {
            if (e.getState() == EntryField.STATE.Focus) {
                oldIndex = index
                if (pDown) {
                    if (index < EntryField.currentList.length - 1) {
                        newIndex = index + 1
                    } else {
                        newIndex = 0;
                    }
                } else {
                    if (index > 0) {
                        newIndex = index - 1;
                    } else {
                        newIndex = EntryField.currentList.length - 1;
                    }
                }
            }
        });

        if (newIndex != -1 && oldIndex != -1) {

            EntryField.currentList[newIndex].setState(EntryField.STATE.Focus);
            EntryField.currentList[newIndex].changeSpriteAnimation("focus");
            // Sound.list["entry"].audioPlay();
            Sound.play("entry");
            EntryField.currentList[newIndex].textOffsetX = EntryField.currentList[newIndex].textOffsetXFocus;
            EntryField.currentList[newIndex].textOffsetY = EntryField.currentList[newIndex].textOffsetYFocus;
            EntryField.currentList[newIndex].sp.cursor.changeAnimation("normal");
            EntryField.currentList[newIndex].sp.cursor.offX = EntryField.currentList[newIndex].cursorPosXOrigin + EntryField.currentList[newIndex].label.length * 5

            //! En dur
            if (EntryField.currentList[oldIndex].focusCB) {
                if (newIndex == 0) { //! Index en dur
                    Login.bTooltipIncluded = false;
                    EntryField.currentList[oldIndex].getTooltip().forEach(sp => {
                        if (sp instanceof Sprite) {
                            sp.delete = true;
                            sp.currentFrame = 0;
                        } else {
                            sp.getSprite().delete = true;
                        }
                    })
                }
            }

            if (EntryField.currentList[newIndex].focusCB) {
                EntryField.currentList[newIndex].focusCB.cb(EntryField.currentList[newIndex].focusCB.arg);
            }

            EntryField.currentList[oldIndex].setState(EntryField.STATE.Normal);
            EntryField.currentList[oldIndex].changeSpriteAnimation("normal");
            EntryField.currentList[oldIndex].sp.cursor.changeAnimation("none");
            EntryField.currentList[oldIndex].textOffsetX = EntryField.currentList[oldIndex].textOffsetXOrigin;
            EntryField.currentList[oldIndex].textOffsetY = EntryField.currentList[oldIndex].textOffsetYOrigin;
        }


    }

    static showPassword() {
        Input.passwordTimer = new Timer(2, Input.hidePassword)
        EntryField.currentList.forEach(e => {
            if (e.bPasswordField) {
                e.setPassword(false);
            }
        });
    }

    static hidePassword() {
        Input.passwordTimer = null;
        EntryField.currentList.forEach(e => {
            if (e.bPasswordField) {
                e.setPassword(true);
            }
        });
    }

    static caps() {
        Sound.play("entry");
        Input.bCaps = !Input.bCaps;
        Input.keyboardList.forEach(b => {
            if (Input.bCaps) {
                b.setTextCase("all");
            } else {
                b.setTextCase("normal");
            }
        });
    }

    //? Mouse click on virtual keyboard keys (A-Z, 0-9, DEL)
    static handleKeyboardClick(pIndex) {
        if (pIndex == -1) { //? Del
            Input.handleEntryField(pIndex);
        } else if (typeof pIndex == "string") { //? "num_" + index
            Input.handleEntryField(pIndex.split("_")[1]);
        } else { //? Normal 
            if (Input.bCaps) {
                Input.handleEntryField(Input.UC_alphabet[pIndex]);
            } else {
                Input.handleEntryField(Input.LC_alphabet[pIndex]);
            }
        }
    }

    static openKeyboard() {
        if (!Input.bKeyboardClose) { //? Close
            this.keyboardPanel.startPos.x = this.keyboardPanel.x;
            this.keyboardPanel.startPos.y = this.keyboardPanel.y;
            this.keyboardPanel.setDestination({ x: 0, y: CANVAS_HEIGHT });
            this.keyboardPanel.setMoving(true);
            Input.bKeyboardClose = true;
            Sound.play("keyboard2");

            this.openKeyboardBtn.setAnimations({ x: 626, y: 120 });
            this.openKeyboardBtn.setState(Button.STATE.Inactive);
            this.openKeyboardBtn.getSprite().changeAnimation("Normal");
            Input.keyboardList.forEach(b => {
                b.setState(Button.STATE.Inactive);
            });
        } else { //? Open
            this.keyboardPanel.startPos.x = this.keyboardPanel.x;
            this.keyboardPanel.startPos.y = this.keyboardPanel.y;
            this.keyboardPanel.setDestination({ x: 0, y: CANVAS_HEIGHT - 124 });
            this.keyboardPanel.setMoving(true);
            Input.bKeyboardClose = false;
            Sound.play("keyboard");

            this.openKeyboardBtn.setAnimations({ x: 626, y: 129 });
            this.openKeyboardBtn.setState(Button.STATE.Inactive);
            this.openKeyboardBtn.getSprite().changeAnimation("Normal");

            this.virtualKeyboardMessage.setAlpha(0);
            this.virtualKeyboardMessage.bMoving = false;
        }

    }

    static activeKeyboardBtn() {
        this.openKeyboardBtn.setState(Button.STATE.Normal);
        if (!Input.bKeyboardClose) {
            Input.keyboardList.forEach(b => {
                b.setState(Button.STATE.Normal);

                if (CollisionManager.MouseCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y, b.x, b.y, b.getSize().w, b.getSize().h)) {
                    b.setState(Button.STATE.Hover);
                    b.changeSpriteAnimation("hover");
                    MOUSE_SPRITE.changeAnimation("hover");
                }
            });
        } else {
            Input.resetVirtualKeyboardMessage();

            //? Dernière fermeture avant de passer au splashscreen :
            if (Login.bConnectionSucceed) {
                Input.setKeyboardActive(false);
            }
        }
    }

    static resetVirtualKeyboardMessage() {
        this.virtualKeyboardMessage.setStartPos({ x: this.virtualKeyboardMessage.originPos.x, y: this.virtualKeyboardMessage.originPos.y })
        this.virtualKeyboardMessage.resetPosition();
        this.virtualKeyboardMessage.setDirection(1);
        this.virtualKeyboardMessage.beginMoving({ x: this.virtualKeyboardMessage.originDestination.x, y: this.virtualKeyboardMessage.originDestination.y }, 1);
    }

    static setKeyboardActive(pBool = true) {
        Input.bKeyboardActive = pBool;
    }

    static hideCloseKeyboardMessage() {
        this.keyboardSprite.changeAnimation("normal");
        this.keyboardInstructionPanel.setAlpha(0);
    }

    static update(dt) {

        if (this.keyboardPanel.bMoving) {
            this.keyboardPanel.update(dt);
        }
        if (this.virtualKeyboardMessage.bMoving) {
            this.virtualKeyboardMessage.update(dt);
        }
        // this.keyboardInstructionPanel.update(dt);
        if (Input.passwordTimer != null) Input.passwordTimer.update(dt);
        Sprite.manageBeforeUpdating(Input.keyboardSpriteList, dt);
    }

}

document.addEventListener("fullscreenchange", e => {
    if (FULLSCREEN) {
        FULLSCREEN = false;
        FULLSCREEN_BTN.setAnimations({x: 1344, y: 32});
    } else {
        FULLSCREEN = true;
        FULLSCREEN_BTN.setAnimations({x: 1344, y: 54});
    }
});

// Key event
if (Input.KEYBOARD_KEYDOWN) {
    document.addEventListener("keydown", keyDown, false);
}
if (Input.KEYBOARD_KEYUP) {
    document.addEventListener("keyup", keyUp, false);
}

function keyDown(k) {

    k.preventDefault();

    if (Input.bKeyboardActive && !Input.bIsKeyDown && k.key != "Shift" && !Login.bLoading) {
        // Input.bIsKeyDown = true;

        if (!Input.bKeyboardClose) {
            Input.keyboardSprite.changeAnimation("nope");
            Input.keyboardInstructionPanel.setAlpha(1);
        } else {
            if (Input.LC_alphabet.includes(k.key) || Input.UC_alphabet.includes(k.key) || Input.num.includes(k.key)) {
                Input.handleEntryField(k.key);
            } else if (k.key == "Backspace") {
                Input.handleEntryField(-1);
            } else if (k.key.slice(0, 5) == "Arrow") {
                switch (k.key.slice(5)) {
                    case "Left":
                        Input.moveCursor(false);
                        break;
                    case "Right":
                        Input.moveCursor(true);
                        break;
                    case "Up":
                        Input.changeFocus(false);
                        Input.bIsKeyDown = true;
                        break;
                    case "Down":
                        Input.changeFocus(true);
                        Input.bIsKeyDown = true;
                        break;
                }
            } else if (k.key == "Enter") {
                if (Login.currentState == Login.STATE.Login && Login.loginSubmitBtn.getState() == Button.STATE.Normal) {
                    Login.handleSubmit();
                } else if (Login.currentState == Login.STATE.Signup && Login.submitBtn.getState() == Button.STATE.Normal) {
                    Login.handleSubmit();
                } else {
                    Input.changeFocus(true);
                    Input.bIsKeyDown = true;
                }
            } else if (k.key == "Tab") {
                if (k.shiftKey) {
                    Input.changeFocus(false);
                } else {
                    Input.changeFocus(true);
                }
                Input.bIsKeyDown = true;
            }
            /*
                ! A
                key: 'a'
                code: 'KeyQ'
                q -> KeyA
                w -> KeyZ
                z -> KeyW
                , -> KeyM
                m -> Semicolon

                ! Backspace
                key: 'Backspace'
                code: 'Backspace'

                ! Left / Right / Up / Down
                key: 'ArrowLeft' / ...
                code: 'ArrowLeft' / ...

                ! Enter / NumpadEnter
                key: 'Enter' / 'Enter'
                code: 'Enter' / 'NumpadEnter'

                ! Tab
                key: 'Tab'
                code: 'Tab'
                shiftKey : true / false
            */

        }
    }
}

function keyUp(k) {
    k.preventDefault();

    if (Input.bIsKeyDown) {
        Input.bIsKeyDown = false;
    }

    /**
     * DEBUG
     */
    if (k.code == "KeyQ") {} //? A 

    if (k.code == "KeyD") {
        DISPLAY_DEBUG = !DISPLAY_DEBUG;
    }
    if (k.code == "KeyE") {
        DISPLAY_BOX_COLLIDER = !DISPLAY_BOX_COLLIDER;
    }

    if (k.code == "Enter") {
        
    }
    if (k.code == "KeyQ") {
        FRAME_BY_FRAME = !FRAME_BY_FRAME;
    }

    if (k.code == "Space") {
        debug_STOP = !debug_STOP;
        FRAME_BY_FRAME = debug_STOP;
        if (!debug_STOP) requestAnimationFrame(run);

        // console.log(" --- MainMenu.randomKanaSpriteList : --- ");
        // console.table(MainMenu.randomKanaSpriteList);

        // console.log(" --- Sprite.list : --- ");
        // console.table(Sprite.list);
        // console.log(" --- MainMenu.mainList : --- ");
        // console.table(MainMenu.mainList);
        // console.log(" --- MainMenu.optionsList : --- ");
        // console.table(MainMenu.optionsList);
        // console.log(" --- MainMenu.creditsList : --- ");
        // console.table(MainMenu.creditsList);
        // console.log(" --- Button.list : --- ");
        // console.table(Button.list);
        // console.log(" --- Button.currentList : --- ");
        // console.table(Button.currentList);
        // console.log(" --- Panel.currentList : --- ");
        // console.table(Panel.currentList);
        // console.log(" --- Sprite.kanaList : --- ");
        // console.table(Sprite.kanaList);
    }

    // ------------------- END DEBUG
}

function pick(x, y) {
    let pixel = ctx.getImageData(x, y, 1, 1);
    let data = pixel.data;
}

//!  _______       _______  _______           _______ 
//! (       )     (       )(  ___  )|\     /|(  ____ \
//! | () () |     | () () || (   ) || )   ( || (    \/
//! | || || |     | || || || |   | || |   | || (__    
//! | |(_)| |     | |(_)| || |   | |( (   ) )|  __)   
//! | |   | |     | |   | || |   | | \ \_/ / | (      
//! | )   ( | _   | )   ( || (___) |  \   /  | (____/\
//! |/     \|(_)  |/     \|(_______)   \_/   (_______/
if (Input.MOUSE_MOVE) {
    canvas.addEventListener("mousemove", e => {
    
        const mouseX = e.layerX / SCALE_X;
        const mouseY = e.layerY / SCALE_Y;
    
        MOUSE_SPRITE.x = mouseX;
        MOUSE_SPRITE.y = mouseY;
        if (!inTransition() && mainState != MAIN_STATE.Error) {
            // pick(e.layerX, e.layerY);

            // if (mainState === MAIN_STATE.Game && !MENU) {
            //? With CPU, only Player 0
            if (mainState === MAIN_STATE.Game && Player.current === 0 && !MENU) {
                let c = null;
                let bAlreadyColliding = false;
                for (let i = Player.list[Player.current].cardList.length-1; i >= 0; i--) {
                    c = Player.list[Player.current].cardList[i];
                    if (c.state === Card.STATE.Choosable) {
                        if (c.boxCollision(mouseX, mouseY)) {
                        // if (!bAlreadyColliding && CollisionManager.MouseCollision(mouseX, mouseY, c.x, c.y, c.width, c.height)) {
                            bAlreadyColliding = true;
                            c.state = Card.STATE.Hover;
                            c.y = c.hoverY;
                        }
                    } else if (c.state === Card.STATE.Hover) {
                        if (!c.boxCollision(mouseX, mouseY)) {
                            // if (!CollisionManager.MouseCollision(mouseX, mouseY, c.x, c.y, c.width, c.height)) {
                            c.state = Card.STATE.Choosable;
                            c.y = c.normalY;
                        } else {
                            if (bAlreadyColliding) {
                                c.state = Card.STATE.Choosable;
                                // c.y++;
                                c.y = c.normalY;
                            }
                            bAlreadyColliding = true;
                        }
                    } else if (c.state === Card.STATE.Chosen && CollisionManager.MouseCollision(mouseX, mouseY, c.x, c.y, c.width, c.height)) {
                        // if (bAlreadyColliding) {
                        //     c.state = Card.STATE.Choosable;
                        //     c.y++;
                        // }
                        bAlreadyColliding = true;
                    }
                }


                if (Card.selected !== null) {

                } else { //? CHECK DECKs

                }

                let bOneCollision = false; //? to check if there's at least one collision

                Card.list.forEach(c => {
                    if (Card.selected === null) {

                    } else { //? Card Selected !
                        if (CollisionManager.MouseCollision(mouseX, mouseY, c.x, c.y, c.width, c.height)) {
                            
                        }
                    }
                    
                });
                
            }
    
            Button.currentList.forEach(b => {
                if (b.getState() != Button.STATE.Inactive && b.getState() != Button.STATE.Invisible && !b.bMoving) {
                    if (CollisionManager.MouseCollision(mouseX, mouseY, b.getPosition().x, b.getPosition().y, b.getSize().w, b.getSize().h)) {
                        if ((b.getSprite().tl != undefined && b.getSprite().tl.currentAnimation.name != "down") || // not staticSize
                            (b.getSprite().tl == undefined && b.getSprite().currentAnimation.name != "down")) {    // staticSize

                            if (b.getState() != Button.STATE.Hover) {
                                if (b.hoverCB) {
                                    b.hoverCB.cb(b.hoverCB.arg);
                                }

                                // Sound.play("hover");
                                if (b instanceof CheckboxBtn) {
                                    if (b.bChecked) {
                                        // b.setState(CheckboxBtn.STATE.Hover);
                                        // b.changeSpriteAnimation("c_hover");
                                        // MOUSE_SPRITE.changeAnimation("hover");
                                    } else {
                                        b.setState(CheckboxBtn.STATE.Hover);
                                        b.changeSpriteAnimation("hover");
                                        MOUSE_SPRITE.changeAnimation("hover");
                                    }
                                } else {
                                    b.setState(Button.STATE.Hover);
                                    b.changeSpriteAnimation("hover");
                                    MOUSE_SPRITE.changeAnimation("hover");
                                }

                                if (b.id_test == "V") {
                                    b.textOffsetX = b.textOffsetXHover;
                                    b.textOffsetY = b.textOffsetYHover;
                                    b.bTextOffsetChanged = true;
                                }

                            } else {
                                if (MOUSE_SPRITE.currentAnimation.name != "hover") {
                                    MOUSE_SPRITE.changeAnimation("hover");
                                }
                            }
                        }
                    } else { //? Mouse Moving and NO collision
                        if (b.getState() == Button.STATE.Hover) {
                            if (b.hoverCB) {
                                b.getTooltip().forEach(sp => {
                                    if (sp instanceof Sprite) {
                                        sp.delete = true;
                                        sp.currentFrame = 0;
                                    } else {
                                        sp.getSprite().delete = true;
                                    }
                                })
                                if (b.getHoverOffset()) {
                                    let func = translate.bind(b, { x: b.getHoverOffset().x, y: b.getHoverOffset().y }, true);
                                    func();
                                }
                            }
                            
                            if (b instanceof CheckboxBtn) {
                                if (b.bChecked) {
                                    b.setState(Button.STATE.Normal);
                                    b.changeSpriteAnimation("c_normal");
                                } else {
                                    b.setState(Button.STATE.Normal);
                                    b.changeSpriteAnimation("normal");
                                }
                            } else {
                                b.setState(Button.STATE.Normal);
                                b.changeSpriteAnimation("normal");
                            }
                            
                            MOUSE_SPRITE.changeAnimation("normal");

                        } else {
                            if (b.bTextOffsetChanged) b.resetOffsets();
                        }
                    }
                }
            });
        
            //? Mouse MOVE ---
            Panel.currentList.forEach(p => {
                if (p.getState() != Panel.STATE.Inactive && p.hoverable && !SETTINGS) {
                    if (CollisionManager.MouseCollision(mouseX, mouseY, p.x, p.y, p.getSize().w, p.getSize().h)) {
                        if ((p.getSprite().tl != undefined && p.getSprite().tl.currentAnimation.name != "down") || // not staticSize
                            (p.getSprite().tl == undefined && p.getSprite().currentAnimation.name != "down")) {    // staticSize
                            if (p.getState() != Panel.STATE.Hover) {
                                if (p.hoverCB) {
                                    Sound.play("kanapanel");
                                    p.hoverCB.cb(p.hoverCB.arg);
                                }
                                p.setState(Panel.STATE.Hover);
                                p.changeSpriteAnimation("hover");
                            }
                        }
                    } else {
                        if (p.getState() == Panel.STATE.Hover) {
                            if (p.hoverCB) {
                                p.getTooltip().forEach(sp => {
                                    if (sp instanceof Sprite) {
                                        sp.delete = true;
                                    } else {
                                        sp.getSprite().delete = true;
                                    }
                                })
                            }
                            p.setState(Panel.STATE.Normal);
                            p.changeSpriteAnimation("normal");
                        }
                    }
                }
            });
        }
    
        if (TRANSITION) {
            MOUSE_SPRITE.changeAnimation("normal");
        }
    });
}

//!                    _______  _______  _       
//! |\     /||\     /|(  ____ \(  ____ \( \      
//! | )   ( || )   ( || (    \/| (    \/| (      
//! | | _ | || (___) || (__    | (__    | |      
//! | |( )| ||  ___  ||  __)   |  __)   | |      
//! | || || || (   ) || (      | (      | |      
//! | () () || )   ( || (____/\| (____/\| (____/\
//! (_______)|/     \|(_______/(_______/(_______/

if (Input.MOUSE_WHEEL) {
    canvas.addEventListener("wheel", e => {
        e.preventDefault();
        Panel.currentList.forEach(p => {
            if (p.getState() != Panel.STATE.Inactive && p instanceof DropdownPanel && p.getState() == Panel.STATE.Hover) {
                if (p.list.length > 8) {
                    if (e.deltaY == -100) {        //? y++
                        if (p.currentPos > 0) {
                            p.currentPos--;        //? Vers le haut de la liste
                            p.cursor.offY--;
                            p.cursorUp.offY = p.cursor.offY - 2;  //! -2 ??
                            p.cursorDown.offY = p.cursor.offY + p.cursor.scaleY;
                            if (p.currentPos == 0) {
                                p.cursor.y = p.cursorStartPos;
                            }
                        }
                    } else if (e.deltaY == 100) {  //? y--
                        if (p.currentPos < p.list.length - 8) {
                            p.currentPos++;
                            p.cursor.offY++;
                            p.cursorUp.offY = p.cursor.offY - 2;
                            p.cursorDown.offY = p.cursor.offY + p.cursor.scaleY;
                            if (p.currentPos == p.list.length - 8) {
                                p.cursor.y = p.limit - p.cursor.scaleY - 2; //! -2 ??
                            }
                        }
                    }
                }
            }
        });
    
    });
}
if (Input.CONTEXT_MENU) {
    canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
    });
}

//!  _______       ______   _______           _       
//! (       )     (  __  \ (  ___  )|\     /|( (    /|
//! | () () |     | (  \  )| (   ) || )   ( ||  \  ( |
//! | || || |     | |   ) || |   | || | _ | ||   \ | |
//! | |(_)| |     | |   | || |   | || |( )| || (\ \) |
//! | |   | |     | |   ) || |   | || || || || | \   |
//! | )   ( | _   | (__/  )| (___) || () () || )  \  |
//! |/     \|(_)  (______/ (_______)(_______)|/    )_)

if (Input.MOUSE_DOWN) {

    canvas.addEventListener("mousedown", e => {
    
        if (!inTransition() && e.button == 0 && mainState != MAIN_STATE.Error) { // Left click !
    
            const mouseX = e.layerX / SCALE_X;
            const mouseY = e.layerY / SCALE_Y;
    
            if (MENU) {
                if (mainState === MAIN_STATE.Game && !CollisionManager.MouseCollision(mouseX, mouseY, Game.menuPanel.x, Game.menuPanel.y, Game.menuPanel.width, Game.menuPanel.height)) {
                    Game.closeMenu();
                }
            }
    
            let bClickedOnKeyboard = false;
            // if (MainMenu.state != MainMenu.STATE.Transition && Game1.currentState != Game1.STATE.Transition) {
                Button.currentList.every(b => {
                    if (b.getState() != Button.STATE.Inactive && b.getState() != Button.STATE.Invisible) {
    
                        if (b.getState() == Button.STATE.Hover) {

                            if (b instanceof CheckboxBtn) {
                                if (b.bChecked) {
                                    // b.changeSpriteAnimation("c_down");
                                } else {
                                    b.changeSpriteAnimation("down");
                                }
                            } else {
                                b.changeSpriteAnimation("down");
                            }

                            if (b.id == 1) { // Btn standard
                                b.textOffsetX += 1;
                                b.textOffsetY += 1;
                                b.bTextOffsetChanged = true;
                            } 
    
                            MOUSE_SPRITE.changeAnimation("down");
                            return false;
                        }
                    }
                    return true;
                });
    
            // }
        }
    })
}

//!  _______  _       _________ _______  _       
//! (  ____ \( \      \__   __/(  ____ \| \    /\
//! | (    \/| (         ) (   | (    \/|  \  / /
//! | |      | |         | |   | |      |  (_/ / 
//! | |      | |         | |   | |      |   _ (  
//! | |      | |         | |   | |      |  ( \ \ 
//! | (____/\| (____/\___) (___| (____/\|  /  \ \
//! (_______/(_______/\_______/(_______/|_/    \/
if (Input.MOUSE_CLICK) {

    canvas.onclick = e => {
        if (!Sound.bInit) {
            Sound.initAudioContext();
        }
    
        if (!inTransition() && e.button == 0 && mainState != MAIN_STATE.Error) { // Left click !
            const mouseX = e.layerX / SCALE_X;
            const mouseY = e.layerY / SCALE_Y;
    
            // if (MainMenu.state != MainMenu.STATE.Transition && Game1.currentState != Game1.STATE.Transition) {
            // if (mainState === MAIN_STATE.Game) {
            //? With CPU, only Player 0
            if (mainState === MAIN_STATE.Game && Player.current === 0) { //! GAME ---------------------

                let bAlreadyColliding = false;
                // for (let i = Player.list[Player.current].cardList.length-1; i >= 0; i--) {
                for (let i = 0; i < Player.list[Player.current].cardList.length; i++) {
                    c = Player.list[Player.current].cardList[i];
                    if (c.state === Card.STATE.Hover) { //! HOVER TO CHOSEN ---------------------
                        bAlreadyColliding = true;
                        c.state = Card.STATE.Chosen;

                        c.resetBoxColliders("c"); //? Passage des box en Chosen par défaut

                        if (i > 0) {
                            let previousCard = Player.list[Player.current].cardList[i-1]
                            if (previousCard.state === Card.STATE.Chosen) {
                                previousCard.resetBoxColliders("n"); //? Carte précédente à "n"
                            }
                        }
                        if (i < Player.list[Player.current].cardList.length-1) { //? Current card : avant dernière
                            let nextCard = Player.list[Player.current].cardList[i+1]
                            if (nextCard.state === Card.STATE.Chosen) {
                                c.resetBoxColliders("n"); //? Finalement "n" si jamais la carte suivante est Chosen
                            }
                        }
                        c.y = c.chosenY;

                        if (Card.selectedType === "") {
                            Card.selectedType = c.name;
                        } else {
                            if (!IN(c.name,["JB","JR"])) {
                                Card.selectedType = c.name;
                            }
                        }
                        
                        Card.selectedCards.push(c);

                        if (Game.currentState === Game.STATE.Main) {
                            if (Card.selectedCards.length >= Game.putCards.length) {
                                Game.putPassBtn.state = Button.STATE.Normal;
                                Game.putPassBtn.setLabel("Put");
                            }
                            Card.checkOtherCards("u");
                        } else {
                            Player.list[Player.current].cardToExchange.push(c);
                            Card.checkCardToExchangeNb();
                        }

                    //! CHOSEN TO NORMAL/HOVER --------------
                    } else if (c.state === Card.STATE.Chosen && c.boxCollision(mouseX, mouseY)) {

                        if (i > 0) {
                            let previousCard = Player.list[Player.current].cardList[i-1]
                            if (previousCard.state === Card.STATE.Chosen) {
                                previousCard.resetBoxColliders("c"); //? Carte précédente rapasse à "c"
                            }
                        }

                        //? Juste en attendant de faire le check des selectedCards et choosableCards plus bas 
                        //? On enlève le state Chosen. Puis plus bas on vérifie si on remet la carte en Hover ou en Choosable
                        c.state = Card.STATE.Normal; 
                        //? ------------------------

                        Card.selectedCards = Card.selectedCards.filter(c => {
                            return c.state === Card.STATE.Chosen;
                        })
                        if (Game.currentState === Game.STATE.Main) {
                            if (Card.selectedCards.length === 0) {
                                if (Game.putCards.length === 0) {
                                    Game.putPassBtn.state = Button.STATE.Invisible;
                                } else {
                                    Game.putPassBtn.state = Button.STATE.Normal;
                                }
                                Game.putPassBtn.setLabel("Pass");
                                Card.selectedType = "";
                                Game.setChoosableCards();
                            } else {
                                if (Card.selectedCards.length < Game.putCards.length) {
                                    Game.putPassBtn.setLabel("Pass");
                                }
                                Card.checkOtherCards("d");
                            }
                        } else {

                            c.bRemoveFromExchange = true;

                            Player.list[Player.current].cardToExchange = Player.list[Player.current].cardToExchange.filter(card => {
                                return !card.bRemoveFromExchange;
                            });

                            Game.validExchangeBtn.state = Button.STATE.Invisible;

                            Game.setChoosableForExchangeCard();
                        }

                        c.resetBoxColliders("n");
                        c.y = c.hoverY;
                        if (c.boxCollision(mouseX, mouseY)) {
                            c.state = Card.STATE.Hover;
                        } else {
                            c.state = Card.STATE.Choosable;
                            c.y = c.normalY;
                        }

                    }
                }

                if (Card.selected === null) {

                    if (Card.multiHover) {
                        // Card.multiSelect = true;
                        // Card.multiSelectPos = Card.multiHoverPos;
                        // let bFirst = true;
                        // Game.lists[Card.multiHoverPos].forEach(c => {
                        //     let card = c.getParent();
                        //     if (card.bHovering) {
                        //         if (bFirst) {
                        //             bFirst = false;
                        //             Card.selected = card;
                        //         }
                        //         card.bHovering = false;
                        //         card.bSelect = true;
                        //     }
                        // });
                    } else {
                        Card.list.every(c => {
                            // if (c.bHovering && c.state === Card.STATE.Normal) {
                                
                            //     c.bHovering = false;
                            //     c.bSelect = true;
                            //     Card.selected = c;
                            //     return false;
                            // } else if (c.bHovering && c.state === Card.STATE.FaceDown) {
                            //     c.state = Card.STATE.Normal;
                            //     c.getSprite().changeAnimation("normal");
                            //     if (MOBILE) {
                            //         c.bHovering = false;
                            //     }
                            // }
                            return true;
                        });
                    }

                } else {

                    if (Game.bDisplayOkPanel) {
                        if (Card.multiSelect) {
                            // Card.multiTransition = true;
                        } else {
                            
                        }
                    }

                    //? Ici : displayOK = false ==> désactivation de tous les selects
                    let bCollision = false;
                    Card.list.every(c => {
                        if (CollisionManager.MouseCollision(mouseX, mouseY, c.x, c.y, c.width, c.height)) {
                            bCollision = true;
                            // if (c.bSelect) {
                            //     c.bSelect = false;
                            //     Card.selected = null;
                            //     if (!MOBILE) c.bHovering = true;
                            // } else {
                            //     Card.multiSelect = false;
                            //     Card.multiSelectPos = "";
                            //     if (Card.selected !== null) Card.selected.bSelect = false;
                            //     Card.selected = null;
                            //     Game.listToGoTo = ""
                            // }
                        } else {
                            // if (c.bSelect) {
                            //     c.bSelect = false;
                            // }
                        }
                        return true;
                    });
                    if (!bCollision) {
                        Card.multiSelect = false;
                        Card.multiSelectPos = "";
                        Card.selected.bSelect = false;
                        Card.selected = null;
                        Game.bDisplayOkPanel = false;
                        Game.listToGoTo = "";
                    }
                }
            }

            Button.currentList.every(b => {
                if (b.getState() != Button.STATE.Inactive && b.getState() != Button.STATE.Invisible && !b.bMoving) {
                    if (b.getState() == Button.STATE.Hover) {                        

                        if ((b.getSprite().class == 9 && b.getSprite().tl.currentAnimation.name != "down")
                            || (b.getSprite().class != 9 && b.getSprite().currentAnimation.name != "down")
                        ) {
                            return false;
                        }

                        if (b.getHoverOffset()) {
                            let func = translate.bind(b, { x: b.getHoverOffset().x, y: b.getHoverOffset().y }, true);
                            func();
                        }

                        if (b.bTextOffsetChanged) b.resetOffsets();

                        if (b.sound != "") {
                            if (b.id_test != "go") {
                                Sound.play(b.sound);
                            } else {
                                setTimeout(() => {
                                    Sound.play(b.sound);
                                }, 500);
                            }
                        }

                        if (b instanceof CheckboxBtn) {
                            if (b.bChecked) {
                                // b.setState(Button.STATE.Normal);
                            } else {
                                b.setState(Button.STATE.Normal);
                                b.changeSpriteAnimation("normal");
                                b.check();
                            }
                        } else {
                            b.setState(Button.STATE.Normal);
                            b.changeSpriteAnimation("normal");
                        }
                        MOUSE_SPRITE.changeAnimation("normal");

                        if (b.callback.cb != null && b.callback.arg != null) {
                            b.callback.cb(b.callback.arg);
                        } else {
                            b.callback();
                        }
                        if (b.hoverCB) {
                            b.getTooltip().forEach(sp => {
                                if (sp instanceof Sprite) {
                                    sp.delete = true;
                                } else {
                                    sp.getSprite().delete = true;
                                }
                            });
                        }
                        return false;
                    } else {
                        if (b.bTextOffsetChanged) b.resetOffsets();
                    }
                }
                return true;
            });

            // Check after a screen change if the mouse isn't hovering

            if (!inTransition()) {

                Button.currentList.every(b => {
                    if (b.getState() != Button.STATE.Inactive && b.getState() != Button.STATE.Invisible && !b.bMoving) {
                        if (CollisionManager.MouseCollision(mouseX, mouseY, b.x, b.y, b.getSize().w, b.getSize().h)) {
                            if (b.hoverCB && b.getState() != Button.STATE.Hover) {
                                b.hoverCB.cb(b.hoverCB.arg);
                            }

                            if (b instanceof CheckboxBtn) {
                                if (b.bChecked) {
                                } else {
                                    b.setState(Button.STATE.Hover);
                                    b.changeSpriteAnimation("hover");
                                    MOUSE_SPRITE.changeAnimation("hover");
                                }
                            } else {
                                if (!MOBILE) b.setState(Button.STATE.Hover);
                                if (!MOBILE) b.changeSpriteAnimation("hover");
                                MOUSE_SPRITE.changeAnimation("hover");

                            }

                            
                            return false;
                        } else {
                            if (b.getState() == Button.STATE.Hover) {
                                if (b.bTextOffsetChanged) b.resetOffsets();
                                b.setState(Button.STATE.Normal);
                                b.changeSpriteAnimation("normal");
                                MOUSE_SPRITE.changeAnimation("normal");
                            }
                        }
                    }
                    return true;
                });

            }
    
            // }
        }
        if (TRANSITION) {
            MOUSE_SPRITE.changeAnimation("normal");
        }
    }
}

/**
 *
 * FIN GESTION MENU MOUSE
 *
 */