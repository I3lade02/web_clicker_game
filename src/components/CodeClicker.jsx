import React from 'react';
import { Button } from 'react-bootstrap';

function CodeClicker({ onClick }) {
    return (
        <div className='my-4'>
            <Button variant='primary' size='lg' onClick={onClick}>
                Compile Code
            </Button>
        </div>
    );
}

export default CodeClicker;