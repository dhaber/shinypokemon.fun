import { Ball } from 'models/ball.model';
import { BallType } from 'types/ball.types';

export const getBall = (id: BallType): Ball | null =>
  ballList.find((ball) => ball.id === id) || null;

export const ballList: Ball[] = [
  new Ball({ id: 'beast', xOffset: 0, yOffset: 0, name: 'Beast Ball' }),
  new Ball({ id: 'cherish', xOffset: 1, yOffset: 0, name: 'Cherish Ball' }),
  new Ball({ id: 'dive', xOffset: 2, yOffset: 0, name: 'Dive Ball' }),
  new Ball({ id: 'dream', xOffset: 3, yOffset: 0, name: 'Dream Ball' }),
  new Ball({ id: 'dusk', xOffset: 4, yOffset: 0, name: 'Dusk Ball' }),
  new Ball({ id: 'fast', xOffset: 5, yOffset: 0, name: 'Fast Ball' }),
  new Ball({ id: 'feather', xOffset: 6, yOffset: 0, name: 'Feather Ball' }),
  new Ball({ id: 'friend', xOffset: 0, yOffset: 1, name: 'Friend Ball' }),
  new Ball({ id: 'gigaton', xOffset: 1, yOffset: 1, name: 'Gigaton Ball' }),
  new Ball({ id: 'great', xOffset: 2, yOffset: 1, name: 'Great Ball' }),
  new Ball({
    id: 'greatHisui',
    xOffset: 3,
    yOffset: 1,
    name: 'Great Ball (Hisuian)',
  }),
  new Ball({ id: 'heal', xOffset: 4, yOffset: 1, name: 'Heal Ball' }),
  new Ball({ id: 'heavy', xOffset: 5, yOffset: 1, name: 'Heavy Ball' }),
  new Ball({
    id: 'heavyHisui',
    xOffset: 6,
    yOffset: 1,
    name: 'Heavy Ball (Hisuian)',
  }),
  new Ball({ id: 'jet', xOffset: 0, yOffset: 2, name: 'Jet Ball' }),
  new Ball({ id: 'leaden', xOffset: 1, yOffset: 2, name: 'Leaden Ball' }),
  new Ball({ id: 'level', xOffset: 2, yOffset: 2, name: 'Level Ball' }),
  new Ball({ id: 'love', xOffset: 3, yOffset: 2, name: 'Love Ball' }),
  new Ball({ id: 'lure', xOffset: 4, yOffset: 2, name: 'Lure Ball' }),
  new Ball({ id: 'luxury', xOffset: 5, yOffset: 2, name: 'Luxury Ball' }),
  new Ball({ id: 'master', xOffset: 6, yOffset: 2, name: 'Master Ball' }),
  new Ball({ id: 'moon', xOffset: 0, yOffset: 3, name: 'Moon Ball' }),
  new Ball({ id: 'nest', xOffset: 1, yOffset: 3, name: 'Nest Ball' }),
  new Ball({ id: 'net', xOffset: 2, yOffset: 3, name: 'Net Ball' }),
  new Ball({ id: 'origin', xOffset: 3, yOffset: 3, name: 'Origin Ball' }),
  new Ball({ id: 'park', xOffset: 4, yOffset: 3, name: 'Park Ball' }),
  new Ball({ id: 'pokeball', xOffset: 5, yOffset: 3, name: 'Pokéball' }),
  new Ball({
    id: 'pokeballHisui',
    xOffset: 6,
    yOffset: 3,
    name: 'Pokéball (Hisuian)',
  }),
  new Ball({ id: 'premier', xOffset: 0, yOffset: 4, name: 'Premier Ball' }),
  new Ball({ id: 'quick', xOffset: 1, yOffset: 4, name: 'Quick Ball' }),
  new Ball({ id: 'repeat', xOffset: 2, yOffset: 4, name: 'Repeat Ball' }),
  new Ball({ id: 'safari', xOffset: 3, yOffset: 4, name: 'Safari Ball' }),
  new Ball({ id: 'sport', xOffset: 4, yOffset: 4, name: 'Sport Ball' }),
  new Ball({ id: 'strange', xOffset: 5, yOffset: 4, name: 'Strange Ball' }),
  new Ball({ id: 'timer', xOffset: 6, yOffset: 4, name: 'Timer Ball' }),
  new Ball({ id: 'ultra', xOffset: 0, yOffset: 5, name: 'Ultra Ball' }),
  new Ball({
    id: 'ultraHisui',
    xOffset: 1,
    yOffset: 5,
    name: 'Ultra Ball (Hisuian)',
  }),
  new Ball({ id: 'wing', xOffset: 2, yOffset: 5, name: 'Wing Ball' }),
];
