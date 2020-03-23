import { Player, Characters } from "./player.js";
import { Map } from "./map.js";
import { Configuration } from "./configuration.js";
/**
 * Fichier : game.js
 * Class for the game
 */
class Game {
    /**
     * create instance.
     * @constructor 
     */
    constructor() {
        this.lastKey = null;
        this.firstPlayer = false;
        this.ui = {
            btnChoice: $("#btnValidChoice"),
            btnStart: $("#btnStartGame"),
            main: $("body main").eq(0),
            glass: $("#glass"),
            charChoice: $("#character-choice"),
            newGameBtn: $("#newGameBtn"),
            planetName: $("#planetName"),
            planetImg: $("#planetImg"),
            playerNum: $("#playerNum"),
            combatWindow: $("#combatWindow"),
            combatWindowMain: $("#combatWindow main"),
            btnAttack: $("#btnAttack"),
            btnDefend: $("#btnDefend"),
            loseImg: $("#lose"),
            winImg: $("#win"),
            message: $("#message"),
            playerNumCombat: $("#playerNumCombat"),
            hit1: $("#hit1"),
            hit2: $("#hit2"),
            btnReload: $("#btnReload"),
            starWarsCrawler: $(".star-wars"),
            sep: $("span.sep"),
            about: $("#aboutWindow"),
            aboutBtn: $("#aboutBtn"),
            aboutCloseBtn: $("#aboutCloseBtn")
        };
        for (let i = 1; i < 3; i++) {
            this.ui[`player${i}Name`] = $(`#player${i}Name`);
            this.ui[`lifePlayer${i}`] = $(`#lifePlayer${i}`);
            this.ui[`weaponPlayer${i}`] = $(`#weaponPlayer${i}`);
            this.ui[`player${i}Img`] = $(`#player${i}Img`);
        }
        this.player1 = null;
        this.player2 = null;
        this.map = null;
        this.config = new Configuration(this);
        this.start();
    }
    /**
     * Get the current player
     * @memberof game
     * @name currentPlayer
     * @public
     * @return {Player} the current player
     */
    get currentPlayer() {
        return this[`player${this.firstPlayer ? 1 : 2}`];
    }
    /**
     * Get the player number
     * @memberof game
     * @name playerNum
     * @public
     * @return {Number} the number of the current player 1 or 2
     */
    get playerNum() {
        return this.firstPlayer ? 1 : 2;
    }
    /**
     * Get the other player
     * @memberof game
     * @name otherPlayer
     * @public
     * @return {Player} the other player than the current one
     */
    get otherPlayer() {
        return this[`player${this.firstPlayer ? 2 : 1}`];
    }
    /**
     * Start the game
     * @method
     * @name game.start
     * @public
     */
    start() {
        this.config.load();
        this.firstPlayer = true;
        // Evénement click sur le bouton pour recharger la page
        this.ui.btnReload.on("click", () => {
            window.location.reload(true);
        });
        // Evénement click sur le bouton pour afficher la page A propos
        this.ui.aboutBtn.on("click", () => {
            this.showAbout();
        });
        // Evénement click sur le bouton pour fermer la page A propos
        this.ui.aboutCloseBtn.on("click", () => {
            this.hideAbout();
        });
        // Evénement click sur le bouton pour la lancement de la partie
        this.ui.btnStart.on("click", () => {
            this.map = new Map(
                {
                    game: this,
                    planet: {
                        name: ["tatooine", "hoth", "dagobah", "deathstar"][randomize(0, 3)]
                    },
                    weapons: [
                        {
                            name: "phaser"
                        }, {
                            name: "blaster"
                        }, {
                            name: "sabreLaser"
                        }, {
                            name: ["xwing", "faucon", "tiefighter"][randomize(0, 2)]
                        }, {
                            name: "phaser"
                        }, {
                            name: "blaster"
                        }, {
                            name: "sabreLaser"
                        }, {
                            name: ["xwing", "faucon", "tiefighter"][randomize(0, 2)]
                        }]
                });
            this.map.initialize();
            this.displayPlanet();
            this.displayPlayerInfos();
            this.map.displayPlayerMoves(this.currentPlayer);
        });
        // Evénement click sur le bouton pour le choix du personnage
        this.ui.btnChoice.on("click", () => {
            const radio = $("input[type='radio']:checked");
            if (this.firstPlayer) {
                this.ui.btnChoice.attr("disabled", true);
                this.player1 = new Player(radio.val(), this);
                this.ui.playerNum.html(this.playerNum);
                this.changePlayer();
                this.ui.playerNum.html(this.playerNum);
                radio.attr("disabled", true);
                radio.prop("checked", false);
            } else {
                this.ui.btnChoice.toggleClass("hidden");
                this.player2 = new Player(radio.val(), this);
                this.ui.btnStart.toggleClass("hidden");
                $("input[type='radio']").each( (idx, elem) => {
                    $(elem).attr("disabled", true);
                });
                this.ui.playerNum.parent("h4").html("Cliquez sur le bouton Commencer pour lancer la partie.");
                this.changePlayer();
            }
        });
        // Evénement click sur le bouton pour lancer la partie
        this.ui.newGameBtn.on("click", () => {
            $([this.ui.glass, this.ui.charChoice, this.ui.newGameBtn, this.ui.starWarsCrawler, this.config.ui.configBtn]).each((idx, elem) => {
                elem.toggleClass("hidden");
            });
            $(Characters).each((idx, char) => {
                $(`.${char.group}-characters`).append(`<label class='character ${char.group}' data-name='${char.name}'>
                <input type='radio' name='choice' value='${char.name}' />
                <div class='checkmark ${char.name.toLowerCase().replace(" ", "")}'></div>
                </label>`);
            });
            $("input[type='radio']").each((idx, radio) => {
                $(radio).on("change", () => {
                    this.ui.btnChoice.attr("disabled", false);
                });
            });
        });
        // Evénement click sur le bouton d'attaque
        this.ui.btnAttack.on("click", () => {
            this.attack();
        });
        // Evénement click sur le bouton de défense
        this.ui.btnDefend.on("click", () => {
            this.defend();
        });
    }
    /**
     * Show the planet name and image
     * @method
     * @name game.displayPlanet
     * @public
     */
    displayPlanet() {
        this.ui.planetName.html(this.map.planet._name);
        this.ui.planetImg.attr("src", `images/planets/${this.map.planet._name}.png`);
    }
    /**
     * Show the player infos
     * @method
     * @name game.displayPlayerInfos
     * @public
     */
    displayPlayerInfos() {
        for (let i = 1; i < 3; i++) {
            const player = this[`player${i}`];
            this.ui[`player${i}Name`].html(player._name);
            this.ui[`weaponPlayer${i}`].html(player.weapon._name);
            this.ui[`player${i}Img`].attr("src", `/images/players/${player.name}.png`);
        }
    }
    /**
     * Start the combat mode and show the combat window
     * @method
     * @name game.startCombatMode
     * @public
     */
    startCombatMode() {
        this.map.clearCellsEventAndAnimation();
        $([this.ui.glass, this.ui.combatWindow, this.ui.main]).each((idx, elem) => {
            elem.toggleClass("hidden");
        });
        $("html, body").animate({ scrollTop: 0 }, "fast");
        $("body").css("overflow", "hidden");
        // transfert des infos dans la fenêtre de combat
        this.ui.combatWindowMain.append($("section.left", this.ui.main.get(0))[0]);
        this.ui.combatWindowMain.append($("section.right", this.ui.main.get(0))[0]);
        this.refreshCombatUI();
    }
    /**
     * Current player launch an attack
     * @method
     * @name game.attack
     * @public
     */
    attack() {
        $([this.ui.hit1, this.ui.hit2]).each((idx, elem) => {
            elem.addClass("hidden");
        });
        const shield = this.otherPlayer.shield;
        this.currentPlayer.attack(this.otherPlayer);
        if (this.otherPlayer.life > 0) {
            this.ui[`hit${this.playerNum===1?2:1}`].get(0).dataset.damages = this.currentPlayer.weapon.damages * shield;
            this.ui[`hit${this.playerNum===1?2:1}`].toggleClass("hidden");
            this.changePlayer();
        }
        this.refreshCombatUI();
        if (this.player1.life <= 0 || this.player2.life <= 0) {
            this.end();
        }
    }
    /**
     * Current player defends
     * @method
     * @name game.defend
     * @public
     */
    defend() {
        $([this.ui.hit1, this.ui.hit2]).each((idx, elem) => {
            elem.addClass("hidden");
        });
        this.currentPlayer.defend();
        this.changePlayer();
        this.refreshCombatUI();
    }
    /**
     * Change the current player
     * @method
     * @name game.changePlayer
     * @public
     */
    changePlayer() {
        this.lastKey = null;
        this.currentPlayer.remainingMoves = this.config.numPlayersMoves;
        this.firstPlayer = !this.firstPlayer;
    }
    /**
     * Refresh the combat UI
     * @method
     * @name game.refreshCombatUI
     * @public
     */
    refreshCombatUI() {
        this.ui["lifePlayer1"].css("width", this.player1.life * 150 / 100);
        this.ui["lifePlayer2"].css("width", this.player2.life * 150 / 100);
        $([{ player:this.player1, ui:this.ui.lifePlayer1},{ player:this.player2, ui:this.ui.lifePlayer2}]).each((idx, elem) => {
            elem.ui.removeClass("_75 _50 _25");
            if (elem.player.life>=50 && elem.player.life < 75) {
                elem.ui.addClass("_75");
            }
            if (elem.player.life>=25 && elem.player.life < 50) {
                elem.ui.addClass("_50");
            }
            if (elem.player.life<25) {
                elem.ui.addClass("_25");
            }
        });
        $([{ player: this.player1, ui:this.ui.player1Img}, { player:this.player2, ui:this.ui.player2Img}]).each((idx, elem) => {
            elem.ui.removeClass("shield");
            if (elem.player.shield !== 1) {
                elem.ui.addClass("shield");
            }
            if (elem.player.shield !== 1) {
                elem.ui.addClass("shield");
            }
        });
        this.ui.playerNumCombat.html(this.playerNum);
    }
    /**
     * Stop the game
     * @method
     * @name game.end
     * @public
     */
    end() {
        if (this.player1.life <= 0) {
            this.ui.loseImg.toggleClass("posLeft");
            this.ui.winImg.toggleClass("posRight");
        }
        if (this.player2.life <= 0) {
            this.ui.loseImg.toggleClass("posRight");
            this.ui.winImg.toggleClass("posLeft");
        }
        $([this.ui.loseImg, this.ui.winImg, this.ui.btnAttack, this.ui.btnDefend, this.ui.message, this.ui.btnReload, this.ui.sep]).each((idx, elem) => {
            elem.toggleClass("hidden"); 
        });
    }
    /**
     * Show the about dialog
     * @method
     * @name game.showAbout
     * @public
     */
    showAbout() {
        this.ui.about.toggleClass("hidden");
    }
    /**
     * Hide the about dialog
     * @method
     * @name game.hideAbout
     * @public
     */
    hideAbout() {
        this.ui.about.toggleClass("hidden");
    }
}
// Une fois le documment chargé, on lance le jeu
$(document).ready(() => {
    const game = new Game();
    $(document).keydown((e) => {
        if (!game.config.moveByMouse) {
            if (!game.lastKey) {
                game.currentPlayer.remainingMoves = game.config.numPlayersMoves;
            }
            if ([37, 38, 39, 40].indexOf(e.which)>-1) {
                if (game.currentPlayer.canMove(e.which)) {
                    game.lastKey = e.which;
                }
            } else if (e.which === 27) {
                game.currentPlayer.remainingMoves = 0;
                game.changePlayer();
                game.map.displayPlayerMoves(game.currentPlayer);
            }
        }
    });
});
/*
 * generic function for the random into range [min, max]
 * @function
 * @public
 * @returns {Number} A number into the [min, max] range
 */
window.randomize = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // Le résultat renvoyé est un entier compris dans l'intervalle [min,max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}