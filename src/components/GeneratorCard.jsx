import React from 'react';
import { Card, Button } from 'react-bootstrap';

function GeneratorCard({ generator, quantity, onBuy, disabled, currentCost }) {
    return (
        <Card className={`generator-card ${quantity > 0 ? 'active-generator' : ''}`}>
            <Card.Body>
                <Card.Title>{generator.name}</Card.Title>
                <Card.Text>{generator.description}</Card.Text>
                <Card.Text>Cost: {Math.floor(currentCost)}</Card.Text>
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