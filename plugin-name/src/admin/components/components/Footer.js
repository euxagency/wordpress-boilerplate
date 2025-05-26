import { __ } from '@wordpress/i18n';
const Footer = () => {
  return (
    <footer className='topsms-footer-wrap'>
      <div className='topsms-footer-innerwrap flex justify-between'>
        <span className='copy-right-text'>
            {__("©2025 TopSMS All Right Reserved - ", 'topsms')}
            <a href="https://topsms.com.au/privacy-policy/" target="_blank" className="text-blue-600 hover:underline"> Privacy Policy </a>
        </span>
        <div className='topsms-contact-info flex justify-between gap-[2rem]'>
          <a href="mailto:support@topsms.com.au" className="text-blue-600 hover:underline"> support@topsms.com.au </a>
          <a href='tel:610291216234'>+61 (0) 2 9121 6234</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
