import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()

    setMessage('')
    setLoading(true)

    try {

      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        {
          email,
          password
        }
      )

      /*
       * Save user and JWT token
       * through AuthContext.
       */
      login(response.data)

      setMessage('Login successful!')

      console.log(
        'Login response:',
        response.data
      )

      /*
       * Login successful.
       * Navigate directly to Home page.
       */
      setTimeout(() => {
        navigate('/')
      }, 800)

    } catch (error) {

      console.error(
        'Login failed:',
        error
      )

      if (error.response?.status === 401) {

        setMessage(
          'Invalid email or password'
        )

      } else {

        setMessage(
          'Unable to connect to server'
        )

      }

      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-info">

          <div className="login-brand">
            Travel<span>Ease</span>
          </div>

          <h1>
            Explore the world,
            <br />
            one journey at a time.
          </h1>

          <p>
            Discover beautiful destinations, exciting travel packages,
            and unforgettable experiences.
          </p>

          <div className="login-feature">

            <span>✈️</span>

            <div>
              <strong>
                Discover Destinations
              </strong>

              <small>
                Find your next perfect getaway.
              </small>
            </div>

          </div>

          <div className="login-feature">

            <span>🏨</span>

            <div>
              <strong>
                Easy Travel Planning
              </strong>

              <small>
                Choose packages that suit your journey.
              </small>
            </div>

          </div>

          <div className="login-feature">

            <span>🌎</span>

            <div>
              <strong>
                Unforgettable Experiences
              </strong>

              <small>
                Make every trip memorable.
              </small>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-card">

          <div className="login-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue your journey
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            autoComplete="off"
          >

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
                autoComplete="off"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

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
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
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


            {/* MESSAGE */}

            {message && (
              <div
                className={
                  message === 'Login successful!'
                    ? 'login-message success'
                    : 'login-message error'
                }
              >
                {message}
              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign In'}
            </button>

          </form>


          {/* REGISTER LINK */}

          <div className="login-footer">

            <p>
              Don't have an account?{' '}

              <span
                onClick={() =>
                  navigate('/register')
                }
              >
                Register here
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login