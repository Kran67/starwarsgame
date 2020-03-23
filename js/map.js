import { WeaponFactory } from "./weapon.js";
import { Planet } from "./planet.js";
/**
 * Fichier : map.js
 * Class for the map
 */
class Map {
    /**
     * create instance.
     * @param {Object} options The maps properties
     * @param {Object} options.game The game instance
     * @param {Array}  options.weapons All weapons in the map
     * @param {String} options.weapons[x].name The name of the weapon
     * @param {Object} options.planet The planet properties
     * @param {String} options.planet.name The name of the planet
     */
    constructor(options) {
        this.game = options.game;
        this.rows = this.game.config.numRowsOnMap;
        this.columns = this.game.config.numColumnsOnMap;
        this.weapons = [];
        options.weapons.forEach(weapon => {
            this.weapons.push(WeaponFactory.create(weapon.name));
        });
        this.planet = new Planet(options.planet.name);
        this.obstaclesCells = [];
    }
    /**
     * Initilize the map
     * @method
     * @public 
     * @name Map.initialize
     */
    initialize() {
        $([this.game.ui.main, this.game.ui.glass, this.game.ui.charChoice]).each((idx, elem) => {
            $(elem).toggleClass("hidden");
        });
        this.obstaclesCells.length = 0;
        this.generate();
    }
    /**
     * Generate the map, obstacles, weapons and players
     * @method
     * @public 
     * @name Map.generate
     */
    generate() {
        const numberObstacles = this.game.config.numObstacles;
        const map = [`<div class='mdl-grid'>`];
        let rndRow;
        let rndColumn;
        let cell;
        let weap;
        const rand = randomize;
        // on calcule la position des obstacles
        while (this.obstaclesCells.length < numberObstacles) {
            rndRow = rand(0, this.rows - 1);
            rndColumn = rand(0, this.columns - 1);
            cell = this.obstaclesCells.some(e => e.x === rndColumn && e.y === rndRow);
            if (!cell) {
                this.obstaclesCells.push({
                    x: rndColumn, y: rndRow, isOk: false
                });
            }
        }
        // on calcule la position des armes
        this.weapons.forEach((weapon, idx) => {
            if (idx < this.game.config.numWeaponsOnMap) {
                rndRow = rand(0, this.rows - 1);
                rndColumn = rand(0, this.columns - 1);
                cell = this.obstaclesCells.some(e => e.x === rndColumn && e.y === rndRow);
                weap = this.weapons.some(e => e.x === rndColumn && e.y === rndRow);
                while (cell || weap) {
                    rndRow = rand(0, this.rows - 1);
                    rndColumn = rand(0, this.columns - 1);
                    cell = this.obstaclesCells.some(e => e.x === rndColumn && e.y === rndRow);
                    weap = this.weapons.some(e => e.x === rndColumn && e.y === rndRow);
                }
                if (!cell && !weap) {
                    weapon.x = rndColumn;
                    weapon.y = rndRow;
                }
            }
        });
        // on calcule la position du personnage 1
        this.getPlayerPosition(this.game.player1);
        // on calcule la position du personnage 2
        this.getPlayerPosition(this.game.player2);
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.columns; colIdx++) {
                let tile = ` ${this.planet._name}-tile`;
                let tileWeapon = "";
                let player = "";
                cell = this.obstaclesCells.some(e => e.x === colIdx && e.y === rowIdx);
                const weapon = this.weapons.find(e => e.x === colIdx && e.y === rowIdx);
                if (cell && !weapon) {
                    tile = ` ${this.planet._name}-obstacle`;
                } else if (weapon) {
                    tileWeapon = ` ${weapon.name}`;
                } else if (this.game.player1.x === colIdx && this.game.player1.y === rowIdx) {
                    this.game.player1.x = colIdx;
                    this.game.player1.y = rowIdx;
                    player = ` ${this.game.player1.name}`;
                } else if (this.game.player2.x === colIdx && this.game.player2.y === rowIdx) {
                    this.game.player2.x = colIdx;
                    this.game.player2.y = rowIdx;
                    player = ` ${this.game.player2.name}`;
                }
                player = player !== "" ? ` player ${player}` : player;
                map.push(`<div data-x='${colIdx}' data-y='${rowIdx}' data-weapon='${tileWeapon.trim()}' class='mdl-cell mdl-cell--1-col planet${tile}${tileWeapon}${player}'></div>`);
            }
        }
        map.push("</div>");
        $("div.main .middle").append(map.join(""));
        // on calcule la taille des celulles en fonction de la taille de la grille
        this.calcGridAndCellsSize();
        $(window).on("resize", () => {
            this.calcGridAndCellsSize();
        });
    }
    /**
     * Calculate the grid and cells sizes
     * @method
     * @public
     * @name Map.calcGridAndCellsSize
     */
    calcGridAndCellsSize() {
        let actualWidth = ~~$(".mdl-grid").width();
        let cellSize = actualWidth / this.game.config.numColumnsOnMap;
        if (cellSize > 120) {
            cellSize = 120;
        } else {
            cellSize = 60;
        }
        $(".mdl-cell").each((idx, cell) => {
            $(cell).width(cellSize);
            $(cell).height(cellSize);
        });
        if (actualWidth !== cellSize * this.game.config.numColumnsOnMap) {
            actualWidth = cellSize * this.game.config.numColumnsOnMap;
            $(".mdl-grid").width(actualWidth);
        }
        $(".mdl-grid").height(cellSize * this.game.config.numRowsOnMaps);
    }
    /**
     * Get the position of the player in the map without overlap
     * @method
     * @public 
     * @name Map.getPlayerPosition
     * @param {Player} player A player
     */
    getPlayerPosition(player) {
        let quarter = -1;
        const rand = randomize;
        // pour éviter que les joueurs se touche, on coupe la carte en 4
        if (player === this.game.player1) {
            quarter = rand(0, 3);

        } else {
            quarter = rand(0, 3);
            while (quarter === this.game.player1._quarter) {
                quarter = rand(0, 3);
            }
        }
        player._quarter = quarter;
        quarter = this.getMinMaxQuarterCoords(quarter);
        let rndRow = rand(quarter.minRow, quarter.maxRow);
        let rndColumn = rand(quarter.minCol, quarter.maxCol);
        let cell = this.obstaclesCells.some(e => e.x === rndColumn && e.y === rndRow);
        let weapon = this.weapons.some(e => e.x === rndColumn && e.y === rndRow);
        while (cell || weapon) {
            rndRow = rand(quarter.minRow, quarter.maxRow);
            rndColumn = rand(quarter.minCol, quarter.maxCol);
            cell = this.obstaclesCells.some(e => e.x === rndColumn && e.y === rndRow);
            weapon = this.weapons.some(e => e.x === rndColumn && e.y === rndRow);
        }
        if (!cell && !weapon) {
            player.x = rndColumn;
            player.y = rndRow;
        }
    }
    /**
     * Get the coords of a quarter
     * @method
     * @public 
     * @name Map.getMinMaxQuarterCoords
     * @param {Number} quarter The quarter 
     * @returns {Object} The quarter coords
     */
    getMinMaxQuarterCoords(quarter) {
        let _minRow = 0;
        let _maxRow = 0;
        let _minCol = 0;
        let _maxCol = 0;
        const cols2 = ~~(this.game.config.numColumnsOnMap / 2);
        const rows2 = ~~(this.game.config.numRowsOnMap / 2);
        switch (quarter) {
            case 0:
                _maxRow = rows2 - 1;
                _maxCol = cols2 - 1;
                break;
            case 1:
                _maxRow = rows2 - 1;
                _minCol = cols2 + 1;
                _maxCol = this.game.config.numColumnsOnMap - 1;
                break;
            case 2:
                _minRow = rows2 + 1;
                _maxRow = this.game.config.numRowsOnMap - 1;
                _maxCol = cols2 - 1;
                break;
            case 3:
                _minRow = rows2 + 1;
                _minCol = cols2 + 1;
                _maxRow = this.game.config.numRowsOnMap - 1;
                _maxCol = this.game.config.numColumnsOnMap - 1;
                break;
        }
        return {
            minRow: _minRow,
            maxRow: _maxRow,
            minCol: _minCol,
            maxCol: _maxCol
        };
    }
    /**
     * Clear all cell event and animation
     * @method
     * @public 
     * @name Map.clearCellsEventAndAnimation
     */
    clearCellsEventAndAnimation() {
        $(".mdl-cell").each((idx, cell) => {
            $(cell).removeClass("leftArrow topArrow rightArrow bottomArrow animate");
            $(cell).off("click", this.movePlayer);
        });
    }
    /**
     * Display cells how the player can move
     * @method
     * @public 
     * @name Map.displayPlayerMoves
     * @param {Player} player A player
     */
    displayPlayerMoves(player) {
        this.clearCellsEventAndAnimation();
        let i, x, y, nbPossibleMoves = 0;
        const maxTile = this.game.currentPlayer.remainingMoves;
        const secondPlayer = player === this.game.player1 ? this.game.player2 : this.game.player1;
        $(["left", "top", "right", "bottom"]).each((idx, elem) => {
            for (i = 1; i <= maxTile; i++) {
                x = player.x;
                y = player.y;
                switch (elem) {
                    case "left":
                        x -= i;
                        break;
                    case "top":
                        y -= i;
                        break;
                    case "right":
                        x += i;
                        break;
                    case "bottom":
                        y += i;
                        break;
                }
                if (x > 0 || x < this.columns || y > 0 || y < this.rows) {
                    const cell = $(`div[data-x='${x}'][data-y='${y}']`);
                    const obstacle = this.obstaclesCells.some(e => e.x === x && e.y === y);
                    const weapon = this.weapons.some(e => e.x === x && e.y === y);
                    if (cell.length > 0) {
                        if (!obstacle) {
                            nbPossibleMoves++;
                            if (weapon) {
                                cell.toggleClass("animate");
                            } else if (secondPlayer.x === x && secondPlayer.y === y) {
                                break;
                            }
                            else {
                                cell.toggleClass(`${elem}Arrow`);
                            }
                            cell.get(0).map = this;
                            if (this.game.config.moveByMouse) {
                                cell.on("click", this.movePlayer);
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        });
        if (nbPossibleMoves === 0 && maxTile === this.game.config.numPlayersMoves) {
            if (confirm(`Le joueur${this.game.playerNum} est bloqué.\nVoulez-vous relancer la partie?`)) {
                this.game.ui.btnReload.trigger("click");
            };
        }
    }
    /**
     * Move the player to this cell
     * @method
     * @public 
     * @name Map.movePlayer
     */
    movePlayer() {
        const cellX = ~~$(this).get(0).dataset.x;
        const cellY = ~~$(this).get(0).dataset.y;
        const _map = this.map;
        _map.game.currentPlayer.moveTo(this, cellX, cellY);
    }
}
/**
 * @exports 
 */
export { Map };