import React from 'react';
import { Offcanvas, ProgressBar } from 'react-bootstrap';
import { achievements } from '../features/achievements';

function AchievementsPanel({ show, onClose, unlocked, stats}) {
    const totalAchieved = unlocked.length;
    const totalAvailable = achievements.length;
    const overallProgress = (totalAchieved / totalAvailable) * 100;

    const getProgress = (ach) => {
        if (ach.id === 'first-click') return Math.min(stats.totalClicks, 1);
        if (ach.id === 'ten-thousand-loc') return Math.min(stats.totalLinesOfCode, 10000);
        if (ach.id === 'clickmaster') return Math.min(stats.totalClicks, 1000);
        return 0;
    };

    return (
        <Offcanvas show={show} onHide={onClose} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Achievements</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h6>Total Progress</h6>
                <ProgressBar now={overallProgress} label={`${Math.floor(overallProgress)}%`} className='mb-4' />

                {achievements.map((ach) => {
                    const isUnlocked = unlocked.includes(ach.id);
                    const current = getProgress(ach);
                    const goal = ach.id === 'first-click' ? 1 : ach.id === 'ten-thousand-loc' ? 10000 : ach.id === 'clickmaster' ? 1000 : 1;
                    return (
                        <div key={ach.id} className='mb-3'>
                            <h6>{isUnlocked ? '✅' : '🔒'} {ach.name}</h6>
                            <p>{ach.description}</p>
                            <ProgressBar
                                now={(current / goal) * 100}
                                label={`${Math.floor((current / goal) * 100)}%`}
                                variant={isUnlocked ? 'success' : 'secondary'}
                            />
                        </div>
                    );
                })}
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default AchievementsPanel;