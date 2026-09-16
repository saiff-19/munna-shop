import { useState } from 'react';

// Basic Bottom Sheet wrapper
export function BottomSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AddMilkModal({ isOpen, onClose, profile, addLedgerEntry }) {
  const [type, setType] = useState('TON');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qty || isNaN(qty)) return;
    setLoading(true);
    
    const price = type === 'TON' ? profile.ton_price : profile.full_cream_price;
    
    await addLedgerEntry({
      item_name: `${type} Milk`,
      item_type: type,
      quantity: parseFloat(qty),
      price: price,
      date: date
    });
    
    setLoading(false);
    setQty('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Milk">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="TON">TON (₹{profile?.ton_price})</option>
            <option value="FULL_CREAM">Full Cream (₹{profile?.full_cream_price})</option>
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" step="0.5" value={qty} onChange={e => setQty(e.target.value)} required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary mt-4" disabled={loading}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </BottomSheet>
  );
}

export function AddOtherModal({ isOpen, onClose, addLedgerEntry }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || isNaN(price) || !qty || isNaN(qty)) return;
    setLoading(true);
    
    await addLedgerEntry({
      item_name: name,
      item_type: 'OTHER',
      quantity: parseFloat(qty),
      price: parseFloat(price),
      date: date
    });
    
    setLoading(false);
    setName('');
    setPrice('');
    setQty('1');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Other Item">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Item Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="flex gap-4">
          <div style={{ flex: 1 }}>
            <label>Price</label>
            <input type="number" step="0.5" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Quantity</label>
            <input type="number" step="0.5" value={qty} onChange={e => setQty(e.target.value)} required />
          </div>
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary mt-4" disabled={loading}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </BottomSheet>
  );
}

export function SettingsModal({ isOpen, onClose, profile, updatePrices }) {
  const [ton, setTon] = useState('');
  const [fc, setFc] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize state when modal opens or profile changes
  useState(() => {
    if (profile) {
      setTon(profile.ton_price);
      setFc(profile.full_cream_price);
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updatePrices(parseFloat(ton), parseFloat(fc));
    setLoading(false);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Settings">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>TON Price</label>
          <input type="number" step="0.5" value={ton} onChange={e => setTon(e.target.value)} required />
        </div>
        <div>
          <label>Full Cream Price</label>
          <input type="number" step="0.5" value={fc} onChange={e => setFc(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary mt-4" disabled={loading}>
          {loading ? 'Updating...' : 'Update Prices'}
        </button>
      </form>
    </BottomSheet>
  );
}

export function PaymentModal({ isOpen, onClose, unpaidEntries, settlePayment }) {
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;

  const total = unpaidEntries.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Find dates
  const dates = unpaidEntries.map(e => new Date(e.date));
  const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString() : '';
  const maxDate = dates.length ? new Date().toLocaleDateString() : ''; // up to today

  const handleSubmit = async () => {
    setLoading(true);
    const unpaidIds = unpaidEntries.map(e => e.id);
    const from_date = new Date(Math.min(...dates)).toISOString().split('T')[0];
    const to_date = new Date().toISOString().split('T')[0];
    
    await settlePayment(total, from_date, to_date, unpaidIds);
    setLoading(false);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Confirm Payment">
      <div className="flex flex-col gap-4">
        <div className="glass-panel p-4 text-center">
          <div className="text-muted mb-2">Total Amount</div>
          <div className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>₹{total.toFixed(2)}</div>
        </div>
        <div className="text-center text-sm text-muted mb-4">
          Settling entries from <br/>
          <span className="font-bold">{minDate}</span> to <span className="font-bold">{maxDate}</span>
        </div>
        
        <button onClick={handleSubmit} className="btn-primary" disabled={loading || total === 0}>
          {loading ? 'Processing...' : 'Mark as Paid'}
        </button>
      </div>
    </BottomSheet>
  );
}
