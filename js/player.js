import { WeaponFactory } from "./weapon.js";
/**
 * Fichier : player.js
 * Class for a player
 */
class Player {
    /**
     * create instance.
     * @param {String} name the player name
     * @param {Game} game the game instance
     */
    constructor(name, game) {
        this._quarter = -1;
        this.x = -1;
        this.y = -1;
        this.life = 100;
        this.weapon = WeaponFactory.create();
        this._name = name;
        this.shield = 1;
        this.remainingMoves = null;
        this.game = game;
    }
    /**
     * @memberof Player
     * @name name
     * @public
     * @return {String} the formatted name
     */
    get name() {
        return this._name.toLowerCase().replace(" ", "");
    }
    /**
     * Move the player on the map at coords
     * @method
     * @public
     * @name player.moveTo
     * @param {Object} cell The cell to move
     * @param {Number} newX The new cell x coord
     * @param {Number} newY The new cell y coord
     */
    moveTo(cell, newX, newY) {
        const currentCell = $(`div[data-x='${this.x}'][data-y='${this.y}']`);
        const game = this.game;
        const map = game.map;
        currentCell.removeClass(this.name);
        this.x = newX;
        this.y = newY;
        $(cell).addClass(this.name);
        // check if combat next time
        const coordsCombatPossible = [];
        if (newY - 1 > -1) {
            coordsCombatPossible.push({ x: newX, y: newY - 1 });
        }
        if (newY + 1 < map.rows) {
            coordsCombatPossible.push({ x: newX, y: newY + 1 });
        }
        if (newX - 1 > -1) {
            coordsCombatPossible.push({ x: newX - 1, y: newY });
        }
        if (newX + 1 < map.columns) {
            coordsCombatPossible.push({ x: newX + 1, y: newY });
        }
        const weapon = map.weapons.some(e => e.x === newX && e.y === newY);
        if (weapon) {
            this.swapWeapon(cell);
        }
        map.clearCellsEventAndAnimation();
        const otherPlayer = game.otherPlayer;
        game.inCombatMode = coordsCombatPossible.some(e => e.x === otherPlayer.x && e.y === otherPlayer.y);
        if (game.inCombatMode) {
            game.startCombatMode();
        }
        if (this.remainingMoves === 0 || game.config.moveByMouse) {
            game.changePlayer();
        }
        map.displayPlayerMoves(game.currentPlayer);
    }
    /**
     * The player can move at direction
     * @method
     * @public
     * @name player.canMove
     * @param {Number} dir The key direction to move
     * @return {Boolean} if player can move return true otherwise false
     */
    canMove(dir) {
        let move = false;
        let nextCell;
        let newX = this.x;
        let newY = this.y;
        let arrowName = null;
        switch (dir) {
            case 37: // left
                arrowName = "leftArrow";
                newX--;
                break;
            case 38: // top
                arrowName = "topArrow";
                newY--;
                break;
            case 39: // right
                arrowName = "rightArrow";
                newX++;
                break;
            case 40: // bottom
                arrowName = "bottomArrow";
                newY++;
                break;
        }
        nextCell = $(`div[data-x='${newX}'][data-y='${newY}']`);
        if (nextCell.hasClass(arrowName) || nextCell.get(0).dataset.weapon !== "") {
            move = true;
        }
        if (move && this.remainingMoves>0) {
            this.remainingMoves--;
            this.moveTo(nextCell, newX, newY);
            return true;
        }
        return false;
    }
    /**
     * swap the player weapon with the cell weapon
     * @method
     * @public
     * @name player.swapWeapon
     * @param {Object} cell The cell with the weapon
     */
    swapWeapon(cell) {
        const map = this.game.map;
        const weapon = $(cell).get(0).dataset.weapon.trim();
        $(cell).removeClass(weapon);
        $(cell).addClass(this.weapon.name);
        $(cell).get(0).dataset.weapon = this.weapon.name;
        const weaponIdx = map.weapons.findIndex(elem => {
            return elem.name === weapon;
        });
        [this.weapon, map.weapons[weaponIdx]] = [map.weapons[weaponIdx], this.weapon];
        [map.weapons[weaponIdx].x, this.weapon.x] = [this.weapon.x, -1];
        [map.weapons[weaponIdx].y, this.weapon.y] = [this.weapon.y, -1];
        map.game.ui[`weaponPlayer${this.game.playerNum}`].html(this.weapon._name);
    }
    /**
     * Attack the other player with him weapon
     * @method
     * @public
     * @name player.attack
     * @param {Player} otherPlayer The other player
     */
    attack(otherPlayer) {
        this.shield = 1;
        otherPlayer.life -= this.weapon.damages * otherPlayer.shield;
        otherPlayer.shield = 1;
    }
    /**
     * Active him shield
     * @method
     * @public
     * @name player.defend
     */
    defend() {
        this.shield = 0.5;
    }
}
/**
 * @const {Array} The list of all characters in the game
 */
const Characters = [
    {
        group: "rebellion",
        name: "Yoda"
    }, {
        group: "rebellion",
        name: "Luke"
    }, {
        group: "rebellion",
        name: "Chewbacca"
    }, {
        group: "darkside",
        name: "Dark Vador"
    }, {
        group: "darkside",
        name: "Dark Maul"
    }, {
        group: "darkside",
        name: "Storm Trooper"
    }
];
/**
 * @exports 
 */
export { Player, Characters };