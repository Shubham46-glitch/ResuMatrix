import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InterviewPrep = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    const generateInterview = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.post(`/api/interview/generate/${reportId}`, {}, config);
        
        navigate(`/interview/session/${data._id}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate interview. Please try again.');
        setIsGenerating(false);
      }
    };

    if (user?.token) {
        generateInterview();
    }
  }, [reportId, navigate, user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <div className="bg-matrix-panel border border-matrix-warning/50 rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-matrix-warning mb-2">Generation Failed</h2>
          <p className="text-matrix-text-muted mb-6">{error}</p>
          <button 
            onClick={() => navigate(`/report/${reportId}`)}
            className="bg-matrix-accent hover:bg-matrix-accent-hover text-white px-6 py-2 rounded-xl transition-colors"
          >
            Back to Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-matrix-panel border border-matrix-border rounded-2xl p-10 text-center max-w-md flex flex-col items-center shadow-[0_0_40px_rgba(99,102,241,0.15)]"
      >
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-matrix-accent blur-xl opacity-20 rounded-full animate-pulse"></div>
            <BrainCircuit className="h-16 w-16 text-matrix-accent relative z-10 animate-bounce" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Preparing Your Interview</h1>
        <p className="text-matrix-text-muted mb-6 leading-relaxed">
          Our AI is analyzing your resume and crafting a personalized set of 10 questions to test your skills and experience.
        </p>
        
        <div className="flex items-center gap-3 text-matrix-accent">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-semibold tracking-wide animate-pulse">Generating questions...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewPrep;
