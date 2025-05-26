import { __ } from '@wordpress/i18n';
import { 
    Card, 
    CardBody, 
    Button, 
    TextControl,
    SelectControl
} from '@wordpress/components';
import { useState, memo, useCallback } from '@wordpress/element';

import StepIndicator from './StepIndicator.js';
import CustomInput from '../components/CustomInput.js';

// Select options
const TYPES = [
    { value: '', label: __('Select a type', 'plugin-name') },
    { value: 'A', label: __('Type A', 'plugin-name') },
    { value: 'B', label: __('Type B', 'plugin-name') },
    { value: 'c', label: __('Type C', 'plugin-name') },
];

// Memoize the CustomInput to prevent unnecessary re-renders
const CustomInput_ = memo(CustomInput);

// Memoize the CustomSelect to prevent unnecessary re-renders
const CustomSelect = memo(({ label, value, options, onChange, error, ...props }) => (
    <div className="mb-4">
        <div className="plugin-name-label">{label}</div>
        <div className="plugin-name-input">
            <SelectControl
                label=""
                value={value}
                options={options}
                onChange={onChange}
                {...props}
            />
        </div>
        {error && (
            <div className="text-red-500 text-sm mt-1">{error}</div>
        )}
    </div>
));

const FirstPage = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        type: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    
    // Use useCallback to create stable function references
    const handleChange = useCallback((field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    }, []);
    
    // Make request to the server to save settings
    const saveSettings = useCallback(async () => {
        setIsSaving(true);
        
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                console.error('WordPress REST API nonce not available');
                return;
            }

            // Form data 
            const newData = {
                username: formData.username,
                password: formData.password,
                type: formData.type || '',
            };
            // Data to send 
            const sendData = {
                payload: newData
            }
    
            const response = await fetch("/wp-json/plugin-name/v1/setup/save", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce,
                },
                body: JSON.stringify(sendData)
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.data.message || 'Unknown error');
            }
        } catch (err) {
            console.error(`Failed to save data: ${err.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    }, [formData]);


    // Save settings to the backend on submit
    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();
        
        try {
            await saveSettings()
            onComplete('secondPage', formData);
        } catch (err) {
            console.error('Failed to proceed:', err);
        }
    }, [onComplete, formData, saveSettings]);

    const handleUsernameChange = useCallback((value) => handleChange('username', value), [handleChange]);
    const handlePasswordChange = useCallback((value) => handleChange('password', value), [handleChange]);
    const handleTypeChange = useCallback((value) => handleChange('type', value), [handleChange]);
    
    return (
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <StepIndicator currentStep={1} />
            
            <CardBody className="p-8">
                {/* Form header */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-2">
                        {__('First Page', 'plugin-name')}
                    </h3>

                    <p className="text-gray-600 ">
                        {__('Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis.', 'plugin-name')}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomInput_
                            key="username-field"
                            label={__('Username', 'plugin-name')}
                            description={__('Max 11 characters', 'plugin-name')}
                            placeholder={__('Username', 'plugin-name')}
                            value={formData.username}
                            onChange={handleUsernameChange}
                            maxLength={11}
                            required
                        />
                        
                        <CustomInput_
                            key="password-field"
                            label={__('Password', 'plugin-name')}
                            placeholder={__('Password', 'plugin-name')}
                            value={formData.password}
                            type={"password"}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <CustomSelect
                            key="type-field"
                            label={__('Type', 'plugin-name')}
                            value={formData.type}
                            options={TYPES}
                            onChange={handleTypeChange}
                            required
                        />
                        
                    </div>
                </form>

                <Button 
                    primary
                    className={`plugin-name-button w-full ${isSaving ? 'animate-pulse' : ''}`}
                    onClick={handleSubmit}
                    disabled={isSaving}
                >
                   {isSaving ? __('Saving...', 'plugin-name') : __('Save', 'plugin-name')}
                </Button>
            </CardBody>
        </Card>
    );
};

export default FirstPage;