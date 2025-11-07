import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileUp, 
  FileText, 
  BarChart3, 
  Users, 
  ArrowRight,
  Upload,
  Zap,
  Target,
  FileSearch,
  GitCompare
} from 'lucide-react';
import { api, apiForm } from '../apiClient';
import SkillDistributionChart from '../components/SkillDistributionChart';

const ComparePage = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleCompare = async () => {
    if (!file1) {
      setError('Please upload the first resume');
      return;
    }
    
    if (!file2) {
      setError('Please upload the second resume');
      return;
    }

    setLoading(true);
    setShowAnimation(true);
    setError(null);

    const formData1 = new FormData();
    formData1.append('resume', file1);
    formData1.append('jd', file1); // Using same file for both resume and jd

    const formData2 = new FormData();
    formData2.append('resume', file2);
    formData2.append('jd', file2); // Using same file for both resume and jd

    try {
      // Upload first file
      const uploadResponse1 = await apiForm.post('/api/upload/', formData1);
      
      // Upload second file
      const uploadResponse2 = await apiForm.post('/api/upload/', formData2);

      // Analyze first file
      const analyzeResponse1 = await api.post('/api/analyze/', {
        analysis_id: uploadResponse1.data.analysis_id
      });

      // Analyze second file
      const analyzeResponse2 = await api.post('/api/analyze/', {
        analysis_id: uploadResponse2.data.analysis_id
      });

      // Compare files
      const compareResponse = await api.post('/api/compare/', {
        file1_id: uploadResponse1.data.analysis_id,
        file2_id: uploadResponse2.data.analysis_id
      });

      setComparisonData({
        file1: analyzeResponse1.data,
        file2: analyzeResponse2.data,
        comparison: compareResponse.data
      });
    } catch (err) {
      let errorMessage = 'Error comparing documents. Please try again.';
      
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
      setShowAnimation(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Resume Comparison</h1>
          <p className="text-muted-foreground text-lg">
            Compare two resumes to analyze similarities and differences in skills
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-background border rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-dashed rounded-2xl p-8 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">First Resume</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload a resume for comparison
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFile1Change}
                />
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {file1 ? file1.name : 'Choose File'}
                </div>
              </label>
            </div>
            
            <div className="border-2 border-dashed rounded-2xl p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Second Resume</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload another resume for comparison
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFile2Change}
                />
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {file2 ? file2.name : 'Choose File'}
                </div>
              </label>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={handleCompare}
              disabled={!file1 || !file2 || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  Compare Resumes
                </>
              )}
            </button>
            
            {error && (
              <p className="text-red-500 mt-4">{error}</p>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        {comparisonData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Similarity Score */}
            <div className="bg-background border rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Similarity Score</h2>
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{Math.round(comparisonData.comparison.similarity_score)}%</span>
                </div>
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${comparisonData.comparison.similarity_score}, 100`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-muted-foreground mt-4">
                The resumes share {comparisonData.comparison.similarity_score}% similarity in skills.
              </p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-background border rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">Skills Distribution</h3>
                <SkillDistributionChart
                  data={comparisonData.comparison.skill_distribution}
                />
              </div>
              
              <div className="bg-background border rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">Skills Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={comparisonData.comparison.skill_comparison}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="skills" fill="url(#barGradient)" />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Skill Analysis */}
            <div className="bg-background border rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-center">Detailed Skill Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-center text-blue-500">Resume 1 Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonData.file1.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-center text-green-500">Common Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonData.comparison.common_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-center text-purple-500">Resume 2 Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonData.file2.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Unique Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-center text-red-500">Unique to Resume 1</h3>
                <div className="flex flex-wrap gap-2">
                  {comparisonData.comparison.unique_to_file1.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-background border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-center text-orange-500">Unique to Resume 2</h3>
                <div className="flex flex-wrap gap-2">
                  {comparisonData.comparison.unique_to_file2.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {!comparisonData && !loading && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compare Resumes</h3>
            <p className="text-muted-foreground">
              Upload two resumes to see a detailed comparison of their skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;