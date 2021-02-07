import React, {useState} from 'react';

import Canvas from './Canvas';

import {level1} from './levels/level1';
import {Button, makeStyles} from '@material-ui/core';
import {ILevel} from './interfaces';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    buttons: {
        margin: '40px',
    }
});

const App: React.FC = () => {
    const classes = useStyles();
    const [currentLevel, setCurrentLevel] = useState<string>('');

    const levels: ILevel[] = [
        level1,
    ];

    const renderCanvas = () => {
        if (!currentLevel) {
            return;
        }

        return (
            <Canvas
                level={levels[parseInt(currentLevel) as number]}
            />

        )
    }

    return (
        <div className={classes.root}>
            <div className={classes.buttons}>
                <Button
                    onClick={() => setCurrentLevel('0')}
                    variant={'contained'}
                >
                    Level 1
                </Button>

                <Button
                    onClick={() => setCurrentLevel('')}
                    variant={'contained'}
                >
                    Reset
                </Button>
            </div>

            <div>
                {renderCanvas()}
            </div>
        </div>
    );
}

export default App;
