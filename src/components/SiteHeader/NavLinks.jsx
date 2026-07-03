import chevronIcon from '../../assets/chevron.svg';
import { NAV_ITEMS } from '../../data/property.js';

export default function NavLinks() {
  return (
    <nav className="site-header__nav" aria-label="Property navigation">
      <ul className="site-header__nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="site-header__nav-item">
            <a className="site-header__nav-link" href={item.href}>
              {item.label}
              {item.hasChevron && (
                <img
                  className="site-header__nav-chevron"
                  src={chevronIcon}
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
