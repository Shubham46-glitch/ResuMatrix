import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-matrix-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-matrix-accent" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">How can we help?</h1>
        <p className="text-matrix-text-muted mb-10 max-w-lg mx-auto">Browse our knowledge base or reach out to our support team for assistance with your resume optimization.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-matrix-panel border border-matrix-border hover:border-matrix-accent transition-colors rounded-2xl p-6 cursor-pointer group">
                <FileText className="h-6 w-6 text-white mb-4 group-hover:text-matrix-accent transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2 text-left">Documentation</h3>
                <p className="text-matrix-text-muted text-sm text-left mb-4">Learn how our ATS scoring algorithm works and how to interpret your results.</p>
                <div className="flex items-center text-matrix-accent text-sm font-medium">
                    Read Docs <ExternalLink className="h-4 w-4 ml-1" />
                </div>
            </div>

            <div className="bg-matrix-panel border border-matrix-border hover:border-matrix-accent transition-colors rounded-2xl p-6 cursor-pointer group">
                <MessageCircle className="h-6 w-6 text-white mb-4 group-hover:text-matrix-accent transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2 text-left">Contact Support</h3>
                <p className="text-matrix-text-muted text-sm text-left mb-4">Can't find what you're looking for? Send a message to our human support team.</p>
                <div className="flex items-center text-matrix-accent text-sm font-medium">
                    Open Ticket <ExternalLink className="h-4 w-4 ml-1" />
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Help;
