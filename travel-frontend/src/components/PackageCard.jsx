import {
  ArrowRight,
  CalendarDays,
  MapPin
} from 'lucide-react'

import { Link } from 'react-router-dom'

function PackageCard({ packageData }) {

  const handleLocationClick = () => {

    const destination = packageData.destination

    const mapsUrl =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`

    window.open(
      mapsUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <article className="package-card">

      <div className="package-image-wrapper">

        <img
          src={
            packageData.image ||
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85'
          }
          alt={packageData.name}
          className="package-image"
        />

        <span className="package-badge">
          Popular
        </span>

      </div>

      <div className="package-body">

        <button
          type="button"
          className="package-location package-location-button"
          onClick={handleLocationClick}
          title={`View ${packageData.destination} on Google Maps`}
        >
          <MapPin size={15} />

          <span>
            {packageData.destination}
          </span>
        </button>

        <h3>
          {packageData.name}
        </h3>

        <p className="package-description">
          {packageData.description}
        </p>

        <div className="package-meta">

          <span>
            <CalendarDays size={16} />

            {packageData.durationDays} days
          </span>

        </div>

        <div className="package-footer">

          <div>

            <small>
              Starting from
            </small>

            <strong>
              ₹{Number(packageData.price).toLocaleString('en-IN')}
            </strong>

          </div>

          <Link
            to={`/packages/${packageData.id}`}
            className="package-button"
          >
            View Details

            <ArrowRight size={17} />
          </Link>

        </div>

      </div>

    </article>
  )
}

export default PackageCard
