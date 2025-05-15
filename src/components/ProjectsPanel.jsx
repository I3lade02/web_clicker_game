import React from 'react';
import { Offcanvas, Button, ProgressBar } from 'react-bootstrap';

function ProjectsPanel({ show, onClose, projects, onComplete, totalLinesOfCode }) {
return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Projects</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {projects.map((proj) => {
          const progress = Math.min(totalLinesOfCode / proj.goal, 1) * 100;
          const isCompleted = proj.completed;

          return (
            <div key={proj.id} className="mb-4">
              <h5>{proj.name}</h5>
              <p>{proj.description}</p>
              <p>
                <strong>Reward:</strong>{' '}
                {proj.reward.type === 'clickPower'
                ? `+${proj.reward.value} Click Power`
                : `+${proj.reward.value} Refactor Points(3)`}
              </p>
              <ProgressBar
                now={progress}
                label={`${Math.floor(progress)}%`}
                animated
                striped
                variant={isCompleted ? 'success' : 'info'}
                className="mb-2"
              />
              <Button
                variant="success"
                onClick={() => onComplete(proj.id)}
                disabled={isCompleted || totalLinesOfCode < proj.goal}
              >
                {isCompleted ? 'Completed' : 'Complete Project'}
              </Button>
              <hr />
            </div>
          );
        })}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ProjectsPanel;