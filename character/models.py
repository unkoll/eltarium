from django.db import models

# Create your models here.


class User(models.Model):
    """

    """
    email = models.EmailField()
    password = models.CharField(max_length=255)
    is_admin = models.BooleanField()
    worlds = models.ForeignKey(World)
    characters = models.ForeignKey(Character)


class World(models.Model):
    """

    """
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=255)
    characters = models.ForeignKey(Character, blank=True)


class Character(models.Model):
    """

    """
    name = models.CharField(max_length=50)
    player = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    avatar = models.CharField(max_length=255)

    health = models.IntegerField()
    energy = models.IntegerField()
    action = models.IntegerField()

    stats = models.OneToOneField(Stats)
    skills = models.OneToOneField(Skills)
    inventory = models.OneToOneField(Inventory)
    spellbook = models.ManyToManyField(Spell, blank=True)

    def json(self):
        return {
            "name": self.name,
            "player": self.player,
            "color": self.color,
            "avatar": self.avatar,
            "stats": {
                "health": {
                    "cur": self.health
                },
                "energy": {
                    "cur": self.energy
                },
                "action": {
                    "cur": self.action
                },
                "main": {
                    "strength": {
                        "base": self.stats.strength
                    },
                    "agility": {
                        "base": self.stats.agility
                    },
                    "perception": {
                        "base": self.stats.perception
                    },
                    "intelligence": {
                        "base": self.stats.intelligence
                    },
                    "stamina": {
                        "base": self.stats.stamina
                    },
                    "speed": {
                        "base": self.stats.speed
                    },
                    "free": {
                        "base": self.stats.free
                    }
                }
            }
        }

class Item(models.Model):
    """
        name (Имя) — строка
        description (Описание) — текст
        type (Тип) — строка в особом формате (Пример: «weapon two-handed sword»)
        rarely (Редкость) — число:
            0 — мусор
            1 — обычный
            2 — необычный
            3 — редкий
            4 — эпический
            5 — легендарный
        lvl (Уровень предмета) — число [0;7]
        weigth (Вес) — дробное число
        bonus (Бонус) : [строка-запрос]

        capacity (Емкость) — число
        revive (Восстановление) — дробное число


        damage (Урон) — строка
        action (Затраты очков действий) — число
        dist (Оптимальная дистанция) - число
        penalty (Штраф за дальность) — число
        ammo (Боеприпасы) - строка

        dt (Порог урона) — дробное число
        at (Порог брони) — дробное число
        movement (Передвижение) — дробное число

        blocking (Шанс блокирования) — число

        cnt (Максимальное количество/количество зарядов) — число

        (Только зелья)
        toxicity (Токсичность) — число
        effect (Эффект) — Effect

        (Только боеприпасы)
        misfire (Шанс осечки) — дробное число
    """
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=255, blank=True)

    type = models.CharField(max_length=100)
    rarely = models.IntegerField()
    lvl = models.IntegerField()
    weight = models.FloatField()
    bonus = models.TextField(blank=True)

    capacity = models.FloatField(null=True)
    revive = models.FloatField(null=True)

    damage = models.CharField(null=True)
    action = models.IntegerField(null=True)
    dist = models.IntegerField(null=True)
    penalty = models.IntegerField(null=True)
    ammo = models.CharField(null=True)

    dt = models.FloatField(null=True)
    at = models.FloatField(null=True)
    movement = models.FloatField(null=True)

    blocking = models.IntegerField(null=True)

    cnt = models.IntegerField(null=True)

    toxicity = models.IntegerField(null=True)
    effect = models.ForeignKey(Effect, null=True)

    misfire = models.FloatField(null=True)


class Stats(models.Model):
    strength = models.IntegerField()
    agility = models.IntegerField()
    perception = models.IntegerField()
    intelligence = models.IntegerField()
    stamina = models.IntegerField()
    speed = models.IntegerField()

    free = models.IntegerField()


