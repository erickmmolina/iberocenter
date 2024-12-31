interface OnboardingProgressProps {
  currentStep: 'user' | 'company';
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  const steps = [
    { key: 'user', label: 'Datos personales' },
    { key: 'company', label: 'Datos de la empresa' }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex-1">
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
              `}>
                {index + 1}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}