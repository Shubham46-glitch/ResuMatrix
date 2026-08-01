import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, CheckCircle2, Shield, Zap, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    if (file && file.type === 'application/pdf') {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        setFile(file);
      } else {
        setError('File size must be less than 10MB');
      }
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
        formData.append('jobDescription', jobDescription);
    }

    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`
        }
      };
      
      const { data } = await axios.post('/api/analyze', formData, config);
      
      // Navigate to results page with the report data
      setIsUploading(false);
      navigate(`/report/${data.report._id}`);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error uploading file. Make sure backend is running and you are logged in properly.');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Analyze Your Career Potential</h1>
        <p className="text-matrix-text-muted text-lg">
          Upload your resume and let our AI dissect your experience, optimize for ATS, and reveal hidden opportunities.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-matrix-panel border border-matrix-border rounded-2xl p-8 mb-8"
      >
        {/* Dropzone */}
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging ? 'border-matrix-accent bg-matrix-accent/10' : 'border-matrix-border hover:border-matrix-text-muted bg-[#0B0F19]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-[#1C2333] h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadIcon className="h-8 w-8 text-matrix-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Drag and drop your resume</h3>
          <p className="text-matrix-text-muted mb-6">Supports PDF format up to 10MB</p>
          
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer bg-[#2D3346] hover:bg-[#384056] text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-block"
          >
            Browse Files
          </label>
        </div>

        {error && <div className="mt-6 text-matrix-warning text-center text-sm bg-[#422026] border border-[#EF4444]/20 py-3 rounded-lg font-medium">{error}</div>}

        {/* Selected File Card */}
        {file && (
          <div className="mt-8 bg-[#1C2333] border border-matrix-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D3346] p-2 rounded text-matrix-text-muted">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-matrix-success" />
                  <span className="text-matrix-success text-xs font-semibold">PDF format verified</span>
                </div>
              </div>
            </div>
            <span className="text-matrix-text-muted text-sm font-bold">100%</span>
          </div>
        )}

        {/* Optional Job Description */}
        <div className="mt-8">
            <label className="block text-sm font-medium text-matrix-text-muted mb-2">Target Job Description (Optional for better ATS scoring)</label>
            <textarea
                className="w-full bg-[#0B0F19] border border-matrix-border rounded-xl p-4 text-white focus:ring-2 focus:ring-matrix-accent focus:border-transparent transition-all outline-none"
                rows="4"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
        </div>

        {/* Analyze Button */}
        <button 
          onClick={handleAnalyze}
          disabled={!file || isUploading}
          className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
            file && !isUploading
              ? 'bg-matrix-accent hover:bg-matrix-accent-hover text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
              : 'bg-[#2D3346] text-matrix-text-muted cursor-not-allowed'
          }`}
        >
          {isUploading ? (
              <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Analyzing... (This takes about 15s)
              </>
          ) : (
              <>
                Analyze Resume <Zap className="h-5 w-5" />
              </>
          )}
        </button>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 text-center hover:border-matrix-success transition-colors">
          <Shield className="h-6 w-6 text-matrix-success mx-auto mb-4" />
          <h4 className="text-white font-bold mb-2">Privacy Guaranteed</h4>
          <p className="text-matrix-text-muted text-xs leading-relaxed">Your data is encrypted and never shared with third parties.</p>
        </div>
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 text-center hover:border-white transition-colors">
          <Zap className="h-6 w-6 text-white mx-auto mb-4" />
          <h4 className="text-white font-bold mb-2">Fast Processing</h4>
          <p className="text-matrix-text-muted text-xs leading-relaxed">Deep neural analysis completed in under 15 seconds.</p>
        </div>
        <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6 text-center hover:border-matrix-accent transition-colors">
          <TrendingUp className="h-6 w-6 text-matrix-accent mx-auto mb-4" />
          <h4 className="text-white font-bold mb-2">ATS Optimization</h4>
          <p className="text-matrix-text-muted text-xs leading-relaxed">Score high against top industry tracking systems.</p>
        </div>
      </motion.div>

    </div>
  );
};

export default Upload;
