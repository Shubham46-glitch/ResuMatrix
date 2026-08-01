import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis report?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/analyze/${id}`, config);
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting report');
      }
    }
  };

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
           setReports([]);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreBadge = (score) => {
    if (score >= 85) return <span className="bg-[#1D3235] text-matrix-success px-3 py-1 rounded-full text-xs font-bold border border-[#10B981]/20">{score}% Excellent</span>;
    if (score >= 70) return <span className="bg-[#2D2A4A] text-[#8B5CF6] px-3 py-1 rounded-full text-xs font-bold border border-[#8B5CF6]/20">{score}% Good</span>;
    return <span className="bg-[#422026] text-matrix-warning px-3 py-1 rounded-full text-xs font-bold border border-[#EF4444]/20">{score}% Needs Work</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { formattedDate, formattedTime };
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-end mb-8">
            <div>
               <h1 className="text-3xl font-bold text-white mb-2">Analysis History</h1>
               <p className="text-matrix-text-muted">Review your historical AI analyses and resume optimizations.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-matrix-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search resumes..." 
                        className="bg-matrix-panel border border-matrix-border text-white text-sm rounded-lg focus:ring-matrix-accent focus:border-matrix-accent block w-64 pl-10 p-2.5 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 bg-matrix-panel border border-matrix-border hover:border-matrix-text-muted text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Filter className="h-4 w-4" /> Filter
                </button>
            </div>
        </div>

        <div className="bg-matrix-panel border border-matrix-border rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-matrix-text-muted">
                <thead className="text-xs uppercase bg-[#0F1423] border-b border-matrix-border">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">Resume Name</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">Upload Date</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">ATS Score</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="4" className="text-center py-8">Loading history...</td></tr>
                    ) : reports.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-16">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-[#1C2333] p-4 rounded-full mb-4">
                                        <FileText className="h-8 w-8 text-matrix-text-muted" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">No Reports Yet</h3>
                                    <p className="text-sm text-matrix-text-muted max-w-md mb-6">You haven't analyzed any resumes yet. Upload your first resume to get actionable AI feedback!</p>
                                    <button 
                                        onClick={() => navigate('/upload')}
                                        className="bg-matrix-accent hover:bg-matrix-accent-hover text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        Analyze Resume
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        reports.map((report) => {
                            const { formattedDate, formattedTime } = formatDate(report.createdAt);
                            return (
                                <tr key={report._id} className="border-b border-matrix-border/50 hover:bg-[#1C2333] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#2D3346] p-2.5 rounded-lg text-matrix-text-muted">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{report.resumeName}</p>
                                                <p className="text-xs mt-1">{report.fileSize || 'N/A'} • {report.format || 'PDF Format'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{formattedDate}</p>
                                        <p className="text-xs mt-1">{formattedTime}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getScoreBadge(report.atsScore)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => navigate(`/report/${report._id}`)}
                                                className="flex items-center gap-2 bg-[#2D3346] hover:bg-[#384056] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
                                                <Eye className="h-4 w-4" /> View Report
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(report._id)}
                                                className="text-matrix-text-muted hover:text-matrix-warning transition-colors p-2 rounded-lg hover:bg-[#422026]">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
            <div className="p-4 border-t border-matrix-border flex justify-between items-center text-xs">
                <span>Showing {reports.length} of {reports.length} records</span>
                <div className="flex gap-2">
                    <button className="h-8 w-8 rounded flex items-center justify-center border border-matrix-border hover:bg-[#2D3346] text-white disabled:opacity-50">{'<'}</button>
                    <button className="h-8 w-8 rounded flex items-center justify-center border border-matrix-border hover:bg-[#2D3346] text-white disabled:opacity-50">{'>'}</button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default History;
