import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Calendar, FileText, ChevronRight, Mic, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteAll = async () => {
    if (interviews.length === 0) return;
    if (window.confirm('Are you sure you want to delete ALL your mock interview history? This cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/interview`, config);
        setInterviews([]);
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting all interviews');
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview history?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/interview/${id}`, config);
        setInterviews(interviews.filter(interview => interview._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting interview');
      }
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/interview/history', config);
        setInterviews(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching interview history');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-10 w-10 text-matrix-accent animate-spin" />
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-matrix-success';
    if (score >= 70) return 'text-matrix-accent';
    return 'text-matrix-warning';
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Mic className="h-8 w-8 text-matrix-accent" /> Mock Interview History
            </h1>
            <p className="text-matrix-text-muted">Track your AI interview performance over time.</p>
        </div>
        
        {interviews.length > 0 && (
            <button 
                onClick={handleDeleteAll}
                className="flex items-center gap-2 px-4 py-2 bg-matrix-warning/10 text-matrix-warning hover:bg-matrix-warning hover:text-white rounded-xl transition-all border border-matrix-warning/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-medium"
            >
                <Trash2 className="h-4 w-4" /> Delete All
            </button>
        )}
      </motion.div>

      {error ? (
        <div className="bg-matrix-panel border border-matrix-warning/50 rounded-2xl p-6 text-center">
            <AlertCircle className="h-10 w-10 text-matrix-warning mx-auto mb-2" />
            <p className="text-matrix-warning">{error}</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-12 text-center">
            <div className="bg-[#1C2333] h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="h-10 w-10 text-matrix-text-muted" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Interviews Yet</h2>
            <p className="text-matrix-text-muted mb-6 max-w-md mx-auto">You haven't completed any mock interviews. Go to one of your Resume Analysis reports and click "Start AI Mock Interview" to begin practicing!</p>
            <button onClick={() => navigate('/history')} className="bg-matrix-accent hover:bg-matrix-accent-hover text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                Go to Reports
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview, idx) => {
            const formattedDate = new Date(interview.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const isCompleted = interview.status === 'completed';

            return (
              <motion.div 
                key={interview._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => isCompleted ? navigate(`/interview/result/${interview._id}`) : navigate(`/interview/session/${interview._id}`)}
                className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 hover:border-matrix-accent cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] group relative"
              >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                      {isCompleted ? (
                          <div className="flex items-center gap-1 text-xs font-bold bg-[#1D3235] text-matrix-success px-2 py-1 rounded border border-[#10B981]/20">
                              Completed
                          </div>
                      ) : (
                          <div className="flex items-center gap-1 text-xs font-bold bg-[#422026] text-matrix-warning px-2 py-1 rounded border border-[#EF4444]/20">
                              In Progress
                          </div>
                      )}
                      <button 
                        onClick={(e) => handleDelete(e, interview._id)}
                        className="p-1.5 text-matrix-text-muted hover:text-matrix-warning hover:bg-matrix-warning/10 rounded-lg transition-colors"
                        title="Delete Interview"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                      <div className="bg-[#1C2333] p-3 rounded-xl border border-matrix-border group-hover:border-matrix-accent/50 transition-colors flex-shrink-0">
                          <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div className="pr-28 overflow-hidden">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{interview.analysisReport?.resumeName || 'Mock Interview'}</h3>
                          <p className="text-xs text-matrix-text-muted flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formattedDate}
                          </p>
                      </div>
                  </div>

                  {isCompleted ? (
                      <div className="pt-4 border-t border-matrix-border/50 flex items-center justify-between">
                          <div>
                              <p className="text-xs text-matrix-text-muted uppercase tracking-wider mb-1">Score</p>
                              <p className={`text-2xl font-bold ${getScoreColor(interview.evaluation?.overallScore)}`}>
                                  {interview.evaluation?.overallScore || 0}<span className="text-sm text-gray-500 font-normal">/100</span>
                              </p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-[#1C2333] flex items-center justify-center text-white group-hover:bg-matrix-accent transition-colors">
                              <ChevronRight className="h-4 w-4" />
                          </div>
                      </div>
                  ) : (
                      <div className="pt-4 border-t border-matrix-border/50 flex items-center justify-between">
                           <p className="text-sm text-matrix-text-muted">Resume session...</p>
                           <div className="h-8 w-8 rounded-full bg-[#1C2333] flex items-center justify-center text-white group-hover:bg-matrix-warning transition-colors">
                              <ChevronRight className="h-4 w-4" />
                          </div>
                      </div>
                  )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
