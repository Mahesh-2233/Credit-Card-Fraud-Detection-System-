import React, { useState } from 'react';
import axios from 'axios';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Activity,
  History,
  DollarSign
} from 'lucide-react';

const CATEGORIES = ['Grocery', 'Electronics', 'Luxury', 'Travel', 'Gas', 'Pharmacy', 'Restaurant'];

function App() {
  const [formData, setFormData] = useState({
    user_id: 1001,
    amount: 50.00,
    merchant_category: 'Grocery',
    hour_of_day: 12,
    is_international: 0,
    avg_user_spend: 45.00
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        ...formData,
        amount: parseFloat(formData.amount),
        avg_user_spend: parseFloat(formData.avg_user_spend),
        hour_of_day: parseInt(formData.hour_of_day),
        is_international: parseInt(formData.is_international)
      });

      const newResult = { ...formData, ...response.data, id: Date.now() };
      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    } catch (error) {
      alert("Error: Make sure the backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>Credit Card Fraud Detection System</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}> Fraud Analysis Tool</p>
        </div>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* INPUT FORM */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} color="#00f2fe" /> New Transaction
          </h3>
          <form onSubmit={handleCheck} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>User ID</label>
                <input type="number" className="input-field" value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>Amount ($)</label>
                <input type="number" className="input-field" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>Category</label>
              <select className="input-field" value={formData.merchant_category} onChange={e => setFormData({ ...formData, merchant_category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>Hour (0-23)</label>
                <input type="number" className="input-field" value={formData.hour_of_day} onChange={e => setFormData({ ...formData, hour_of_day: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>Avg. History ($)</label>
                <input type="number" className="input-field" value={formData.avg_user_spend} onChange={e => setFormData({ ...formData, avg_user_spend: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input type="checkbox" checked={formData.is_international === 1} onChange={e => setFormData({ ...formData, is_international: e.target.checked ? 1 : 0 })} />
              <label style={{ fontSize: '0.9rem' }}>International Transaction?</label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Analyzing..." : "Check for Fraud"}
            </button>
          </form>
        </div>

        {/* ANALYSIS RESULT */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {!result ? (
            <div style={{ opacity: 0.3 }}>
              <Activity size={48} style={{ marginBottom: '1rem' }} />
              <p>Enter data to start analysis</p>
            </div>
          ) : (
            <>
              <div className={`status-icon icon-${result.status.toLowerCase()}`}>
                {result.status === 'Fraud' ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
              </div>
              <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>{result.status}</h2>

              <p style={{
                marginTop: '1rem',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: result.status === 'Fraud' ? '#ff4b2b' : '#00ff87',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {result.status === 'Fraud' ? 'Risky' : 'Non-risky'}
              </p>

              <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', fontSize: '0.9rem' }}>
                <div style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <p style={{ opacity: 0.5 }}>Details</p>
                  <p>Amt: ${result.amount}</p>
                  <p>Cat: {result.merchant_category}</p>
                </div>
                <div style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <p style={{ opacity: 0.5 }}>Behavior</p>
                  <p>History: ${result.avg_user_spend}</p>
                  <p>Time: {result.hour_of_day}:00</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} /> Recent Checks
        </h3>
        <table className="transaction-table">
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.5, fontSize: '0.8rem' }}>
              <th>ID</th>
              <th>AMOUNT</th>
              <th>CATEGORY</th>
              <th>RISK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx) => (
              <tr key={tx.id} className="transaction-row">
                <td style={{ opacity: 0.6 }}>#{tx.id.toString().slice(-5)}</td>
                <td style={{ fontWeight: 700 }}>${tx.amount}</td>
                <td>{tx.merchant_category}</td>
                <td>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: tx.status === 'Fraud' ? '#ff4b2b' : '#00ff87'
                  }}>
                    {tx.status === 'Fraud' ? 'Risky' : 'Non-risky'}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${tx.status.toLowerCase()}`}>
                    {tx.status === 'Fraud' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                    <span style={{ marginLeft: 5 }}>{tx.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
