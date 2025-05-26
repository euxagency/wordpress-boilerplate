import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='plugin-name-page-wrap'>
        <div className='plugin-name-page-content'>
          <div class='plugin-name-content-wrap'>
            {children} {/* This will change dynamically */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
