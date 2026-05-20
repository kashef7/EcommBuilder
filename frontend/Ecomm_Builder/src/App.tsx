import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import './App.css';

// Define service information interfaces
interface ServiceInfo {
  id: string;
  name: string;
  route: string;
  healthUrl: string;
  navPath: string;
  description: string;
  icon: React.ReactNode;
}

// 1. Service List with Configurations
const SERVICES: ServiceInfo[] = [
  {
    id: 'auth',
    name: 'Authentication Service',
    route: '/api/auth/*',
    healthUrl: '/api/auth/health',
    navPath: '/auth',
    description: 'Manages user identities, secure claims, and database access.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
      </svg>
    )
  },
  {
    id: 'products',
    name: 'Products Service',
    route: '/api/products/*',
    healthUrl: '/api/products/health',
    navPath: '/products',
    description: 'Publishes catalog inventories, descriptions, and ratings.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.699 2.479 0l4.318-4.318c.699-.699.699-1.78-.001-2.479l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    )
  },
  {
    id: 'shop',
    name: 'Shop Service',
    route: '/api/shop/*',
    healthUrl: '/api/shop/health',
    navPath: '/shop',
    description: 'Handles storefront parameters, merchants, and client carts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    )
  },
  {
    id: 'ordering',
    name: 'Ordering Service',
    route: '/api/ordering/*',
    healthUrl: '/api/ordering/health',
    navPath: '/ordering',
    description: 'Manages transaction workflows, receipts, and order states.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    )
  }
];

// Type representing connection status states
type ConnectionStatus = 'checking' | 'online' | 'offline';

// ==========================================
// HOME PAGE COMPONENT
// ==========================================
function HomePage() {
  const [statuses, setStatuses] = useState<Record<string, ConnectionStatus>>({
    auth: 'checking',
    products: 'checking',
    shop: 'checking',
    ordering: 'checking'
  });

  const checkAllStatuses = async () => {
    // Reset to checking
    setStatuses({
      auth: 'checking',
      products: 'checking',
      shop: 'checking',
      ordering: 'checking'
    });

    // Run parallel checks
    await Promise.all(
      SERVICES.map(async (service) => {
        try {
          const res = await fetch(service.healthUrl);
          if (res.ok) {
            setStatuses((prev) => ({ ...prev, [service.id]: 'online' }));
          } else {
            setStatuses((prev) => ({ ...prev, [service.id]: 'offline' }));
          }
        } catch (err) {
          setStatuses((prev) => ({ ...prev, [service.id]: 'offline' }));
        }
      })
    );
  };

  useEffect(() => {
    checkAllStatuses();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Service Connection Dashboard</h1>
        <p className="page-subtitle">
          Real-time check of all C# microservices running behind the Nginx API Gateway.
        </p>
      </div>

      <div className="actions-row">
        <button className="btn-primary" onClick={checkAllStatuses}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '1.1rem', height: '1.1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Re-test All Connections
        </button>
      </div>

      <div className="dashboard-grid">
        {SERVICES.map((service) => {
          const status = statuses[service.id];
          return (
            <Link key={service.id} to={service.navPath} className="status-card">
              <div className="status-card-header">
                <span className="nav-icon">{service.icon}</span>
                <div className={`status-indicator status-${status}`}>
                  <span className="status-dot"></span>
                  {status === 'checking' && 'Checking...'}
                  {status === 'online' && 'Online'}
                  {status === 'offline' && 'Offline'}
                </div>
              </div>
              <div>
                <h3 className="service-name">{service.name}</h3>
                <p style={{ fontSize: '14px', margin: '8px 0 12px 0', minHeight: '40px' }}>
                  {service.description}
                </p>
                <div className="service-route">{service.route}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

// ==========================================
// GENERIC SERVICE PAGE LOADER COMPONENT
// ==========================================
interface ServicePageProps {
  service: ServiceInfo;
}

function ServicePage({ service }: ServicePageProps) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const performConnectionTest = async () => {
    setLoading(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch(service.healthUrl);
      if (res.status === 200) {
        setSuccess(true);
      } else {
        throw new Error(`Non-200 Status Code returned: ${res.status} (${res.statusText})`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network request failed or timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performConnectionTest();
  }, [service.healthUrl]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{service.name} Tester</h1>
        <p className="page-subtitle">
          Pings the relative route through the API gateway.
        </p>
      </div>

      <div className="actions-row">
        <Link to="/" className="nav-item-link" style={{ padding: '8px 12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          ← Back to Dashboard
        </Link>
        <button className="btn-primary" onClick={performConnectionTest} disabled={loading} style={{ padding: '8px 16px', fontSize: '14px' }}>
          Test Again
        </button>
      </div>

      <div className="test-panel">
        <div className="panel-section">
          <span className="section-label">Target Route</span>
          <div className="service-route" style={{ fontSize: '15px', padding: '6px 12px' }}>
            GET {service.healthUrl}
          </div>
        </div>

        <div className="panel-section">
          <span className="section-label">Connection Status</span>
          
          {loading && (
            <div className="loading-indicator">
              <span className="spinner"></span>
              <span>Loading connection status...</span>
            </div>
          )}

          {!loading && success && (
            <div className="success-container">
              <h1 className="success-h1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Hello from {service.name.replace(' Service', '')} Service
              </h1>
              <p style={{ margin: 0, color: 'var(--success-color)', fontSize: '15px' }}>
                Gateway connection resolved and successfully connected to the backend microservice.
              </p>
            </div>
          )}

          {!loading && !success && (
            <div className="error-container">
              <h1 className="error-h1">
                Error: Cannot connect to Service {service.name.replace(' Service', '')}
              </h1>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--error-color)' }}>
                Gateway ping failed or backend service is unreachable.
              </p>
              <pre className="raw-error-box">{errorMsg}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ==========================================
// CORE LAYOUT & NAVIGATION WRAPPER
// ==========================================
export default function App() {
  return (
    <Router>
      <div className="dashboard-layout">
        {/* Sidebar Nav */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">EB</div>
            <h2 className="brand-name">EcommBuilder</h2>
          </div>

          <ul className="sidebar-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} end>
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </span>
                Dashboard
              </NavLink>
            </li>
            
            {SERVICES.map((service) => (
              <li key={service.id}>
                <NavLink to={service.navPath} className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">{service.icon}</span>
                  {service.name.replace(' Service', '')}
                </NavLink>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 'auto', fontSize: '12px', opacity: 0.5, borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            System Environment: .NET 10 & Nginx API Gateway
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {SERVICES.map((service) => (
              <Route
                key={service.id}
                path={service.navPath}
                element={<ServicePage service={service} />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
