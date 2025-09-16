import React from 'react';
import './Stepper.css';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div key={index} className="stepper-step">
          <div
            className={`step-circle ${
              index < currentStep
                ? 'completed'
                : index === currentStep
                ? 'active'
                : ''
            }`}
          >
            {index < currentStep ? '✔' : index + 1}
          </div>
          <div className="step-label">{step}</div>
          {index !== steps.length - 1 && (
            <div
              className={`step-line ${index < currentStep ? 'completed' : ''}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
