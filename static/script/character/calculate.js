/**
 * Created by unkoll on 30.06.17.
 */

Array.prototype.back = function() {
    return this[this.length - 1];
};

function get(x) {
    return (typeof(x) === 'number') ? x : 0;
}

function stat (x) {
    return player.stats.main[x].base + player.stats.main[x].bonus;
}

function info(item) {
    /*
    Return Obj with full info about item from type
     */
    let result = {};
    if (item !== undefined) {
        let type = item.type.split(' ');
        result.type = type[0];
        switch (type[0]){
            case 'armor': {
                if (type[1] === 'shield') {
                    result.skill = 'shields';
                    result.hands = 1;
                    result.range = 'shield';
                    result.slot = 'shield';
                }
                else {
                    result.skill = 'armor';
                    result.heavy = (type[1] === 'plate' || type[1] === 'chain');
                    result.material = type[1];
                    result.slot = type[2];
                }
                break;
            }
            case 'weapon': {
                result.hands = (type[1] === 'two_handed' || type[1] === 'bow' || (type[1] === 'fire' && type[2] === 'canon')) ? 2 : 1;
                result.range = (type[1] === 'one_handed' || type[1] === 'two_handed')? 'melee' : 'ranged';
                result.hide = (type[1] === 'one_handed' && (type[2] === 'fists' || type[2] === 'dagger'));
                result.slot = 'weapon';
                result.skill = (type[1] === 'one_handed' && type[2] === 'fists')?'fists':type[1];
                break;
            }
        }
    }
    return result;
}

function getByAddr(addr, iter, cur) {
    if (!isNaN(Number(addr[0]))) return Number(addr[0]);
    if (iter === undefined) iter = 0;
    if (cur === undefined) cur = player;

    if (iter >= addr.length)
        return cur;
    return getByAddr(addr, iter+1, cur[addr[iter]]);
}

