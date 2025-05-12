import React from 'react';

function CodeStatsPanel({ loc, clickPower, refactorPoints }) {
    return (
        <div className='mt-4'>
            <h4>Lines of Code: {loc}</h4>
            <p>Click Power: {clickPower}</p>
            <p>Refactor Points: {refactorPoints}</p>
        </div>
    );
}

export default CodeStatsPanel;