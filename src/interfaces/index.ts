import {Map as ImmutableMap} from "immutable";

export interface ILevel {
    width: number;
    height: number;
    squares: ILevelSquare[];
}

export interface ILevelSquare {
    type: TSquare;
    length: number;
}

export type TSquare = 'wall' | 'space' | 'player' | 'box' | 'goal';

export type TLevelGrid = ImmutableMap<string, ImmutableMap<string, TSquare>>;

export interface ICoordinates {
    row: number;
    column: number;
}