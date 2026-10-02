import { ArrowUpRight, MapPin } from 'lucide-react'

function DestinationCard({ destination }) {
  return (
    <article className="destination-card">

      <img
        src={destination.image}
        alt={destination.name}
        className="destination-image"
      />

      <div className="destination-overlay"></div>

      <div className="destination-content">

        <div className="destination-location">
          <MapPin size={15} />
          <span>{destination.location}</span>
        </div>

        <h3>{destination.name}</h3>

        <div className="destination-bottom">

          <span>{destination.description}</span>

          <button
            className="destination-arrow"
            aria-label={`Explore ${destination.name}`}
          >
            <ArrowUpRight size={19} />
          </button>

        </div>

      </div>

    </article>
  )
}

export default DestinationCard