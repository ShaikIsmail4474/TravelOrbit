import {
  User,
  Mail,
  ShieldCheck,
  LockKeyhole
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { useAuth } from '../context/AuthContext'

import '../styles/settings.css'

function Settings() {

  const { user } = useAuth()

  return (
    <>
      <Navbar />

      <main className="settings-page">

        <section className="settings-header">

          <div className="container">

            <span className="section-eyebrow">
              Account Settings
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Manage your account information and security settings.
            </p>

          </div>

        </section>


        <section className="settings-section">

          <div className="container">

            <div className="settings-grid">

              {/* PROFILE INFORMATION */}

              <div className="settings-card">

                <div className="settings-card-header">

                  <div className="settings-card-icon">
                    <User size={21} />
                  </div>

                  <div>

                    <h2>
                      Profile Information
                    </h2>

                    <p>
                      Your account details
                    </p>

                  </div>

                </div>


                <div className="settings-info-list">

                  {/* NAME */}

                  <div className="settings-info-item">

                    <div className="settings-info-icon">
                      <User size={17} />
                    </div>

                    <div>

                      <small>
                        Full Name
                      </small>

                      <strong>
                        {user?.name || '-'}
                      </strong>

                    </div>

                  </div>


                  {/* EMAIL */}

                  <div className="settings-info-item">

                    <div className="settings-info-icon">
                      <Mail size={17} />
                    </div>

                    <div>

                      <small>
                        Email Address
                      </small>

                      <strong>
                        {user?.email || '-'}
                      </strong>

                    </div>

                  </div>


                  {/* ROLE */}

                  <div className="settings-info-item">

                    <div className="settings-info-icon">
                      <ShieldCheck size={17} />
                    </div>

                    <div>

                      <small>
                        Account Type
                      </small>

                      <strong>
                        {user?.role || '-'}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>


              {/* SECURITY */}

              <div className="settings-card">

                <div className="settings-card-header">

                  <div className="settings-card-icon">
                    <LockKeyhole size={21} />
                  </div>

                  <div>

                    <h2>
                      Security
                    </h2>

                    <p>
                      Manage your account security
                    </p>

                  </div>

                </div>


                <div className="settings-security-content">

                  <div className="settings-security-item">

                    <div>

                      <strong>
                        Password
                      </strong>

                      <p>
                        Your password is securely protected.
                      </p>

                    </div>

                    <span className="settings-security-badge">
                      Protected
                    </span>

                  </div>


                  <div className="settings-security-item">

                    <div>

                      <strong>
                        Authentication
                      </strong>

                      <p>
                        Your account uses secure JWT authentication.
                      </p>

                    </div>

                    <span className="settings-security-badge">
                      Active
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* INFORMATION NOTE */}

            <div className="settings-note">

              <ShieldCheck size={19} />

              <p>
                Your account information is securely stored.
                Passwords are never displayed on this page.
              </p>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Settings
