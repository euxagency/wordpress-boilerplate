import { __ } from '@wordpress/i18n';
import { 
    Card, 
    CardBody,
    Button,
    Icon,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

const AccordionItem = ({ status, statusKey, onSuccessMessage, onErrorMessage }) => {
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Fetch saved status message from the db
    useEffect(() => {
        fetchMessage();
    }, [status]);

    // Notify parent when save is successful
    useEffect(() => {
        if (saveSuccess) {
            // Send the success message to the parent component
            if (onSuccessMessage) {
                onSuccessMessage(__(`${status} message saved successfully`, 'plugin-name'));
            }
            
            // Reset local success state after notifying parent
            setTimeout(() => {
                setSaveSuccess(false);
            }, 100);
        }
    }, [saveSuccess, onSuccessMessage, status]);

    // Handle message change
    const handleMessageChange = (value) => {
        setMessage(value);
        setSaveSuccess(false);
    };

    // Fetch status saved message from db
    const fetchMessage = async () => {
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                console.error('WordPress REST API nonce not available');
                return;
            }

            // Fetch status message from backend
            const response = await fetch(`/wp-json/plugin-name/v1/settings/status/${statusKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                }
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.data.message || 'Unknown error');
            }

            // Get the status message and get it reflected on the frontend
            const message_ = data.data.message;

             // Update the message 
            setMessage(message_ || message);
        } catch (error) {
            console.error('Error fetching status settings:', error);
            
            // Notify parent of error
            if (onErrorMessage) {
                onErrorMessage(__(`Failed to load ${status} message. Please refresh and try again.`, 'plugin-name'));
            }
        } 
    };

    // Save status message to db
    const saveMessage = async () => {
        setIsSaving(true);
        
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                throw new Error('WordPress REST API nonce not available');
            }

            // Data to send 
            const sendData = {
                status_key: statusKey,
                message: message
            };

            // Save status message to backend
            const response = await fetch('/wp-json/plugin-name/v1/settings/status/save-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: JSON.stringify(sendData)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.data.message || 'Unknown error');
            }

            setSaveSuccess(true);
        } catch (error) {
            console.error('Error saving status message:', error);
            
            // Notify parent of error
            if (onErrorMessage) {
                onErrorMessage(__(`Failed to save ${status} message. Please try again.`, 'plugin-name'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="settings-card">
            <CardBody>
                {/* Tabs Section */}
                <div className="settings-tabs-container mb-6">
                        <div className="settings-tab-content">
                            {/* Message text area Section */}
                            <div className="settings-message">
                                <div className="flex flex-wrap -mx-4">
                                    <div className="w-full lg:w-1/2 px-4 mb-6">
                                        <h2 className="text-lg font-medium mb-1">{__('Message', 'plugin-name')}</h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {__('Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis. ', 'plugin-name')}
                                        </p>
                                        
                                        {/* Custom Textarea Control */}
                                        <div className="settings-textarea-container mb-4">
                                            <textarea
                                                value={message}
                                                onChange={(e) => handleMessageChange(e.target.value)}
                                                className="settings-textarea w-full h-32 p-4 border border-gray-300 rounded-md"
                                                style={{ fontSize: '14px' }}
                                            />
                                        </div>

                                        {/* Save Button */}
                                        <div className="settings-actions flex justify-between space-x-4 mt-12">
                                            <Button 
                                                variant="primary" 
                                                className="settings-button-save px-6 py-2 bg-blue-500 text-white rounded-full"
                                                onClick={saveMessage}
                                                isBusy={isSaving}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? __('Saving...', 'plugin-name') : __('Save Settings', 'plugin-name')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AccordionItem;