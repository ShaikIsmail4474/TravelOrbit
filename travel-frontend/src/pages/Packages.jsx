import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PackageCard from '../components/PackageCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import { getPackages } from '../services/packageService'

import '../styles/packages.css'

function Packages() {

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchParams] = useSearchParams()

  const selectedLocation = searchParams.get('location')

  useEffect(() => {

    const loadPackages = async () => {

      try {

        setLoading(true)
        setError('')

        const data = await getPackages()

        setPackages(data)

      } catch (err) {

        console.error('Failed to load travel packages:', err)

        setError(
          'Unable to load travel packages. Please try again later.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadPackages()

  }, [])

  const filteredPackages = selectedLocation
    ? packages.filter((packageData) =>
        packageData.location?.toLowerCase() ===
        selectedLocation.toLowerCase()
      )
    : packages

  return (
    <>
      <Navbar />

      <main>

        <section className="packages-page-header">
          <div className="container">

            <span className="section-eyebrow">
              {selectedLocation
                ? `Packages in ${selectedLocation}`
                : 'Explore our collection'}
            </span>

            <h1>
              {selectedLocation
                ? `${selectedLocation} Travel Packages`
                : 'Travel Packages'}
            </h1>

            <p>
              {selectedLocation
                ? `Discover travel experiences available in ${selectedLocation}.`
                : 'Discover carefully selected travel experiences and find the perfect package for your next journey.'}
            </p>

          </div>
        </section>


        <section className="packages-section">

          <div className="container">

            {loading && (
              <Loading message="Loading travel packages..." />
            )}


            {!loading && error && (
              <ErrorMessage message={error} />
            )}


            {!loading && !error && filteredPackages.length === 0 && (

              <div className="empty-state">

                <h3>
                  {selectedLocation
                    ? `No packages available in ${selectedLocation}`
                    : 'No travel packages available'}
                </h3>

                <p>
                  {selectedLocation
                    ? 'Please check back later for packages in this destination.'
                    : 'Please check back later for available travel packages.'}
                </p>

              </div>

            )}


            {!loading && !error && filteredPackages.length > 0 && (

              <div className="package-grid">

                {filteredPackages.map((packageData) => (

                  <PackageCard
                    key={packageData.id}
                    packageData={packageData}
                  />

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Packages