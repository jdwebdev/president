function rnd(pMin, pMax) { // pMax NON COMPRIS
    return Math.floor(Math.random() * (pMax - pMin)) + pMin;
}

function fixedRandom() {
    let random = -1;
    do {
        random = rnd(0, RND_ARR.length);
    } while (random == ALREADY_RANDOM);
    ALREADY_RANDOM = random;
    return random;
}

function Math_angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

class Timer {
    constructor(pMax, pCallback) {
        this.value = 0;
        this.max = pMax;
        this.callback = pCallback;
    }

    update(pNumber) {
        this.value += pNumber;
        if (this.value >= this.max) {
            this.value = 0;
            if (this.callback.cb != null && this.callback.arg != null) {
                this.callback.cb(this.callback.arg);
            } else {
                this.callback();
            }
        }
    }

    setMax(pMax) {
        this.max = pMax;
    }

    reset() {
        this.value = 0;
    }
}

function centerX(pWidth = 0, pDistance = 0, pDirection = 0) {
    if (pDirection == 0) { // left
        return Math.floor((CANVAS_WIDTH * 0.5) - (pWidth * 0.5) - pDistance);
    } else { // right
        return Math.floor((CANVAS_WIDTH * 0.5) - (pWidth * 0.5) + pDistance);
    }
}

function centerY(pHeight = 0, pDistance = 0, pDirection = 0) {
    if (pDirection == 0) { // top
        return Math.floor((CANVAS_HEIGHT * 0.5) - (pHeight * 0.5) - pDistance);
    } else { // bottom
        return Math.floor((CANVAS_HEIGHT * 0.5) - (pHeight * 0.5) + pDistance);
    }
}

function centerXElement(pElement, pWidth = 0, pDistance = 0, pDirection = 0) {
    if (pDirection == 0) { // left
        if (pElement instanceof Panel && Array.isArray(pElement.id)) {
            return Math.floor((pElement.totalWidth * 0.5) - (pWidth * 0.5) - pDistance);
        } else {
            return Math.floor((pElement.width * 0.5) - (pWidth * 0.5) - pDistance);
        }
    } else { // right
        if (pElement instanceof Panel && Array.isArray(pElement.id)) {
            return Math.floor((pElement.totalWidth * 0.5) - (pWidth * 0.5) + pDistance);
        } else {
            return Math.floor((pElement.width * 0.5) - (pWidth * 0.5) + pDistance);
        }
    }
}

function centerYElement(pElement, pHeight = 0, pDistance = 0, pDirection = 0) {
    if (pDirection == 0) { // left
        if (pElement instanceof Panel && Array.isArray(pElement.id)) {
            return Math.floor((pElement.totalHeight * 0.5) - (pHeight * 0.5) - pDistance);
        } else {
            return Math.floor((pElement.height * 0.5) - (pHeight * 0.5) - pDistance);
        }
    } else { // right
        if (pElement instanceof Panel && Array.isArray(pElement.id)) {
            return Math.floor((pElement.totalHeight * 0.5) - (pHeight * 0.5) + pDistance);
        } else {
            return Math.floor((pElement.height * 0.5) - (pHeight * 0.5) + pDistance);
        }
    }
}

function centerPoint(pWidth, pPoint) {
    return Math.floor(pPoint - pWidth/2);
}

function id(pElement) {
    return document.getElementById(pElement);
}

function text(ctx, pContent, pX, pY, pColor = BLACK_COLOR) {
    ctx.fillStyle = pColor;
    ctx.fillText(pContent, pX, pY);
}

