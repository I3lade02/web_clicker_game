import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function AchievementToast({ achievement }) {
    return (
        <ToastContainer position='top-end' className='p-3'>
            <Toast bg='success' show={true} delay={3000} autohide >
                <Toast.Header closeButton={false}>
                    <strong className='me-auto'>Achievement unlocked</strong>
                </Toast.Header>
                <Toast.Body>{achievement.name}: {achievement.description}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default AchievementToast;