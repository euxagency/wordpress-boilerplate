import { __ } from '@wordpress/i18n';
import { 
    Card, 
    CardBody, 
    Button,
    Icon
} from '@wordpress/components';

import StepIndicator from './StepIndicator.js';

const SecondPage = () => {
    // Redirect on click
    const handleClick = () => {
        window.location.href = '/wp-admin/admin.php?page=plugin-name-settings';
    };
    
    return (
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <StepIndicator currentStep={2} />
            
            <CardBody className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    {__('Fantastic! Welcome Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis.', 'plugin-name')}
                </h2>
                
                <p className="text-gray-600 mb-8 mt-8">
                    {__('Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis.', 'plugin-name')}
                </p>
                
                {/* Action button */}
                <Button 
                    primary
                    className="plugin-name-button w-full mt-8"
                    onClick={handleClick}
                >
                    {__('Visit Settings', 'plugin-name')}
                </Button>
            </CardBody>
        </Card>
    );
};

export default SecondPage;