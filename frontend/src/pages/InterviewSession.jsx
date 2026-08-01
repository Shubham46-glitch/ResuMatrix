import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertTriangle, Volume2, Mic, MicOff } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRecordingRef = React.useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';
      
      rec.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += text + ' ';
          } else {
            interim += text;
          }
        }
        
        if (finalTranscript.trim()) {
          setAnswers(prev => {
            const newAnswers = [...prev];
            const current = prev[currentIndex] || '';
            newAnswers[currentIndex] = (current.trim() ? current.trim() + ' ' : '') + finalTranscript.trim() + ' ';
            return newAnswers;
          });
        }
        setInterimTranscript(interim);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'no-speech') {
            setIsRecording(false);
            isRecordingRef.current = false;
        }
      };

      rec.onend = () => {
        if (isRecordingRef.current) {
            // Auto restart if it stopped due to silence but user didn't click stop
            try { rec.start(); } catch(e) {}
        } else {
            setIsRecording(false);
            setInterimTranscript('');
        }
      };

      setRecognition(rec);
    }
  }, [currentIndex]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/interview/${interviewId}`, config);
        
        if (data.status === 'completed') {
            // If already completed, redirect to results
            navigate(`/interview/result/${interviewId}`);
            return;
        }

        setInterview(data);
        // Pre-fill existing answers if any exist (e.g. if page reloaded)
        if (data.answers && data.answers.length > 0) {
            const paddedAnswers = [...data.answers];
            while(paddedAnswers.length < 10) paddedAnswers.push('');
            setAnswers(paddedAnswers.slice(0, 10));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching interview session');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchInterview();
  }, [interviewId, user, navigate]);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < 9) {
      window.speechSynthesis.cancel();
      setIsRecording(false);
      isRecordingRef.current = false;
      setInterimTranscript('');
      if (recognition) recognition.stop();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      window.speechSynthesis.cancel();
      setIsRecording(false);
      isRecordingRef.current = false;
      setInterimTranscript('');
      if (recognition) recognition.stop();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech-to-text is not supported in this browser. Please try Chrome or Edge.");
      return;
    }
    if (isRecording) {
      isRecordingRef.current = false;
      recognition.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      isRecordingRef.current = true;
      try {
        recognition.start();
      } catch(e) {
        // Already started
      }
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    // Check if any answers are empty
    const unansweredCount = answers.filter(a => a.trim() === '').length;
    if (unansweredCount > 0) {
        const confirmSubmit = window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to finish?`);
        if (!confirmSubmit) return;
    }

    try {
        setIsSubmitting(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`/api/interview/evaluate/${interviewId}`, { answers }, config);
        navigate(`/interview/result/${interviewId}`);
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit interview. Please try again.');
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-10 w-10 text-matrix-accent animate-spin" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-matrix-panel border border-matrix-warning/50 rounded-2xl text-center">
        <AlertTriangle className="h-12 w-12 text-matrix-warning mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Session Error</h2>
        <p className="text-matrix-text-muted">{error || "Interview session not found."}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 bg-matrix-panel border border-matrix-border text-white px-6 py-2 rounded-lg hover:bg-[#2D3346] transition-colors">
            Return Home
        </button>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / 10) * 100;
  const currentQuestion = interview.questions[currentIndex];

  if (isSubmitting) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <Loader2 className="h-16 w-16 text-matrix-accent animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Evaluating Your Performance</h2>
            <p className="text-matrix-text-muted">Our AI is meticulously reviewing your answers...</p>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 pb-24">
      {/* Header & Progress */}
      <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
              <div>
                  <h1 className="text-2xl font-bold text-white mb-1">AI Mock Interview</h1>
                  <p className="text-sm text-matrix-text-muted">Analyzing against {interview.analysisReport?.resumeName || 'your resume'}</p>
              </div>
              <div className="text-right">
                  <span className="text-2xl font-bold text-matrix-accent">{currentIndex + 1}</span>
                  <span className="text-matrix-text-muted font-medium"> / 10</span>
              </div>
          </div>
          <div className="w-full bg-[#1C2333] h-2 rounded-full overflow-hidden">
              <div 
                  className="bg-matrix-accent h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
              ></div>
          </div>
      </div>

      {/* Question Card */}
      <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-8 shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-matrix-accent"></div>
          
          <div className="flex justify-between items-start mb-6 pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed flex-1 pr-4">
                  {currentQuestion}
              </h2>
              <button 
                  onClick={() => speakQuestion(currentQuestion)}
                  className="p-3 bg-[#1C2333] hover:bg-matrix-accent/20 border border-matrix-border hover:border-matrix-accent text-matrix-accent rounded-xl transition-all flex-shrink-0"
                  title="Read Question Aloud"
              >
                  <Volume2 className="h-6 w-6" />
              </button>
          </div>
          
          <div className="relative">
              <textarea 
                  value={answers[currentIndex] + (isRecording && interimTranscript ? (answers[currentIndex] && !answers[currentIndex].endsWith(' ') ? ' ' : '') + interimTranscript : '')}
                  onChange={handleAnswerChange}
                  placeholder="Type your detailed answer here or use the microphone..."
                  className="w-full bg-[#0B0F19] border border-matrix-border rounded-xl p-5 text-gray-300 h-64 focus:ring-2 focus:ring-matrix-accent focus:border-transparent outline-none resize-none transition-all"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                  {isRecording && interimTranscript && (
                      <div className="flex items-center gap-2 text-matrix-accent text-sm animate-pulse mr-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Listening...
                      </div>
                  )}
                  <div className="text-xs text-matrix-text-muted">
                      {answers[currentIndex].length} chars
                  </div>
                  <button 
                      onClick={toggleRecording}
                      className={`p-3 rounded-xl transition-all flex items-center gap-2 font-medium ${isRecording ? 'bg-matrix-warning text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse border-none' : 'bg-[#1C2333] hover:bg-[#2D3346] border border-matrix-border text-white'}`}
                  >
                      {isRecording ? (
                          <><MicOff className="h-5 w-5" /> Stop Listening</>
                      ) : (
                          <><Mic className="h-5 w-5 text-matrix-accent" /> Answer via Voice</>
                      )}
                  </button>
              </div>
          </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
          <button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-matrix-panel border border-matrix-border hover:bg-[#2D3346] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
              <ArrowLeft className="h-5 w-5" /> Previous
          </button>

          {currentIndex < 9 ? (
              <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white bg-matrix-accent hover:bg-matrix-accent-hover shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all"
              >
                  Next <ArrowRight className="h-5 w-5" />
              </button>
          ) : (
              <button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-matrix-success hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                  <CheckCircle className="h-5 w-5" /> Finish Interview
              </button>
          )}
      </div>
    </div>
  );
};

export default InterviewSession;
