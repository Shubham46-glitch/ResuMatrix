import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Trophy, BookOpen, AlertCircle, Calendar, FileText, Mic } from 'lucide-react';
import axios from 'axios';

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          navigate('/login');
          return;
        }

        const { data } = await axios.get(`/api/analyze/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matrix-accent"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <AlertCircle className="h-16 w-16 text-matrix-warning mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
        <p className="text-matrix-text-muted mb-6">{error || "The requested analysis report could not be found."}</p>
        <button onClick={() => navigate('/history')} className="bg-matrix-panel border border-matrix-border text-white px-6 py-2 rounded-lg hover:border-matrix-text-muted transition-colors">
          Back to History
        </button>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981'; // Green
    if (score >= 70) return '#8B5CF6'; // Purple
    return '#EF4444'; // Red
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return <span className="bg-[#1D3235] text-matrix-success px-3 py-1 rounded-full text-xs font-bold border border-[#10B981]/20">Excellent</span>;
    if (score >= 70) return <span className="bg-[#2D2A4A] text-[#8B5CF6] px-3 py-1 rounded-full text-xs font-bold border border-[#8B5CF6]/20">Good</span>;
    return <span className="bg-[#422026] text-matrix-warning px-3 py-1 rounded-full text-xs font-bold border border-[#EF4444]/20">Needs Work</span>;
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/history')} className="p-2 bg-matrix-panel border border-matrix-border rounded-lg hover:border-matrix-text-muted text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis Report</h1>
            <p className="text-sm text-matrix-text-muted flex items-center gap-2">
              <FileText className="h-3 w-3" /> {report.resumeName} • <Calendar className="h-3 w-3" /> {formattedDate}
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/interview/prep/${id}`)}
          className="flex items-center gap-2 bg-matrix-accent hover:bg-matrix-accent-hover text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
        >
          <Mic className="h-5 w-5" /> Start AI Mock Interview
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS SCORE CARD */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 bg-matrix-panel border border-matrix-border rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">{getScoreBadge(report.atsScore)}</div>
          <h2 className="text-lg font-bold text-white mb-6 w-full text-left">ATS Match Score</h2>
          
          <div className="relative h-48 w-48 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#1C2333" strokeWidth="12" fill="none" />
                  <circle 
                    cx="96" cy="96" r="88" 
                    stroke={getScoreColor(report.atsScore)} 
                    strokeWidth="12" fill="none" 
                    strokeDasharray={2 * Math.PI * 88} 
                    strokeDashoffset={(2 * Math.PI * 88) * (1 - report.atsScore / 100)} 
                    className="transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white tracking-tighter">{report.atsScore}</span>
                  <span className="text-sm text-matrix-text-muted mt-1 uppercase tracking-widest">Score</span>
              </div>
          </div>
          
          <p className="text-sm text-matrix-text-muted leading-relaxed">
            {report.atsScore >= 80 ? "Your resume is highly optimized and ready for ATS systems." : 
             report.atsScore >= 60 ? "Your resume is decent but needs specific keyword optimizations." :
             "Your resume is likely to be filtered out. Significant improvements required."}
          </p>
        </motion.div>

        {/* SUMMARY & QUICK IMPROVEMENTS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-matrix-accent" /> Professional Summary
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed bg-[#1C2333] p-4 rounded-xl border border-matrix-border/50">
              {report.professionalSummary || "No summary provided."}
            </p>
            
            {report.grammar && (
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-matrix-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Grammar & Formatting</p>
                  <p className="text-xs text-matrix-text-muted">{report.grammar}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-matrix-panel to-[#1C2333] border border-matrix-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" /> Quick Improvements
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.quickImprovements?.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></span>
                  {imp}
                </li>
              ))}
              {(!report.quickImprovements || report.quickImprovements.length === 0) && (
                <p className="text-sm text-matrix-text-muted col-span-2">No specific quick improvements found.</p>
              )}
            </ul>
          </div>
        </motion.div>

        {/* SKILLS MATCHING */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#1D3235]/30 border border-[#10B981]/20 rounded-2xl p-6">
             <h2 className="text-lg font-bold text-matrix-success mb-4 flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5" /> Matched Skills
             </h2>
             <div className="flex flex-wrap gap-2">
               {report.matchedSkills?.length > 0 ? report.matchedSkills.map((skill, idx) => (
                 <span key={idx} className="bg-[#1D3235] text-matrix-success text-xs px-3 py-1.5 rounded border border-[#10B981]/30">
                   {skill}
                 </span>
               )) : <span className="text-sm text-matrix-text-muted">No specific skills matched.</span>}
             </div>
           </div>

           <div className="bg-[#422026]/30 border border-[#EF4444]/20 rounded-2xl p-6">
             <h2 className="text-lg font-bold text-matrix-warning mb-4 flex items-center gap-2">
               <XCircle className="h-5 w-5" /> Missing Skills
             </h2>
             <div className="flex flex-wrap gap-2">
               {report.missingSkills?.length > 0 ? report.missingSkills.map((skill, idx) => (
                 <span key={idx} className="bg-[#422026] text-matrix-warning text-xs px-3 py-1.5 rounded border border-[#EF4444]/30">
                   {skill}
                 </span>
               )) : <span className="text-sm text-matrix-text-muted">No major missing skills identified!</span>}
             </div>
           </div>
        </motion.div>

        {/* STRENGTHS & WEAKNESSES */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3 bg-matrix-panel border border-matrix-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-matrix-border">
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Core Strengths</h2>
              <ul className="space-y-4">
                {report.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-[#2D3346] p-1 rounded-full text-matrix-success mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed">{strength}</span>
                  </li>
                ))}
                {(!report.strengths || report.strengths.length === 0) && (
                   <span className="text-sm text-matrix-text-muted">No specific strengths listed.</span>
                )}
              </ul>
            </div>
            
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Areas for Growth</h2>
              <ul className="space-y-4">
                {report.weaknesses?.map((weakness, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-[#2D3346] p-1 rounded-full text-matrix-warning mt-0.5 flex-shrink-0">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{weakness.point}</p>
                      <p className="text-xs text-matrix-text-muted mt-1 leading-relaxed">{weakness.description}</p>
                    </div>
                  </li>
                ))}
                {(!report.weaknesses || report.weaknesses.length === 0) && (
                   <span className="text-sm text-matrix-text-muted">No weaknesses identified.</span>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* SUGGESTED PROJECTS & CERTS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-matrix-panel border border-matrix-border rounded-2xl p-6 md:p-8">
             <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <BookOpen className="h-5 w-5 text-matrix-accent" /> Suggested Projects
             </h2>
             <div className="space-y-4">
               {report.suggestedProjects?.length > 0 ? report.suggestedProjects.map((project, idx) => (
                 <div key={idx} className="bg-[#1C2333] border border-matrix-border/50 rounded-xl p-4 hover:border-matrix-accent/50 transition-colors">
                   <h3 className="text-sm font-bold text-matrix-accent mb-1">{project.name}</h3>
                   <p className="text-xs text-gray-400 leading-relaxed">{project.description}</p>
                 </div>
               )) : <p className="text-sm text-matrix-text-muted">No projects suggested at this time.</p>}
             </div>
           </div>

           <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 md:p-8 flex flex-col">
             <h2 className="text-lg font-bold text-white mb-6">Recommended Tech</h2>
             <div className="space-y-6 flex-1">
               <div>
                 <h3 className="text-xs font-semibold text-matrix-text-muted uppercase tracking-wider mb-3">Certifications</h3>
                 <div className="flex flex-col gap-2">
                   {report.suggestedCertifications?.map((cert, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                       <Trophy className="h-3 w-3 text-yellow-500" /> {cert}
                     </div>
                   ))}
                   {(!report.suggestedCertifications || report.suggestedCertifications.length === 0) && (
                     <span className="text-sm text-matrix-text-muted">None at this time.</span>
                   )}
                 </div>
               </div>
               
               <div>
                 <h3 className="text-xs font-semibold text-matrix-text-muted uppercase tracking-wider mb-3">Technologies to Learn</h3>
                 <div className="flex flex-wrap gap-2">
                   {report.suggestedTechnologies?.map((tech, idx) => (
                     <span key={idx} className="bg-[#2D3346] text-gray-300 text-xs px-2.5 py-1 rounded-md border border-matrix-border">
                       {tech}
                     </span>
                   ))}
                   {(!report.suggestedTechnologies || report.suggestedTechnologies.length === 0) && (
                     <span className="text-sm text-matrix-text-muted">None at this time.</span>
                   )}
                 </div>
               </div>
             </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Report;
