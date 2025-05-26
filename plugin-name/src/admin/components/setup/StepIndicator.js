import { __ } from '@wordpress/i18n';
import { __experimentalText as Text } from '@wordpress/components';

const StepIndicator = ({ currentStep, steps = [] }) => {
    // Default steps if none provided
    const defaultSteps = [
        { name: __('First Page', 'plugin-name') },
        { name: __('Second Page', 'plugin-name') }
    ];
    
    // Use provided steps or defaults
    const stepsToRender = steps.length > 0 ? steps : defaultSteps;
    
    // Parse currentStep to ensure it's a number for comparison
    const activeStep = parseInt(currentStep, 10);
    
    return (
        <div className="my-8">
            <div className="flex justify-center">
                <div style={{ 
                    width: '100%',
                    maxWidth: '600px'
                }}>
                    <div className="relative">
                        {/* Replace the full-width line with individual connecting lines */}
                        {stepsToRender.map((step, index) => {
                            // Don't render a line after the last item
                            if (index === stepsToRender.length - 1) return null;
                            
                            return (
                                <div 
                                    key={`line-${index}`}
                                    className="absolute h-px bg-gray-200"
                                    style={{
                                        left: `calc(${(2 * index + 1) * (100 / (2 * stepsToRender.length))}%)`,
                                        right: `calc(${100 - ((2 * index + 3) * (100 / (2 * stepsToRender.length)))}%)`,
                                        top: '1rem'
                                    }}
                                ></div>
                            );
                        })}
                        
                        {/* Grid for steps */}
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: `repeat(${stepsToRender.length}, 1fr)`,
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {stepsToRender.map((step, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    {/* Circle with number */}
                                    <div 
                                        className={`${index + 1 === activeStep 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-600'} 
                                            rounded-full w-8 h-8 flex items-center justify-center z-10`}
                                    >
                                        <span>{index + 1}</span>
                                    </div>
                                    
                                    {/* Step label with text wrapping */}
                                    <Text
                                        size="small"
                                        className={`text-center break-words mt-2 ${index + 1 === activeStep ? 'text-blue-600' : 'text-gray-500'}`}
                                        style={index + 1 === activeStep ? { fontWeight: 'bold' } : {}}
                                    >
                                        {step.name}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepIndicator;