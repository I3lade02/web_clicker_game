import React from 'react';
import { Offcanvas, ProgressBar } from 'react-bootstrap';
import { achievements } from '../features/achievements';

function AchievementsPanel({ show, onClose, unlocked, stats}) {
    const totalAchieved = unlocked.length;
    const totalAvailable = achievements.length;
    const overallProgress = (totalAchieved / totalAvailable) * 100;

    const getProgress = (ach) => {
        switch (ach.id) {
            case 'power-upgrade':
                return (stats.purchasedUpgrades || []).length;
            case 'aint-working':
                return Object.values(stats.purchasedGenerators ?? {}).reduce((sum, qty) => sum + qty, 0);
            case 'first-click':
                return Math.min(stats.totalClicks, 1);
            case 'ten-thousand-loc':
                return Math.min(stats.totalLinesOfCode, 10000);
            case 'clickmaster':
                return Math.min(stats.totalClicks, 1000);
            default:
                return 0;
        }
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
                    const goal = {
                        'first-click': 1,
                        'ten-thousand-loc': 10000,
                        'clickmaster': 1000,
                        'power-upgrade': 3,
                        'aint-working': 100,
                    }[ach.id] || 1;
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