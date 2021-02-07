import {ILevel} from '../interfaces';

export const level1: ILevel = {
    width: 10,
    height: 8,
    squares: [
        {"type": "wall", "length": 10},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 8},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 2},
        {"type": "box", "length": 1},
        {"type": "space", "length": 5},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 4},
        {"type": "player", "length": 1},
        {"type": "space", "length": 3},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 8},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 8},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 1},
        {"type": "space", "length": 7},
        {"type": "goal", "length": 1},
        {"type": "wall", "length": 1},

        {"type": "wall", "length": 10},
    ],
};

