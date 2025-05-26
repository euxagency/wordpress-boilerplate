import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CustomInput from '../components/CustomInput';

const TextAutoSave = ({ onSuccessMessage, onErrorMessage }) => {
    const [username, SetUsername] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(true);
    const [usernameError, setUsernameError] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState(false);

    // Notify parent component of username saving success
    useEffect(() => {
        if (usernameSuccess) {
            const message = __('Username saved successfully', 'plugin-name');
            
            if (onSuccessMessage) {
                onSuccessMessage(message);
            }
            
            // Reset local success state
            setTimeout(() => {
                setUsernameSuccess(false);
            }, 100);
        }
    }, [usernameSuccess, onSuccessMessage]);

    // Watch for error changes and notify parent component
    useEffect(() => {
        if (usernameError && onErrorMessage) {
            onErrorMessage(surchargeError);
        }
    }, [usernameError, onErrorMessage]);

    // Initial settings on load (fetched from db)
    useEffect(() => {
        fetchUsername();
    }, []);
    
    // Fetch username
    const fetchUsername = async () => {
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                console.error('WordPress REST API nonce not available');
                setUsernameLoading(false);
                return;
            }

            // Fetch username from backend
            const response = await fetch('/wp-json/plugin-name/v1/settings/username', {
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

            // Update the username state
            SetUsername(data.data.value || '');
        } catch (error) {
            console.error('Error fetching username:', error);
            
            // Notify parent of error
            if (onErrorMessage) {
                onErrorMessage(__('Failed to load username. Please refresh and try again.', 'plugin-name'));
            }
        } finally {
            setUsernameLoading(false);
        }
    };

    // Save username on blur
    const handleUsernameBlur = async () => {
        try {
            setUsernameLoading(true);
            
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                throw new Error('WordPress REST API nonce not available');
            }

            // Data to send
            const sendData = {
                key: 'username',
                value: username
            };

            // Save username to backend
            const response = await fetch('/wp-json/plugin-name/v1/settings/save-input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: JSON.stringify(sendData)
            });

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.data?.message || 'Unknown error');
            }
            setUsernameSuccess(true);
        } catch (error) {
            console.error('Error saving username:', error);
            setUsernameError(__('Failed to save username.', 'plugin-name'));
        } finally {
            setUsernameLoading(false);
        }
    };

    return (
        <>
            {usernameLoading ? (
                <div className="animate-pulse bg-gray-300 h-10 w-full rounded"></div>
            ) : (
                <div>
                    <CustomInput
                        label={__('Username', 'plugin-name')}
                        description={__('Max 11 characters', 'plugin-name')}
                        placeholder={__('Username', 'plugin-name')}
                        value={username}
                        onBlur={handleUsernameBlur}
                        maxLength={11}
                    />
                </div>
            )}
        </>
    );
};

export default TextAutoSave;