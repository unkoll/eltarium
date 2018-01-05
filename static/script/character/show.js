/**
 * Created by unkoll on 01.07.17.
 */

function get_add_damage(item){
    let type = (item !== undefined)? item.type.split(' ') : ['weapon','one_handed', 'fists'];
    switch (type[1]) {
        case 'one_handed':
            if (type[2] === 'mace' || type[2] === 'fists')
                return stat('strength');
            if (type[2] === 'dagger')
                return stat('agility');
            return Math.max(stat('strength'), stat('agility'));
        case 'two_handed':
            return (type[2] === 'stave' || type[2] === 'polearm') ? Math.max(stat('strength'), stat('agility')) : stat('strength');
        case 'fire':
            return stat('perception');
        default:
            return Math.max(stat('agility'),stat('perception'));
    }
}

const Show = {
    avatar : function () {
        $('#name').html(player.name);
        $('#character').html(player.name + ' (управлеяется игроком ' + player.player + ')')
            .css('background-color', player.color);
        $('#avatar').attr('src', player.avatar);
    },
    stats: {
        main: function () {
            for (let key in player.stats.main)
                $('#' + key).html(stat(key) + Delta.main[key]);
            if (stat('free') !== 0) $('#distribute_stats').removeClass('hide');
            else  $('#distribute_stats').addClass('hide');
        },
        hea: function () {
            let hea = ['health', 'energy', 'action'];
            for (let i = 0; i < 3; ++i) {
                let it = hea[i], w = 0, b = 0;
                if (player.stats[it].max !== 0)
                    w = player.stats[it].cur / player.stats[it].max * Const.INDICATOR_WIDTH;
                if (w === Const.INDICATOR_WIDTH)
                    b = 20;
                w = w + 'px';
                b = b + 'px';
                $('#' + it + '_indicator').css({
                    'width': w,
                    'border-top-right-radius': b,
                    'border-bottom-right-radius': b
                });
                for (let key in player.stats[it])
                    $('#' + it + '_' + key).html(player.stats[it][key].toFixed(0));
            }
        },
        resist : function() {
            for (let key in player.stats.resist)
                $('#' + key).html(player.stats.resist[key].toFixed(0));

        },
        movement: function() {
            $('#movement').html(player.stats.movement.toFixed(1));
        },
        weight: function() {
            for (key in player.stats.weight)
                $('#weight_' + key).html(player.stats.weight[key].toFixed(0));

        },
        critical: function () {
            for (let key in player.stats.critical) {
                $('#' + key).html(player.stats.critical[key].toFixed(0));
                $('#' + key + '_act').html(player.stats.critical[key].toFixed(0));
            }

        },
        chances: function () {
            for (let key in player.stats.chances.battle)
                    $('#' + key).html(player.stats.chances.battle[key].toFixed(0));

            for (let key in player.stats.chances.peaceful)
                $('#' + key).html(player.stats.chances.peaceful[key].toFixed(0));

            $('#evasion_act').html(player.stats.chances.battle.evasion.toFixed(0));
            $('#blocking_act').html(player.stats.chances.battle.blocking.toFixed(0));
        },
        armor: function () {
            $('#dt').html(player.stats.armor.dt);
            $('#at').html(player.stats.armor.at);
        }
    },
    inventory: {
        clothes: function () {
            for (let key in player.inventory.clothes) {
                $('#' + key).attr('src', Calculate.icon(player.inventory.clothes[key]));
                $('#' + key + '_info')
                    .html(Calculate.info(player.inventory.clothes[key], 'equiped', '', key));
            }
        },
        weapon: function () {
            let using = player.inventory.using_weapon;
            $('#weapon_' + using + 'Xuse').addClass('active');
            for (let key in player.inventory.weapon) {
                for (let it in player.inventory.weapon[key]) {
                    $('#weapon_' + key + '_' + it)
                        .attr('src', Calculate.icon(player.inventory.weapon[key][it]));
                    $('#weapon_' + key + '_' + it + '_info')
                        .html(Calculate.info(player.inventory.weapon[key][it], 'equiped', '', 'weapon_' + key + '_' + it));
                }
            }
            let info_main = info(player.inventory.weapon[using].main);
            let info_offend =  info(player.inventory.weapon[using].offend);
            let add_damage, damage, chance;

            let dmg_query = '';

            if (get(info_main.hands) > 0 && get(info_offend.hands) === 0 || info_offend.slot === 'shield') {
                add_damage = get_add_damage(player.inventory.weapon[using].main);
                damage = (player.inventory.weapon[using].main !== undefined)?player.inventory.weapon[using].main.damage:"D4";
                chance = (info_main.skills !== undefined) ? info_main.skills : 'fists';

                dmg_query += 'Шанс попадания: ' + player.stats.chances.battle[chance] + '<br>';
                dmg_query += 'Урон: ' + damage + ' (+' + add_damage + ') <br>';
                dmg_query += '<input type="button" name="main" class="righted strike" value="Ударить"> <br class="clean">';
            }
            else {
                add_damage = get_add_damage(player.inventory.weapon[using].main);
                damage = (player.inventory.weapon[using].main !== undefined)?player.inventory.weapon[using].main.damage:"D4";
                chance = (info_main.skills !== undefined) ? info_main.skills : 'fists';

                dmg_query += 'Основная рука: <br> <div class="tab">'
                dmg_query += 'Шанс попадания: ' + player.stats.chances.battle[chance] + '<br>';
                dmg_query += 'Урон: ' + damage + ' (+' + add_damage + ') <br> ';
                dmg_query += '<input type="button" name="main" class="righted strike" value="Ударить"> <br class="clean">';

                add_damage = get_add_damage(player.inventory.weapon[using].offend);
                damage = (player.inventory.weapon[using].offend !== undefined)?player.inventory.weapon[using].offend.damage:"D4";
                chance = (info_offend.skills !== undefined) ? info_offend.skills : 'fists';

                dmg_query += '</div> Дополнительная рука: <br> <div class="tab">'
                dmg_query += 'Шанс попадания: ' + player.stats.chances.battle[chance] + '<br>';
                dmg_query += 'Урон: ' + damage + ' (+' + add_damage + ') <br> ';
                dmg_query += '<input type="button" name="offend" class="righted strike" value="Ударить"> <br class="clean">';

                dmg_query += ' </div> <br> Шанс двойного удара: ' + player.stats.critical.double_strike + '<br>';

            }

            $('#damage').html(dmg_query);
        },
        money: function () {
            let add_select  = '';
            for (let key in player.inventory.money) {
                add_select += '<option value=' + key + '> ' + Const.translate.money[key] + '</option>';
                $('#' + key).html(player.inventory.money[key]);
                //Show name of coin
                $('#' + key + '_icon').unbind()
                    .bind('mouseenter mouseleave', function () {
                    let q = $(this).attr('id');
                    q = q.split('_');
                    $('#' + q[0] + '_info').toggleClass('hide');
                });
            }
            $('#money_add_select').html(add_select);
        },
        docs: function () {
            let docs = '';
            for (let key in player.inventory.docs)
                docs += player.inventory.docs[key] + "<br>";
            docs += '<input type="button" id="docs_edit" value="Редактировать">';
            $('#docs_info').html(docs);
            $('#docs_edit').unbind()
                .bind('click', function(){
                    $('#docs_info').addClass('hide');
                    Prompt.open();
                    Prompt.add.close();
                    Prompt.add.heading('Редактирование документов');
                    let len = player.inventory.docs.length;
                    for (let key = 0; key < player.inventory.docs.length; ++key) {
                        Prompt.add.field('Документ ' + Number(Number(key) + Number(1)), 'doc' + key, player.inventory.docs[key]);
                    }
                    $('#prompt_footer').append('<input type="button" id="prompt_add" value="Добавить еще"> <br>');
                    $('#prompt_add').unbind()
                        .bind('click', function(){
                            Prompt.add.field('Документ ' +  Number(Number(len) + Number(1)), 'doc' + len, '');
                            len++;
                        });

                    Prompt.add.submit(function() {
                        player.inventory.docs.splice(0, len);
                        for (let key = 0;  key < len + 1; ++key) {
                            let val =  $('#doc'+key).val();
                            if (val !== '' && val !== undefined) player.inventory.docs.push(val);
                        }
                        reload();
                    });

                });
        },
        bags: function () {
            $('#bag').attr('src', Calculate.icon(player.inventory.bags.bag));
            $('#bag_info').html(Calculate.info(player.inventory.bags.bag, "equiped", "", "bag"));
            for (let key  = 0; key < player.inventory.bags.flask.length; ++key) {
                $('#flask_' + key).attr('src', Calculate.icon(player.inventory.bags.flask[key]));
                $('#flask_' + key + '_info')
                    .html(Calculate.info(player.inventory.bags.flask[key], 'equiped', 'elixir', 'flask_' + key));
            }
            for (let key = 0; key < player.inventory.bags.ammo.length; ++key) {
                $('#ammo_' + key).attr('src', Calculate.icon(player.inventory.bags.ammo[key]));
                $('#ammo_' + key + '_info')
                    .html(Calculate.info(player.inventory.bags.ammo[key], 'equiped', 'ammo', 'ammo_' + key));
            }

            for (let key = 0; key < 4; ++key)
                $('#ammo_' + key).removeClass('active');
            let using_ammo = player.inventory.using_ammo;
            if (player.inventory.bags.ammo[using_ammo] !== undefined)
                $('#ammo_' + using_ammo).addClass('active');


            $('.for_bag').html('Сумка: <br>');
            let cnt = (player.inventory.bags.bag !== undefined)? player.inventory.bags.bag.cnt : 0;
            for (let key = 0; key < 4 + cnt; ++key) {
                let addr = '/static/icon/item/empty.gif';
                let info = 'Пусто';
                if (key < player.inventory.bags.main.length) {
                    addr = Calculate.icon(player.inventory.bags.main[key]);
                    info = Calculate.info(player.inventory.bags.main[key], 'unequiped', '', 'main_bag_' + key);
                }
                $('.for_bag').append(
                    '<div class="lefted pad slot">' +
                    '<img class="icon" id="main_bag_' + key + '" src="' + addr + '">' +
                    '<div id="main_bag_' + key + '_info" class="tab hide info" >' + info + '</div> </div>'
                );
            }
        }
    },
    effects: function() {
        $('#effect_content').html('');
        for (let key = 0; key < player.effects.length; ++key) {
            let duration = (player.effects[key].duration > 0) ? player.effects[key].duration : 'вечно';
            let query = '<div class="lefted effect" id="effect_' + key + '">' + player.effects[key].name +
                '<div class="info hide" style="top: 25px;" id="effect_' + key + '_info"> Источник: ' + player.effects[key].source +
                '<br> Длительность: ' + duration + '</div>' +  '</div> ' +
                '<img class="righted effect_del" src="/static/delete.png" height=20px id="effect_' + key + '_del"> <br class="clean">';
            $('#effect_content').append(query);
        }
    },
    skills: function() {
        let add_select = '';
        for (let key in player.skills) {
            add_select += '<option value=' + key + '> ' + player.skills[key].name + '</option>';
        }
        $('#skill_add_select').html(add_select);


    },
    spells: function() {
        $('#perk').html('<br><br>');
        $('#elements').html('<br><br>');
        $('#combinative').html('<br><br>');
        for (let i = 0; i < player.spellbook.length; ++i) {
            $('#' + player.spellbook[i].type).append(Calculate.spell.render(i));
        }
        if ($('#perk').html() === '<br><br>') $('#perk').append('<strong> Пусто :C <br> Учитесь, учитесь и еще раз учитесь! </strong>');
        $('#perk').append('<br class="clean">');
        if ($('#elements').html() === '<br><br>') $('#elements').append('<strong> Пусто :C <br> Учитесь, учитесь и еще раз учитесь! </strong>');
        $('#elements').append('<br class="clean">');
        if ($('#combinative').html() === '<br><br>') $('#combinative').append('<strong> Пусто :C <br> Учитесь, учитесь и еще раз учитесь! </strong>');
        $('#combinative').append('<br class="clean">');
    },
    all: function () {
        for (let key in Show.stats)
            Show.stats[key]();
        for (let key in Show.inventory)
            Show.inventory[key]();
        Show.effects();
        Show.skills();
        Show.spells();
        Bind();
    }
};
