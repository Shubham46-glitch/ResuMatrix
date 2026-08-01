import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Zap, Clock, Upload, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [latestReport, setLatestReport] = useState(null);
  const [stats, setStats] = useState({ total: 0, latestScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token !== 'fake') {
           const { data } = await axios.get('/api/analyze/history', {
             headers: { Authorization: `Bearer ${userInfo.token}` }
           });
           
           if (data.length > 0) {
               setLatestReport(data[0]);
               setStats({
                   total: data.length,
                   latestScore: data[0].atsScore
               });
           }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "text-matrix-success";
    if (score >= 60) return "text-matrix-accent";
    return "text-matrix-warning";
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return "bg-matrix-success";
    if (score >= 60) return "bg-matrix-accent";
    return "bg-matrix-warning";
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}.
        </h1>
        <p className="text-matrix-text-muted text-lg max-w-2xl">
          Your AI-driven career path is looking sharp. Here's how your latest resume iterations are performing across our ATS simulation engine.
        </p>
      </motion.div>

      {/* Top Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Analyses Card */}
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 relative overflow-hidden group hover:border-matrix-accent transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-[#2D3346] p-3 rounded-lg text-matrix-text-muted">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-matrix-text-muted text-sm font-medium tracking-wide uppercase mb-1">Total Analyses</p>
          <h2 className="text-4xl font-bold text-white">{stats.total}</h2>
        </div>

        {/* Latest ATS Score Card */}
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 relative overflow-hidden group hover:border-matrix-accent transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-matrix-accent/20 p-3 rounded-lg text-matrix-accent">
              <Zap className="h-5 w-5" />
            </div>
             {/* Small circular progress placeholder */}
             {latestReport && (
                 <div className={`h-10 w-10 rounded-full border-4 border-matrix-border flex items-center justify-center text-[10px] font-bold ${latestReport.atsScore >= 80 ? 'border-t-matrix-success' : 'border-t-matrix-accent'}`}>
                   {latestReport.atsScore}%
                 </div>
             )}
          </div>
          <p className="text-matrix-text-muted text-sm font-medium tracking-wide uppercase mb-1">Latest ATS Score</p>
          <h2 className={`text-4xl font-bold ${getScoreBadgeClass(stats.latestScore)}`}>
              {stats.latestScore > 0 ? stats.latestScore : '--'}<span className="text-2xl opacity-50">%</span>
          </h2>
        </div>

        {/* Last Upload Card */}
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 relative overflow-hidden group hover:border-matrix-accent transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-[#1D3235] p-3 rounded-lg text-matrix-success">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-matrix-text-muted text-sm font-medium tracking-wide uppercase mb-1">Last Upload</p>
          <h2 className="text-2xl font-bold text-white">
              {latestReport ? new Date(latestReport.createdAt).toLocaleDateString() : 'No Uploads'}
          </h2>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions & Recommendation */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/upload" className="w-full flex items-center justify-center gap-2 bg-matrix-accent hover:bg-matrix-accent-hover text-white py-3 px-4 rounded-xl font-medium transition-colors">
                <Upload className="h-4 w-4" />
                Upload New Resume
              </Link>
              <Link to="/history" className="w-full flex items-center justify-center gap-2 bg-[#21283B] hover:bg-[#2A334B] text-white border border-matrix-border py-3 px-4 rounded-xl font-medium transition-colors">
                <History className="h-4 w-4" />
                View Full History
              </Link>
            </div>
          </div>

          {/* AI Recommendation */}
          {latestReport && latestReport.quickImprovements && latestReport.quickImprovements.length > 0 && (
              <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 opacity-10">
                    <Zap className="h-32 w-32" />
                 </div>
                 <span className="inline-block bg-[#1D3235] text-matrix-success text-xs font-semibold px-2 py-1 rounded mb-4">AI Recommendation</span>
                 <h3 className="text-xl font-bold text-white mb-3">Quick Improvement</h3>
                 <p className="text-matrix-text-muted text-sm leading-relaxed mb-6">
                   {latestReport.quickImprovements[0]}
                 </p>
                 <Link to="/analytics" className="flex items-center gap-2 text-matrix-success hover:text-white font-medium transition-colors text-sm">
                    View Insights <ArrowRight className="h-4 w-4" />
                 </Link>
              </div>
          )}
        </motion.div>

        {/* Right Column: Latest Analysis Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-matrix-panel border border-matrix-border rounded-2xl p-8">
           <div className="flex justify-between items-start mb-8 border-b border-matrix-border pb-6">
             <div>
               <h3 className="text-2xl font-bold text-white">Latest Analysis</h3>
               <p className="text-matrix-text-muted text-sm mt-1">{latestReport ? latestReport.resumeName : 'No analysis available'}</p>
             </div>
             <span className="bg-[#2D3346] text-matrix-text-muted text-xs font-semibold px-3 py-1.5 rounded-full">Active Iteration</span>
           </div>

           {latestReport ? (
               <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div>
                       <p className="text-xs font-bold text-matrix-text-muted tracking-widest uppercase mb-4">Matched Keywords</p>
                       <div className="flex flex-wrap gap-2">
                         {latestReport.matchedSkills && latestReport.matchedSkills.length > 0 ? (
                             latestReport.matchedSkills.slice(0, 8).map(kw => (
                               <span key={kw} className="bg-[#1D3235] text-matrix-success border border-[#10B981]/20 px-3 py-1 rounded-full text-xs font-medium">{kw}</span>
                             ))
                         ) : (
                             <span className="text-matrix-text-muted text-sm">None detected</span>
                         )}
                       </div>
                     </div>
                     <div>
                       <p className="text-xs font-bold text-matrix-text-muted tracking-widest uppercase mb-4">Missing Keywords</p>
                       <div className="flex flex-wrap gap-2">
                         {latestReport.missingSkills && latestReport.missingSkills.length > 0 ? (
                             latestReport.missingSkills.slice(0, 8).map(kw => (
                               <span key={kw} className="bg-[#422026] text-matrix-warning border border-[#EF4444]/20 px-3 py-1 rounded-full text-xs font-medium">{kw}</span>
                             ))
                         ) : (
                             <span className="text-matrix-text-muted text-sm">None detected</span>
                         )}
                       </div>
                     </div>
                   </div>

                   <div>
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-bold text-matrix-text-muted tracking-widest uppercase">Overall Optimization Progress</p>
                        <span className="text-white font-bold text-sm">{latestReport.atsScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-matrix-border rounded-full overflow-hidden mb-6">
                        <div className={`h-full ${getScoreBgClass(latestReport.atsScore)} rounded-full`} style={{ width: `${latestReport.atsScore}%` }}></div>
                      </div>

                      <div className="flex items-start gap-3 bg-[#1C2333] p-4 rounded-xl border border-matrix-border">
                        <div className="mt-0.5 text-matrix-text-muted"><FileText className="h-5 w-5"/></div>
                        <p className="text-sm text-matrix-text-muted leading-relaxed">
                          {latestReport.professionalSummary || 'No summary available.'}
                        </p>
                      </div>
                   </div>
               </>
           ) : (
               <div className="text-center py-10">
                   <p className="text-matrix-text-muted mb-4">You haven't uploaded any resumes yet.</p>
                   <Link to="/upload" className="inline-block bg-matrix-accent hover:bg-matrix-accent-hover text-white py-2 px-6 rounded-lg font-medium transition-colors">
                       Upload Now
                   </Link>
               </div>
           )}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
