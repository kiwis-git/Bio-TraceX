import React from 'react';
import Link from 'next/link';

// 1. FIXED: Added the 'export' keyword right here so layout.tsx can find it!
export function Sidebar() {
  return (
    <div className="sidebar-container">
      {/* Your logo block */}
      <div className="sidebar-logo" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem' }}>
        🧪 BioTraceX
      </div>

      {/* Your navigation links */}
      <nav style={{ display: 'flex', flexDirection: 'inherit', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#333' }}>
          <span>Dashboard</span>
        </Link>
        <Link href="/tracking" style={{ textDecoration: 'none', color: '#333' }}>
          <span>Sample Tracking</span>
        </Link>
        <Link href="/admin/logs" style={{ textDecoration: 'none', color: '#333' }}>
          <span>Security Logs</span>
        </Link>
      </nav>

      {/* 2. YOUR RESPONSIBLE CSS: Embedded cleanly right inside the component frame */}
      <style>{`
        .sidebar-container {
          width: 260px;
          border-right: 1px solid #eaeaea;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          background-color: #f9f9f9;
        }

        /* 📱 Mobile UI Morph */
        @media (max-width: 768px) {
          .sidebar-container {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #eaeaea;
            padding: 0.75rem 1rem;
            flex-direction: row; 
            align-items: center;
            justify-content: space-between;
          }
          
          .sidebar-logo {
            margin-bottom: 0 !important;
          }

          .sidebar-container a span {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}