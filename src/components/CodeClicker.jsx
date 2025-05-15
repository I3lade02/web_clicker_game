import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../styles/main.css';

function CodeClicker({ onClick, clickValue }) {
    const [clicks, setClicks] = useState([]);

    const handleClick = (e) => {
        const newClick = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            value: clickValue.toFixed(1)
        };
        setClicks((prev) => [...prev, newClick]);
        onClick();
        setTimeout(() => {
            setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
        }, 1000);
    };
    
    return (
        <div className='click-area' onClick={handleClick}>
            <Button variant='primary' size='lg'>
                Compile Code
            </Button>
            {clicks.map((click) => (
                <span
                    key={click.id}
                    className='floating-text'
                    style={{ left: click.x, top: click.y }}
                >
                    +{clickValue}
                </span>
            ))}
        </div>
    );
}

export default CodeClicker;