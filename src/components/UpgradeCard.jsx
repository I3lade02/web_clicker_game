import React from 'react';
import { Card, Button } from 'react-bootstrap';

function UpgradeCard({ upgrade, onUpgrade, disabled }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{upgrade.name}</Card.Title>
                <Card.Text>{upgrade.description}</Card.Text>
                <Card.Text><strong>Reward:</strong> +{upgrade.bonus} Click Power</Card.Text>
                <Card.Text>{upgrade.cost} LoC</Card.Text>
                <Button variant="success" onClick={onUpgrade} disabled={disabled}>
                    {disabled ? 'Unavailable' : 'Purchase'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default UpgradeCard;