import React from 'react';
import {Stage, Layer, Rect} from 'react-konva';
import {Map as ImmutableMap} from 'immutable';

import {ICoordinates, ILevel, ILevelSquare, TLevelGrid, TSquare} from './interfaces';

interface ICanvasProps {
    level: ILevel;
}

const SQUARE_HEIGHT = 50;
const SQUARE_WIDTH = 50;

const Canvas: React.FC<ICanvasProps> = (props: ICanvasProps) => {
    const [levelGrid, setLevelGrid] = React.useState<TLevelGrid>(ImmutableMap());
    const [playerPosition, setPlayerPosition] = React.useState<ICoordinates>({row: 0, column: 0});

    let row = 0;
    let column = 0;

    React.useEffect(() => {
        let tempGrid: TLevelGrid = ImmutableMap();

        props.level.squares.forEach((square: ILevelSquare) => {
            for (let i = 0; i < square.length; i++) {
                tempGrid = tempGrid.setIn([row.toString(), column.toString()], square.type);

                if (square.type === 'player') {
                    setPlayerPosition({row, column});
                }

                column++;
                if (column > props.level.width - 1) {
                    column = 0;
                    row++;
                }
            }
        });

        setLevelGrid(tempGrid);
    }, [props.level]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            const fieldUp = levelGrid.getIn([(playerPosition.row - 1).toString(), playerPosition.column.toString()]);
            const field2Up = levelGrid.getIn([(playerPosition.row - 2).toString(), playerPosition.column.toString()]);

            if (fieldUp === 'wall' || (fieldUp === 'box' && (field2Up === 'wall' || field2Up === 'box'))) {
                return;
            }

            if (fieldUp === 'box') {
                const newGrid = levelGrid.setIn(
                    [playerPosition.row.toString(), playerPosition.column.toString()],
                    'space')
                .setIn(
                    [(playerPosition.row - 1).toString(), playerPosition.column.toString()],
                    'box'
                );

                setLevelGrid(newGrid);
            }

            setPlayerPosition({row: playerPosition.row - 1, column: playerPosition.column});
        }

        if (event.key === 'ArrowRight') {
            const fieldRight = levelGrid.getIn([playerPosition.row.toString(), (playerPosition.column + 1).toString()]);
            const field2Right = levelGrid.getIn([playerPosition.row.toString(), (playerPosition.column + 2).toString()]);

            if (fieldRight === 'wall' || (fieldRight === 'box' && (field2Right === 'wall' || field2Right === 'box'))) {
                return;
            }

            setPlayerPosition({row: playerPosition.row, column: playerPosition.column + 1});
        }

        if (event.key === 'ArrowDown') {
            const fieldDown = levelGrid.getIn([(playerPosition.row + 1).toString(), playerPosition.column.toString()]);
            const field2Down = levelGrid.getIn([(playerPosition.row + 2).toString(), playerPosition.column.toString()]);

            if (fieldDown === 'wall' || (fieldDown === 'box' && (field2Down === 'wall' || field2Down === 'box'))) {
                return;
            }

            setPlayerPosition({row: playerPosition.row + 1, column: playerPosition.column});
        }

        if (event.key === 'ArrowLeft') {
            const fieldLeft = levelGrid.getIn([playerPosition.row.toString(), (playerPosition.column - 1).toString()]);
            const field2Left = levelGrid.getIn([playerPosition.row.toString(), (playerPosition.column - 2).toString()]);

            if (fieldLeft === 'wall' || (fieldLeft === 'box' && (field2Left === 'wall' || field2Left === 'box'))) {
                return;
            }

            setPlayerPosition({row: playerPosition.row, column: playerPosition.column - 1});
        }
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

        return 'white';
    }

    const renderLevel = (): JSX.Element[] => {
        const result: JSX.Element[] = [];

        for (let row = 0; row < props.level.height; row++) {
            for (let column = 0; column < props.level.width; column++) {
                const currentSquare: TSquare = levelGrid.getIn([row.toString(), column.toString()]);

                if (currentSquare === 'player') {
                    continue;
                }

                result.push(
                    <Rect
                        key={Math.random().toString()}
                        x={column * SQUARE_WIDTH}
                        y={row * SQUARE_HEIGHT}
                        width={SQUARE_WIDTH}
                        height={SQUARE_HEIGHT}
                        fill={getColor(currentSquare)}
                    />
                );
            }
        }

        result.push(
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

        return result;
    }

    return (
        <Stage
            width={props.level.width * SQUARE_WIDTH}
            height={props.level.height * SQUARE_HEIGHT}
        >
            <Layer>
                {renderLevel()}
            </Layer>
        </Stage>
    );
}

export default Canvas