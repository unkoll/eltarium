/**
 * Created by unkoll on 30.06.17.
 */

function reload() {
    Web.commit();
    Init.all();
    Show.all();
}

function linear_func(x1, y1, x2, y2, x) {
    let k = (y2 - y1)/(x2 - x1);
    let b = (x1*y2 - y1*x2)/(x1 - x2);
    return k*x + b;
}

const Action = {
    delete: function (item_id, category, re) {
        switch (category[0]) {
            case 'weapon':
                $('#weapon_' + category[1] + '_' + item_id).attr('src', '/static/icon/weapon/empty/' + item_id + '.gif');
                $('#weapon_' + category[1] + '_' + item_id + '_info').html('Пусто').addClass('hide');
                delete player.inventory.weapon[category[1]][item_id];
                break;
            case 'flask':
                player.inventory.bags.flask.splice(Number(item_id),1);
                $('#flask_' + item_id ).attr('src', '/static/icon/item/empty.gif');
                $('#flask_' + item_id + '_info').html('Пусто')
                    .addClass('hide');
                break;
            case 'ammo':
                player.inventory.bags.ammo.splice(Number(item_id),1);
                $('#ammo_' + item_id ).attr('src', '/static/icon/item/empty.gif');
                $('#ammo_' + item_id + '_info').html('Пусто')
                    .addClass('hide');
                break;
            case 'main':
                player.inventory.bags.main.splice(Number(item_id),1);
                break;
            case 'bag':
                delete player.inventory.bags.bag;
                $('#bag_info').addClass('hide');
                break;
            default:
                var type = (Const.is_armor(category[0]))? 'armor':'jewelry';
                $('#' + item_id).attr('src', '/static/icon/' + type + '/empty/' + item_id + '.gif');
                $('#' + item_id + '_info').html('Пусто')
                    .addClass('hide');
                delete player.inventory.clothes[item_id];
        }
        if (re) reload();
    },
    unequip: function (item_id, category, re) {
        let item;
        switch (category[0]) {
            case 'weapon':
                item = player.inventory.weapon[category[1]][item_id];
                break;
            case 'flask':
                item = player.inventory.bags.flask[Number(item_id)];
                break;
            case 'ammo':
                item = player.inventory.bags.ammo[Number(item_id)];
                break;
            case 'bag':
                item = player.inventory.bags.bag;
                break;
            default:
                item = player.inventory.clothes[item_id];
        }
        Action.delete(item_id, category, false);
        player.inventory.bags.main.push(item);
        if (re) reload();
    },
    equip : function (item_id) {
        let item = player.inventory.bags.main[item_id];
        let type = item.type.split(' ');
        switch (type[0]) {
            case 'armor':
                if (type[1] === 'shield') {
                    if (player.inventory.weapon.main.offend === undefined &&
                        hands(player.inventory.weapon.main.main) === 1) {
                        player.inventory.weapon.main.offend = item;
                        break;
                    }
                    else if (hands(player.inventory.weapon.additional.main) === 2)
                        Action.unequip('main', ['weapon', 'additional'], false);
                    else if (player.inventory.weapon.additional.offend !== undefined)
                        Action.unequip('offend', ['weapon', 'additional'], false);
                    player.inventory.weapon.additional.offend = item;
                    break;
                }
                if (player.inventory.clothes[type[2]] !== undefined)
                    Action.unequip(type[2], ['armor'], false);
                player.inventory.clothes[type[2]] = item;
                break;
            case 'weapon':
                let weap = [];
                if (info(item).hide) weap.push('hide');
                weap.push('main');
                let check = false;
                for (let i = 0; i < weap.length; ++i) {
                    if (info(item).hands === 2) {
                        if (player.inventory.weapon[weap[i]].main === undefined && player.inventory.weapon[weap[i]].offend === undefined) {
                            player.inventory.weapon[weap[i]].main = item;
                            check = true;
                            break;
                        }
                    }
                    else {
                        if (player.inventory.weapon[weap[i]].main === undefined) {
                            player.inventory.weapon[weap[i]].main = item;
                            check = true;
                            break;
                        }
                        if (info(player.inventory.weapon[weap[i]].main).hands === 1
                            && player.inventory.weapon[weap[i]].offend === undefined) {
                            player.inventory.weapon[weap[i]].offend = item;
                            check = true;
                            break;
                        }
                    }
                }
                if (check) break;
                if (info(item).hands === 2) {
                    if (player.inventory.weapon.additional.main !== undefined)
                        Action.unequip('main', ['weapon', 'additional'], false);
                    if (player.inventory.weapon.additional.offend !== undefined)
                        Action.unequip('offend', ['weapon', 'additional'], false);
                    player.inventory.weapon.additional.main = item;
                }
                else {
                    if (player.inventory.weapon.additional.main === undefined)
                        player.inventory.weapon.additional.main = item;
                    else {
                        if (info(player.inventory.weapon.additional.main).hands === 2)
                            Action.unequip('main', ['weapon', 'additional'], false);
                        else if (player.inventory.weapon.additional.offend !== undefined)
                            Action.unequip('offend', ['weapon', 'additional'], false);
                        player.inventory.weapon.additional.offend = item;
                    }
                }
                break;
            case 'jewelry':
                if (type[1] === 'ring') {
                    if (player.inventory.clothes.ring_1 === undefined) {
                        player.inventory.clothes.ring_1 = item;
                        break;
                    }
                    if (player.inventory.clothes.ring_2 !== undefined)
                        Action.unequip('ring_2', ['jewelry'], false);
                    player.inventory.clothes.ring_2 = item;
                    break;
                }
                if (player.inventory.clothes[type[1]] !== undefined)
                    Action.unequip(type[1], ['jewelry'], false);
                player.inventory.clothes[type[1]] = item;
                break;
            case 'item':
                let cur_type = (type[1] === 'elixir') ? 'flask' : type[1];
                let ch = false;
                for (let i = 0; i < 3; ++i)
                    if (player.inventory.bags[cur_type][i] === undefined) {
                        player.inventory.bags[cur_type][i] = item;
                        ch = true;
                        break;
                    }
                if (ch) break;
                if (player.inventory.bags[cur_type][3] !== undefined)
                    Action.unequip(3, [cur_type], false);
                player.inventory.bags[cur_type][3] = item;
                break;
            case 'bag':
                if (player.inventory.bags.bag !== undefined)
                    Action.unequip('bag', ['bag'], false);
                player.inventory.bags.bag = item;
                break;
        }
        Action.delete(item_id, ['main'], false);
        reload();
    },
    armoring: function(dmg) {
        let dt = player.stats.armor.dt;
        let at = player.stats.armor.at;
        let m1 = dt + (at - dt)/3;
        let m2 = at - (at - dt)/3;

        if (dmg <= dt)
            return 90;
        if (dt < dmg && dmg <= m1)
            return linear_func(dt, 90, m1, 65, dmg);
        if (m1 < dmg && dmg <= m2)
            return linear_func(m1, 65, m2, 25, dmg);
        if (m2 < dmg && dmg <= at)
            return linear_func(m2, 25, at, 0, dmg);
        return 0;
    },
    get_damage: function(type, dmg) {
        dmg = Math.ceil(dmg * (1 - get(player.stats.resist[type])/100));
        if (type === 'phys') dmg = Math.ceil(dmg * (1 - Action.armoring(dmg)/100));
        player.stats.health.cur -= dmg;
        reload();
    }
};

