import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      // Redirect to login page after successful signup
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Note: MongoDB might not be connected yet.');
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
          <div className="bg-matrix-accent p-3 rounded-xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Create an Account</h2>
          <p className="mt-2 text-center text-sm text-matrix-text-muted">
            Start your AI-driven career optimization
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-[#EF4444] text-sm text-center bg-[#422026] border border-[#EF4444]/20 py-3 rounded-lg font-medium">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-matrix-text-muted mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0B0F19] border border-matrix-border placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-matrix-accent focus:border-transparent sm:text-sm transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-matrix-text-muted mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#0B0F19] border border-matrix-border placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-matrix-accent focus:border-transparent sm:text-sm transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-matrix-accent hover:bg-matrix-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-matrix-bg focus:ring-matrix-accent transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              Sign up
            </button>

          </div>
          <div className="text-center text-sm">
            <span className="text-matrix-text-muted">Already have an account? </span>
            <Link to="/login" className="text-matrix-accent hover:text-matrix-accent-hover font-medium">Log in</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
