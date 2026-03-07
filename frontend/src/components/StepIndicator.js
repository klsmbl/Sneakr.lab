import './StepIndicator.css';

const STEPS = [
  { num: 1, label: 'Choose Your Shoe' },
  { num: 2, label: 'Confirm Selection' },
  { num: 3, label: 'Customize' },
];

export function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, idx) => (
        <>
          <div key={step.num} className="step-indicator__step">
            <div
              className={[
                'step-indicator__circle',
                currentStep === step.num ? 'active' : '',
                currentStep > step.num ? 'done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {currentStep > step.num ? '✓' : step.num}
            </div>
            <span
              className={[
                'step-indicator__label',
                currentStep === step.num ? 'active' : '',
                currentStep > step.num ? 'done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={[
                'step-indicator__line',
                currentStep > step.num ? 'done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )}
        </>
      ))}
    </div>
  );
}
