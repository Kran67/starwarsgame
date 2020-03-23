/**
 * Fichier : game.js
 * Class Configuration
 */
class Configuration {
    /**
     * create instance.
     * @param {Game} game The game instance
     */
    constructor(game) {
        this.game = game;
        this.ui = {
            config: $("#configWindow"),
            configBtn: $("#configBtn"),
            configCloseBtn: $("#configCloseBtn"),
            configResetBtn: $("#configResetBtn"),
            rngMaxRowsOnMap: $("#rngMaxRowsOnMap"),
            rngMaxColsOnMap: $("#rngMaxColsOnMap"),
            rngObstacles: $("#rngObstacles"),
            rngWeapons: $("#rngWeapons"),
            rngPlayersMoves: $("#rngPlayersMoves"),
            chkUseMouse: $("#chkUseMouse")
        }
        this.numRowsOnMap = null;
        this.numColumnsOnMap = null;
        this.numPlayersMoves = null;
        this.numWeaponsOnMap = null;
        this.numObstacles = null;
        this.moveByMouse = null;
        this.reset();
        // Evénements pour les sliders
        $([this.ui.rngMaxRowsOnMap, this.ui.rngMaxColsOnMap, this.ui.rngObstacles, this.ui.rngPlayersMoves, this.ui.rngWeapons]).each((idx, elem) => {
            $(elem).on("input", (e) => {
                this.updateSlider(e.target);
            });
            //this.updateSlider(elem.get(0));
        });
        // Evénement click sur le bouton pour fermer la page de configuration
        this.ui.configBtn.on("click", () => {
            this.show();
        });
        // Evénement click sur le bouton pour fermer la page de configuration
        this.ui.configCloseBtn.on("click", () => {
            this.hide();
        });
        // Evénements 
        this.ui.configResetBtn.on("click", () => {
            this.reset();
        });
    }
    /**
     * Show the ui window
     * @method
     * @public 
     * @name Configuration.show
     */
    show() {
        $([this.game.ui.glass, this.ui.config]).each((idx, elem) => {
            elem.toggleClass("hidden");
        });
        this.updateUI();
    }
    /**
     * Hide the ui window
     * @method
     * @public 
     * @name Configuration.hide
     */
    hide() {
        this.save();
        $([this.game.ui.glass, this.ui.config]).each((idx, elem) => {
            elem.toggleClass("hidden");
        });
    }
    /**
     * Load the configuration from the localstorage
     * @method
     * @public 
     * @name Configuration.load
     */
    load() {
        let config = localStorage.getItem('config');
        if (config) {
            config = JSON.parse(config);
            this.numRowsOnMap = ~~config.numRowsOnMap;
            this.numColumnsOnMap = ~~config.numColumnsOnMap;
            this.numPlayersMoves = ~~config.numPlayersMoves;
            this.numWeaponsOnMap = ~~config.numWeaponsOnMap;
            this.numObstacles = ~~config.numObstacles;
            this.moveByMouse = config.moveByMouse;
            this.ui.rngMaxRowsOnMap.val(this.numRowsOnMap);
            this.ui.rngMaxColsOnMap.val(this.numColumnsOnMap);
            this.ui.rngPlayersMoves.val(this.numPlayersMoves);
            this.ui.rngWeapons.val(this.numWeaponsOnMap);
            this.ui.rngObstacles.val(this.numObstacles);
            this.ui.chkUseMouse.prop("checked", this.moveByMouse);
        }
    }
    /**
     * Save the configuration to the localstorage
     * @method
     * @public 
     * @name Configuration.save
     */
    save() {
        this.numRowsOnMap = ~~this.ui.rngMaxRowsOnMap.val();
        this.numColumnsOnMap = ~~this.ui.rngMaxColsOnMap.val();
        this.numPlayersMoves = ~~this.ui.rngPlayersMoves.val();
        this.numWeaponsOnMap = ~~this.ui.rngWeapons.val();
        this.numObstacles = ~~this.ui.rngObstacles.val();
        this.moveByMouse = this.ui.chkUseMouse.prop("checked");
        localStorage.setItem('config',
            JSON.stringify({
                numRowsOnMap: this.numRowsOnMap,
                numColumnsOnMap: this.numColumnsOnMap,
                numPlayersMoves: this.numPlayersMoves,
                numWeaponsOnMap: this.numWeaponsOnMap,
                numObstacles: this.numObstacles,
                moveByMouse: this.moveByMouse
            }));
    }
    /**
     * Reset the configuration
     * @method
     * @public 
     * @name Configuration.reset
     */
    reset() {
        this.numRowsOnMap = 10;
        this.numColumnsOnMap = 10;
        this.numPlayersMoves = 3;
        this.numWeaponsOnMap = 4;
        this.numObstacles = 10;
        this.moveByMouse = true;
        this.resetUI();
    }
    /**
     * Reset the UI
     * @method
     * @public 
     * @name Configuration.resetUI
     */
    resetUI() {
        this.ui.chkUseMouse.prop("checked", this.moveByMouse);
        this.ui.rngMaxRowsOnMap.val(this.numRowsOnMap);
        this.ui.rngMaxColsOnMap.val(this.numColumnsOnMap);
        this.ui.rngObstacles.val(this.numObstacles);
        this.ui.rngPlayersMoves.val(this.numPlayersMoves);
        this.ui.rngWeapons.val(this.numWeaponsOnMap);
        this.updateUI();
    }
    /**
     * Update the UI with the current configuration values
     * @method
     * @public 
     * @name Configuration.updateUI
     */
    updateUI() {
        $([this.ui.rngMaxRowsOnMap, this.ui.rngMaxColsOnMap, this.ui.rngObstacles, this.ui.rngPlayersMoves, this.ui.rngWeapons]).each((idx, elem) => {
            this.updateSlider(elem.get(0));
        });
    }
    /**
     * Update the slider UI from the input range value
     * @method
     * @public 
     * @name Configuration.updateSlider
     * @param {HTMLElement} input The input slider
     */
    updateSlider(input) {
        const track = input.parentNode.querySelector(".lightsaber_track");
        if (track) {
            let bulletPosition = ~~((~~input.value - ~~input.min) / (~~input.max - ~~input.min) * input.offsetWidth);
            bulletPosition = bulletPosition > 0 ? bulletPosition : 0;
            track.style.width = `${bulletPosition}px`;
            input.parentNode.dataset.value = input.value;
        }
        if ($(input).is(this.ui.rngMaxColsOnMap) || $(input).is(this.ui.rngMaxRowsOnMap)) {
            this.numObstacles = ~~((~~this.ui.rngMaxColsOnMap.val() * ~~this.ui.rngMaxRowsOnMap.val()) * 0.1);
            this.ui.rngObstacles.attr("max", (~~this.ui.rngMaxColsOnMap.val() * ~~this.ui.rngMaxRowsOnMap.val()) * 0.3);
            this.ui.rngObstacles.val(~~this.ui.rngObstacles.val()+1);
            this.ui.rngObstacles.val(~~this.ui.rngObstacles.val()-1);
            this.ui.rngObstacles.trigger("input");
        }
    }
}
/**
 * @exports 
 */
export { Configuration };