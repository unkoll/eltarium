/**
 * Created by unkoll on 06.07.17.
 */
const Bind = function() {
    $('.icon').unbind()
        .bind('click', function () {
            let q = $(this).attr('id');
            $('#' + q + '_info').toggleClass('hide');
        });
    $('.unequip').unbind()
        .bind('click', function () {
            let q = $(this).attr('id').split('X');
            q = q[0].split('_');
            category = [q[0]];
            if (category[0] === 'weapon') category.push(q[1]);
            Action.unequip(q.pop(), category, true);
        });
    $('.equip').unbind()
        .bind('click', function () {
            let q = $(this).attr('id').split('X');
            q = q[0].split('_');
            Action.equip(Number(q.pop()));
        });
    $('.delete').unbind()
        .bind('click', function () {
            let  q = $(this).attr('id').split('X');
            q = q[0].split('_');
            category = [q[0]];
            if (category[0] === 'weapon') category.push(q[1]);
            Action.delete(q.pop(), category, true);
        });
    $('.weapon_use').unbind()
        .bind('click', function () {
            let q = $(this).attr('id').split('X')[0].split('_')[1];
            $('#weapon_' + player.inventory.using_weapon + 'Xuse').removeClass('active');
            player.inventory.using_weapon = q;
            player.stats.action.cur -= player.action_expend.change_weapon;
            reload();
        });
    $('.drink').unbind()
        .bind('click', function() {
            let q = $(this).attr('id').split('X')[0];
            let it = Number(q.split('_')[1]);
            let eff = {};
            for (let key in player.inventory.bags.flask[it].effect)
                eff[key] = player.inventory.bags.flask[it].effect[key];


            player.effects.push(eff);
            player.inventory.bags.flask[it].cnt--;
            if (player.inventory.bags.flask[it].cnt <= 0) {
                Action.delete(it, ['flask'], false);
            }
            player.stats.action.cur -= player.action_expend.flask;

            reload();

        });
    $('.add_cnt').unbind()
        .bind('click', function() {
            let cnt = prompt('Сколько добавить? ', 0);
            cnt = Number(cnt);
            if (isNaN(cnt) || cnt === 0 || cnt === null) return;

            let q = $(this).attr('id').split('X')[0].split('_');
            switch (q[0]) {
                case 'main':
                    player.inventory.bags.main[Number(q[2])].cnt += cnt;
                    break;
                case 'bag':
                    player.inventory.bags.bag.cnt += cnt;
                    break;
                default:
                    player.inventory.bags[q[0]][Number(q[1])].cnt += cnt;
            }
            reload();
        });
    $('.use_ammo').unbind()
        .bind('click', function() {
            player.inventory.using_ammo = Number($(this).attr('id').split('X')[0].split('_')[1]);
            reload();
        });

    //Distribution stats
    $('#distribute_stats').unbind()
        .bind('click', function() {
            $('#distribute').toggleClass('hide');
            for (let key in Delta.main)
                Delta.main[key] = 0;
        });
    $('.plus').unbind()
        .bind('click', function() {
            let cur = $(this).attr('name');
            if (Delta.main.free + stat('free') > 0 && player.stats.main[cur].base + Delta.main[cur] < 12) {
                Delta.main.free --;
                Delta.main[cur] ++;
                Show.stats.main();
            }
        });
    $('.minus').unbind()
        .bind('click', function(){
            let cur = $(this).attr('name');
            if (Delta.main[cur] > 0) {
                Delta.main.free ++;
                Delta.main[cur] --;
                Show.stats.main();
            }
        });
    $('#distribute_submit').unbind()
        .bind('click', function() {
           $('#distribute').addClass('hide');
           for (let key in Delta.main) {
               player.stats.main[key].base += Number(Delta.main[key]);
               Delta.main[key] = 0;
           }
           reload();
        });

    //Effects
    $('#effect_open').unbind()
        .bind('click', function() {
            $('#effect_panel').toggleClass('hide');
            $('#action_panel').addClass('hide');
    });

    $('.effect').unbind()
        .bind('mouseenter mouseleave', function() {
            let q = $(this).attr('id');
            $('#' + q + '_info').toggleClass('hide');
        });
    $('.effect_del').unbind()
        .bind('click', function(){
            let it = Number($(this).attr('id').split('_')[1]);
            player.effects.splice(it,1);
            reload();
        });
    $('#effect_add').unbind()
        .bind('click', function(){
            Prompt.open();
            Prompt.add.close();
            Prompt.add.heading('Добавление эффекта');
            Prompt.add.field('Название', 'eff_name', '');
            Prompt.add.field('Источник', 'eff_source', '');
            Prompt.add.large_field('Условие', 'eff_conditional', '');
            Prompt.add.large_field('Эффект', 'eff_effect', '');
            Prompt.add.field('Длительность', 'eff_duration', '');
            Prompt.add.submit(function() {
                let eff = {
                    name: $('#eff_name').val(),
                    source : $('#eff_source').val(),
                    conditional: $('#eff_conditional').val(),
                    effect: $('#eff_effect').val(),
                    duration: $('#eff_duration').val()
                };

                if (eff.name === '' || eff.effect === '' || eff.duration === '') {
                    alert('Заполните поле названия, эффекта и длительности');
                    return;
                }
                if (eff.source === '') eff.source = 'Неизвестно';

                player.effects.push(eff);
                Prompt.close();
                reload();
            });
        });
    $('input[name="effect_clean"]').unbind()
        .bind('click', function() {
           for(let key = player.effects.length - 1; key >= 0; key--) {
               let duration = player.effects[key].duration;
               if (duration !== -1)
                   player.effects.splice(key,1);
           }
           reload();
        });


    //Action panel
    $('#action_open').unbind()
        .bind('click', function() {
           $('#action_panel').toggleClass('hide');
           $('#effect_panel').addClass('hide');
        });
    $('.var').unbind()
        .bind('click', function() {
            let cur = $(this).attr('id').split('X')[0];
            let sec = $(this).attr('second');

            if (!$('#' + sec).hasClass('hide')) {
                $('#' + sec).addClass('hide');
                $('#' + sec + 'Xopen').addClass('unactive');
                $('#' + cur).removeClass('hide');
                $('#' + cur + 'Xopen').removeClass('unactive');
            }

        });
    //Battle
    $('#enrage_use').unbind()
        .bind('click', function() {
            let enrage = {
                name : 'Исступление',
                source: '---',
                condition: '',
                effect: '(const#action_expend strike#-#1)',
                duration: 1
            };
            player.effects.push(enrage);
            reload();
        });
    $('.strike').unbind()
        .bind('click', function() {
            let cur = $(this).attr('name');
            let using = player.inventory.using_weapon;
            let using_ammo = player.inventory.using_ammo;
            let item = player.inventory.weapon[using][cur];
            let ammo = player.inventory.bags.ammo[using_ammo];
            let delta_ammo = false;

            if (item.ammo !== undefined) {
                if (ammo !== undefined && ammo.type.split(' ')[2] === item.ammo){
                    if (ammo.cnt > 0)
                        delta_ammo = true;
                    else {
                        alert('Недостаточно боеприпасов!');
                        return;
                    }
                }
                else {
                    alert('Проверьте боеприпасы!');
                    return;
                }
            }

            let act =  3 + player.action_expend.strike;
            if (player.inventory.weapon[using][cur] !== undefined)
                act = player.inventory.weapon[using][cur].action + player.action_expend.strike;

            act *= player.action_expend.mod;
            if (player.stats.action.cur - act < 0) {
                alert('Недостатоно очков действий!');
                return;
            }

            if (delta_ammo) player.inventory.bags.ammo[using_ammo].cnt--;
            player.stats.action.cur -= act;
            reload();
        });
    $('.expend').unbind()
        .bind('click', function() {
            let name = $(this).attr('name');
            player.stats[name].cur -= $('input[expended="' + name +'"]').val();
            $('input[expended="' + name +'"]').val(0);
            reload();
        });
    $('#dmg_submit').unbind()
        .bind('click', function() {
            Action.get_damage($('#dmg_type').val(), $('#dmg').val());
            $('#dmg_type').val('phys');
            $('#dmg').val(0);
        });
    $('#start_battle').unbind()
        .bind('click', function() {
            player.stats.action.cur = player.stats.action.base;
            reload();
        });
    $('#next_turn').unbind()
        .bind('click', function() {
            player.stats.action.cur += player.stats.action.recovery;
            for (let key = player.effects.length - 1; key >= 0; key--){
                if (Calculate.parse.conditional(player.effects[key].conditional))
                    Calculate.parse.effect(player.effects[key].effect, 'turn');

                if (player.effects[key].duration > 0) player.effects[key].duration--;
                if (player.effects[key].duration === 0)
                    player.effects.splice(key, 1);
            }
            let using = player.inventory.using_weapon;
            for (let key in player.inventory.clothes)
                Calculate.parse.effect(player.inventory.clothes[key].bonus, 'turn');

            for (let key in player.inventory.weapon[using])
                Calculate.parse.effect(player.inventory.weapon[using][key].bonus, 'turn');

            reload();
        });
    //Admin
    $('#money_add_sumbit').unbind()
        .bind('click', function() {
            let x = Number($('#money_add_val').val());
            $('#money_add_val').val(0); if (isNaN(x)) return;
            player.inventory.money[$('#money_add_select').val()] += x;
            reload();
        });
    $('#skill_add_sumbit').unbind()
        .bind('click', function() {
            let x = Number($('#skill_add_val').val());
            $('#skill_add_val').val(0); if (isNaN(x)) return;
            player.skills[$('#skill_add_select').val()].exp +=
                (x * (1 + 0.05*(stat('intelligence') - 6))).toFixed(0);
            reload();
        });
    $('.change').unbind()
        .bind('click', function() {
            let name = $(this).attr('name');
            let val = $('input[name="' + name + '_val"]').val();
            player[name] =  val;

            $('input[name="' + name + '_val"]').val('');
            Show.avatar();
        });
    $('#reset_stats').unbind()
        .bind('click', function() {
            for (let key in player.stats.main){
                player.stats.main[key].base = 3;
            }
            player.stats.main.free.base = 20;
            reload();
        });
    $('#add_item').unbind()
        .bind('click', function() {
            Prompt.open();
            Prompt.add.close()
                .heading('Добавление предмета')
                .field('Название: ', 'item_name', '', 'Меч стражника')
                .large_field('Описание: ', 'item_description', '')
                .heading('')
                .field('Тип: ', 'item_type', '', 'weapon one_handed sword')
                .field('Редкость: ', 'item_rarely', '', '0 - 5 (0 - мусор, 5 - легендарный)')
                .field('Уровень предмета: ', 'item_lvl', '', '0 - 7')
                .field('Вес: ', 'item_weight', '')
                .large_field('Бонусы: ', 'item_bonus', '')
                .heading('')
                .field('Емкость: ', 'item_capacity', '')
                .field('Восст. энергии:', 'item_revive', '')
                .heading('')
                .field('Урон: ', 'item_damage', '')
                .field('Затраты ОД: ', 'item_action', '')
                .field('Опт. дистанция: ', 'item_dist', '')
                .field('Штраф: ', 'item_penalty', '')
                .field('Тип боеприпасов: ', 'item_ammo', '')
                .heading('')
                .field('Порог урона: ', 'item_dt', '')
                .field('Порог брони: ', 'item_at', '')
                .field('Передвижение: ', 'item_movement', '')
                .heading('')
                .field('Шанс блока: ', 'item_blocking', '')
                .heading('')
                .field('Количество: ', 'item_cnt', '', 'ячеек или зарядов')
                .heading('')
                .field('Токсичность: ', 'item_toxicity', '', 'Только для зелий')
                .large_field('Эффект: ', 'item_effect', '')
                .heading('')
                .field('Шанс осечки(%): ', 'item_misfire', '', 'Только для боеприпасов')
                .submit(function(){
                    let item = {};
                    item.name = $('#item_name').val();
                    item.description = $('#item_description').val();
                    item.type = $('#item_type').val();
                    item.rarely = Number($('#item_rarely').val());
                    item.lvl = Number($('#item_lvl').val());
                    item.weight = Number($('#item_weight').val());
                    item.bonus = $('#item_bonus').val();
                    let eff  = $('#item_effect').val();
                    if (eff !== '' && eff !== '' && eff !== ' ')
                        item.effect = JSON.parse(eff);
                    for (let it in Const.args) {
                        let x = $('#item_' + it).val();
                        if (x === '' || x === ' ' || x === undefined) continue;
                        if (!isNaN(Number(x))) x = Number(x);
                        item[it] = x;
                    }
                    let x = $('#item_ammo').val();
                    if (!(x === '' || x === ' ' || x === undefined))  item.bonus = x;

                    player.inventory.bags.main.push(item);
                    reload();
                    Prompt.close();
                });



        });

    //SPELLBOOK
    $('#spellbook_open').unbind()
        .bind('click', function() {
            $('#inventory').addClass('hide');
            $('#spellbook').removeClass('hide');
            $(this).attr({'id': 'spellbook_close', 'value' : 'Снаряжение'});
            reload();
        });
    $('#spellbook_close').unbind()
        .bind('click', function(){
            $('#spellbook').addClass('hide');
            $('#inventory').removeClass('hide');
            $(this).attr({'id': 'spellbook_open', 'value' : 'Книга заклинаний'});
            reload();
        });
    $('.spell').unbind()
        .bind('click', function() {
           $(this).children('.info').toggleClass('hide');
        });
    $('.cast').unbind()
        .bind('click', function(){
            let it = player.spellbook[Number($(this).parent('.info').parent('.spell').attr('name'))];
            let delta_energy = (it.energy + get(player.energy_expend.cast))*player.energy_expend.mod;
            let delta_action = (it.action + get(player.action_expend.cast))*player.action_expend.mod;
            if (player.stats.energy.cur - delta_energy < 0) {
                alert('Недостаточно энергии!');
                return;
            }
            if (player.stats.action.cur - delta_action < 0) {
                alert('Недостаточно очков действия!');
                return;
            }
            player.stats.energy.cur -= delta_energy;
            player.stats.action.cur -= delta_action;
            let cv = it.effects;
            if (cv !== undefined) player.effects.push(cv);
            reload();
        });
    $('#spell_add').unbind()
        .bind('click', function(){
           Prompt.open();
           Prompt.add.close()
               .heading('Добавить заклинание')
               .field('Название: ', 'spell_name', '', '')
               .large_field('Описание: ', 'spell_description', '', '')
               .field('Изображение (50х50): ', 'spell_icon', '', 'ссылка')
               .field('Затраты ОД: ', 'spell_action', '', '')
               .field('Затраты энергии: ', 'spell_energy', '', '')
               .field('Тип: ', 'spell_type', '', 'elements|combinative|perk')
               .large_field('Эффект (на себя) (JSON)', 'spell_effects', '', '')
               .field('Доступные школы: ', 'spell_school', '', 'через пробел rune/spell/ritual')
               .large_field('Сила заклинания: ', 'spell_spell', '', '')
               .large_field('Критические эффекты (JSON): ', 'spell_critical', '', '')
               .submit(function() {
                    let spell = {};
                    spell.name = $('#spell_name').val();
                    spell.description = $('#spell_description').val();
                    spell.icon = $('#spell_icon').val();
                    spell.action = $('#spell_action').val();
                    spell.type=$('#spell_type').val();
                    let eff  = $('#spell_effects').val();
                    if (eff !== '' && eff !== '' && eff !== ' ')
                        spell.effects = JSON.parse(eff);
                    spell.school = $('#spell_school').val();
                    spell.spell = $('#spell_spell').val();
                   let crit  = $('#spell_critical').val();
                   if (crit !== '' && crit !== '' && crit !== ' ')
                       spell.critical = JSON.parse(crit);

                    player.spellbook.push(spell);
                    reload();
               });
        });
};