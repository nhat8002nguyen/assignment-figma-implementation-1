import agentPhoto from '../../assets/agent-photo.jpg';
import { PROPERTY_STATS, BROKER } from '../../data/property.js';
import './PropertyInfoCard.css';

export function PropertyInfoCardStats() {
  return (
    <div className="property-info-card__stats">
      {PROPERTY_STATS.map((stat) => (
        <div
          key={stat.label}
          className={`property-info-card__stat${stat.isPrice ? ' property-info-card__stat--price' : ''}`}
        >
          <span className="property-info-card__stat-label">{stat.label}</span>
          <span className="property-info-card__stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

export function PropertyInfoCardBroker() {
  return (
    <div className="property-info-card__broker">
      <div className="property-info-card__avatar">
        <img
          className="property-info-card__avatar-image"
          src={agentPhoto}
          alt={BROKER.name}
          width={156}
          height={156}
        />
      </div>

      <div className="property-info-card__info">
        <p className="property-info-card__role">{BROKER.role}</p>
        <h2 className="property-info-card__name">{BROKER.name}</h2>
      </div>

      <div className="property-info-card__contact">
        <p className="property-info-card__contact-item">{BROKER.license}</p>
        <p className="property-info-card__contact-item">{BROKER.phone}</p>
        <p className="property-info-card__contact-item">{BROKER.email}</p>
      </div>
    </div>
  );
}