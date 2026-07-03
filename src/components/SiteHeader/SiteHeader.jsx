import logo from '../../assets/logo.svg';
import NavLinks from './NavLinks.jsx';
import MoreMenu from './MoreMenu.jsx';
import './SiteHeader.css';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <img className="site-header__logo" src={logo} alt="tonomo" width={172} height={24} />

      <div className="site-header__nav-desktop">
        <NavLinks />
      </div>

      <div className="site-header__nav-compact site-header__nav-compact--mobile">
        <MoreMenu includeDocuments />
      </div>

      <div className="site-header__nav-compact site-header__nav-compact--tablet">
        <MoreMenu />
      </div>

      <div className="site-header__actions">
        <button type="button" className="site-header__button site-header__button--outline site-header__button--documents">
          Documents
        </button>
        <button type="button" className="site-header__button site-header__button--filled">
          Contact
        </button>
      </div>
    </header>
  );
}
