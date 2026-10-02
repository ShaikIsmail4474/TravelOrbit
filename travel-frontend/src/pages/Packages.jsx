import { useEffect, useState } from 'react'

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

        <section className="packages-page-header">
          <div className="container">

            <span className="section-eyebrow">
              Explore our collection
            </span>

            <h1>
              Travel Packages
            </h1>

            <p>
              Discover carefully selected travel experiences
              and find the perfect package for your next journey.
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

                {packages.map((packageData) => (

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