import Hero from '../Hero/Hero.jsx';
import { PropertyInfoCardBroker } from '../PropertyInfoCard/PropertyInfoCard.jsx';
import './PropertyPage.css';

export default function PropertyPage() {
  return (
    <div className="property-page">
      <Hero />
      <PropertyInfoCardBroker />
    </div>
  );
}
