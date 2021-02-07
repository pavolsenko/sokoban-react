import React, {useState} from 'react';

import Canvas from './Canvas';

import {level1} from './levels/level1';
import {Button} from '@material-ui/core';
import {ILevel} from './interfaces';


const App: React.FC = () => {
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
        <>
            <div>
                <Button
                    onClick={() => setCurrentLevel('0')}
                    variant={'contained'}
                >
                    Level 1
                </Button>
            </div>

            <div>
                {renderCanvas()}
            </div>
        </>
    );
}

export default App;
