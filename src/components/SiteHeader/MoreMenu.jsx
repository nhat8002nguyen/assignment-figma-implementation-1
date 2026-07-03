import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../data/property.js';

export default function MoreMenu({ includeDocuments = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="site-header__more" ref={menuRef}>
      <button
        type="button"
        className="site-header__more-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More navigation options"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="site-header__more-icon" aria-hidden="true">☰</span>
      </button>

      {isOpen && (
        <div className="site-header__more-panel" role="menu">
          <ul className="site-header__more-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} role="none">
                <a
                  className="site-header__more-link"
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {includeDocuments && (
              <li role="none">
                <button
                  type="button"
                  className="site-header__more-link site-header__more-link--button"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Documents
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
