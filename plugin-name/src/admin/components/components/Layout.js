import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='topsms-page-wrap'>
        <div className='topsms-page-content'>
          <div class='topsms-content-wrap'>
            {children} {/* This will change dynamically */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
