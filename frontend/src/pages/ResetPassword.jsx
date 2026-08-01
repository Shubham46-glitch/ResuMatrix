import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(`/api/auth/resetpassword/${token}`, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The token may be expired.');
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
          <div className="bg-[#1D3235] p-4 rounded-full mb-4">
            <ShieldCheck className="h-8 w-8 text-matrix-success" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Reset Password</h2>
          <p className="mt-2 text-center text-sm text-matrix-text-muted">
            Enter your new secure password below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-[#EF4444] text-sm text-center bg-[#422026] border border-[#EF4444]/20 py-3 rounded-lg font-medium">{error}</div>}
          {message && <div className="text-matrix-success text-sm text-center bg-[#1D3235] border border-[#10B981]/20 py-3 rounded-lg font-medium">{message}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-matrix-text-muted mb-1">New Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0B0F19] border border-matrix-border placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-matrix-accent focus:border-transparent sm:text-sm transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-matrix-text-muted mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0B0F19] border border-matrix-border placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-matrix-accent focus:border-transparent sm:text-sm transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-matrix-accent hover:bg-matrix-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-matrix-bg focus:ring-matrix-accent transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