class Skills(models.Model):
    one_handed = models.ForeignKey(Skill)
    two_handed  = models.ForeignKey(Skill)
    bow = models.ForeignKey(Skill)
    arbalest = models.ForeignKey(Skill)
    fire = models.ForeignKey(Skill)
    fists = models.ForeignKey(Skill)

    armor = models.ForeignKey(Skill)
    shields = models.ForeignKey(Skill)

    magic = models.ForeignKey(Skill)

    science = models.ForeignKey(Skill)
    logic = models.ForeignKey(Skill)
    gambling = models.ForeignKey(Skill)
    sneak = models.ForeignKey(Skill)
    communication = models.ForeignKey(Skill)
    music = models.ForeignKey(Skill)
    blacksmithing = models.ForeignKey(Skill)
    jewellery = models.ForeignKey(Skill)
    tailoring = models.ForeignKey(Skill)
    alchemy = models.ForeignKey(Skill)
    medicine = models.ForeignKey(Skill)


class Skill(models.Model):
    name = models.CharField(max_length=50)
    exp = models.IntegerField()
    lvl = models.IntegerField(default=1)
    tree = models.ForeignKey(Tree)
    active = models.ManyToManyField(Perk)


class Tree(models.Model):
    perks = models.ManyToManyField(Perk)


class Perk(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=255)
    need = models.ForeignKey(Tree, null=True)
    lvl = models.IntegerField()
    exp = models.IntegerField()
    effect = models.ForeignKey(Effect)


class Inventory(models.Model):
    clothes = models.OneToOneField(Clothes)
    using_weapon = models.CharField(max_length=20)
    using_ammo = models.SmallIntegerField()
    weapon = models.OneToOneField(Weapon)
    bags = models.OneToOneField(Bags)
    money = models.OneToOneField(Money)
    docs = models.TextField()


class Clothes(models.Model):
    head = models.ForeignKey(Item, null=True)
    torso = models.ForeignKey(Item, null=True)
    hands = models.ForeignKey(Item, null=True)
    legs = models.ForeignKey(Item, null=True)
    belt = models.ForeignKey(Item, null=True)
    neck = models.ForeignKey(Item, null=True)
    ring1 = models.ForeignKey(Item, null=True)
    ring2 = models.ForeignKey(Item, null=True)
    wrist = models.ForeignKey(Item, null=True)
    ear = models.ForeignKey(Item, null=True)
    cloak = models.ForeignKey(Item, null=True)
    artefact = models.ForeignKey(Item, null=True)


class Weapon(models.Model):
    main = models.OneToOneField(WeaponSlot)
    offend = models.OneToOneField(WeaponSlot)
    hide = models.OneToOneField(WeaponSlot)


class WeaponSlot(models.Model):
    main = models.ForeignKey(Item, null=True)
    offend = models.ForeignKey(Item, null=True)


class Bags(models.Model):
    bag = models.ForeignKey(Item, null=True)
    main = models.OneToOneField(Bag)
    flask = models.OneToOneField(Bag)
    ammo = models.OneToOneField(Bag)


class Bag(models.Model):
    cur = models.ManyToManyField(Item, blamk=True)


class Money(models.Model):
    ruby = models.IntegerField(default=0)
    emerald = models.IntegerField(default=0)
    sapphire = models.IntegerField(defauld=0)
    azar = models.IntegerField(default=0)
    ancient = models.IntegerField(default=0)


class Effect(models.Model):
    name = models.CharField(max_length=50)
    source = models.CharField(max_length=50, blank=True)
    condition = models.TextField()
    effect = models.TextField()
    duration = models.IntegerField()


class Spell(models.Model):
    """
        name (Название) - строка
        description (Описание) - текст
        icon (Иконка) - ссылка на изображение
        action (Затраты очков действий) - число
        energy (Затраты энергии) - число

        type: (element|combinative|perk)
        effects (Эффекты): Effect
        school (Школы) : строка (ritual, spell, rune), разделитель - пробел;
        spell (Сила заклинания) : строка-запрос, значение возьмется из player.buffer, тип не указывать
        chance (Шансы) : { название шанса: строка-запрос, значение возьмется из player.buffer, тип не указывать  }
    """
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50)
    action = models.IntegerField()
    energy = models.IntegerField()

    type = models.CharField(max_length=20)
    effects = models.ForeignKey(Effect, null=True)
    school = models.CharField(max_length=50, blank=True)
    chance = models.ManyToManyField(CriticalSpell, null=True)


class CriticalSpell(models.Model):
    name = models.CharField(max_length=50)
    query = models.TextField(blank=True)