const Calculate = {
    conditional : function (addr, op, x) {
        let cur = getByAddr(addr);
        x = x.split(' ');
        switch(op) {
            case '==': return cur === getByAddr(x);
            case '!=': return cur !== getByAddr(x);
            case '>':  return cur >   getByAddr(x);
            case '>=': return cur >=  getByAddr(x);
            case '<':  return cur <   getByAddr(x);
            case '<=': return cur <=  getByAddr(x);
            case 'item': {
                let item_info = info(cur);
                switch (x[0]) {
                    case 'hands': return get(item_info.hands) === Number(x[1]);
                    case 'hide': return item_info.hide === (x[1] === 'true');
                    case 'heavy': return item_info.heavy === (x[1] === 'true');
                    default: return item_info[x[0]] === x[1];
                }
            }

        }
        return true;
    },
    effect : function (addr, op, x, iter, cur) {
        if (addr.length === 0 || addr.length === undefined) return cur;
        if (iter === addr.length) {
            x = x.split(' ');
            switch (op) {
                case '+': return cur + getByAddr(x);
                case '-': return cur - getByAddr(x);
                case '*': return cur * getByAddr(x);
                case '/': return cur / getByAddr(x);
                case '=': return cur = getByAddr(x);
            }
            return cur;
        }
        cur[addr[iter]] = Calculate.effect(addr, op, x, iter+1, cur[addr[iter]]);
        return cur;
    },
    parse: {
        conditional: function(conds) {
            if (conds === undefined || conds === '' || conds === ' ') return true;

            let oper = [];
            let val = [];

            let prior = function(op) {
                switch (op) {
                    case '|': return 1;
                    case '&': return 2;
                    case '!': return 3;
                }
                return -1;
            };
            let operate = function(op) {
                let v1,v2;
                v1 = val.pop();
                if (op !== '!') v2 = val.pop();

                switch (op){
                    case '|': return val.push(v1 | v2);
                    case '&': return val.push(v1 & v2);
                    case '!': return val.push(!v1);
                }
            };
            let is_delim = function(op) {
                return op === ' ';
            };
            let is_operate = function(op) {
                return (op === '|' || op === '&' || op === '!' || op === '(' || op === ')');
            };


            let cash = '';
            for (let i = 0; i < conds.length; ++i){
                if (is_delim(conds[i])) continue;
                if (conds[i] === '('){
                    oper.push('(');
                }
                else if (conds[i] === ')') {
                    while (oper.back() !== '(') {
                        operate(oper.back()); oper.pop();
                    }
                    oper.pop();
                }
                else if (is_operate(conds[i])){
                    while (oper.length > 0 && prior(conds[i]) > prior(oper.back())){
                        operate(oper.back()); oper.pop();
                    }
                    oper.push(conds[i]);
                }
                else {
                    while(conds[i] !== ')') {
                        cash += conds[i]; ++i;
                    }
                    oper.pop(); cash = cash.split('#');
                    val.push(Calculate.conditional(cash[1].split(' '), cash[2], cash[3]));
                    cash = '';
                }
            }
            while (oper.length > 0) {
                operate(oper.back()); oper.pop();
            }
            return val.back();
        },
        effect: function(effs, mode) {
            if (effs === undefined || effs === '' || effs ===' ') return;
            effs = effs.split('&');
            for (let i = 0; i < effs.length; ++i) {
                let eff = effs[i].slice(1,effs[i].length - 1).split('#');
                if (eff[0] === mode) {
                    player = Calculate.effect(eff[1].split(' '), eff[2], eff[3], 0, player);
                }
            }

        }
    },
    item : function (it) {
        if (it === undefined) return;
        player.stats.weight.cur += get(it.weight);
        player.stats.armor.dt += get(it.dt);
        player.stats.armor.at += get(it.at);
        player.stats.movement += get(it.movement);

        player.stats.energy.max += get(it.capacity);
        player.stats.energy.recovery += get(it.revive);

        player.stats.chances.battle.blocking += get(it.blocking);
        Calculate.parse.effect(it.bonus, 'const');

    },
    icon : function (item) {
        if (item === undefined) return '/static/icon/item/empty.gif';
        let type = item.type.split(' ');
        let addr = '/static/icon';
        for (let i = 0; i < type.length; ++i)
            addr += '/' + type[i];
        addr += (item.rarely !== 0) ? '/' + item.rarely : '';
        addr += '.gif';
        return addr;
    },
    info : function (item, place, type, id) {
        if (item === undefined) return 'Пусто';
        let result =
            '<strong style="color:' + Const.item_color[item.rarely - 1] + '">'
            + item.name + '</strong> <br> '
            + item.description + '<br><br>';
        for (let i in Const.args) {
            if (item[i] !== undefined)
                result += Const.args[i] + item[i] + '<br>';
        }
        result += '<br> Уровень предмета: ' + item.lvl + '<br> Вес: ' + item.weight + '<br>';
        if (type === 'elixir')
            result += '<input type="button" class="drink" id="' + id + 'Xdrink" value = "Выпить">';
        if (type === 'ammo')
            result += '<input type="button" class="use_ammo" id="' + id + 'Xammo" value="Использовать">';
        switch (place) {
            case 'equiped':
                result += '<input type="button" class="unequip" id="' + id + 'Xunequip" value="Убрать в сумку">';
                break;
            case 'unequiped':
                result += '<input type="button" class="equip" id="' + id + 'Xequip" value="Надеть">';
                break;
        }
        if (item.cnt !== undefined)
            result += '<br> <input type="button" class="add_cnt" id="' + id + 'Xadd_cnt" value="Добавить">';

        result += '<br> <input type="button" class="delete" id="' + id + 'Xdelete" value="Выбросить">';
        return result;
    },
    bag : function (item) {
        for (let i in item)
            player.stats.weight.cur += get(item[i].weight);
    },
    spell : {
        name: function(it) {
            return '<strong>' + player.spellbook[it].name + '</strong>';
        },
        icon: function(it){
            return player.spellbook[it].icon;
        },
        info: function(it) {
            let cur = player.spellbook[it];
            let result = '<strong>' + cur.name + '</strong> <br>' +
                '<br>' + cur.description + '<br><br>' +
                'Затраты энергии: ' + cur.energy + '<br> ' +
                'Затраты очков действия: ' + cur.action + '<br><br>';
            player.buffer = 0;
            Calculate.parse.effect(cur.spell, '');
            player.buffer +=  player.damage.spell;
            result += 'Сила заклинаний: ' + player.buffer + '<br>';
            let school = cur.school.split(' ');
            let t_sc = '';
            for (let i = 0; i < school.length; ++i) {
                t_sc += Const.translate.school[school[i]] + ', ';
            }
            result += 'Допустимые школы: ' + t_sc + ' абсолютная <br><br>';

            for (let key in cur.chance) {
                player.buffer = 0;
                Calculate.parse.effect(cur.chance[key], '');
                player.buffer +=  player.stats.critical[key];
                result += Const.translate.critical[key] + ': ' + player.buffer + '<br>';
            }
            result += '<br> <input type="button" name="' + it + '" class="full cast" value="Использовать">';
            return result;
        },
        render : function(spell_id) {
            return '<div class="spell" name="'+ spell_id + '">' +
                '<img class="lefted spell_icon" src="' + Calculate.spell.icon(spell_id) + '"> ' +
                '<div class="lefted spell_name" style="margin-left: 7px;">' + Calculate.spell.name(spell_id) + '</div> <br class="clean">'+
                '<div class="hide tab info">' + Calculate.spell.info(spell_id) + '</div> '+
                '</div>';

        }
    }
};
