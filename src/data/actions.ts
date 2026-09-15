import type { ActionDef } from '../types'

export const ACTION_DEFS: ActionDef[] = [
  { id: 'wave', label: 'Помахать', icon: '👋', rarity: 'common', currency: 'free', effect: 'Персонаж машет рукой.' },
  { id: 'handshake', label: 'Пожать руку', icon: '🤝', rarity: 'common', currency: 'free', effect: 'Персонажи пожимают друг другу руки.' },
  { id: 'five', label: 'Дать пять', icon: '✨', rarity: 'common', currency: 'coins', priceCoins: 100, effect: 'Персонажи хлопают ладонями.' },
  { id: 'pat', label: 'Погладить', icon: '❤️', rarity: 'uncommon', currency: 'coins', priceCoins: 200, effect: 'Появляются маленькие сердечки.' },
  { id: 'tease', label: 'Подразнить', icon: '😂', rarity: 'uncommon', currency: 'coins', priceCoins: 150, effect: 'Персонаж дразнит соседа.' },
  { id: 'hug', label: 'Обнять', icon: '🫂', rarity: 'uncommon', currency: 'coins', priceCoins: 250, effect: 'Персонажи ненадолго обнимаются.' },
  { id: 'congrats', label: 'Поздравить', icon: '🎉', rarity: 'common', currency: 'coins', priceCoins: 120, effect: 'Вокруг разлетается конфетти.' },
  { id: 'kick', label: 'Пнуть', icon: '😈', rarity: 'uncommon', currency: 'coins', priceCoins: 180, effect: 'Мультяшный «ПЫХ!», без урона.' },
  { id: 'punch', label: 'Ударить', icon: '👊', rarity: 'uncommon', currency: 'coins', priceCoins: 180, effect: 'Мультяшное «БАМ!» со звёздочками.' },
  { id: 'push', label: 'Толкнуть', icon: '💥', rarity: 'common', currency: 'coins', priceCoins: 120, effect: 'Лёгкий толчок, персонаж отступает.' },
  { id: 'shoot', label: 'Выстрелить', icon: '🎯', rarity: 'rare', currency: 'coins', priceCoins: 600, effect: 'Конфетная пушка — «ПУФ!» и облако конфетти.' },
  { id: 'snowball', label: 'Бросить снежок', icon: '❄️', rarity: 'event', currency: 'coins', effect: 'Снежок попадает в цель, вокруг снежное облако.', eventId: undefined },
  { id: 'fireworks', label: 'Запустить фейерверк', icon: '🎆', rarity: 'event', currency: 'coins', effect: 'Праздничный залп фейерверка.', eventId: undefined },
  { id: 'message', label: 'Написать', icon: '💬', rarity: 'common', currency: 'free', effect: 'Открывает окно сообщений.' },
]
