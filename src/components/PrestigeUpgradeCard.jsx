import React from 'react';
import { Card, Button } from 'react-bootstrap';

function PrestigeUpgradeCard({ upgrade, onBuy, disabled }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{upgrade.name}</Card.Title>
                <Card.Text>{upgrade.description}</Card.Text>
                <Card.Text>Cost: {upgrade.cost} RP</Card.Text>
                <Button variant='dark' onClick={onBuy} disabled={disabled}>
                    {disabled ? 'Purchased/Unavailable' : 'Unlock'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default PrestigeUpgradeCard;