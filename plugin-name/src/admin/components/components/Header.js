import { __ } from '@wordpress/i18n';
import { Card, CardBody, Flex, FlexItem, Icon } from '@wordpress/components';

import PluginNameIcon from '../icons/PluginNameIcon.svg';

const Header = () => {
  return (
    <Card className='plugin-name-header mb-4 border-0 shadow-none'>
        <CardBody className='plugin-name-header-card-body p-0 mt-2'>
            <Flex align='center' gap={4}>
            <FlexItem gap={2}>
                <Flex>
                {/* Logo */}
                <FlexItem>
                    <div className='plugin-name-logo-container rounded-full w-12 h-12 flex items-center justify-center'>
                    <Icon icon={PluginNameIcon} size={32} />
                    </div>
                </FlexItem>

                {/* Header Text */}
                <FlexItem>
                    <h2 className='m-0 text-xl font-semibold'>
                    {__('Plugin Name', 'plugin-name')}
                    </h2>
                    <p variant='muted' className='text-sm text-gray-600'>
                    {__(
                        'Lorem ipsum dolor sit amet consectetur. Arcu sed aliquam blandit ut magna nullam magna sagittis.',
                        'plugin-name'
                    )}
                    </p>
                </FlexItem>
                </Flex>
            </FlexItem>
            </Flex>
        </CardBody>
    </Card>
  );
};

export default Header;
