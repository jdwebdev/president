let SS;
let bImageLoaded = false;
let bSplashSoundReady = false;

let bSplashReady = false;


let tsvFile = "";
let translationEn = []; // 1
let translationFr = []; // 2
let translationJp = []; // 3
let LANG = [];
let ASSETS_COUNTER = 0;
let ASSETS_READY = false;

function LoadAssets() {

    // SpriteSheets
    SS = new Image();
    SS.src = "./images/SS.png";
    /* 
    *  Plus tard utiliser une image en format base64
    *  onlinepngtools.com/convert-png-to-base64 : 
    *  SS.src = "data:image/png;base64,blablablablabla;";
    */
    SS.onload = () => {
        console.log("image loaded !!!");
        ASSETS_COUNTER++;
        if (ASSETS_COUNTER == 1) {
            ASSETS_READY = true;
        }
    };

    //? Music and Sounds
    Sound.list["jadona"] = new Sound("jadona.mp3");
    Sound.list["back"] = new Sound("back.mp3");
    Sound.list["click"] = new Sound("click.mp3");

    Sound.list["maintheme"] = new Sound("music/PG.wav", "m", true);

    //? Translation file
    // readTSVFile("./translation - 1.tsv");
}

function readTSVFile(pFile) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", pFile, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                tsvFile = rawFile.responseText;
                createTranslationArrays(tsvFile);
            }
        }
    }
    rawFile.send(null);
}

function createTranslationArrays(pFile) {
    let row = pFile.split(/\r\n|\n/);
    for (let i = 0; i < row.length; i++) {
        row[i] = row[i].split('\t');
        translationEn[row[i][0]] = row[i][1];
        translationFr[row[i][0]] = row[i][2];
        translationJp[row[i][0]] = row[i][3];
    }

    // LANG = translationEn;
    LANG = translationFr;
    ASSETS_COUNTER++;
    if (ASSETS_COUNTER == 2) {
        ASSETS_READY = true;
    }
}

LoadAssets();