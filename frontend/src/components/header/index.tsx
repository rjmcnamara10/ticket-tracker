import './index.css';

/**
 * Represents the header component for the application, containing the logo and title.
 */
const Header = () => (
  <header className='header'>
    <img src={'/logo192.png'} alt='Logo' className='logo' />
    <img src={'/title.png'} alt='Title' className='title' />
  </header>
);

export default Header;
