"use client";

import React, { useEffect, useState } from 'react';
import { getSecurityLogsAction } from '@/app/actions';
import { SecurityLog } from '@/lib/mock-data';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await getSecurityLogsAction();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            BioTraceX — System Audit Ledger
          </h1>
          <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Real-time infrastructure access logs and protocol verification.
          </p>
        </header>

        {/* Dashboard Grid Card */}
        <div style={{ backgroundColor: '#161616', borderRadius: '8px', border: '1px solid #262626', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Compiling audit records...</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
              No security anomalies recorded. System pristine.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#1f1f1f', borderBottom: '1px solid #262626', color: '#aaa' }}>
                  <th style={{ padding: '1rem' }}>Log ID</th>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>Operator / Identity</th>
                  <th style={{ padding: '1rem' }}>Event Action</th>
                  <th style={{ padding: '1rem' }}>Protocol Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '1rem', color: '#888', fontFamily: 'monospace' }}>{log.id}</td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{log.userId}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontFamily: 'monospace', backgroundColor: '#222', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#00d2ff' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: log.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: log.status === 'Success' ? '#10b981' : '#ef4444',
                        border: log.status === 'Success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}