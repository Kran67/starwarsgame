/**
 * Fichier : weapon.js
 * Base class for weapons
 */
class Weapon {
    /**
     * create instance.
     * @param {Object} [options] description of weapon properties
     * @param {String} [options.name] Weapon name
     * @param {Number} [options.x] Cell x coord that contains the weapon
     * @param {Number} [options.y] Cell y coord that contains the weapon
     * @param {Number} [options.damages] Damages of the weapon
     */
    constructor(options) {
        this._name = options.name;
        this.x = options.x || -1;
        this.y = options.y || -1;
        this.damages = options.damages;
    }
    /**
     * Property name
     * @memberof Weapon
     * @name name
     * @public
     * @return {String} The formatted name
     */
    get name() {
        return this._name.toLowerCase().replace(" ", "");
    }
}

/**
 * Grenade weapon
 * @class Grenade
 * @extends Weapon
 */
class Grenade extends Weapon {
    /**
     * create instance.
     */
    constructor() {
        super({
            name: "Grenade",
            damages: 10
        });
    }
}

/**
 * Phaser weapon
 * @class Phaser
 * @extends Weapon
 */
class Phaser extends Weapon {
    /**
     * create instance.
     */
    constructor() {
        super({
            name: "Phaser", 
            damages: 20
        });
    }
}

/**
 * Blaster weapon
 * @class Blaster
 * @extends Weapon
 */
class Blaster extends Weapon {
    /**
     * create instance.
     */
    constructor() {
        super({
            name: "Blaster",
            damages:30
        });
    }
}

/**
 * SabreLaser weapon
 * @class SabreLaser
 * @extends Weapon
 */
class SabreLaser extends Weapon {
    /**
     * create instance.
     */
    constructor() {
        super({
            name: "Sabre laser", 
            damages: 40
        });
    }
}

/**
 * Ship weapon
 * @class Ship
 * @extends Weapon
 */
class Ship extends Weapon {
    /**
     * create instance.
     * @param {String} name The Weapon name
     */
    constructor(name) {
        super({
            name: name, 
            damages: 50
        });
    }
}

/**
 * XWing weapon
 * @class XWing
 * @extends Ship
 */
class XWing extends Ship {
    /**
     * create instance.
     */
    constructor() {
        super("XWing");
    }
}

/**
 * Faucon weapon
 * @class Faucon
 * @extends Ship
 */
class Faucon extends Ship {
    /**
     * create instance.
     */
    constructor() {
        super("Faucon");
    }
}

/**
 * TieFighter weapon
 * @class TieFighter
 * @extends Ship
 */
class TieFighter extends Ship {
    /**
     * create instance.
     */
    constructor() {
        super("Tie Fighter");
    }
}

/**
 * @exports
 * @const WeaponFactory
 * Create a instance of weapon from a name class
 */
export const WeaponFactory = {
    /**
     * names to classes definition
     */
    specWeapon: {
        __default: Grenade,
        __grenade: Grenade,
        __phaser: Phaser,
        __blaster: Blaster,
        __sabrelaser: SabreLaser,
        __xwing: XWing,
        __faucon: Faucon,
        __tiefighter: TieFighter
    },
    /**
     * create instance.
     * @param {String} name The class name
     * @returns {Object} new instance of weapon
     */
    create(name) {
        name = name?name.toLowerCase():'default';
        const cls = this.specWeapon[`__${name}`];
        return new cls(name);
    }
}