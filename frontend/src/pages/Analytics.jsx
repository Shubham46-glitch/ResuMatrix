import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Analytics = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token && userInfo.token !== 'fake') {
           const { data } = await axios.get('/api/analyze/history', {
             headers: { Authorization: `Bearer ${userInfo.token}` }
           });
           setReports(data || []);
        } else {
           navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matrix-accent"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">No Data Yet</h2>
        <p className="text-matrix-text-muted mb-6">Upload a resume to generate your first analytics report!</p>
        <button onClick={() => navigate('/upload')} className="bg-matrix-panel border border-matrix-border text-white px-6 py-2 rounded-lg hover:border-matrix-text-muted transition-colors">
          Go to Upload
        </button>
      </div>
    );
  }

  // --- Data Calculations ---
  // Sort chronologically (oldest first)
  const sortedReports = [...reports].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const latestReport = sortedReports[sortedReports.length - 1];
  
  // Trend Bar Chart (last 5 reports)
  const recentReports = sortedReports.slice(-5);
  const trendData = recentReports.map((r, idx) => ({
      name: idx === recentReports.length - 1 ? 'Current' : `V${idx + 1}`,
      score: r.atsScore
  }));

  let trendChange = null;
  if (recentReports.length >= 2) {
      const prev = recentReports[recentReports.length - 2].atsScore;
      const curr = latestReport.atsScore;
      trendChange = curr - prev;
  }

  // Fake Derivation for Radar (Since our AI only returns 1 global score)
  const score = latestReport.atsScore;
  const numSkills = latestReport.matchedSkills?.length || 0;
  
  const technical = Math.min(100, score + (numSkills * 1.5));
  const communication = Math.min(100, Math.max(50, score - 5));
  const execution = Math.min(100, score + 2);
  const leadership = Math.min(100, Math.max(40, score - 10));
  const softSkills = Math.min(100, Math.max(60, score - (latestReport.grammar?.length > 15 ? 10 : 0)));

  const radarData = [
    { subject: 'Technical', A: technical, fullMark: 100 },
    { subject: 'Leadership', A: leadership, fullMark: 100 },
    { subject: 'Communication', A: communication, fullMark: 100 },
    { subject: 'Soft Skills', A: softSkills, fullMark: 100 },
    { subject: 'Execution', A: execution, fullMark: 100 },
  ];

  // Helper for progress bar color
  const getLevelColor = (val) => val >= 85 ? 'bg-matrix-success' : val >= 70 ? 'bg-matrix-accent' : 'bg-matrix-warning';
  const getLevelText = (val) => val >= 85 ? 'Expert' : val >= 70 ? 'Advanced' : 'Intermediate';

  return (
    <div className="max-w-6xl mx-auto py-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-8">Analytics Hub</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* ATS Score Trend */}
            <div className="lg:col-span-2 bg-matrix-panel border border-matrix-border rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-white">ATS Score Trend</h3>
                    {trendChange !== null && (
                        <span className={`text-xs font-bold ${trendChange >= 0 ? 'text-matrix-success' : 'text-matrix-warning'}`}>
                            {trendChange >= 0 ? '+' : ''}{trendChange} vs previous
                        </span>
                    )}
                </div>
                <p className="text-matrix-text-muted text-sm mb-6">Tracking your resume performance across iterations.</p>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{fill: '#232D42'}} contentStyle={{backgroundColor: '#151B2B', borderColor: '#232D42', color: '#fff'}} />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {trendData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#6366F1' : '#475569'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Completeness */}
            <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-matrix-text-muted tracking-widest uppercase mb-6">Completeness</p>
                <div className="relative h-40 w-40 mb-6 flex items-center justify-center">
                    {/* SVG Circle for progress */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#232D42" strokeWidth="8" fill="none" />
                        <circle cx="80" cy="80" r="70" stroke="#F8FAFC" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={(2 * Math.PI * 70) * (1 - score / 100)} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score}<span className="text-xl">%</span></span>
                        <span className="text-xs text-matrix-text-muted mt-1">
                           {score >= 85 ? 'Optimal' : score >= 70 ? 'Good' : 'Needs Work'}
                        </span>
                    </div>
                </div>
                <p className="text-matrix-text-muted text-sm max-w-[200px]">Latest ATS Score from: <br/><span className="text-white truncate block mt-1">{latestReport.resumeName}</span></p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {/* Skill Coverage */}
            <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">Skill Coverage</h3>
                    <span className="bg-[#1C2333] border border-matrix-border text-matrix-text-muted text-[10px] uppercase font-bold px-2 py-1 rounded">AI Derived</span>
                </div>
                <p className="text-matrix-text-muted text-sm mb-6">Multi-dimensional competence analysis based on your latest resume.</p>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-64 w-64 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#232D42" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                <Radar name="Skills" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="flex-1 space-y-6 w-full">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-white">Technical</span>
                                <span className="text-matrix-success">{getLevelText(technical)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-matrix-border rounded-full overflow-hidden"><div className={`h-full ${getLevelColor(technical)}`} style={{width: `${technical}%`}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-white">Leadership</span>
                                <span className="text-white">{getLevelText(leadership)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-matrix-border rounded-full overflow-hidden"><div className={`h-full ${getLevelColor(leadership)}`} style={{width: `${leadership}%`}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-white">Communication</span>
                                <span className="text-white">{getLevelText(communication)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-matrix-border rounded-full overflow-hidden"><div className={`h-full ${getLevelColor(communication)}`} style={{width: `${communication}%`}}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 flex flex-col">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <span className="text-white">✨</span> AI Insights
                 </h3>
                 <div className="space-y-4 flex-1">
                     {latestReport.quickImprovements && latestReport.quickImprovements.length > 0 ? (
                       <div className="bg-[#1C2333] border-l-2 border-matrix-accent p-4 rounded-r-xl">
                           <h4 className="text-matrix-accent text-xs font-bold uppercase tracking-wider mb-2">Suggested Improvement</h4>
                           <p className="text-matrix-text-muted text-sm leading-relaxed">
                               {latestReport.quickImprovements[0]}
                           </p>
                       </div>
                     ) : null}
                     
                     {latestReport.grammar ? (
                       <div className="bg-[#1D3235] border-l-2 border-matrix-success p-4 rounded-r-xl">
                           <h4 className="text-matrix-success text-xs font-bold uppercase tracking-wider mb-2">Formatting & Grammar</h4>
                           <p className="text-[#10B981] opacity-90 text-sm leading-relaxed">
                               {latestReport.grammar}
                           </p>
                       </div>
                     ) : null}

                     {latestReport.missingSkills && latestReport.missingSkills.length > 0 ? (
                       <div className="bg-[#422026] border-l-2 border-matrix-warning p-4 rounded-r-xl">
                           <h4 className="text-matrix-warning text-xs font-bold uppercase tracking-wider mb-2">Missing Skills</h4>
                           <p className="text-[#EF4444] opacity-90 text-sm leading-relaxed">
                               Consider adding: {latestReport.missingSkills.join(', ')}
                           </p>
                       </div>
                     ) : null}
                 </div>
                 <button 
                    onClick={() => navigate(`/report/${latestReport._id}`)}
                    className="w-full mt-6 bg-[#2D3346] hover:bg-[#384056] text-white py-3 rounded-xl font-medium transition-colors text-sm">
                     View Latest Detailed Report
                 </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
