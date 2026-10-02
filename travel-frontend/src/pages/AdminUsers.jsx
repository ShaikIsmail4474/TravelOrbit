import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Mail,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
  XCircle
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import {
  getAllUsers,
  updateUser,
  updateUserStatus
} from '../services/userService'

import '../styles/adminUsers.css'

function AdminUsers() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const [editingUser, setEditingUser] = useState(null)

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'CUSTOMER'
  })

  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  const [statusLoadingId, setStatusLoadingId] = useState(null)
  const [statusError, setStatusError] = useState('')

  useEffect(() => {

    const loadUsers = async () => {

      try {

        setLoading(true)
        setError('')

        const data = await getAllUsers()

        setUsers(data)

      } catch (err) {

        console.error(
          'Failed to load users:',
          err
        )

        if (err.response?.status === 401) {

          setError(
            'Your session has expired. Please login again.'
          )

        } else if (err.response?.status === 403) {

          setError(
            'You are not authorized to view users.'
          )

        } else {

          setError(
            'Unable to load users. Please try again later.'
          )

        }

      } finally {

        setLoading(false)

      }

    }

    loadUsers()

  }, [])

  const filteredUsers = useMemo(() => {

    const search = searchTerm
      .trim()
      .toLowerCase()

    return users.filter((user) => {

      const name = user.name?.toLowerCase() || ''
      const email = user.email?.toLowerCase() || ''
      const role = user.role?.toUpperCase() || ''

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search)

      const matchesRole =
        roleFilter === 'ALL' ||
        role === roleFilter

      return matchesSearch && matchesRole

    })

  }, [users, searchTerm, roleFilter])

  const openEditModal = (user) => {

    setEditingUser(user)

    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'CUSTOMER'
    })

    setEditError('')

  }

  const closeEditModal = () => {

    if (editLoading) {
      return
    }

    setEditingUser(null)

    setEditForm({
      name: '',
      email: '',
      role: 'CUSTOMER'
    })

    setEditError('')

  }

  const handleEditChange = (event) => {

    const {
      name,
      value
    } = event.target

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }))

  }

  const handleEditSubmit = async (event) => {

    event.preventDefault()

    try {

      setEditLoading(true)
      setEditError('')

      const updatedUser = await updateUser(
        editingUser.id,
        editForm
      )

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        )
      )

      closeEditModal()

    } catch (err) {

      console.error(
        'Failed to update user:',
        err
      )

      if (err.response?.status === 401) {

        setEditError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setEditError(
          'You are not authorized to update this user.'
        )

      } else if (err.response?.data?.message) {

        setEditError(
          err.response.data.message
        )

      } else {

        setEditError(
          'Unable to update user. Please try again.'
        )

      }

    } finally {

      setEditLoading(false)

    }

  }

  const handleStatusChange = async (user) => {

    const nextStatus = !user.active

    const actionText = nextStatus
      ? 'activate'
      : 'deactivate'

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${user.name}'s account?`
    )

    if (!confirmed) {
      return
    }

    try {

      setStatusLoadingId(user.id)
      setStatusError('')

      const updatedUser = await updateUserStatus(
        user.id,
        nextStatus
      )

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser
        )
      )

    } catch (err) {

      console.error(
        'Failed to update user status:',
        err
      )

      if (err.response?.status === 401) {

        setStatusError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setStatusError(
          'You are not authorized to change user status.'
        )

      } else if (err.response?.data?.message) {

        setStatusError(
          err.response.data.message
        )

      } else {

        setStatusError(
          'Unable to update user status. Please try again.'
        )

      }

    } finally {

      setStatusLoadingId(null)

    }

  }

  return (
    <>
      <Navbar />

      <main className="admin-users-page">

        <section className="admin-users-header">

          <div className="container">

            <button
              type="button"
              className="admin-users-back"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft size={17} />
              Back to Admin Dashboard
            </button>

            <div className="admin-users-heading">

              <span className="section-eyebrow">
                Administration
              </span>

              <h1>
                User Management
              </h1>

              <p>
                View registered users and manage their
                account information and status.
              </p>

            </div>

          </div>

        </section>

        <section className="admin-users-section">

          <div className="container">

            {loading && (
              <Loading message="Loading users..." />
            )}

            {!loading && error && (
              <ErrorMessage message={error} />
            )}

            {!loading &&
              !error &&
              statusError && (

                <div className="admin-user-status-error">
                  {statusError}

                  <button
                    type="button"
                    onClick={() => setStatusError('')}
                    aria-label="Close status error"
                  >
                    <X size={16} />
                  </button>

                </div>

              )
            }

            {!loading &&
              !error &&
              users.length === 0 && (

                <div className="admin-users-empty">

                  <Users size={42} />

                  <h2>
                    No Users Found
                  </h2>

                  <p>
                    There are currently no registered users
                    available.
                  </p>

                </div>

              )
            }

            {!loading &&
              !error &&
              users.length > 0 && (

                <div className="admin-users-list">

                  <div className="admin-users-toolbar">

                    <div className="admin-users-summary">

                      <div>

                        <span>
                          Total Users
                        </span>

                        <strong>
                          {users.length}
                        </strong>

                      </div>

                    </div>

                    <div className="admin-users-controls">

                      <div className="admin-users-search">

                        <Search size={18} />

                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) =>
                            setSearchTerm(event.target.value)
                          }
                          placeholder="Search by name or email..."
                          aria-label="Search users"
                        />

                        {searchTerm && (

                          <button
                            type="button"
                            className="admin-users-search-clear"
                            onClick={() => setSearchTerm('')}
                            aria-label="Clear search"
                          >
                            <X size={16} />
                          </button>

                        )}

                      </div>

                      <div className="admin-users-filter">

                        <label
                          htmlFor="role-filter"
                        >
                          Role
                        </label>

                        <div className="admin-users-filter-select">

                          <select
                            id="role-filter"
                            value={roleFilter}
                            onChange={(event) =>
                              setRoleFilter(event.target.value)
                            }
                          >

                            <option value="ALL">
                              All Users
                            </option>

                            <option value="CUSTOMER">
                              Customers
                            </option>

                            <option value="ADMIN">
                              Admins
                            </option>

                          </select>

                          <ChevronDown size={16} />

                        </div>

                      </div>

                    </div>

                  </div>

                  {filteredUsers.length === 0 && (

                    <div className="admin-users-empty admin-users-no-results">

                      <Search size={38} />

                      <h2>
                        No Matching Users
                      </h2>

                      <p>
                        No users match your current search
                        or role filter.
                      </p>

                    </div>

                  )}

                  {filteredUsers.length > 0 && (

                    <div className="admin-users-grid">

                      {filteredUsers.map((user) => (

                        <article
                          key={user.id}
                          className="admin-user-card"
                        >

                          <div className="admin-user-card-header">

                            <div className="admin-user-avatar">
                              <User size={22} />
                            </div>

                            <div className="admin-user-title">

                              <h2>
                                {user.name}
                              </h2>

                              <span>
                                User ID #{user.id}
                              </span>

                            </div>

                            <span
                              className={`admin-user-role admin-role-${user.role?.toLowerCase()}`}
                            >
                              {user.role}
                            </span>

                          </div>

                          <div className="admin-user-card-content">

                            <div className="admin-user-info">

                              <Mail size={16} />

                              <div>

                                <span>
                                  Email Address
                                </span>

                                <strong>
                                  {user.email}
                                </strong>

                              </div>

                            </div>

                            <div className="admin-user-info">

                              <ShieldCheck size={16} />

                              <div>

                                <span>
                                  Account Role
                                </span>

                                <strong>
                                  {user.role}
                                </strong>

                              </div>

                            </div>

                            <div className="admin-user-info">

                              {user.active ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <XCircle size={16} />
                              )}

                              <div>

                                <span>
                                  Account Status
                                </span>

                                <strong
                                  className={
                                    user.active
                                      ? 'admin-user-status-active'
                                      : 'admin-user-status-inactive'
                                  }
                                >
                                  {user.active
                                    ? 'ACTIVE'
                                    : 'INACTIVE'
                                  }
                                </strong>

                              </div>

                            </div>

                          </div>

                          <div className="admin-user-card-footer">

                            <button
                              type="button"
                              className="admin-user-edit-button"
                              onClick={() =>
                                openEditModal(user)
                              }
                            >
                              <Edit3 size={16} />
                              Edit User
                            </button>

                            <button
                              type="button"
                              className={
                                user.active
                                  ? 'admin-user-deactivate-button'
                                  : 'admin-user-activate-button'
                              }
                              onClick={() =>
                                handleStatusChange(user)
                              }
                              disabled={
                                statusLoadingId === user.id
                              }
                            >
                              {statusLoadingId === user.id
                                ? 'Updating...'
                                : user.active
                                  ? (
                                    <>
                                      <XCircle size={16} />
                                      Deactivate
                                    </>
                                  )
                                  : (
                                    <>
                                      <CheckCircle2 size={16} />
                                      Activate
                                    </>
                                  )
                              }
                            </button>

                          </div>

                        </article>

                      ))}

                    </div>

                  )}

                </div>

              )}

          </div>

        </section>

      </main>

      {editingUser && (

        <div
          className="admin-user-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget &&
              !editLoading
            ) {
              closeEditModal()
            }

          }}
        >

          <div
            className="admin-user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >

            <div className="admin-user-modal-header">

              <div>

                <span>
                  User ID #{editingUser.id}
                </span>

                <h2 id="edit-user-title">
                  Edit User
                </h2>

              </div>

              <button
                type="button"
                className="admin-user-modal-close"
                onClick={closeEditModal}
                disabled={editLoading}
                aria-label="Close edit user dialog"
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="admin-user-edit-form"
              onSubmit={handleEditSubmit}
            >

              <div className="admin-user-form-group">

                <label htmlFor="edit-user-name">
                  Name
                </label>

                <input
                  id="edit-user-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />

              </div>

              <div className="admin-user-form-group">

                <label htmlFor="edit-user-email">
                  Email Address
                </label>

                <input
                  id="edit-user-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />

              </div>

              <div className="admin-user-form-group">

                <label htmlFor="edit-user-role">
                  Account Role
                </label>

                <div className="admin-user-role-select-wrapper">

                  <select
                    id="edit-user-role"
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    required
                  >

                    <option value="CUSTOMER">
                      CUSTOMER
                    </option>

                    <option value="ADMIN">
                      ADMIN
                    </option>

                  </select>

                  <ChevronDown size={17} />

                </div>

              </div>

              {editError && (

                <div className="admin-user-edit-error">
                  {editError}
                </div>

              )}

              <div className="admin-user-modal-actions">

                <button
                  type="button"
                  className="admin-user-cancel-button"
                  onClick={closeEditModal}
                  disabled={editLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-user-save-button"
                  disabled={editLoading}
                >
                  {editLoading
                    ? 'Saving...'
                    : 'Save Changes'
                  }
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <Footer />
    </>
  )
}

export default AdminUsers