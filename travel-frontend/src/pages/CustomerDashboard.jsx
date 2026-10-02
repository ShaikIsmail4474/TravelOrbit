import {
  CalendarDays,
  Compass,
  LogOut,
  User,
  ArrowRight
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function CustomerDashboard() {

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {

    logout()
    navigate('/login')

  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '50px 20px'
      }}
    >

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '35px'
          }}
        >

          <div>

            <p
              style={{
                margin: '0 0 7px',
                color: '#f59e0b',
                fontSize: '12px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Customer Dashboard
            </p>

            <h1
              style={{
                margin: '0 0 8px',
                color: '#172033',
                fontSize: '34px'
              }}
            >
              Welcome, {user?.name}!
            </h1>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              Manage your travel bookings and explore new journeys.
            </p>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              minHeight: '42px',
              padding: '0 16px',
              border: '1px solid #cbd5e1',
              borderRadius: '9px',
              background: 'white',
              color: '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>


        {/* ACCOUNT CARD */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '25px',
            padding: '22px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            background: 'white',
            boxShadow:
              '0 8px 25px rgba(15, 23, 42, 0.05)'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              flexShrink: 0,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#f59e0b'
            }}
          >
            <User size={24} />
          </div>


          <div>

            <h2
              style={{
                margin: '0 0 5px',
                color: '#172033',
                fontSize: '18px'
              }}
            >
              {user?.name}
            </h2>

            <p
              style={{
                margin: '0 0 5px',
                color: '#64748b',
                fontSize: '13px'
              }}
            >
              {user?.email}
            </p>

            <span
              style={{
                color: '#16a34a',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase'
              }}
            >
              Customer Account
            </span>

          </div>

        </div>


        {/* DASHBOARD ACTIONS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >

          {/* MY BOOKINGS */}

          <div
            style={{
              padding: '28px',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              background: 'white',
              boxShadow:
                '0 8px 25px rgba(15, 23, 42, 0.05)'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                marginBottom: '18px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb'
              }}
            >
              <CalendarDays size={23} />
            </div>

            <h2
              style={{
                margin: '0 0 8px',
                color: '#172033',
                fontSize: '20px'
              }}
            >
              My Bookings
            </h2>

            <p
              style={{
                margin: '0 0 22px',
                color: '#64748b',
                fontSize: '13px',
                lineHeight: '1.6'
              }}
            >
              View your travel bookings, dates, package details,
              and booking status.
            </p>

            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                minHeight: '42px',
                padding: '0 15px',
                border: 'none',
                borderRadius: '9px',
                background: '#172033',
                color: 'white',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              View My Bookings
              <ArrowRight size={16} />
            </button>

          </div>


          {/* EXPLORE PACKAGES */}

          <div
            style={{
              padding: '28px',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              background: 'white',
              boxShadow:
                '0 8px 25px rgba(15, 23, 42, 0.05)'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                marginBottom: '18px',
                borderRadius: '12px',
                background: '#fff7ed',
                color: '#f59e0b'
              }}
            >
              <Compass size={23} />
            </div>

            <h2
              style={{
                margin: '0 0 8px',
                color: '#172033',
                fontSize: '20px'
              }}
            >
              Explore Packages
            </h2>

            <p
              style={{
                margin: '0 0 22px',
                color: '#64748b',
                fontSize: '13px',
                lineHeight: '1.6'
              }}
            >
              Discover new destinations and find travel packages
              for your next journey.
            </p>

            <button
              type="button"
              onClick={() => navigate('/packages')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                minHeight: '42px',
                padding: '0 15px',
                border: 'none',
                borderRadius: '9px',
                background: '#172033',
                color: 'white',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Explore Packages
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CustomerDashboard
