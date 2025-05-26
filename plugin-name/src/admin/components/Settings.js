import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Snackbar } from '@wordpress/components';

import Layout from './components/Layout';
import Accordion from './settings/Accordion';
import AccordionItem from './settings/AccordionItem';
import TextAutoSave from './settings/TextAutoSave';

const Settings = () => {
    // State for snackbar message
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success'); // 'success', 'error', 'info'

    const statuses = [
        {
            key: 'processing',
            title: 'Processing',
            description: 'lorem ipsum dolor sit amet condecture',
            color: '#17a34a', 
        },
        {
            key: 'completed',
            title: 'Completed',
            description: 'lorem ipsum dolor sit amet condecture',
            color: '#365aed', 
        },
        {
            key: 'failed',
            title: 'Failed',
            description: 'lorem ipsum dolor sit amet condecture',
            color: '#ff3a44', 
        },
    ];

    // Handle success message from components
    const handleSuccessMessage = (message) => {
        setSnackbarMessage(message);
        setSnackbarStatus('success');
        setShowSnackbar(true);
        
        // Auto-dismiss the success message after 3 seconds
        setTimeout(() => {
            setShowSnackbar(false);
            setSnackbarMessage('');
        }, 3000);
    };
    
    // Handle error message from components
    const handleErrorMessage = (message) => {
        setSnackbarMessage(message);
        setSnackbarStatus('error');
        setShowSnackbar(true);
        
        // Auto-dismiss the error message after 5 seconds
        setTimeout(() => {
            setShowSnackbar(false);
            setSnackbarMessage('');
        }, 5000);
    };
    
    // Handle dismissing the snackbar
    const handleDismissSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage('');
    };

    return (
        <Layout>
            {/* Snackbar for success/error messages - positioned at bottom left via CSS */}
            {showSnackbar && (
                <Snackbar 
                    onDismiss={handleDismissSnackbar}
                    className={`plugin-name-snackbar ${snackbarStatus === 'error' ? 'plugin-name-snackbar-error' : snackbarStatus === 'info' ? 'plugin-name-snackbar-info' : ''}`}
                >
                    {snackbarMessage}
                </Snackbar>
            )}
                
            <div className='px-6 py-4'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-1'>
                        {__('Settings', 'plugin-name')}
                    </h2>
                    <p className='text-gray-600'>
                        {__(
                        'Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis.',
                        'plugin-name'
                        )}
                    </p>
                </div>
            </div>
            <div className='page-details'>
                <div className='plugin-name-status-wrap flex flex-col items-start self-stretch gap-1'>
                    <div className='plugin-name-accordion-wrap flex flex-col gap-3 p-3 pr-4 w-full'>
                        {/* Map through the statuses array to create an Accordian and AccordianItem for each  status*/}
                        {statuses.map((status) => (
                            <Accordion
                                key={status.key}
                                title={status.title}
                                description={status.description}
                                statusKey={status.key}
                                statusColor={status.color}
                                onSuccessMessage={handleSuccessMessage}
                                onErrorMessage={handleErrorMessage}
                            >
                                <AccordionItem
                                    status={status.title} 
                                    statusKey={status.key}
                                    onSuccessMessage={handleSuccessMessage}
                                    onErrorMessage={handleErrorMessage}
                                />
                            </Accordion>
                        ))}

                        <TextAutoSave 
                            onSuccessMessage={handleSuccessMessage}
                            onErrorMessage={handleErrorMessage}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;