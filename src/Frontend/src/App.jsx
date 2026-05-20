import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to establish tunnel connection.');
        setLoading(false);
      });
  }, [retryCount]);

  // LOADING STATE
  if (loading) {
    return (
      <div style={styles.fullscreenContainer}>
        <div className="glass-panel" style={styles.loaderCard}>
          <div className="glow-indicator-loading" style={styles.largeIndicator}></div>
          <h2 style={styles.loaderText}>Connecting to Monolith Backend...</h2>
          <p style={styles.subLoaderText}>Locating gateway at /api/health ...</p>
          <div style={styles.progressTrack}>
            <div style={styles.progressBar}></div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR / FAILURE STATE
  if (error) {
    return (
      <div style={styles.fullscreenContainer}>
        <div className="glass-panel" style={styles.errorCard}>
          <div className="glow-indicator-error" style={styles.largeIndicator}></div>
          <h1 style={styles.errorTitle}>Consolidation Interface Offline</h1>
          <p style={styles.errorDesc}>
            The React container was unable to communicate with the monolithic backend endpoint.
          </p>
          <div style={styles.errorLogs}>
            <span style={{ color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>[CRITICAL_ERR] {error}</span>
          </div>
          <div style={styles.troubleshootBox}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Troubleshooting Checklist:</h4>
            <ul style={styles.troubleshootList}>
              <li>Verify the Kubernetes Pods are running via <code>kubectl get pods</code>.</li>
              <li>Ensure the database migrations are complete and PostgreSQL is online.</li>
              <li>Verify the Service is exposed via the external LoadBalancer on Port 80.</li>
            </ul>
          </div>
          <button style={styles.retryButton} onClick={() => setRetryCount(c => c + 1)}>
            Re-Attempt Handshake
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS / FULL DASHBOARD STATE
  const isDbHealthy = healthData?.database?.status === 'Healthy';

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <header style={styles.header} className="glass-panel">
        <div style={styles.headerBrand}>
          <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <div>
            <h3 style={styles.headerTitle}>ECOMM-MONOLITH</h3>
            <p style={styles.headerSubtitle}>Unified Control & Telemetry Panel</p>
          </div>
        </div>
        
        <div style={styles.clusterTag}>
          <span style={styles.pulsePoint}></span>
          <span style={{ fontSize: '12px', letterSpacing: '0.05em' }}>K8s CLUSTER: KashefUbuntu</span>
        </div>
      </header>

      {/* CORE HERO SECTION */}
      <main style={styles.main}>
        <div className="glass-panel" style={styles.heroCard}>
          <div style={styles.heroBadge}>Consolidation Verified</div>
          
          {/* THE MANDATORY MONOLITHIC GREETING */}
          <h1 className="gradient-text-rainbow" style={styles.greetingTitle}>
            Hello from the Unified Monolithic System!
          </h1>
          
          <p style={styles.heroDescription}>
            Your e-commerce backend and frontend have been successfully consolidated into a single container monolith.
            Inter-service latency has been reduced to zero, database connections are pooled natively, and your cluster 
            grid routing is fully operational.
          </p>
        </div>

        {/* STATUS GRID */}
        <section style={styles.statusGrid}>
          {/* SYSTEM HEALTH CARD */}
          <div className="glass-panel" style={styles.gridCard}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>Monolith Core Health</h4>
              <div className="glow-indicator-healthy"></div>
            </div>
            <div style={styles.statusValue}>ONLINE</div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Endpoint:</span>
              <code style={styles.code}>/api/health</code>
            </div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Response:</span>
              <span style={{ color: 'var(--accent-emerald)' }}>HTTP 200 OK</span>
            </div>
          </div>

          {/* DATABASE HEALTH CARD */}
          <div className="glass-panel" style={styles.gridCard}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>PostgreSQL Grid Connection</h4>
              <div className={isDbHealthy ? "glow-indicator-healthy" : "glow-indicator-error"}></div>
            </div>
            <div style={styles.statusValue}>{isDbHealthy ? "CONNECTED" : "OFFLINE"}</div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Host:</span>
              <code style={styles.code}>postgres-db:5432</code>
            </div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Details:</span>
              <span style={{ color: isDbHealthy ? 'var(--accent-cyan)' : 'var(--accent-rose)', fontSize: '13px' }}>
                {healthData?.database?.details || 'Database ping check failed.'}
              </span>
            </div>
          </div>

          {/* DOCKER BUILD METADATA */}
          <div className="glass-panel" style={styles.gridCard}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>Container Topology</h4>
              <div style={styles.glowCyan}></div>
            </div>
            <div style={styles.statusValue}>SINGLE CONTAINER</div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Base Image:</span>
              <code style={styles.code}>dotnet:10.0-aspnet</code>
            </div>
            <div style={styles.statusDetail}>
              <span style={styles.label}>Web Server:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Kestrel Engine</span>
            </div>
          </div>
        </section>

        {/* METRICS & RAW RESPONSE */}
        <section style={styles.detailsGrid}>
          {/* ARCHITECTURE BLOCK */}
          <div className="glass-panel" style={styles.detailsCard}>
            <h4 style={styles.detailsCardTitle}>Consolidation Topology Map</h4>
            <p style={styles.detailsText}>
              Previously, this application operated as four distinct microservices: 
              <strong> Auth_Service</strong>, <strong>Products_Service</strong>, <strong>Ordering_Service</strong>, 
              and <strong>Shop_Service</strong>, each requiring separate deployment pods, internal networking routing, and cluster IP overhead.
            </p>
            <p style={styles.detailsText}>
              In this single-container monolithic setup, requests to port <code>80</code> are handled directly by the compiled C# engine. 
              The React SPA files are served statically from the <code>wwwroot/</code> folder, while Web API operations are instantly routed 
              internally inside the process grid under <code>/api/*</code>.
            </p>
          </div>

          {/* API INSPECTOR */}
          <div className="glass-panel" style={styles.detailsCard}>
            <h4 style={styles.detailsCardTitle}>Live API Gateway response</h4>
            <pre style={styles.codeBlock}>
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>EcommBuilder Monolith Console • Powered by .NET 10 & React • kashef7 Repository</p>
      </footer>
    </div>
  );
}

// INLINE STYLING SYSTEM
const styles = {
  fullscreenContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '24px',
    background: 'var(--bg-primary)',
  },
  loaderCard: {
    maxWidth: '480px',
    width: '100%',
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginTop: '24px',
    marginBottom: '8px',
  },
  subLoaderText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
    fontFamily: 'var(--font-mono)',
  },
  progressTrack: {
    width: '100%',
    height: '4px',
    backgroundColor: '#1f1f23',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    width: '40%',
    height: '100%',
    backgroundColor: 'var(--accent-purple)',
    borderRadius: '2px',
    animation: 'shine 1.5s infinite linear',
    backgroundImage: 'linear-gradient(90deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
  },
  largeIndicator: {
    width: '20px',
    height: '20px',
  },
  errorCard: {
    maxWidth: '560px',
    width: '100%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '20px',
    marginBottom: '12px',
  },
  errorDesc: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  errorLogs: {
    width: '100%',
    backgroundColor: '#141416',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'left',
    marginBottom: '24px',
    fontSize: '13px',
  },
  troubleshootBox: {
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#18181b',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '28px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  troubleshootList: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    paddingLeft: '16px',
    lineHeight: '1.8',
  },
  retryButton: {
    backgroundColor: 'var(--accent-purple)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
    transition: 'all 0.2s',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    width: '28px',
    height: '28px',
    color: 'var(--accent-purple)',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    color: 'var(--text-primary)',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  clusterTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#18181b',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '6px 14px',
    color: 'var(--text-secondary)',
  },
  pulsePoint: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-cyan)',
    boxShadow: '0 0 10px var(--accent-cyan)',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroCard: {
    padding: '48px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.05), rgba(24, 24, 27, 0.7))',
  },
  heroBadge: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--accent-cyan)',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  greetingTitle: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: '1.2',
    maxWidth: '800px',
  },
  heroDescription: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '720px',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  gridCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  statusDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '10px',
  },
  label: {
    color: 'var(--text-secondary)',
  },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    backgroundColor: '#141416',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  glowCyan: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-cyan)',
    boxShadow: '0 0 15px var(--accent-cyan)',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
  },
  detailsCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detailsCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '12px',
  },
  detailsText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  codeBlock: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    backgroundColor: '#0c0c0e',
    color: '#e4e4e7',
    padding: '16px',
    borderRadius: '8px',
    overflowX: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    maxHeight: '260px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px 0',
    color: '#52525b',
    fontSize: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
  },
};
