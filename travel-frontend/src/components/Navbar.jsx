import { useState } from 'react'

import {
  Menu,
  UserRound,
  X,
  ChevronDown,
  CalendarDays,
  Settings,
  LayoutDashboard,
  LogOut,
  Globe2
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import '../styles/navbar.css'

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navigate = useNavigate()

  const { user, isAuthenticated, logout } = useAuth()


  /* =================================
     LOGOUT
  ================================= */

  const handleLogout = () => {

    logout()

    setProfileOpen(false)
    setMenuOpen(false)

    navigate('/login')
  }


  /* =================================
     CLOSE MENUS
  ================================= */

  const closeMenus = () => {
    setMenuOpen(false)
    setProfileOpen(false)
  }


  /* =================================
     SCROLL TO HOME SECTION
  ================================= */

  const scrollToSection = (sectionId) => {

    setMenuOpen(false)
    setProfileOpen(false)

    const section = document.getElementById(sectionId)

    if (section) {

      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

    } else {

      navigate(`/#${sectionId}`)

    }
  }


  return (
    <header className="navbar">

      <div className="navbar-container">


        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenus}
        >

          <span className="logo-icon">
            T
          </span>

          <span className="brand-name">
            Travel

            <span className="brand-globe">
              <Globe2
                size={21}
                strokeWidth={2.3}
              />
            </span>

            rbit
          </span>

        </Link>


        {/* DESKTOP NAVIGATION */}

        <nav className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/packages">
            Packages
          </Link>

          <button
            type="button"
            className="navbar-section-link"
            onClick={() =>
              scrollToSection('destinations')
            }
          >
            Destinations
          </button>

          <button
            type="button"
            className="navbar-section-link"
            onClick={() =>
              scrollToSection('about')
            }
          >
            About
          </button>

        </nav>


        {/* DESKTOP ACTIONS */}

        <div className="navbar-actions">

          {!isAuthenticated ? (

            <>

              <Link
                to="/login"
                className="login-link"
              >
                <UserRound size={18} />
                Login
              </Link>

              <Link
                to="/register"
                className="register-button"
              >
                Get Started
              </Link>

            </>

          ) : (

            <div className="profile-wrapper">

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <span className="profile-icon">
                  <UserRound size={17} />
                </span>

                <span className="profile-name">
                  {user?.name}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? 'profile-chevron open'
                      : 'profile-chevron'
                  }
                />

              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div className="profile-dropdown">

                  <div className="profile-dropdown-header">

                    <div className="profile-dropdown-icon">
                      <UserRound size={20} />
                    </div>

                    <div>

                      <strong>
                        {user?.name}
                      </strong>

                      <small>
                        {user?.email}
                      </small>

                    </div>

                  </div>


                  <div className="profile-dropdown-divider" />


                  {/* CUSTOMER DASHBOARD */}

                  {user?.role === 'CUSTOMER' && (

                    <Link
                      to="/customer"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >

                      <LayoutDashboard size={17} />

                      <span>
                        Dashboard
                      </span>

                    </Link>

                  )}


                  {/* ADMIN DASHBOARD */}

                  {user?.role === 'ADMIN' && (

                    <Link
                      to="/admin"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >

                      <LayoutDashboard size={17} />

                      <span>
                        Admin Dashboard
                      </span>

                    </Link>

                  )}


                  {/* MY BOOKINGS */}

                  {user?.role === 'CUSTOMER' && (

                    <Link
                      to="/my-bookings"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >

                      <CalendarDays size={17} />

                      <span>
                        My Bookings
                      </span>

                    </Link>

                  )}


                  {/* SETTINGS */}

                  <Link
                    to="/settings"
                    className="profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >

                    <Settings size={17} />

                    <span>
                      Settings
                    </span>

                  </Link>


                  <div className="profile-dropdown-divider" />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="profile-dropdown-item profile-logout"
                    onClick={handleLogout}
                  >

                    <LogOut size={17} />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </div>

          )}

        </div>


        {/* MOBILE BUTTON */}

        <button
          type="button"
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >

          {menuOpen
            ? <X size={25} />
            : <Menu size={25} />
          }

        </button>

      </div>


      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="mobile-navigation">


          {/* HOME */}

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </Link>


          {/* PACKAGES */}

          <Link
            to="/packages"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Packages
          </Link>


          {/* DESTINATIONS */}

          <button
            type="button"
            className="mobile-section-link"
            onClick={() =>
              scrollToSection('destinations')
            }
          >
            Destinations
          </button>


          {/* ABOUT */}

          <button
            type="button"
            className="mobile-section-link"
            onClick={() =>
              scrollToSection('about')
            }
          >
            About
          </button>


          {!isAuthenticated ? (

            <>

              <Link
                to="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="mobile-register"
              >
                Get Started
              </Link>

            </>

          ) : (

            <div className="mobile-profile">


              {/* MOBILE PROFILE */}

              <div className="mobile-profile-user">

                <div className="profile-dropdown-icon">
                  <UserRound size={19} />
                </div>

                <div>

                  <strong>
                    {user?.name}
                  </strong>

                  <small>
                    {user?.email}
                  </small>

                </div>

              </div>


              {/* CUSTOMER DASHBOARD */}

              {user?.role === 'CUSTOMER' && (

                <Link
                  to="/customer"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >

                  <LayoutDashboard size={17} />

                  Dashboard

                </Link>

              )}


              {/* ADMIN DASHBOARD */}

              {user?.role === 'ADMIN' && (

                <Link
                  to="/admin"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >

                  <LayoutDashboard size={17} />

                  Admin Dashboard

                </Link>

              )}


              {/* MY BOOKINGS */}

              {user?.role === 'CUSTOMER' && (

                <Link
                  to="/my-bookings"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >

                  <CalendarDays size={17} />

                  My Bookings

                </Link>

              )}


              {/* SETTINGS */}

              <Link
                to="/settings"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <Settings size={17} />

                Settings

              </Link>


              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                Logout

              </button>

            </div>

          )}

        </div>

      )}

    </header>
  )
}

export default Navbar