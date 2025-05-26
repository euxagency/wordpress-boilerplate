import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import FirstPage from './setup/FirstPage';
import SecondPage from './setup/SecondPage'; 

const Setup = () => {
    const [currentStep, setCurrentStep] = useState('firstPage');
    const [data, setData] = useState({});

    const handleStepComplete = (nextStep, data = {}) => {
        // Update userData with any new data passed from the step
        setData(prevData => ({ ...prevData, ...data }));
        setCurrentStep(nextStep);
    };

    return (
        <div className="plugin-name-app">
            {currentStep === 'firstPage' && (
                <FirstPage onComplete={handleStepComplete} />
            )}
            
            {currentStep === 'secondPage' && (
                <SecondPage onComplete={handleStepComplete} />
            )}
        </div>
    );
};

export default Setup;