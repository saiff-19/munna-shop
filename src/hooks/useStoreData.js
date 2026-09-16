import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export function useStoreData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) console.error('Error fetching profile:', error);
    else setProfile(data);
  }, [user]);

  const fetchLedger = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ledger')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching ledger:', error);
    else setLedger(data || []);
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchProfile(), fetchLedger()]).finally(() => setLoading(false));
    } else {
      setProfile(null);
      setLedger([]);
      setLoading(false);
    }
  }, [user, fetchProfile, fetchLedger]);

  const updatePrices = async (ton_price, full_cream_price) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ton_price, full_cream_price, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (!error) await fetchProfile();
    return { error };
  };

  const addLedgerEntry = async (entry) => {
    const { error } = await supabase
      .from('ledger')
      .insert([{ ...entry, user_id: user.id }]);
    if (!error) await fetchLedger();
    return { error };
  };

  const deleteLedgerEntry = async (id) => {
    const { error } = await supabase
      .from('ledger')
      .delete()
      .eq('id', id);
    if (!error) await fetchLedger();
    return { error };
  };

  const settlePayment = async (amount, from_date, to_date, unpaidEntryIds) => {
    // Start by inserting the payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: user.id,
        amount,
        from_date,
        to_date,
        paid_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (paymentError) return { error: paymentError };

    // Update all unpaid entries with the new payment_id
    const { error: ledgerError } = await supabase
      .from('ledger')
      .update({ payment_id: paymentData.id })
      .in('id', unpaidEntryIds);

    if (ledgerError) return { error: ledgerError };
    
    await fetchLedger();
    return { error: null };
  };

  return {
    profile,
    ledger,
    loading,
    refreshLedger: fetchLedger,
    updatePrices,
    addLedgerEntry,
    deleteLedgerEntry,
    settlePayment
  };
}
