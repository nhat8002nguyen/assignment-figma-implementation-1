import heroBg from '../../assets/hero-bg.jpg';
import SiteHeader from '../SiteHeader/SiteHeader.jsx';
import { PropertyInfoCardStats } from '../PropertyInfoCard/PropertyInfoCard.jsx';
import { PROPERTY } from '../../data/property.js';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__background">
        <img
          className="hero__background-image"
          src={heroBg}
          alt=""
          aria-hidden="true"
        />
      </div>

      <SiteHeader />

      <div className="hero__content">
        <h1 className="hero__title">{PROPERTY.title}</h1>
        <p className="hero__subtitle">{PROPERTY.subtitle}</p>
      </div>

      <PropertyInfoCardStats />
    </section>
  );
}
