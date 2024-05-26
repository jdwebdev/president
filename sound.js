class Sound {

    static list = [];
    static current = null;
    static bFadingOut = false;
    static bMute = false;
    static bPlayingKana = false;
    static currentPlayingKana = "";

    static id = 0;
    // static audioContext = new AudioContext();
    static audioContext = null;
    static bInit = false;

    constructor(pPath, pType = "s", pLoop = false, bKana = false) {
        // this.sound = document.createElement("audio");
        // this.sound.src = pPath;
        // this.sound.style.display = "none";
        this.id = Sound.id;
        Sound.id++;
        let originPath = "./sounds/";
        pPath = originPath + pPath

        this.sound = new Audio(pPath)
        this.path = pPath;
        this.sndList = [];
        this.sndIndex = 0;
        this.sound.load();

        this.sound.addEventListener("ended", () => {
            this.bPlaying = false;
            this.currentTime = 0;
            if (this.type == "m") {
                this.audioPlay();
            }
        });

        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.onplay = function() {
            // console.log("OK: " + pPath);
        }
        this.sound.onloadeddata = function() {
            // console.log("loadedData: " + pPath);
        }

        this.sound.loop = pLoop;
        this.name = "";

        this.type = pType;
        this.bKana = bKana;
        this.bAlreadyPlayed = false;
        this.bPlaying = false;

        this.timer = new Timer(0.3, this.updateVolume.bind(this));

        this.gainNode = null;

        // this.sound.onended = () => this.sound.remove();
        // document.body.appendChild(this.sound);
        // this.sound.remove();
    }

    static initAudioContext() {
        Sound.bInit = true;
        Sound.audioContext = new AudioContext();
    }

    static play(pSound) {
        Sound.list[pSound].audioPlay();
    }

    audioPlay = async () => {
        if (Sound.bInit) {
            let source = Sound.audioContext.createBufferSource();
            const audioBuffer = await fetch(this.path)
                .then(res => res.arrayBuffer())
                .then(ArrayBuffer => Sound.audioContext.decodeAudioData(ArrayBuffer));
        
            source.buffer = audioBuffer;
    
            this.gainNode = Sound.audioContext.createGain();
            source.addEventListener("ended", () => {
                if (this.type == "m") {
                    this.audioPlay();
                }
            });
    
            //! TEST
            if (this.type == "s") {
                this.gainNode.gain.value = SFX_VOLUME*2;
            } else {
                this.gainNode.gain.value = MUSIC_VOLUME;
                Sound.setCurrentMusic(this);
            }
            let currentGain = this.gainNode.gain.value;
            //! ----
    
            source.connect(this.gainNode);
            this.gainNode.connect(Sound.audioContext.destination)
    
            //! TEST
            // this.gainNode.gain.setValueAtTime(1, Sound.audioContext.currentTime);
            this.gainNode.gain.setValueAtTime(currentGain, Sound.audioContext.currentTime);
            //! ----
    
            // source.connect(Sound.audioContext.destination);
            source.start();
    
            //? Possibilité de faire gainNode.gain.value = 0; pour couper le son
        }
    }

    play() {
        if (this.bPlaying && this.sound.ended) {
            this.bPlaying = false;
        } else {
            
        }

        if (this.bPlaying) {
            this.reset();
            if (this.type == "m") {
                this.playSound(MUSIC_VOLUME);
            } else if (this.type == "s") {
                if (!this.bKana) {
                    this.playSound(SFX_VOLUME);
                } else if (this.bKana) {
                    if (!Sound.bPlayingKana) {
                        Sound.bPlayingKana = true;
                        Sound.currentPlayingKana = this.name;
                        this.playSound(SFX_VOLUME)
                        Button.currentList.forEach(b => {
                            if (b instanceof SoundBtn) {
                                if (b.callback.arg == this.name) {
                                    b.setState(Button.STATE.Inactive);
                                    b.getSprite().changeAnimation("playing");
                                } else {
                                    b.setState(Button.STATE.Inactive);
                                    b.getSprite().changeAnimation("inactive");
                                }
                            }
                        });
                    }
                }
            }
        } else {
            if (this.type == "m") {
                this.playSound(MUSIC_VOLUME);
            } else if (this.type == "s") {
                if (!this.bKana) {
                    this.playSound(SFX_VOLUME);
                } else if (this.bKana) {
                    if (!Sound.bPlayingKana) {
                        Sound.bPlayingKana = true;
                        Sound.currentPlayingKana = this.name;
                        this.playSound(SFX_VOLUME)
                        Button.currentList.forEach(b => {
                            if (b instanceof SoundBtn) {
                                if (b.callback.arg == this.name) {
                                    b.setState(Button.STATE.Inactive);
                                    b.getSprite().changeAnimation("playing");
                                } else {
                                    b.setState(Button.STATE.Inactive);
                                    b.getSprite().changeAnimation("inactive");
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    
    reset() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.bPlaying = false;
    }

    playSound(pVolume) {
        if (!Sound.bMute) {
            this.bPlaying = true;
            this.sound.volume = pVolume;
            this.sound.play(); //! AudioElement.play(). Différent de la méthode play() du dessus. 
        }
    }

    setKanaType(pBool) {
        this.bKana = pBool;
    }

    setName(pName) {
        this.name = pName;
    }

    //? Lesson Kana Sound
    static playCallback(pName) {
        Sound.list[pName].audioPlay();
    }



    static decreaseMusicVolume() {
        if (MUSIC_VOLUME > 0) {
            MUSIC_VOLUME *= 10;
            MUSIC_VOLUME -= 1;
            MUSIC_VOLUME /= 10;
            if (SETTINGS) MUSIC_SPRITE.changeAnimation(MUSIC_VOLUME*10);
            if (MainMenu.bInit) {
                MainMenu.musicSprite.changeAnimation(MUSIC_VOLUME*10);
            }
            if (MUSIC_VOLUME == 0) {
                if (SETTINGS) MUSIC_SPEAKER.changeAnimation("mute");
                if (MainMenu.bInit) {
                    MainMenu.musicSpeaker.changeAnimation("mute");
                }
            }

            if (SaveManager.bSaveDataExists) {
                SaveManager.save([{ type: "bgm", value: MUSIC_VOLUME }]);
            }
            if (Sound.current != null) {
                Sound.current.sound.volume = MUSIC_VOLUME;

                Sound.current.gainNode.gain.value = MUSIC_VOLUME*10;
                let currentGain = Sound.current.gainNode.gain.value;
                Sound.current.gainNode.gain.setValueAtTime(currentGain, Sound.audioContext.currentTime);
            }
        }
    }

    static increaseMusicVolume() {
        if (MUSIC_VOLUME < 1) {
            MUSIC_VOLUME *= 10;
            MUSIC_VOLUME += 1;
            MUSIC_VOLUME /= 10;
            if (SETTINGS) MUSIC_SPRITE.changeAnimation(MUSIC_VOLUME*10);
            if (MainMenu.bInit) {
                MainMenu.musicSprite.changeAnimation(MUSIC_VOLUME*10);
            }
            if (MUSIC_VOLUME*10 == 1) {
                if (SETTINGS) MUSIC_SPEAKER.changeAnimation("normal");
                if (MainMenu.bInit) {
                    MainMenu.musicSpeaker.changeAnimation("normal");
                }
            }
            if (SaveManager.bSaveDataExists) {
                SaveManager.save([{ type: "bgm", value: MUSIC_VOLUME }]);
            }
            if (Sound.current != null) {
                Sound.current.sound.volume = MUSIC_VOLUME;

                Sound.current.gainNode.gain.value = MUSIC_VOLUME*10;
                let currentGain = Sound.current.gainNode.gain.value;
                Sound.current.gainNode.gain.setValueAtTime(currentGain, Sound.audioContext.currentTime);
            }
        }
    }

    static decreaseSfxVolume() {
        if (SFX_VOLUME > 0) {
            SFX_VOLUME *= 10;
            SFX_VOLUME -= 1;
            SFX_VOLUME /= 10;
            if (SETTINGS) SFX_SPRITE.changeAnimation(SFX_VOLUME*10);
            if (MainMenu.bInit) {
                MainMenu.sfxSprite.changeAnimation(SFX_VOLUME*10);
            }
            if (SFX_VOLUME == 0) {
                if (SETTINGS) SFX_SPEAKER.changeAnimation("mute");
                if (MainMenu.bInit) {
                    MainMenu.sfxSpeaker.changeAnimation("mute");
                }
            }
            if (SaveManager.bSaveDataExists) {
                SaveManager.save([{ type: "sfx", value: SFX_VOLUME }]);
            }
        }
    }

    static increaseSfxVolume() {
        if (SFX_VOLUME < 1) {
            SFX_VOLUME *= 10;
            SFX_VOLUME += 1;
            SFX_VOLUME /= 10;
            if (SETTINGS) SFX_SPRITE.changeAnimation(SFX_VOLUME*10);
            if (MainMenu.bInit) {
                MainMenu.sfxSprite.changeAnimation(SFX_VOLUME*10);
            }
            if (SFX_VOLUME*10 == 1) {
                if (SETTINGS) SFX_SPEAKER.changeAnimation("normal");
                if (MainMenu.bInit) {
                    MainMenu.sfxSpeaker.changeAnimation("normal");
                }
            }
            if (SaveManager.bSaveDataExists) {
                SaveManager.save([{ type: "sfx", value: SFX_VOLUME }]);
            }
        }
    }

    static toggleMute() {
        Sound.bMute = !Sound.bMute;
        if (Sound.current != null && Sound.bMute) {
            Sound.current.sound.volume = 0;
        } else if (Sound.current != null && !Sound.bMute) {
            Sound.current.sound.volume = MUSIC_VOLUME;
        }
    }

    update(dt) {
        this.timer.update(dt);
    }

    updateVolume() {
        if (this.sound.volume >= 0.02) {
            this.sound.volume -= 0.02;
        } else {
            Sound.fadeOut(false);
            this.sound.volume = MUSIC_VOLUME;
            this.reset();
        }
    }

    static fadeOut(pBool) {
        Sound.bFadingOut = pBool;
    }

    static setCurrentMusic(pMusic) {
        Sound.current = pMusic;
    }
}