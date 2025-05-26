import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

import VerticalStrokeIcon from '../icons/VerticalStrokeIcon';
import SettingsIcon from '../icons/SettingsIcon';

const Accordion = ({ title, description, statusKey, statusColor, children, onSuccessMessage, onErrorMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(true); 
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isCogHovered, setIsCogHovered] = useState(false);

    // Reference to content div
    const contentRef = useRef(null); 
    const [height, setHeight] = useState("0px"); 

    // Open the details - dynamic height render
    useEffect(() => {
        if (isOpen) {
            setHeight(`${contentRef.current.scrollHeight}px`); 
        } else {
            setHeight("0px");
        }
    }, [isOpen]);

    // Initial status settings on load (fetched from db)
    useEffect(() => {
        if (statusKey) {
            fetchStatusSettings();
        }
    }, [statusKey]);

    useEffect(() => {
        if (saveSuccess) {
            // Send the success message to the parent component
            if (onSuccessMessage) {
                onSuccessMessage(__(`${title} status ${isEnabled ? 'enabled' : 'disabled'} successfully`, 'plugin-name'));
            }
            
            // Reset local success state after notifying parent
            setTimeout(() => {
                setSaveSuccess(false);
            }, 100);
        }
    }, [saveSuccess, onSuccessMessage, title, isEnabled]);

    // Handle toggle changes
    const handleToggleChange = () => {
        const newValue = !isEnabled;

        // Update local state immediately
        setIsEnabled(newValue);

        // Save to database
        saveStatusEnabled(newValue);
    };

    // Fetch current status enabled settings from db
    const fetchStatusSettings = async () => {
        setIsLoading(true);
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                console.error('WordPress REST API nonce not available');
                setIsLoading(false);
                return;
            }

            // Fetch status settings from backend
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

            // Get the enabled settings and get it reflected on the frontend
            const enabled = data.data.enabled;
            setIsEnabled(enabled);
            // console.log(`Status ${statusKey} enabled:  ${enabled}`);
        } catch (error) {
            console.error('Error fetching status settings:', error);
            
            // Notify parent of error
            if (onErrorMessage) {
                onErrorMessage(__(`Failed to load ${title} status settings. Please refresh and try again.`, 'plugin-name'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Save status enabled setting to the database
    const saveStatusEnabled = async (isEnabled) => {
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                throw new Error('WordPress REST API nonce not available');
            }

            // Data to send 
            const sendData = {
                status_key: statusKey,
                enabled: isEnabled
            };
            // console.log(`Saving ${statusKey} enabled setting:`, sendData);

            // Save status enabled option to backend
            const response = await fetch('/wp-json/plugin-name/v1/settings/status/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: JSON.stringify(sendData)
            });

            const data = await response.json();
            // console.log('Status enabled setting saved successfully:', data);

            if (!data.success) {
                throw new Error(data.data.message || 'Unknown error');
            }
            
            // Set success state to notify parent
            setSaveSuccess(true);
            
            // If status is disabled, close the accordion
            if (!isEnabled) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Error saving status enabled setting:', error);
            // Revert the toggle if saving failed
            setIsEnabled(!isEnabled);
            
            // Notify parent of error
            if (onErrorMessage) {
                onErrorMessage(__(`Failed to ${isEnabled ? 'disable' : 'enable'} ${title} status. Please try again.`, 'plugin-name'));
            }
        }
    };

    return (
        <>
            <div className="plugin-name-status-wrap items-center self-stretch bg-white rounded-xl flex gap-3 p-[0.75rem] border border-black/[0.07]">
                <span className={`status status-${statusKey} rounded-full h-8 w-[3px]`} style={{ backgroundColor: statusColor }}></span>
                <div className="status-detail-wrap items-center flex flex-1 gap-2">
                    <div className="status-detail items-start flex flex-1 flex-col gap-[2px] justify-center">
                        <h5 className="text-gray-800 font-bold text-medium">{__(title, 'plugin-name')}</h5>
                        <span>{__(description, 'plugin-name')}</span>
                    </div>
                    <div className="status-control items-center flex gap-[12px]">
                        {isLoading ? (
                            <div className="animate-pulse bg-gray-300 h-5 w-9 rounded-full"></div>
                        ) : (
                            <ToggleControl
                                __nextHasNoMarginBottom
                                label=""
                                checked={isEnabled}
                                onChange={handleToggleChange}
                            />
                        )}
                        <VerticalStrokeIcon />
                        <div
                            className={`open-settings ${isOpen ? 'open' : ''} ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`} 
                            onClick={() => isEnabled && setIsOpen(!isOpen)}
                            onMouseEnter={() => setIsCogHovered(true)}
                            onMouseLeave={() => setIsCogHovered(false)}
                            style={{
                                transition: 'transform 0.3s ease',
                                transform: isCogHovered ? 'rotate(90deg)' : 'rotate(0deg)',
                                cursor: isEnabled ? 'pointer' : 'default'
                            }}
                        >
                            <SettingsIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accordion Body with Dynamic Height - Only show if enabled */}
            <div
                className="plugin-name-accordion-body-wrap"
                ref={contentRef}
                style={{
                    maxHeight: height,
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                    overflow: "hidden",
                }}
            >
                {children}
            </div>
        </>
    );
};

export default Accordion;