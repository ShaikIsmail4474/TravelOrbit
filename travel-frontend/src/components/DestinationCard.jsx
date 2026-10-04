import { ArrowUpRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function DestinationCard({ destination }) {

  const navigate = useNavigate()

  const handleDestinationClick = () => {
    navigate('/')

    setTimeout(() => {
      const packagesSection = document.getElementById('packages')

      if (packagesSection) {
        packagesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  return (
    <article
      className="destination-card"
      onClick={handleDestinationClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleDestinationClick()
        }
      }}
    >

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
            onClick={(event) => {
              event.stopPropagation()
              handleDestinationClick()
            }}
          >
            <ArrowUpRight size={19} />
          </button>

        </div>

      </div>

    </article>
  )
}

export default DestinationCard