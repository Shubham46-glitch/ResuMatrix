import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Trophy, MessageSquare, Code, Brain, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InterviewResult = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/interview/${interviewId}`, config);
        
        if (data.status !== 'completed') {
            navigate(`/interview/session/${interviewId}`);
            return;
        }

        setInterview(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching interview result');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchInterview();
  }, [interviewId, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-matrix-accent animate-spin" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <p className="text-matrix-warning">{error || "Result not found."}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 bg-matrix-panel border border-matrix-border text-white px-6 py-2 rounded-lg">Return Home</button>
      </div>
    );
  }

  const evaluation = interview.evaluation || {};
  const strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : [];
  const weaknesses = Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [];
  const improvementTips = Array.isArray(evaluation.improvementTips) ? evaluation.improvementTips : [];

  const getScoreColor = (score) => {
      if (score >= 85) return 'text-matrix-success';
      if (score >= 70) return 'text-matrix-accent';
      return 'text-matrix-warning';
  };

  const getScoreBorder = (score) => {
      if (score >= 85) return 'border-matrix-success';
      if (score >= 70) return 'border-matrix-accent';
      return 'border-matrix-warning';
  };

  return (
    <div className="max-w-6xl mx-auto py-6 pb-20 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/interview/history')} className="p-2 bg-matrix-panel border border-matrix-border rounded-lg hover:border-matrix-text-muted text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Interview Performance</h1>
              <p className="text-sm text-matrix-text-muted mt-1">Based on {interview.analysisReport?.resumeName}</p>
            </div>
          </div>
          <div className="text-right">
              <p className="text-sm text-matrix-text-muted uppercase tracking-widest mb-1">Overall Score</p>
              <div className="text-5xl font-extrabold text-white">
                  <span className={getScoreColor(evaluation.overallScore)}>{evaluation.overallScore}</span><span className="text-2xl text-gray-500">/100</span>
              </div>
          </div>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`bg-matrix-panel border-t-4 ${getScoreBorder(evaluation.communication)} border-x border-b border-x-matrix-border border-b-matrix-border rounded-xl p-6`}>
              <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#1C2333] p-3 rounded-lg"><MessageSquare className="h-6 w-6 text-white" /></div>
                  <span className={`text-3xl font-bold ${getScoreColor(evaluation.communication)}`}>{evaluation.communication}%</span>
              </div>
              <h3 className="text-lg font-bold text-white">Communication</h3>
              <p className="text-sm text-matrix-text-muted mt-1">Clarity, structure, and articulation.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-matrix-panel border-t-4 ${getScoreBorder(evaluation.technicalKnowledge)} border-x border-b border-x-matrix-border border-b-matrix-border rounded-xl p-6`}>
              <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#1C2333] p-3 rounded-lg"><Code className="h-6 w-6 text-white" /></div>
                  <span className={`text-3xl font-bold ${getScoreColor(evaluation.technicalKnowledge)}`}>{evaluation.technicalKnowledge}%</span>
              </div>
              <h3 className="text-lg font-bold text-white">Technical Knowledge</h3>
              <p className="text-sm text-matrix-text-muted mt-1">Accuracy and depth of technical answers.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`bg-matrix-panel border-t-4 ${getScoreBorder(evaluation.confidence)} border-x border-b border-x-matrix-border border-b-matrix-border rounded-xl p-6`}>
              <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#1C2333] p-3 rounded-lg"><Brain className="h-6 w-6 text-white" /></div>
                  <span className={`text-3xl font-bold ${getScoreColor(evaluation.confidence)}`}>{evaluation.confidence}%</span>
              </div>
              <h3 className="text-lg font-bold text-white">Confidence & Delivery</h3>
              <p className="text-sm text-matrix-text-muted mt-1">Tone, problem-solving approach, and certainty.</p>
          </motion.div>
      </div>

      {/* Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-matrix-success" /> Key Strengths</h3>
              <ul className="space-y-3">
                  {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="bg-[#2D3346] rounded-full h-1.5 w-1.5 mt-2 flex-shrink-0"></span> {s}
                      </li>
                  ))}
              </ul>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-matrix-warning" /> Areas for Improvement</h3>
              <ul className="space-y-3">
                  {weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="bg-[#2D3346] rounded-full h-1.5 w-1.5 mt-2 flex-shrink-0"></span> {w}
                      </li>
                  ))}
              </ul>
          </motion.div>
      </div>

      {/* Actionable Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-[#1C2333] to-matrix-panel border border-matrix-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Actionable Advice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvementTips.map((tip, i) => (
                  <div key={i} className="bg-[#0B0F19] p-4 rounded-xl border border-matrix-border/50 text-sm text-gray-300">
                      {tip}
                  </div>
              ))}
          </div>
      </motion.div>

      {/* Question Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h3 className="text-2xl font-bold text-white mb-6 mt-10">Detailed Question Breakdown</h3>
          <div className="space-y-4">
              {interview.questions.map((q, idx) => (
                  <div key={idx} className="bg-matrix-panel border border-matrix-border rounded-xl overflow-hidden transition-all duration-200">
                      <div 
                          className="p-5 flex items-start justify-between cursor-pointer hover:bg-[#1C2333]"
                          onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                      >
                          <div className="flex gap-4">
                              <div className="h-8 w-8 rounded-full bg-[#1C2333] flex items-center justify-center font-bold text-matrix-accent flex-shrink-0 border border-matrix-border">{idx + 1}</div>
                              <h4 className="text-white font-medium pr-4">{q}</h4>
                          </div>
                          {expandedQ === idx ? <ChevronUp className="h-5 w-5 text-matrix-text-muted flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-matrix-text-muted flex-shrink-0" />}
                      </div>
                      
                      <AnimatePresence>
                          {expandedQ === idx && (
                              <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-matrix-border bg-[#0B0F19]"
                              >
                                  <div className="p-6 space-y-6">
                                      <div>
                                          <h5 className="text-xs font-bold text-matrix-text-muted uppercase tracking-wider mb-2">Your Answer</h5>
                                          <p className="text-sm text-gray-300 leading-relaxed bg-[#1C2333] p-4 rounded-xl border border-matrix-border/50">
                                              {interview.answers[idx] || <span className="italic text-gray-500">No answer provided.</span>}
                                          </p>
                                      </div>
                                      <div>
                                          <h5 className="text-xs font-bold text-matrix-accent uppercase tracking-wider mb-2 flex items-center gap-2"><Trophy className="h-3 w-3" /> Ideal Approach</h5>
                                          <p className="text-sm text-[#E0E7FF] leading-relaxed bg-matrix-accent/10 p-4 rounded-xl border border-matrix-accent/20">
                                              {evaluation.idealAnswer?.[idx] || "Provide specific examples and structure your answer logically."}
                                          </p>
                                      </div>
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              ))}
          </div>
      </motion.div>
    </div>
  );
};

export default InterviewResult;
