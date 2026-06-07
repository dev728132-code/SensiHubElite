import { motion } from 'motion/react';
import { MessageSquare, ArrowLeft, ExternalLink, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();
  const whatsappNumber = "9470851455";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-24">
      <div className="max-w-md mx-auto space-y-8 pt-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-900 rounded-full border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Customer Support</h1>
        </div>

        {/* Support Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare className="w-32 h-32" />
          </div>

          <div className="mx-auto w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
            <Phone className="w-10 h-10 text-cyan-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Contact Admin</h2>
            <p className="text-gray-400 text-sm">
              If you have any issues with your configuration or premium membership, our admin team is here to help.
            </p>
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-gray-800/50">
            <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">WhatsApp Official</span>
            <span className="text-2xl font-mono text-white tracking-widest">+{whatsappNumber}</span>
          </div>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-3 w-full bg-[#25D366] hover:bg-[#22c35e] text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/10"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Message Admin Directly</span>
            <ExternalLink className="w-4 h-4 opacity-50" />
          </motion.a>

          <p className="text-[10px] text-gray-500">
            Typically responds within 24 hours. Please include your User ID for faster support.
          </p>
        </motion.div>

        {/* FAQ Preview */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Common Questions</h3>
          <div className="space-y-2">
            {[
              { q: "Config not applying?", a: "Ensure you have the latest game update and storage permissions allowed." },
              { q: "Premium not active?", a: "Transactions can take up to 15 minutes to sync with your account." }
            ].map((faq, i) => (
              <div key={i} className="p-4 bg-gray-900/30 border border-gray-800/50 rounded-xl">
                <p className="text-sm font-medium text-gray-200 mb-1">{faq.q}</p>
                <p className="text-xs text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