//? Draw a simple line
function drawLine(ctx, pStartX, pStartY, pTargetX, pTargetY, pColor = BLACK_COLOR, bDash = false) {
    ctx.beginPath();
    ctx.strokeStyle = pColor;
    if (bDash) {
        ctx.setLineDash([5, 10]);
    } else {
        ctx.setLineDash([]);
    }
    ctx.moveTo(pStartX, pStartY);
    ctx.lineTo(pTargetX, pTargetY);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawRect(ctx, pX, pY, pW, pH, pColor = BLACK_COLOR) {
    ctx.strokeStyle = pColor;
    ctx.strokeRect(pX, pY, pW, pH);
}

function drawFilledRect(ctx, pX, pY, pW, pH, pColor = BLACK_COLOR) {
    ctx.fillStyle = pColor;
    ctx.fillRect(pX, pY, pW, pH);
}

function drawCircle(ctx, pX, pY, pR, pColor = BLACK_COLOR, bDash = false) {
    ctx.strokeStyle = pColor;
    ctx.beginPath();
    if (bDash) {
        ctx.setLineDash([2, 1]);
    } else {
        ctx.setLineDash([]);
    }
    ctx.arc(pX, pY, pR, 0, Math.PI * 2);
    ctx.stroke();
}

function drawFilledCircle(ctx, pX, pY, pR, pColor = BLACK_COLOR) {
    ctx.fillStyle = pColor;
    ctx.beginPath();
    ctx.arc(pX, pY, pR, 0, Math.PI * 2);
    ctx.fill();
}

function drawEllipse(ctx, pX, pY, pRX, pRY, pColor = BLACK_COLOR) {
    ctx.strokeStyle = pColor;
    ctx.beginPath();
    ctx.ellipse(pX, pY, pRX, pRY, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawFilledEllipse(ctx, pX, pY, pRX, pRY, pColor = BLACK_COLOR) {
    ctx.fillStyle = pColor;
    ctx.beginPath();
    ctx.ellipse(pX, pY, pRX, pRY, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBezierCurve(ctx, pStartX, pStartY, pFirstX, pFirstY, pSecondX, pSecondY, pEndX, pEndY, pColor = BLACK_COLOR) {
    ctx.strokeStyle = pColor;
    ctx.beginPath();
    ctx.moveTo(pStartX, pStartY);
    ctx.bezierCurveTo(pFirstX, pFirstY, pSecondX, pSecondY, pEndX, pEndY);
    ctx.fillStyle = WHITE_COLOR;
    ctx.fill();
    ctx.stroke();
}

//? Transformer un range en un autre en gardant le ratio : [-1:1] => [50:150] : Si 0 => 50% => 100
function map(pValue, pMin1, pMax1, pMin2, pMax2) {
    let p1_100Percent = pMax1 - pMin1;
    let diffMin = pValue - pMin1;
    let ratio = diffMin / p1_100Percent;
    return ((pMax2 - pMin2) * ratio) + pMin2;
}

function map_example(pValue, pMin1, pMax1, pMin2, pMax2, pRatio) { //? -1, 1, 50, 150
    let p1_100Percent = pMax1 - pMin1; //? 2
    let diffMin = 0;
    let diffMax = 0;
    let ratio = 0;

    diffMax = pMax1 - pValue;
    diffMin = pValue - pMin1;
    ratio = diffMin / p1_100Percent;
    pRatio[0] = ratio*100;
    return ((pMax2 - pMin2) * ratio) + pMin2;
}

function isPair(pNb) {
    return pNb % 2 == 0;
}

function isMultiple(pNb1, pNb2) {
    return pNb1 % pNb2 == 0;
}

function almostEqual(pValue, pTargetValue, pOffset = 1) {
    return  (Math.floor(pValue) == pTargetValue - pOffset) || (Math.floor(pValue) == pTargetValue) || (Math.floor(pValue) == pTargetValue + pOffset);
}

function randomColor(pAlpha = 1) {
    return "rgba(" + rnd(0, 256) + "," + rnd(0, 256) + "," + rnd(0, 256) + "," + pAlpha + ")";
}

//? To sort an array of numbers
function sort(pArray, pSortedArray, bAscending = true) {
    for (let i = pArray.length-1; i >= 0; i--) {
        if (i !== 0) {
            if (pArray[i] < pArray[i-1]) {
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
                return;
            }
        }
    }

    sort(pArray, pSortedArray, bAscending);
}

function sortZOrder(pArray, pSortedArray, bAscending = true) {

    for (let i = pArray.length-1; i >= 0; i--) {
        if (i !== 0) {
            if (pArray[i].z < pArray[i-1].z) {
                let tmp = {};
                tmp = {...pArray[i]};
                pArray[i] = {...pArray[i-1]};
                pArray[i-1] = {...tmp};
            }
        } else {

            if (bAscending) {
                pSortedArray.push(pArray.shift());
            } else {
                pSortedArray.unshift(pArray.shift());
            }
            if (pArray.length === 0) {
                return;
            }
        }
    }

    sortZOrder(pArray, pSortedArray, bAscending);
}

function toggleFullScreen() {
    if (FULLSCREEN) {
        if (BROWSER == "F") {
            document.exitFullscreen();
        } else {
            document.exitFullscreen();
            // document.webkitExitFullscreen();
        }
    } else {

        let div = document.getElementById("canvas_container");
        if (BROWSER == "F") {
            div.requestFullscreen();
        } else {
            div.requestFullscreen();
            // div.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
}

// TODO Send SCENE STATE ! Here MainMenu.STATE.Main !
function toast(pContent, pPosition = "d", pColorId = 0) { //? pColor = panel's id. 0: red, 1: green
    let startPos;
    let destPos;
    if (pPosition == "d") { //? d => Down ; t => Top
        startPos = CANVAS_HEIGHT;
        destPos = CANVAS_HEIGHT -20;
    } else {
        startPos = -20;
        destPos = 0;
    }
    
    let testtoastPanel = new ToastPanel({ w: CANVAS_WIDTH, h: 20, v: 1 }, 0, startPos, null, "Game", Game.STATE.Main, pContent, pColorId);
    testtoastPanel.setTextOverflow(true);
    testtoastPanel.setFontColor(BLACK_COLOR_0, WHITE_COLOR);
    testtoastPanel.setDestination({ x: 0, y: destPos });
    testtoastPanel.setCanMove(true);
    testtoastPanel.setMovingSpeed(0.2);
    testtoastPanel.setMoving(true);
    Panel.currentList.push(testtoastPanel);
    MAIN_SPRITE_LIST.push(testtoastPanel.getSprite());
}

function changeResolution(pScale) {
    currentScale = pScale;
    
    SCALE_X = currentScale;
    SCALE_Y = currentScale;
    canvas.width = scaleList[currentScale].width;
    canvas.height = scaleList[currentScale].height;

    CANVAS_WIDTH = canvas.width / SCALE_X;
    CANVAS_HEIGHT = canvas.height / SCALE_Y;
    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
}

// First letter UpperCase
function firstUC(pString) {
    return pString[0].toUpperCase() + pString.slice(1);
}

function forceNegative(pValue) {
    return (pValue > 0) ? -pValue : pValue;
}

function round2Dec(pValue, pDecimal = 2) {
    return Math.floor(pValue * (10**pDecimal)) / (10**pDecimal);
}

function roundNearest(pNb) {
    let floor = Math.floor(pNb);
    let ceil = Math.ceil(pNb);
    if (Math.abs(floor - pNb) < Math.abs(ceil - pNb)) { //? Si == on prend ceil
        return floor;
    } else {
        return ceil;
    }
}

//? Force la valeur à rester entre deux valeurs
//? Ex: value = constrain(value, 5, 25); <-- renvoie 5 ou 25 si jamais la valeur déborde
function constrain(pValue, pMin, pMax) {
    if (pValue < pMin) pValue = pMin;
    if (pValue > pMax) pValue = pMax;
    return pValue
}

//? Force la valeur à ne pas être entre deux valeurs
//? Ex: value = except(value, 10, 40) <-- renvoie 10 ou 40 si jamais la valeur se trouve entre les 2
//? Refuser un seul nombre (par exemple 0), envoyer ce nombre dans pMin ET pMax. Retournera aléatoirement ce nombre +1 ou -1
//? Utile pour avoir un nombre Random mais refuser une certaine plage
function except(pValue, pMin, pMax) {
    if (pValue > pMin && pValue < pMax) {
        let diffMin =  Math.abs(pValue - pMin);
        let diffMax = Math.abs(pMax - pValue);
        if (diffMax <= diffMin) {
            return pMax;
        } else {
            return pMin;
        }
    }  else if (pMin == pMax && pValue == pMin) {
        if (rnd(0, 2)) {
            return pValue - 1;
        } else {
            return pValue + 1;
        }
    } else {
        return pValue;
    }
}

function angleConverter(pValue, pRadianToDegree = true) {
    if (pRadianToDegree) {
        return pValue * (180/Math.PI); //? Degree = Radian * (180/PI)
    } else {
        return pValue * (Math.PI / 180); //? Radian = Degree * (PI / 180)
    }
}

function oneSec() {
    return DEBUG_COUNT % 60 == 0;
}
function time(time = 1) {
    //? 1 == 60  0.5 == 30
    return DEBUG_COUNT % (60*time) == 0;
}

function displayTooltip(pArgs) {
    pArgs.tooltip.forEach(sp => {
        if (sp instanceof Sprite) {
            if (sp.delete) sp.delete = false;
            sp.active = true;
        } else {
            if (sp.getSprite().delete) sp.getSprite().delete = false;
        }
    })

    // switch (pArgs.list) {
    //     case "LanguageScreen":
    //         pArgs.tooltip.forEach(sp => {
    //             if (sp instanceof Sprite) {
    //                 LanguageScreen.list.push(sp);
    //             } else {
    //                 LanguageScreen.list.push(sp.getSprite());
    //             }
    //         })
    //         break;
    //     case "mainmenu.main":
    //         pArgs.tooltip.forEach(sp => {
    //             if (sp instanceof Sprite) {
    //                 MainMenu.mainList.push(sp);
    //             } else {
    //                 MainMenu.mainList.push(sp.getSprite());
    //             }
    //         })
    //         break;
    // }
}

function displayPanelChildSprite(pSprite, pList) {
    pSprite.delete = false;

    switch (pList) {
        case "introduction.main":
            Introduction.mainList.push(pSprite);
            break;
        case "lessonTutorial.main":
            LessonTutorial.mainList.push(pSprite);
            break;
    }
}

function displayPanelChildBtn(pBtn, pList) {

    pBtn.getSprite().delete = false;

    switch (pList) {
        case "mainmenu.main":
            MainMenu.mainList.push(pBtn.getSprite());
            Button.currentList.push(pBtn);
            break;
        case "lessonTutorial.main":
            LessonTutorial.mainList.push(pBtn.getSprite());
            Button.currentList.push(pBtn);
            if (CollisionManager.MouseCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y, pBtn.getPosition().x, pBtn.getPosition().y, pBtn.getSize().w, pBtn.getSize().h)) {
                pBtn.setState(Button.STATE.Hover);
                pBtn.changeSpriteAnimation("hover");
                MOUSE_SPRITE.changeAnimation("hover");
            }
            break;
        case "introduction.main":
            Introduction.mainList.push(pBtn.getSprite());
            Button.currentList.push(pBtn);
            if (CollisionManager.MouseCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y, pBtn.getPosition().x, pBtn.getPosition().y, pBtn.getSize().w, pBtn.getSize().h)) {
                pBtn.setState(Button.STATE.Hover);
                pBtn.changeSpriteAnimation("hover");
                MOUSE_SPRITE.changeAnimation("hover");
            }
            break;
    }
}

//? Check if mouse is colliding with a new popping button
function checkMouseHover(pBtn) {
    if (CollisionManager.MouseCollision(MOUSE_SPRITE.x, MOUSE_SPRITE.y, pBtn.getPosition().x, pBtn.getPosition().y, pBtn.getSize().w, pBtn.getSize().h)) {
        pBtn.setState(Button.STATE.Hover);
        pBtn.changeSpriteAnimation("hover");
        MOUSE_SPRITE.changeAnimation("hover");
    }
}

function translate(pCoord, pReverse = false) {
    for (const s in this.sp) {
        if (this.sp[s] instanceof Sprite) {
            if (pReverse) {
                if (this.parent) {
                    this.sp[s].offX -= pCoord.x;
                    this.sp[s].offY -= pCoord.y;
                } else {
                    this.sp[s].x -= pCoord.x;
                    this.sp[s].y -= pCoord.y;
                }
            } else {
                if (this.parent) {
                    this.sp[s].offX += pCoord.x;
                    this.sp[s].offY += pCoord.y;
                } else {
                    this.sp[s].x += pCoord.x;
                    this.sp[s].y += pCoord.y;
                }
            }
        }
    }
}


// t = time     should go from 0 to duration
// b = begin    value of the property being ease.
// c = change   ending value of the property - beginning value of the property
// d = duration
function linear(t, b, c, d) {
    return c * t / d + b;
}

function easeInSin(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

function easeOutSin(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

function easeInOutSin(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
}

function outBounce(t, b, c, d) {
    t = t / d;
    if (t < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
        t = t - (1.5 / 2.75);
        return c * (7.5625 * t * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
        t = t - (2.25 / 2.75);
        return c * (7.5625 * t * t + 0.9375) + b;
    } else {
        t = t - (2.625 / 2.75);
        return c * (7.5625 * t * t + 0.984375) + b;
    }
}

function inBounce(t, b, c, d) {
    return c - outBounce(d - t, 0, c, d) + b;
}

function inOutBounce(t, b, c, d) {
    if (t < d / 2) {
        return inBounce(t * 2, 0, c, d) * 0.5 + b;
    }
    else {
        return outBounce(t * 2 - d, 0, c, d) * 0.5 + c * .5 + b;
    }
}

function outInBounce(t, b, c, d) {
    if (t < d / 2) {
        return outBounce(t * 2, b, c / 2, d);
    }
    else {
        return inBounce((t * 2) - d, b + c / 2, c / 2, d);
    }
}

function inTransition() {
    return TRANSITION || FadeEffect.bActive || Transition.bActive;
}

function screenShake(pCtx, pDx = 5, pDy = 5) {
    let dx = rnd(-pDx, pDx);
    let dy = rnd(-pDy, pDy);
    pCtx.translate(dx, dy);
}

function setScreenShake(pBool, pX = 5, pY = 5, pRed = true) {
    SCREEN_SHAKE = pBool;
    SCREEN_SHAKE_X = pX;
    SCREEN_SHAKE_Y = pY;
    SCREEN_SHAKE_RED = pRed;
    if (!pBool) {
        canvas.style.backgroundColor = CANVAS_ORIGIN_COLOR;
    }
}

function randomizer(pArr, pNumber) {
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

//? Ex: IN(a, [b,c,d]) etc.
//? Afin d'éviter de faire des if (a === b || a === c || a === d) etc.
function IN(pValue, pArr) {
    return pArr.includes(pValue);
}