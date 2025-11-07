import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  BarChart3, 
  FileText, 
  Calendar, 
  ArrowRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { api } from '../apiClient';
import AnalysisResults from '../components/AnalysisResults';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/history/');
      setHistory(response.data.history);
    } catch (err) {
      setError('Error fetching analysis history. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const viewDetails = async (analysisId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/analyze/', {
        analysis_id: analysisId
      });
      setSelectedAnalysis(response.data);
      setShowDetails(true);
    } catch (err) {
      setError('Error fetching analysis details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reanalyze = async (analysisId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/analyze/', {
        analysis_id: analysisId
      });
      
      // Store in localStorage and navigate to results
      localStorage.setItem('lastAnalysis', JSON.stringify(response.data));
      navigate('/home');
    } catch (err) {
      setError('Error re-analyzing document. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (showDetails && selectedAnalysis) {
    return (
      <div className="min-h-screen container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              ← Back to History
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">Analysis Details</h1>
          </div>
          
          <AnalysisResults analysisData={selectedAnalysis} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Analysis History</h1>
          <p className="text-muted-foreground text-lg">
            Review your previous resume and job description analyses
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {history.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-background border rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(analysis.created_at)}</span>
                      </div>
                      <div className={`text-2xl font-bold ${getMatchScoreColor(analysis.match_score)}`}>
                        {Math.round(analysis.match_score)}%
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Match Score</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${analysis.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Missing Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-muted rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {analysis.missing_skills.length > 3 && (
                          <span className="px-2 py-1 bg-muted rounded-md text-xs">
                            +{analysis.missing_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">Analysis #{analysis.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewDetails(analysis.id)}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => reanalyze(analysis.id)}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Reanalyze
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Analysis History</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't analyzed any resumes or job descriptions yet.
                </p>
                <button
                  onClick={() => window.location.href = '/home'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Analyze Your First Resume
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;