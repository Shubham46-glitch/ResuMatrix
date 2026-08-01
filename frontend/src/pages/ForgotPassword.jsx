import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await axios.post('/api/auth/forgotpassword', { email });
      setMessage(data.message || 'Email sent! Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matrix-bg py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-matrix-panel p-10 rounded-2xl shadow-2xl border border-matrix-border"
      >
        <div className="flex flex-col items-center">
          <div className="bg-[#2D3346] p-4 rounded-full mb-4">
            <KeyRound className="h-8 w-8 text-matrix-accent" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Forgot Password</h2>
          <p className="mt-2 text-center text-sm text-matrix-text-muted">
            Enter your email to receive a password reset link.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-[#EF4444] text-sm text-center bg-[#422026] border border-[#EF4444]/20 py-3 rounded-lg font-medium">{error}</div>}
          {message && <div className="text-matrix-success text-sm text-center bg-[#1D3235] border border-[#10B981]/20 py-3 rounded-lg font-medium">{message}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-matrix-text-muted mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0B0F19] border border-matrix-border placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-matrix-accent focus:border-transparent sm:text-sm transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-matrix-accent hover:bg-matrix-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-matrix-bg focus:ring-matrix-accent transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link to="/login" className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-bold rounded-xl text-matrix-text-muted hover:text-white transition-all">
                <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
