import React from 'react';

function CodeStatsPanel({ loc, clickPower, refactorPoints, generatorIncome }) {
    return (
        <div className='mt-4'>
            <h4>Lines of Code: {loc}</h4>
            <p>Click Power: {clickPower}</p>
            <p>Refactor Points: {refactorPoints}</p>
            <p>Generator Output: {generatorIncome.toFixed(1)} LoC/s</p>
        </div>
    );
}

export default CodeStatsPanel;