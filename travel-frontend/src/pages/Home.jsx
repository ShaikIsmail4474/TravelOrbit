import { useEffect, useState } from 'react'

import {
  ArrowRight
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DestinationCard from '../components/DestinationCard'
import PackageCard from '../components/PackageCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import destinations from '../data/destinations'

import { getPackages } from '../services/packageService'

import '../styles/home.css'
import '../styles/destinations.css'
import '../styles/packages.css'

function Home() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadPackages = async () => {

      try {

        setLoading(true)
        setError('')

        const data = await getPackages()

        setPackages(data)

      } catch (err) {

        console.error('Failed to load packages:', err)

        setError(
          'Unable to load travel packages. Please try again later.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadPackages()

  }, [])

  return (
    <>
      <Navbar />

      <main>

        {/* HERO / INTRO */}
        <section className="home-placeholder">
          <div className="container">

            <h1>
              Travel & Tourism Management Portal
            </h1>

            <p>
              Explore destinations, discover travel packages,
              and plan your next journey.
            </p>

          </div>
        </section>


        {/* DESTINATIONS */}
        <section
          className="destinations-section"
          id="destinations"
        >

          <div className="container">

            <div className="section-heading">

              <div className="section-heading-content">

                <span className="section-eyebrow">
                  Explore places
                </span>

                <h2>
                  Popular destinations
                </h2>

                <p>
                  From relaxing beaches to breathtaking mountains,
                  discover places worth adding to your travel list.
                </p>

              </div>

              <a
                href="#packages"
                className="section-link"
              >
                View all destinations
                <ArrowRight size={17} />
              </a>

            </div>


            <div className="destination-grid">

              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}

            </div>

          </div>

        </section>


        {/* FEATURED PACKAGES */}
        <section
          className="packages-section"
          id="packages"
        >

          <div className="container">

            <div className="section-heading">

              <div className="section-heading-content">

                <span className="section-eyebrow">
                  Curated for you
                </span>

                <h2>
                  Featured travel packages
                </h2>

                <p>
                  Explore our available travel packages and
                  find an experience that matches your journey.
                </p>

              </div>

              <a
                href="/packages"
                className="section-link"
              >
                View all packages
                <ArrowRight size={17} />
              </a>

            </div>


            {loading && (
              <Loading message="Loading travel packages..." />
            )}


            {!loading && error && (
              <ErrorMessage message={error} />
            )}


            {!loading && !error && packages.length === 0 && (

              <div className="empty-state">

                <h3>
                  No travel packages available
                </h3>

                <p>
                  Please check back later for available packages.
                </p>

              </div>

            )}


            {!loading && !error && packages.length > 0 && (

              <div className="package-grid">

                {packages
                  .slice(0, 6)
                  .map((packageData) => (

                    <PackageCard
                      key={packageData.id}
                      packageData={packageData}
                    />

                  ))}

              </div>

            )}

          </div>

        </section>


        {/* ABOUT */}
        <section
          className="about-section"
          id="about"
        >

          <div className="container">

            <div className="about-content">

              <div className="about-intro">

                <span className="section-eyebrow">
                  About TravelOrbit
                </span>

                <h2>
                  Plan your journey with confidence.
                </h2>

                <p>
                  TravelOrbit makes it simple to discover destinations,
                  explore travel packages, create bookings, and manage
                  your complete travel experience in one place.
                </p>

              </div>


              <div className="about-features">

                <div className="about-feature">

                  <strong>
                    Discover
                  </strong>

                  <span>
                    Explore destinations and travel experiences.
                  </span>

                </div>


                <div className="about-feature">

                  <strong>
                    Book
                  </strong>

                  <span>
                    Choose a package and create your travel booking.
                  </span>

                </div>


                <div className="about-feature">

                  <strong>
                    Manage
                  </strong>

                  <span>
                    Track bookings and payment details from your account.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Home