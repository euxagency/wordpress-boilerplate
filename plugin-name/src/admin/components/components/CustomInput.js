import { 
    TextControl,
} from '@wordpress/components';

// Customised Text Control component for for label and input field styling
const CustomInput = ({ label, description, value, onChange, error, ...props }) => (
    <div className="mb-4">
        <div className="plugin-name-label">
            {label}
            {description && (
                <span className="text-xs text-gray-500 ml-2">{description}</span>
            )}
        </div>
        <div className="plugin-name-input">
            <TextControl
                label=""
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    </div>
);

export default CustomInput;