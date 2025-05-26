import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import Layout from './components/Layout';
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
        <Layout>
            <div>
                {currentStep === 'firstPage' && (
                    <FirstPage onComplete={handleStepComplete} />
                )}
                
                {currentStep === 'secondPage' && (
                    <SecondPage onComplete={handleStepComplete} />
                )}
            </div>
        </Layout>
    );
};

export default Setup;