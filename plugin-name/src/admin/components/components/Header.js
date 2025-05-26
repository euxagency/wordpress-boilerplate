import { __ } from '@wordpress/i18n';
import { Card, CardBody, Flex, FlexItem, Icon, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import TopsmsIcon from '../icons/TopsmsLogo.svg';
import BalanceCard from './BalanceCard';

const Header = () => {
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);

    // Fetch current balance on load (fetched from db)
    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch current status enabled settings from db
    const fetchUserData = async () => {
        try {
            // Get the nonce from WordPress
            const nonce = window.wpApiSettings?.nonce;
            if (!nonce) {
                console.error('WordPress REST API nonce not available');
                setIsLoading(false);
                return;
            }

            // Fetch user data from backend
            const response = await fetch(`/wp-json/topsms/v1/user`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
                },
            });

            const data = await response.json();
            // console.log('User data:', data);

            if (!data.success) {
                throw new Error(data.data.message || 'Unknown error');
            }

            // Get the user balance
            const balance_ = data.data.data.balance;
            // console.log(balance_);
            setBalance(balance_);

            const blocked = data.data.data.block;
            if (blocked) {
                setIsBlocked(true);
            }
            // console.log('User current balance:', balance_);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <Card className='topsms-header mb-4 border-0 shadow-none'>
        {isBlocked && 
            <Notice status="error" isDismissible={false}>
                <p>
                    {__("Thanks for installing the plugin! Your SMS account is currently under review - this process usually takes 24 to 48 hours. If you haven't heard from us after that time, feel free to reach out at ", 'topsms')}
                     <a href="mailto:support@topsms.com.au" className="text-blue-600 hover:underline"> support@topsms.com.au </a>
                    {__("and we'll be happy to help. ", 'topsms')}
                </p>
            </Notice>
        }
      <CardBody className='topsms-header-card-body p-0 mt-2'>
        <Flex align='center' gap={4}>
          <FlexItem gap={2}>
            <Flex>
              {/* Logo */}
              <FlexItem>
                <div className='topsms-logo-container bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center'>
                  <Icon icon={TopsmsIcon} size={32} />
                </div>
              </FlexItem>

              {/* Header Text */}
              <FlexItem>
                <h2 className='m-0 text-xl font-semibold'>
                  {__('TopSMS', 'topsms')}
                </h2>
                <p variant='muted' className='text-sm text-gray-600'>
                  {__(
                    'Configure automated SMS notifications for your customers',
                    'topsms'
                  )}
                </p>
              </FlexItem>
            </Flex>
          </FlexItem>

          {/* Balance Info */}
          <FlexItem>
            <BalanceCard balance={balance} isLoading={isLoading}/>
        </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Header;
