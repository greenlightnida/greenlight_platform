import React, { useEffect, useState } from 'react';

const REPORT_PATH = '/CUSTODIAN_REPORT.json';

interface CustodialReport {
  fileManagement?: {
    scanReport?: Record<string, unknown>;
    cleanupRecommended?: boolean;
    cleanupApprovalPresent?: boolean;
    cleanupResult?: string;
  };
  recommendations?: string[];
}

const Operations: React.FC = () => {
  const [report, setReport] = useState<CustodialReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'none' | 'approved' | 'error'>('none');

  useEffect(() => {
    fetch(REPORT_PATH)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch report');
        return res.json();
      })
      .then(setReport)
      .catch((error: Error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const approveCleanup = async () => {
    try {
      const res = await fetch('/api/approve-cleanup', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve cleanup');
      setApprovalStatus('approved');
    } catch {
      setApprovalStatus('error');
    }
  };

  if (loading) return <div>Loading custodial report...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!report) return <div>No custodial report found.</div>;

  const fm = report.fileManagement || {};
  const scan = fm.scanReport || {};

  return (
    <div style={{ padding: 32 }}>
      <h1>Operations Dashboard</h1>
      <h2>Custodial File Hygiene Report</h2>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>
        {JSON.stringify(scan, null, 2)}
      </pre>
      <h3>Status</h3>
      <ul>
        <li>Cleanup recommended: <b>{fm.cleanupRecommended ? 'YES' : 'NO'}</b></li>
        <li>Approval present: <b>{fm.cleanupApprovalPresent ? 'YES' : 'NO'}</b></li>
        <li>Recommendations: <ul>{(report.recommendations || []).map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></li>
      </ul>
      {fm.cleanupRecommended && !fm.cleanupApprovalPresent && (
        <button onClick={approveCleanup} disabled={approvalStatus === 'approved'}>
          {approvalStatus === 'approved' ? 'Approval Granted' : 'Approve Ruthless Cleanup'}
        </button>
      )}
      {approvalStatus === 'error' && <div style={{ color: 'red' }}>Failed to approve cleanup. Check server logs.</div>}
      {fm.cleanupResult && (
        <div>
          <h3>Cleanup Result</h3>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>{fm.cleanupResult}</pre>
        </div>
      )}
    </div>
  );
};

export default Operations; 