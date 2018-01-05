/**
 * Created by unkoll on 30.06.17.
 */


const Init = {
    zero : function () {
        let zero= {
            resist: {
                phys: 0,
                energy: 0,
                poison: 0,
                will: 2
            },
            movement: 1.0,
            weight: {cur: 0, max: 0},

            critical: {
                crit: 0,
                burning: 0,
                bleed: 0,
                stun: 0,
                counter_attack: 0,
                enrage: 0,
                double_strike: 0,
                poisoned: 0,
                delay: 0,
                exact_strike: 0,
                armor_ignoring: 0
            },
            armor: {
                dt: 0,
                at: 0
            },
            chances: {
                battle: {
                    one_handed: 70,
                    two_handed: 60,
                    bow: 40,
                    arbalest: 40,
                    fire: 40,
                    fists: 80,

                    ritual_magic: 0,
                    rune_magic: 0,
                    spell_magic: 0,
                    absolute_magic: 0,

                    evasion: 0,
                    blocking: 0
                },
                peaceful: {
                    science: 15,
                    logic: 15,
                    gambling: 15,
                    sneak: 15,
                    lock_picking: 15,
                    persuasion: 15
                }
            },
            action_expend: {
                flask: 2,
                change_weapon: 1,
                strike: 0,
                mod: 1
            },
            energy_expend: {
                mod : 1,
                cast: 0
            },
            damage: {
                spell : 0,
                attack: 0
            }
        };
        for (let key in player.stats.main)
            player.stats.main[key].bonus = 0;
        player.stats.resist = zero.resist;
        player.stats.movement = zero.movement;
        player.stats.weight = zero.weight;
        player.stats.critical = zero.critical;
        player.stats.armor = zero.armor;
        player.stats.chances = zero.chances;
        player.action_expend = zero.action_expend;
        player.energy_expend = zero.energy_expend;
        player.damage = zero.damage;

        player.stats.energy.cur = Math.max(0, player.stats.energy.cur);
        player.stats.energy.max = 0;
        player.stats.energy.recovery = 0;

        player.stats.health.cur = Math.max(0, player.stats.health.cur);
        player.stats.health.max = 0;
        player.stats.health.recovery = 0;

        player.stats.action.cur = Math.max(0, player.stats.action.cur);
        player.stats.action.max = 0;
        player.stats.action.base = 0;
        player.stats.action.recovery = 0;
    },
    inventory : function () {
        let using = player.inventory.using_weapon;
        for (let key in player.inventory.clothes)
            Calculate.item(player.inventory.clothes[key]);

        for (let key in player.inventory.weapon[using])
            Calculate.item(player.inventory.weapon[using][key]);
        Calculate.item(player.inventory.bags.bag);

        for (let key in player.inventory.weapon) if (key !== using) {
            Calculate.bag(player.inventory.weapon[key]);
        }
        Calculate.bag(player.inventory.bags.flask);
        Calculate.bag(player.inventory.bags.ammo);
        let using_ammo = player.inventory.using_ammo;
        Calculate.item(player.inventory.bags.ammo[using_ammo]);
        player.stats.weight.cur -=
            (player.inventory.bags.ammo[using_ammo] !== undefined) ? get(player.inventory.bags.ammo[using_ammo].weight) : 0;

        Calculate.bag(player.inventory.bags.main);
    },
    effects : function() {
        for (let key = 0; key < player.effects.length; ++key)
            if (Calculate.parse.conditional(player.effects[key].condition)) {
                Calculate.parse.effect(player.effects[key].effect, 'const');
            }
    },
    skills : function() {
        
    },
    parameters : function() {

        player.stats.health.max += stat('strength') + stat('stamina') * 4;
        player.stats.health.recovery += stat('stamina') * 0.5;

        player.stats.action.max += 7 + stat('stamina');
        player.stats.action.base += 2 + (stat('perception') + stat('speed')) * 0.5;
        player.stats.action.recovery += 4 + stat('speed') * 0.5;

        player.stats.weight.max += 10 + stat('strength') * 20;
        player.stats.critical.crit += stat('perception') * 1.5;
        player.stats.movement += stat('speed') * 0.075;
        player.stats.chances.battle.evasion += stat('agility') + stat('perception') * 0.5;
    },
    all : function () {
        Init.zero();
        Init.inventory();
        Init.effects();
        Init.skills();
        Init.parameters();
        player.stats.health.cur = Math.min(player.stats.health.cur, player.stats.health.max);
        player.stats.energy.cur = Math.min(player.stats.energy.cur, player.stats.energy.max);
        player.stats.action.cur = Math.min(player.stats.action.cur, player.stats.action.max);
    }
};
