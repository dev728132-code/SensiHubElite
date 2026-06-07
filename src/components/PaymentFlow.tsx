import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, CheckCircle2, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType, doc, setDoc, serverTimestamp } from '../lib/storage';

interface PaymentFlowProps {
  planName: string;
  amount: number;
  onClose: () => void;
}

export function PaymentFlow({ planName, amount, onClose }: PaymentFlowProps) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'qr' | 'form' | 'success'>('qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upiId = '7563075001@axl';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Admin&am=${amount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setIsSubmitting(true);
    setVerifying(true);
    
    // Artificial verification delay for "professional" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const paymentId = `pay_${Date.now()}`;
      const docRef = doc(db, 'users', user.uid, 'payments', paymentId);
      
      await setDoc(docRef, {
        userId: user.uid,
        userName: profile.displayName,
        planName,
        amount,
        utrNumber,
        mobileNumber,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      const historyId = `hist_${Date.now()}`;
      const histRef = doc(db, 'users', user.uid, 'history', historyId);
      await setDoc(histRef, {
        userId: user.uid,
        itemType: 'purchased',
        brand: 'N/A',
        model: 'Subscription/Pack',
        game: 'Free Fire',
        configName: planName,
        sensitivityData: '{}',
        createdAt: serverTimestamp()
      });

      setStep('success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    } finally {
      setIsSubmitting(false);
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border border-cyan-500/30 rounded-3xl w-full max-w-sm overflow-hidden relative shadow-[0_0_50px_rgba(34,211,238,0.1)]"
      >
        {step !== 'success' && (
          <div className="absolute top-4 left-4 z-10">
            <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-gray-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'qr' && (
            <motion.div 
              key="qr"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 pt-16 flex flex-col items-center text-center space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pay for {planName}</h3>
                <p className="text-gray-400 text-sm">Scan QR code using any UPI app</p>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img src={qrCodeUrl} alt="Payment QR" className="w-48 h-48 object-contain" />
              </div>

              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-cyan-400">₹{amount}</p>
                <p className="text-xs text-gray-500 font-medium">UPI ID: {upiId}</p>
              </div>

              <button 
                onClick={() => setStep('form')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-bold text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" /> I Have Paid
              </button>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 pt-16"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Verify Payment</h3>
                <p className="text-gray-400 text-sm">Enter transaction details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">UTR Number (Required)</label>
                  <input 
                    type="text" 
                    required
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    placeholder="e.g., 123456789012"
                    className="w-full mt-1 h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Mobile Number (Required)</label>
                  <input 
                    type="tel" 
                    required
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full mt-1 h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Logged-in User Name</label>
                  <input 
                    type="text" 
                    readOnly
                    value={profile?.displayName || ''}
                    className="w-full mt-1 h-12 px-4 bg-gray-800/50 border border-gray-800 rounded-xl text-sm text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !utrNumber || !mobileNumber}
                  className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-bold transition-all disabled:opacity-50 relative overflow-hidden"
                >
                  {verifying ? (
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       Synchronizing...
                    </div>
                  ) : isSubmitting ? 'Finalizing...' : 'I Have Filled Successfully'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Submitted</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Payment details submitted successfully. Please wait while our admin verifies your payment. Access will be activated after verification.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors w-full"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
