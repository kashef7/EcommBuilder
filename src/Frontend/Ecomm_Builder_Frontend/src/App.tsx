import { useState, useEffect, useCallback } from 'react'
import './App.css'

type Status = 'checking' | 'online' | 'offline'

interface ServiceCheck {
  name: string
  endpoint: string
  description: string
}

const AppUrl = import.meta.env.VITE_BACK_END_BASE_URL|| ""




const SERVICES: ServiceCheck[] = [
  {
    name: 'API Backend',
    endpoint: `${AppUrl}/api/health`,
    description: '.NET Web API',
  },
]

function useHealthCheck(endpoint: string, intervalMs = 8000) {
  const [status, setStatus] = useState<Status>('checking')
  const [latency, setLatency] = useState<number | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [message, setMessage] = useState<string>('')

  const check = useCallback(async () => {
    setStatus('checking')
    const start = performance.now()
    try {
      const res = await fetch(endpoint, { cache: 'no-store' })
      const elapsed = Math.round(performance.now() - start)
      const text = await res.text()
      if (res.ok) {
        setStatus('online')
        setLatency(elapsed)
        setMessage(text)
      } else {
        setStatus('offline')
        setLatency(elapsed)
        setMessage(`HTTP ${res.status}`)
      }
    } catch {
      setStatus('offline')
      setLatency(null)
      setMessage('Unreachable')
    }
    setLastChecked(new Date())
  }, [endpoint])

  useEffect(() => {
    check()
    const id = setInterval(check, intervalMs)
    return () => clearInterval(id)
  }, [check, intervalMs])

  return { status, latency, lastChecked, message, refresh: check }
}

/* Single service card — owns its own health-check hook */
function ServiceCard({ service }: { service: ServiceCheck }) {
  const { status, latency, lastChecked, message, refresh } = useHealthCheck(service.endpoint)

  const latencyClass =
    latency === null ? '' :
    latency < 200 ? 'stat__value--fast' :
    latency < 600 ? 'stat__value--mid'  : 'stat__value--slow'

  const id = service.name.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className={`card card--${status}`} id={`card-${id}`}>
      <div className="card__header">
        <div className="card__indicator">
          <span className={`dot dot--${status}`} />
          {status === 'checking' && <span className="pulse" />}
        </div>
        <div className="card__title-group">
          <h2 className="card__name">{service.name}</h2>
          <span className="card__desc">{service.description}</span>
        </div>
        <span className={`badge badge--${status}`}>
          {status === 'checking' ? 'Checking…' : status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="card__body">
        <div className="stat">
          <span className="stat__label">Endpoint</span>
          <code className="stat__value">{service.endpoint}</code>
        </div>
        <div className="stat">
          <span className="stat__label">Response</span>
          <code className="stat__value stat__value--response">{message || '—'}</code>
        </div>
        <div className="stat">
          <span className="stat__label">Latency</span>
          <span className={`stat__value ${latencyClass}`}>
            {latency !== null ? `${latency} ms` : '—'}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Last Check</span>
          <span className="stat__value">
            {lastChecked ? lastChecked.toLocaleTimeString() : '—'}
          </span>
        </div>
      </div>

      <div className="card__footer">
        <button className="refresh-btn" onClick={refresh} id={`refresh-${id}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  )
}

/* Overall status — one hook per service, all at top level */
function OverallBadge() {
  // Fixed number of hooks — one per entry in SERVICES (no dynamic hooks in loops)
  const check0 = useHealthCheck(SERVICES[0].endpoint)

  const checks = [check0]
  const allOnline   = checks.every(c => c.status === 'online')
  const anyChecking = checks.some(c  => c.status === 'checking')

  const cls   = anyChecking ? 'checking' : allOnline ? 'online' : 'offline'
  const label = anyChecking ? 'Initialising…' : allOnline ? 'All Systems Operational' : 'Service Degraded'

  return (
    <div className={`overall overall--${cls}`} id="overall-status">
      <span className={`dot dot--${cls} dot--lg`} />
      {anyChecking && <span className="pulse pulse--lg" />}
      <span className="overall__label">{label}</span>
    </div>
  )
}

export default function App() {
  const [uptime] = useState(() => new Date())

  return (
    <div className="layout">
      <header className="header">
        <div className="header__brand">
          <svg className="header__logo" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <div>
            <span className="header__title">EcommBuilder</span>
            <span className="header__subtitle">System Status</span>
          </div>
        </div>

        <OverallBadge />

        <div className="header__meta">
          <span className="header__since">Dashboard up since {uptime.toLocaleTimeString()}</span>
        </div>
      </header>

      <main className="main">
        <section className="section">
          <h1 className="section__heading">Service Health</h1>
          <p className="section__sub">Live status checks — auto-refreshed every 8 s</p>
          <div className="grid">
            {SERVICES.map(s => (
              <ServiceCard key={s.name} service={s} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>EcommBuilder Control Console · Polls <code>/api/health</code> every 8 s</span>
      </footer>
    </div>
  )
}
