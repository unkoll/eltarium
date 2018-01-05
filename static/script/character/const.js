/**
 * Created by unkoll on 30.06.17.
 */

function check_player() {
    let st = '';
    for (let key in player) st += key + '\n';
    alert(st);
}


const Const = {
    item_color :  [
        "#ffffff",
        "#00ad00",
        "#2d8cff",
        "#9843ff",
        "#ff7802"
    ],
    args :  {
        cnt: 'Количество: ',

        damage: 'Урон: ',
        action: 'Затраты очков действия: ',
        dist: 'Оптимальная дистанция: ',
        penalty: 'Штраф за дальность: ',

        blocking: 'Шанс блокирования: ',

        dt: 'Порог урона: ',
        at: 'Порог брони: ',
        movement: 'Передвижение: ',


        toxicity: 'Токсичность: ',
        misfire: 'Шанс осечки: ',

        capacity: 'Емкость: ',
        revive: 'Восстановление энергии: '
    },
    test_player  : {
        name: 'Клара Корелли',
        player: 'Настасья',
        color: "#4dc253",
        avatar: "https://pp.vk.me/c636920/v636920202/1830d/y2s8hG-P4RM.jpg",
        stats: {
            health: {
                cur: 4
            },
            energy: {
                cur: 11
            },
            action: {
                cur: 8
            },
            main: {
                strength: { base: 3 },
                agility: { base: 3 },
                perception: { base: 3 },
                intelligence: { base: 3 },
                stamina: { base: 3 },
                speed: { base: 3 },
                free: { base: 20 }
            }
        },
        skills: {
            one_handed: {
                name: 'Одноручное',
                exp: 0
            },
            two_handed: {
                name: 'Двуручное',
                exp: 0
            },
            bow: {
                name: 'Луки',
                exp: 0
            },
            arbalest: {
                name: 'Арбалеты',
                exp: 0
            },
            fire: {
                name: 'Огнестрельное',
                exp: 0
            },
            fists: {
                name: 'Рукопашный бой',
                exp: 0
            },

            armor: {
                name: 'Владение броней',
                exp: 0
            },
            shields: {
                name: 'Щиты',
                exp: 0
            },


            magic: {
                name: 'Владение магией',
                exp: 0
            },

            science: {
                name: 'Наука',
                exp: 0
            },
            logic: {
                name: 'Логика',
                exp: 0
            },
            gambling: {
                name: 'Азартные игры',
                exp: 0
            },
            sneak: {
                name: 'Скрытность',
                exp: 0
            },
            communication: {
                name: 'Общение',
                exp: 0
            },
            music: {
                name: 'Музыка',
                exp: 0
            },
            blacksmithing: {
                name: 'Кузнечное дело',
                exp: 0
            },
            jewellery: {
                name: 'Ювелирное дело',
                exp: 0
            },
            tailoring: {
                name: 'Портняжное дело',
                exp: 0
            },
            alchemy: {
                name: 'Алхимия',
                exp: 0
            },
            medicine: {
                name: 'Медицина',
                exp: 0
            }
        },
        inventory: {
            clothes: {
                head: {
                    name: "Капюшон",
                    description: "Обычный тканный капюшон",
                    type: "armor cloth head",
                    rarely: 1,
                    lvl: 0,
                    weight: 0.5,
                    bonus: '',

                    dt: 0,
                    at: 1,
                    movement: 0.025

                },
                torso: {
                    name: "Богатая одежда с кольчужными элементами",
                    description: "Качественная кольчужная броня",
                    type: "armor chain torso",
                    rarely: 2,
                    lvl: 2,
                    weight: 3.5,
                    bonus: '',


                    dt: 3,
                    at: 10,
                    movement: -0.015
                },
                hands: {
                    name: "Азаранские перчатки",
                    description: "Перчатки, сотканные для богатых азарнских дворов",
                    type: "armor cloth hands",
                    rarely: 2,
                    lvl: 1,
                    weight: 0.5,
                    bonus: "(const#stats chances peaceful persuasion#+#5)",

                    dt: 0,
                    at: 0,
                    movement: 0.01
                },
                legs: {
                    name: "Богатые сапоги с кольчужными элементами",
                    description: "Качественные кольчужные сапоги",
                    type: "armor chain legs",
                    rarely: 2,
                    lvl: 2,
                    weight: 2,
                    bonus: '',

                    dt: 2,
                    at: 4,
                    movement: -0.01

                },
                belt: {
                    name: "Тканный кушак",
                    description: "Обычный тканный кушак. Ничего интересного.",
                    type: "jewelry belt",
                    rarely: 1,
                    lvl: 0,
                    weight: 0.5,
                    bonus: ''
                },
                neck: {
                    name: "Странное ожерелье с изумрудом",
                    description: "Подарок отца. Огранка камня оставляет много вопросов.",
                    type: "jewelry neck",
                    rarely: 3,
                    lvl: 2,
                    weight: 1,
                    bonus: "(const#stats resist will#+#10)",

                    capacity: 15,
                    revive: 1
                },
                ear: {
                    name: "Серебряные серьги",
                    description: "Обычные серебряные серьги",
                    type: "jewelry ear",
                    rarely: 2,
                    lvl: 1,
                    weight: 0,
                    bonus: '',

                    capacity: 3,
                    revive: 0.5
                }
            },
            using_weapon: "main",
            using_ammo: 0,
            weapon: {
                main: {
                    main: {
                        name: "Полуэнергостальной кинжал",
                        description: "Качественный кинжал, подаренный За'Ром <br> Увеличивает шанс критического удара на 15",
                        type: "weapon one_handed dagger",
                        rarely: 3,
                        lvl: 3,
                        weight: 2,
                        bonus: "(const#stats critical crit#+#15)",

                        capacity: 5,
                        revive: 2,

                        damage: "D6+6",
                        action: 3
                    }
                },
                additional: {
                    main: {
                        name: 'Легендарный лук короч',
                        description: 'Ну понятно',
                        type: 'weapon bow',
                        rarely: 5,
                        lvl: 7,
                        weight: 8,
                        bonus: '(const#stats main agility bonus#+#5)',

                        capacity: 20,
                        revive: 1.5,

                        damage: 'D6+20',
                        action: 3,
                        dist: 6,
                        penalty: 15,
                        ammo: 'arrow'
                    }
                },
                hide : {

                }
            },
            bags: {
                bag: {
                    name: "Хорошая сумка из Университета",
                    description: "Такая сумка есть у каждого студента старше 2 курса",
                    type: "bag",
                    rarely: 3,
                    lvl: 3,
                    weight: 0,
                    bonus: '',


                    cnt: 20
                },
                main: [

                ],
                flask: [
                    {
                        name: "Зелье де Вая",
                        description: "Зелье, восстанавливающее 10 ОЗ в течение 2 ходов. <br> Старый и проверенный рецепт",
                        type: "item elixir",
                        rarely: 1,
                        lvl: 2,
                        weight: 2,
                        bonus: '',

                        cnt: 3,
                        toxicity: 10,
                        effect: {
                            name: "Восстановление 5 ОЗ",
                            source: "Зелье де Вая",
                            condition: '',
                            effect: "(turn#stats health cur#+#5)",
                            duration: 2
                        }
                    }
                ],
                ammo: [
                    {
                        name: 'Сверхкрепкие стрелы',
                        description: "Очень крепкие",
                        type: 'item ammo arrow',
                        rarely: 3,
                        lvl: 5,
                        weight: 1,
                        bonus: '',

                        cnt: 20,
                        misfire: 0.01
                    }
                ]
            },
            money: {
                ruby: 150,
                emerald: 1,
                sapphire: 0,
                azar: 0,
                ancient: 1
            },
            docs: [
                "Пропуск в университет",
                "Азаранский паспорт повышенного уровня",
                "Ключ от квартиры в Среднем Азаране"
            ]
        },
        effects: [

        ],
        spellbook: [
            {
                name: 'Огненный шар',
                description: 'Вы запускаете огненный шар в противника. <br> Урон: D4+10+Сила Заклинаний',
                icon: 'https://vignette1.wikia.nocookie.net/wow/images/2/22/Spell_fire_firebolt.png/revision/latest?cb=20170402124407&path-prefix=ru',

                action: 3,
                energy: 12,

                type: 'combinative',
                school: 'ritual spell rune',
                chance: {burning:'(#buffer#+#25)'}
            },
            {
                name: 'Огненный шар',
                description: 'Вы запускаете огненный шар в противника. <br> Урон: D4+10+Сила Заклинаний',
                icon: 'https://vignette1.wikia.nocookie.net/wow/images/2/22/Spell_fire_firebolt.png/revision/latest?cb=20170402124407&path-prefix=ru',

                action: 3,
                energy: 12,

                type: 'combinative',
                school: 'ritual spell rune',
                chance: {burning:'(#buffer#+#25)'}
            },
            {
                name: 'Огненный шар',
                description: 'Вы запускаете огненный шар в противника. <br> Урон: D4+10+Сила Заклинаний',
                icon: 'https://vignette1.wikia.nocookie.net/wow/images/2/22/Spell_fire_firebolt.png/revision/latest?cb=20170402124407&path-prefix=ru',

                action: 3,
                energy: 12,

                type: 'combinative',
                school: 'ritual spell rune',
                chance: {burning:'(#buffer#+#25)'}
            }

        ]
    },
    INDICATOR_WIDTH: 420,
    is_armor : function(cat) {
        return (cat === 'head' || cat === 'legs' || cat === 'hands' || cat === 'torso');
    },
    translate : {
        main: {
            strength: 'Сила',
            agility: 'Ловкость',
            perception: 'Восприятие',
            intelligence: 'Интеллект',
            stamina: 'Выносливость',
            speed: 'Скорость'
        },
        money: {
            ruby: 'Рубин',
            emerald: 'Изумруд',
            sapphire: 'Сапфир',
            azar: 'Азары',
            ancient: 'Древние монеты'
        },
        critical: {
            crit: 'Критический удар',
            burning: 'Горение',
            bleed: 'Кровотечение',
            stun: 'Оглушение',
            counter_attack: 'Контратака',
            enrage: 'Исступление',
            double_strike: 'Двойной удар',
            poisoned: 'Отравление',
            delay: 'Замедление',
            exact_strike: 'Точный удар',
            armor_ignoring: 'Игнорирование брони'
        },
        school: {
            ritual: 'ритуалы',
            spell: 'заклинания',
            rune: 'руны'
        }
    }
};

const Delta ={
    main : {
        strength: 0,
        agility: 0,
        perception: 0,
        intelligence: 0,
        stamina: 0,
        speed: 0,
        free: 0
    }
};

