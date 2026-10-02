import { useEffect, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Package
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import api from '../services/api'

import '../styles/adminPackages.css'

function AdminPackages() {

  const navigate = useNavigate()

  const [packages, setPackages] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    description: '',
    price: '',
    durationDays: '',
    image: ''
  })

  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const [deleteLoadingId, setDeleteLoadingId] = useState(null)


  /* =================================
     LOAD PACKAGES
  ================================= */

  const loadPackages = async () => {

    try {

      setLoading(true)
      setError('')

      const response = await api.get('/packages')

      setPackages(response.data)

    } catch (err) {

      console.error(
        'Failed to load packages:',
        err
      )

      if (err.response?.status === 401) {

        setError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setError(
          'You are not authorized to manage packages.'
        )

      } else {

        setError(
          'Unable to load packages. Please try again later.'
        )

      }

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    loadPackages()

  }, [])


  /* =================================
     FORM HANDLING
  ================================= */

  const resetForm = () => {

    setFormData({
      name: '',
      destination: '',
      description: '',
      price: '',
      durationDays: '',
      image: ''
    })

    setEditingId(null)
    setFormError('')

  }


  const handleAddClick = () => {

    resetForm()

    setShowForm(true)

  }


  const handleEditClick = (packageData) => {

    setEditingId(packageData.id)

    setFormData({
      name: packageData.name || '',
      destination: packageData.destination || '',
      description: packageData.description || '',
      price: packageData.price ?? '',
      durationDays: packageData.durationDays ?? '',
      image: packageData.image || ''
    })

    setFormError('')
    setShowForm(true)

  }


  const handleCancelForm = () => {

    if (formLoading) {
      return
    }

    setShowForm(false)
    resetForm()

  }


  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))

  }


  /* =================================
     CREATE / UPDATE
  ================================= */

  const handleSubmit = async (event) => {

    event.preventDefault()

    setFormError('')

    if (!formData.name.trim()) {

      setFormError(
        'Please enter the package name.'
      )

      return

    }

    if (!formData.destination.trim()) {

      setFormError(
        'Please enter the destination.'
      )

      return

    }

    if (!formData.description.trim()) {

      setFormError(
        'Please enter the package description.'
      )

      return

    }

    if (
      formData.price === '' ||
      Number(formData.price) <= 0
    ) {

      setFormError(
        'Please enter a valid price.'
      )

      return

    }

    if (
      formData.durationDays === '' ||
      Number(formData.durationDays) <= 0
    ) {

      setFormError(
        'Please enter a valid duration.'
      )

      return

    }

    try {

      setFormLoading(true)

      const payload = {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        image: formData.image.trim() || null
      }


      if (editingId) {

        await api.put(
          `/packages/${editingId}`,
          payload
        )

      } else {

        await api.post(
          '/packages',
          payload
        )

      }


      setShowForm(false)
      resetForm()

      await loadPackages()

    } catch (err) {

      console.error(
        'Failed to save package:',
        err
      )

      if (err.response?.status === 401) {

        setFormError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setFormError(
          'You are not authorized to perform this action.'
        )

      } else if (err.response?.data?.message) {

        setFormError(
          err.response.data.message
        )

      } else {

        setFormError(
          'Unable to save the package. Please try again.'
        )

      }

    } finally {

      setFormLoading(false)

    }

  }


  /* =================================
     DELETE
  ================================= */

  const handleDelete = async (packageData) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${packageData.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {

      setDeleteLoadingId(packageData.id)

      await api.delete(
        `/packages/${packageData.id}`
      )

      await loadPackages()

    } catch (err) {

      console.error(
        'Failed to delete package:',
        err
      )

      if (err.response?.status === 401) {

        alert(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        alert(
          'You are not authorized to delete packages.'
        )

      } else {

        alert(
          'Unable to delete the package. Please try again.'
        )

      }

    } finally {

      setDeleteLoadingId(null)

    }

  }


  return (
    <>
      <Navbar />

      <main className="admin-packages-page">

        <section className="admin-packages-header">

          <div className="container">

            <button
              type="button"
              className="admin-packages-back"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft size={17} />
              Back to Admin Dashboard
            </button>

            <div className="admin-packages-heading-row">

              <div>

                <span className="section-eyebrow">
                  Administration
                </span>

                <h1>
                  Package Management
                </h1>

                <p>
                  Create and manage the travel packages available
                  to customers.
                </p>

              </div>

              <button
                type="button"
                className="admin-add-package-button"
                onClick={handleAddClick}
              >
                <Plus size={17} />
                Add Package
              </button>

            </div>

          </div>

        </section>


        <section className="admin-packages-section">

          <div className="container">

            {loading && (
              <Loading message="Loading packages..." />
            )}

            {!loading && error && (
              <ErrorMessage message={error} />
            )}


            {!loading &&
              !error &&
              packages.length === 0 && (

                <div className="admin-packages-empty">

                  <Package size={42} />

                  <h2>
                    No Packages Found
                  </h2>

                  <p>
                    Create your first travel package to make it
                    available to customers.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddClick}
                  >
                    <Plus size={17} />
                    Add First Package
                  </button>

                </div>

              )
            }


            {!loading &&
              !error &&
              packages.length > 0 && (

                <div className="admin-packages-list">

                  {packages.map((packageData) => (

                    <article
                      key={packageData.id}
                      className="admin-package-card"
                    >

                      <div className="admin-package-image-wrapper">

                        <img
                          src={
                            packageData.image ||
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85'
                          }
                          alt={packageData.name}
                          className="admin-package-image"
                        />

                      </div>


                      <div className="admin-package-content">

                        <div className="admin-package-main">

                          <span className="admin-package-destination">
                            {packageData.destination}
                          </span>

                          <h2>
                            {packageData.name}
                          </h2>

                          <p>
                            {packageData.description}
                          </p>

                          <div className="admin-package-details">

                            <span>
                              {packageData.durationDays} days
                            </span>

                            <strong>
                              ₹{Number(
                                packageData.price
                              ).toLocaleString('en-IN')}
                            </strong>

                          </div>

                        </div>


                        <div className="admin-package-actions">

                          <button
                            type="button"
                            className="admin-edit-button"
                            onClick={() =>
                              handleEditClick(packageData)
                            }
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(packageData)
                            }
                            disabled={
                              deleteLoadingId === packageData.id
                            }
                          >
                            <Trash2 size={16} />

                            {deleteLoadingId === packageData.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>

                        </div>

                      </div>

                    </article>

                  ))}

                </div>

              )}

          </div>

        </section>


        {/* ADD / EDIT MODAL */}

        {showForm && (

          <div className="admin-package-modal-overlay">

            <div className="admin-package-modal">

              <div className="admin-package-modal-header">

                <div>

                  <span>
                    {editingId
                      ? 'Update Package'
                      : 'New Package'}
                  </span>

                  <h2>
                    {editingId
                      ? 'Edit Travel Package'
                      : 'Add Travel Package'}
                  </h2>

                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={handleCancelForm}
                  disabled={formLoading}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

              </div>


              <form
                className="admin-package-form"
                onSubmit={handleSubmit}
              >

                {/* NAME */}

                <div className="admin-form-group">

                  <label htmlFor="package-name">
                    Package Name
                  </label>

                  <input
                    id="package-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter package name"
                    disabled={formLoading}
                    required
                  />

                </div>


                {/* DESTINATION */}

                <div className="admin-form-group">

                  <label htmlFor="package-destination">
                    Destination
                  </label>

                  <input
                    id="package-destination"
                    name="destination"
                    type="text"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    disabled={formLoading}
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="admin-form-group">

                  <label htmlFor="package-description">
                    Description
                  </label>

                  <textarea
                    id="package-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter package description"
                    rows="4"
                    disabled={formLoading}
                    required
                  />

                </div>


                {/* PRICE + DURATION */}

                <div className="admin-form-row">

                  <div className="admin-form-group">

                    <label htmlFor="package-price">
                      Price (₹)
                    </label>

                    <input
                      id="package-price"
                      name="price"
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="18000"
                      disabled={formLoading}
                      required
                    />

                  </div>


                  <div className="admin-form-group">

                    <label htmlFor="package-duration">
                      Duration (Days)
                    </label>

                    <input
                      id="package-duration"
                      name="durationDays"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.durationDays}
                      onChange={handleChange}
                      placeholder="6"
                      disabled={formLoading}
                      required
                    />

                  </div>

                </div>


                {/* IMAGE */}

                <div className="admin-form-group">

                  <label htmlFor="package-image">
                    Image URL
                  </label>

                  <input
                    id="package-image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={formLoading}
                  />

                  <small>
                    Optional. Leave empty to use the default image.
                  </small>

                </div>


                {/* ERROR */}

                {formError && (

                  <div className="admin-form-error">
                    {formError}
                  </div>

                )}


                {/* ACTIONS */}

                <div className="admin-form-actions">

                  <button
                    type="button"
                    className="admin-form-cancel"
                    onClick={handleCancelForm}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-form-submit"
                    disabled={formLoading}
                  >
                    {formLoading
                      ? 'Saving...'
                      : editingId
                        ? 'Update Package'
                        : 'Create Package'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

      <Footer />
    </>
  )
}

export default AdminPackages