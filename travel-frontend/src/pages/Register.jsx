import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Register.css'

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword

  const handleRegister = async (e) => {

    e.preventDefault()

    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)

    try {

      const response = await api.post(
        '/auth/register',
        {
          name,
          email,
          password
        }
      )

      console.log(
        'Registration response:',
        response.data
      )

      setMessage(
        'Registration successful! Redirecting to sign in...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {

      console.error(
        'Registration failed:',
        error
      )

      if (error.response?.status === 409) {

        setMessage(
          'Email already exists'
        )

      } else if (error.response?.data?.message) {

        setMessage(
          error.response.data.message
        )

      } else {

        setMessage(
          'Unable to register. Please try again.'
        )

      }

      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      <div className="register-container">

        {/* LEFT SIDE */}

        <div className="register-info">

          <div className="register-brand">
            Travel<span>Ease</span>
          </div>

          <h1>
            Start your next
            <br />
            adventure today.
          </h1>

          <p>
            Create your account and discover beautiful destinations,
            exciting travel packages, and unforgettable experiences.
          </p>

          <div className="register-feature">

            <span>🌴</span>

            <div>
              <strong>
                Explore Destinations
              </strong>

              <small>
                Discover amazing places around the world.
              </small>
            </div>

          </div>

          <div className="register-feature">

            <span>✈️</span>

            <div>
              <strong>
                Plan Your Journey
              </strong>

              <small>
                Find travel packages made for you.
              </small>
            </div>

          </div>

          <div className="register-feature">

            <span>🌎</span>

            <div>
              <strong>
                Create Memories
              </strong>

              <small>
                Make every journey special.
              </small>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="register-card">

          <div className="register-header">

            <h2>
              Create Account
            </h2>

            <p>
              Join TravelEase and start exploring
            </p>

          </div>


          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  minLength="6"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword
                    ? '🙈'
                    : '👁️'}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  minLength="6"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword
                    ? '🙈'
                    : '👁️'}
                </button>

              </div>


              {/* PASSWORD MATCH MESSAGE */}

              {passwordsDoNotMatch && (
                <div className="password-status error">
                  ❌ Passwords do not match
                </div>
              )}

              {passwordsMatch && (
                <div className="password-status success">
                  ✅ Passwords match
                </div>
              )}

            </div>


            {/* GENERAL MESSAGE */}

            {message && (
              <div
                className={
                  message.startsWith(
                    'Registration successful'
                  )
                    ? 'register-message success'
                    : 'register-message error'
                }
              >
                {message}
              </div>
            )}


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={
                loading ||
                passwordsDoNotMatch
              }
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>


          {/* LOGIN LINK */}

          <div className="register-footer">

            <p>
              Already have an account?{' '}

              <span
                onClick={() =>
                  navigate('/login')
                }
              >
                Sign in
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register