import React from 'react';
import { Card, Button } from 'react-bootstrap';

function GeneratorCard({ generator, quantity, onBuy, disabled }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{generator.name}</Card.Title>
                <Card.Text>{generator.description}</Card.Text>
                <Card.Text>Cost: {generator.baseCost}</Card.Text>
                <Card.Text>Generates: {generator.locPerSecond}</Card.Text>
                <Card.Text>Owned: {quantity}</Card.Text>
                <Button variant="info" onClick={onBuy} disabled={disabled}>
                    {disabled ? 'Insufficient LoC' : 'Hire'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default GeneratorCard;