const Prompt = {
    open : function() {
        $('#prompt').removeClass('hide');
        $('#content').addClass('hide');
    },
    close: function() {
        $('#prompt').addClass('hide');
        $('#prompt_content').html('');
        $('#prompt_footer').html('');
        $('#content').removeClass('hide');
    },
    add : {
        close: function() {
            $('#prompt_content')
                .append('<div class="righted"> <img src="/static/close.png" width=20 id="prompt_close"> </div> <br>');
            $('#prompt_close').unbind()
                .bind('click', function(){
                    Prompt.close();
                });
            return Prompt.add;
        },
        heading: function(text) {
            $('#prompt_content').append('<div class="section">' + text + '</div> <br>');
            return Prompt.add;
        },
        field: function(name, field_id, def, place_holder) {
            if (place_holder === undefined) place_holder='';
            $('#prompt_content').append(
                '<div class="lefted">' +  name  +  '</div>' +
                '<div class="righted"> <input type="text" id="' + field_id +
                '"  value="' + def + '" style="font-size:medium; width:300px;" placeholder="' + place_holder + '" > </div> <br class="clean">');
            return Prompt.add;
        },
        large_field: function(name, field_id, def, place_holder) {
            if (place_holder === undefined) place_holder='';
            $('#prompt_content').append(
                '<div class="lefted">' +  name  +  '</div>' +
                '<div class="righted"> <textarea id="' + field_id +
                '"  value="' + def + '" style="font-size:medium; width:300px; height: 100px;" placeholder="' + place_holder + '" > </textarea> </div> <br class="clean">');
            return Prompt.add;
        },
        submit: function(func) {
            $('#prompt_footer').append('<input type="submit" id="prompt_submit" value="Отправить">');
            $('#prompt_submit').unbind()
                .bind('click', function() {
                    func();
                    Prompt.close();
                });
        }
    }
};
