import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function LedgerSheet({ ledger, deleteLedgerEntry, onBack }) {
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState('UNPAID');

  const filteredLedger = ledger.filter(entry => {
    if (filter === 'ALL') return true;
    const isPaid = !!entry.payment_id;
    if (filter === 'PAID') return isPaid;
    if (filter === 'UNPAID') return !isPaid;
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setLoadingId(id);
      await deleteLedgerEntry(id);
      setLoadingId(null);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'var(--bg-main)', zIndex: 50, overflowY: 'auto',
      display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '24px', borderBottom: '1px solid var(--glass-border)',
        width: '100%'
      }}>
        <button onClick={onBack} style={{ background: 'none', color: 'var(--text-main)', fontSize: '16px', padding: 0, width: 'auto', boxShadow: 'none' }}>
          ← Back
        </button>
        <h2 className="text-xl font-bold m-0" style={{ margin: 0 }}>Ledger Sheet</h2>
        <div style={{ width: '60px' }}></div>
      </div>
      
      <div style={{ padding: '16px 24px 0 24px', width: '100%' }}>
        <div className="flex gap-2 p-1" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
          {['ALL', 'UNPAID', 'PAID'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{ 
                flex: 1, padding: '10px', fontSize: '14px', borderRadius: '8px', 
                background: filter === f ? 'var(--primary-color)' : 'transparent', 
                color: filter === f ? '#fff' : 'var(--text-muted)', 
                boxShadow: filter === f ? '0 4px 12px var(--primary-glow)' : 'none'
              }}
            >
              {f === 'ALL' ? 'All' : f === 'UNPAID' ? 'Unpaid' : 'Paid'}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {filteredLedger.length === 0 ? (
          <div className="text-center text-muted" style={{ marginTop: '40px' }}>No entries found.</div>
        ) : (
          filteredLedger.map(entry => {
            const total = entry.quantity * entry.price;
            const isPaid = !!entry.payment_id;
            
            return (
              <div key={entry.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-semibold" style={{ fontSize: '18px' }}>{entry.item_name}</span>
                  <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span>{entry.quantity} @ ₹{entry.price}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  marginTop: '4px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' 
                }}>
                  <span style={{ 
                    fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', letterSpacing: '0.05em',
                    backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'var(--danger-glow)',
                    color: isPaid ? '#10b981' : 'var(--danger-color)'
                  }}>
                    {isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                  
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    disabled={loadingId === entry.id}
                    style={{ 
                      color: 'var(--danger-color)', background: 'none', 
                      padding: '4px', width: 'auto', boxShadow: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: loadingId === entry.id ? 0.5 : 1
                    }}
                    title="Delete Entry"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
