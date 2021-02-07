import React from 'react';
import {Stage, Layer, Rect} from 'react-konva';
import {Map as ImmutableMap, List as ImmutableList} from 'immutable';

import {ICoordinates, ILevel, ILevelSquare, TLevelGrid, TSquare} from './interfaces';

interface ICanvasProps {
    level: ILevel;
}

const SQUARE_HEIGHT = 50;
const SQUARE_WIDTH = 50;

const Canvas: React.FC<ICanvasProps> = (props: ICanvasProps) => {
    const [levelGrid, setLevelGrid] = React.useState<TLevelGrid>(ImmutableMap());
    const [boxesGrid, setBoxesGrid] = React.useState<TLevelGrid>(ImmutableMap());
    const [goalsList, setGoalsList] = React.useState<ImmutableList<ICoordinates>>(ImmutableList());
    const [playerPosition, setPlayerPosition] = React.useState<ICoordinates>({row: 0, column: 0});

    let row = 0;
    let column = 0;

    React.useEffect(() => {
        let tempLevelGrid: TLevelGrid = ImmutableMap();
        let tempBoxesGrid: TLevelGrid = ImmutableMap();
        let tempGoalsList: ImmutableList<ICoordinates> = ImmutableList();

        props.level.squares.forEach((square: ILevelSquare) => {
            for (let i = 0; i < square.length; i++) {
                if (square.type === 'player') {
                    setPlayerPosition({row, column});
                    tempLevelGrid = tempLevelGrid.setIn([row.toString(), column.toString()], 'space');
                } else if (square.type === 'box') {
                    tempBoxesGrid = tempBoxesGrid.setIn([row.toString(), column.toString()], 'box');
                    tempLevelGrid = tempLevelGrid.setIn([row.toString(), column.toString()], 'space');
                } else if (square.type === 'goal') {
                    tempGoalsList = tempGoalsList.push({row, column});
                    tempLevelGrid = tempLevelGrid.setIn([row.toString(), column.toString()], 'goal');
                } else {
                    tempLevelGrid = tempLevelGrid.setIn([row.toString(), column.toString()], square.type);
                }

                column++;
                if (column > props.level.width - 1) {
                    column = 0;
                    row++;
                }
            }
        });

        setLevelGrid(tempLevelGrid);
        setBoxesGrid(tempBoxesGrid);
        setGoalsList(tempGoalsList);
    }, [props.level]);

    const checkLevelComplete = () => {
        let levelWon = true;
        goalsList.forEach((square: ICoordinates) => {
            const box = boxesGrid.getIn([square.row.toString(), square.column.toString()]);

            if (!box) {
                levelWon = false;
            }
        });

        return levelWon;
    }

    const onKeyDown = (event: KeyboardEvent) => {
        let square1row = '0';
        let square1column = '0';
        let square2row = '0';
        let square2column = '0';

        if (event.key === 'ArrowUp') {
            square1row = (playerPosition.row - 1).toString();
            square1column = playerPosition.column.toString();

            square2row = (playerPosition.row - 2).toString();
            square2column = playerPosition.column.toString();
        }

        if (event.key === 'ArrowRight') {
            square1row = playerPosition.row.toString();
            square1column = (playerPosition.column + 1).toString();

            square2row = playerPosition.row.toString();
            square2column = (playerPosition.column + 2).toString();
        }

        if (event.key === 'ArrowDown') {
            square1row = (playerPosition.row + 1).toString();
            square1column = playerPosition.column.toString();

            square2row = (playerPosition.row + 2).toString();
            square2column = playerPosition.column.toString();
        }

        if (event.key === 'ArrowLeft') {
            square1row = playerPosition.row.toString();
            square1column = (playerPosition.column - 1).toString();

            square2row = playerPosition.row.toString();
            square2column = (playerPosition.column - 2).toString();
        }

        const levelSquare1 = levelGrid.getIn([square1row, square1column]);
        const levelSquare2 = levelGrid.getIn([square2row, square2column]);

        const boxesSquare1 = boxesGrid.getIn([square1row, square1column]);
        const boxesSquare2 = boxesGrid.getIn([square2row, square2column]);

        if (levelSquare1 === 'wall') {
            return;
        }

        if (boxesSquare1 === 'box' && levelSquare2 === 'wall') {
            return;
        }

        if (boxesSquare1 === 'box' && boxesSquare2 === 'box') {
            return;
        }

        if (boxesSquare1 === 'box') {
            setBoxesGrid(
                boxesGrid
                    .setIn([square2row, square2column], 'box')
                    .setIn([square1row, square1column], undefined),
            );
        }

        setPlayerPosition({row: parseInt(square1row), column: parseInt(square1column)});
    }

    React.useEffect(() => {
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [onKeyDown]);

    const getColor = (type: TSquare): string => {
        if (type === 'wall') {
            return 'black';
        }

        if (type === 'player') {
            return 'blue';
        }

        if (type === 'goal') {
            return 'green';
        }

        if (type === 'box') {
            return 'brown';
        }

        return '#dddddd';
    }

    const renderLevelGrid = (): JSX.Element[] => {
        const result: JSX.Element[] = [];

        for (let row = 0; row < props.level.height; row++) {
            for (let column = 0; column < props.level.width; column++) {
                const currentSquare: TSquare = levelGrid.getIn([row.toString(), column.toString()]);
                let color = getColor(currentSquare);

                if (currentSquare === 'player') {
                    color = getColor('space');
                }

                result.push(
                    <Rect
                        key={Math.random().toString()}
                        x={column * SQUARE_WIDTH}
                        y={row * SQUARE_HEIGHT}
                        width={SQUARE_WIDTH}
                        height={SQUARE_HEIGHT}
                        fill={color}
                    />
                );
            }
        }

        return result;
    }

    const renderPlayer = (): JSX.Element => {
        return (
            <Rect
                key={Math.random().toString()}
                x={playerPosition.column * SQUARE_WIDTH}
                y={playerPosition.row * SQUARE_HEIGHT}
                width={SQUARE_WIDTH}
                height={SQUARE_HEIGHT}
                fill={getColor('player')}
                cornerRadius={SQUARE_WIDTH / 2}
            />
        );
    }

    const renderBoxes = () => {
        const result: JSX.Element[] = [];

        for (let row = 0; row < props.level.height; row++) {
            for (let column = 0; column < props.level.width; column++) {
                const currentSquare: TSquare = boxesGrid.getIn([row.toString(), column.toString()]);

                if (currentSquare !== 'box') {
                    continue;
                }

                result.push(
                    <Rect
                        key={Math.random().toString()}
                        x={column * SQUARE_WIDTH}
                        y={row * SQUARE_HEIGHT}
                        width={SQUARE_WIDTH}
                        height={SQUARE_HEIGHT}
                        fill={getColor('box')}
                    />
                );
            }
        }

        return result;
    }

    if (checkLevelComplete()) {
        alert('level complete');
    }

    return (
        <Stage
            width={props.level.width * SQUARE_WIDTH}
            height={props.level.height * SQUARE_HEIGHT}
        >
            <Layer>
                {renderLevelGrid()}
            </Layer>

            <Layer>
                {renderBoxes()}
            </Layer>

            <Layer>
                {renderPlayer()}
            </Layer>
        </Stage>
    );
}

export default Canvas