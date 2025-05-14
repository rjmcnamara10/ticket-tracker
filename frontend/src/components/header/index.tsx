import { useNavigate } from 'react-router-dom';
import './index.css';

/**
 * Represents the header component for the application, containing the logo and title.
 */
const Header = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the home page on logo click.
   */
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className='header'>
      <img src={'/logo_header.png'} alt='Logo' className='logo' onClick={handleLogoClick} />
      <img src={'/title.png'} alt='Title' className='title' />
    </header>
  );
};

export default Header;
