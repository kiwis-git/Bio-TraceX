import { TrackingChart } from "@/components/charts/tracking-chart";

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <style>{`
        /* Desktop view: Hide mobile components */
        .mobile-only-analytics {
          display: none;
        }
        .desktop-only-analytics {
          display: block;
        }

        /* Mobile view: Hide desktop components, show custom layout */
        @media (max-width: 768px) {
          .desktop-only-analytics {
            display: none !important;
          }
          .mobile-only-analytics {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .mobile-card {
            background-color: #161616;
            border: 1px solid #262626;
            border-radius: 8px;
            padding: 1rem;
          }
          .metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          /* Circular Progress */
          .progress-ring {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            position: relative;
          }
          .progress-ring-circle {
            fill: transparent;
            stroke: #262626;
            stroke-width: 8;
          }
          .progress-ring-value {
            fill: transparent;
            stroke: #10b981; /* Emerald green for integrity */
            stroke-width: 8;
            stroke-dasharray: 314;
            stroke-dashoffset: 2; /* 99.4% full */
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dashoffset 1s ease-in-out;
          }
        }
      `}</style>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Analytics & Movement Tracking</h1>
        <p className="text-muted-foreground mt-2">Comprehensive data visualizations for sample statuses globally.</p>
      </div>

      <div className="desktop-only-analytics grid gap-6">
        <TrackingChart />
      </div>

      <div className="mobile-only-analytics">
        {/* Hero Metric Card */}
        <div className="mobile-card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Chain-of-Custody Integrity
          </h2>
          <div className="progress-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle className="progress-ring-circle" cx="60" cy="60" r="50" />
              <circle className="progress-ring-value" cx="60" cy="60" r="50" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
              99.4%
            </div>
          </div>
          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '1rem' }}>
            Global integrity maintained across all tracking points.
          </p>
        </div>

        {/* Supporting Metrics Grid */}
        <div className="metric-grid">
          <div className="mobile-card">
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Samples</p>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>78</p>
          </div>
          <div className="mobile-card">
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Active Alerts</p>
            <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>6</p>
          </div>
          <div className="mobile-card">
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>In Transit</p>
            <p style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>12</p>
          </div>
          <div className="mobile-card">
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Avg. Turnaround</p>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>14.2m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
