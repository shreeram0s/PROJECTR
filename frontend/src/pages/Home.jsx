import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileUp, 
  FileText, 
  BarChart3, 
  Search, 
  Users, 
  ArrowRight,
  Upload,
  Brain,
  Target,
  BookOpen,
  Briefcase,
  Loader2,
  ScanFace,
  FileSearch,
  Lightbulb,
  Globe,
  Award
} from 'lucide-react';
import { api, apiForm } from '../apiClient';
import AnalysisResults from '../components/AnalysisResults';
import AnalysisAnimation from '../components/AnalysisAnimation';

const workflowSteps = [
  {
    icon: <FileUp className="h-8 w-8" />,
    title: 'Upload Documents',
    description: 'Upload your resume and job description in PDF, DOCX, or TXT format.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: <ScanFace className="h-8 w-8" />,
    title: 'AI Analysis',
    description: 'Our AI extracts skills, computes match scores, and identifies gaps.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Visual Insights',
    description: 'View detailed analytics on your skills and areas for improvement.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: 'Learn & Improve',
    description: 'Get personalized learning resources for missing skills.',
    color: 'from-pink-500 to-pink-600'
  }
];

const features = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Resume Analysis',
    description: 'AI-powered analysis of your resume to extract skills and experiences using advanced NLP techniques.'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Analytics Dashboard',
    description: 'Visualize your skills and identify areas for improvement with interactive charts and graphs.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Learning Resources',
    description: 'Get personalized learning recommendations based on your skill gaps from YouTube tutorials.'
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'AI Insights',
    description: 'Receive actionable insights to optimize your career profile using machine learning algorithms.'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Job Recommendations',
    description: 'Discover job opportunities tailored to your skills using Adzuna API with location-based filtering.'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Interview Prep',
    description: 'Get personalized interview questions and study materials for technical and behavioral interviews.'
  }
];

const Home = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [error, setError] = useState(null);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleJDChange = (e) => {
    setJobDescription(e.target.files[0]);
  };

  const handleAnalysisComplete = () => {
    setShowAnimation(false);
  };

  const handleAnalyze = async () => {
    if (!resume) {
      setError('Please upload your resume');
      return;
    }
    
    if (!jobDescription) {
      setError('Please upload the job description');
      return;
    }

    setLoading(true);
    setShowAnimation(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jobDescription);

    try {
      // Upload files
      const uploadResponse = await apiForm.post('/api/upload/', formData);

      // Show success message for document upload
      setError('Resume and Job Description uploaded successfully!');
      
      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Analyze files
      const analyzeResponse = await api.post('/api/analyze/', {
        analysis_id: uploadResponse.data.analysis_id
      });

      setAnalysisData(analyzeResponse.data);
      
      // Store analysis results in localStorage for other pages
      localStorage.setItem('lastAnalysis', JSON.stringify(analyzeResponse.data));
      
      // Store missing skills in localStorage for interview prep
      if (analyzeResponse.data.missing_skills) {
        localStorage.setItem('missingSkills', JSON.stringify(analyzeResponse.data.missing_skills));
      }
      
      // Store resume skills in localStorage for job recommendations
      if (analyzeResponse.data.resume_skills) {
        localStorage.setItem('resumeSkills', JSON.stringify(analyzeResponse.data.resume_skills));
      }
      
      // Clear any previous error messages
      setError(null);
    } catch (err) {
      // Improved error handling with detailed logging
      console.error('Full error object:', err);
      
      let errorMessage = 'Error analyzing documents. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response);
        if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = 'Network error. Please check your connection and make sure the backend server is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
      setShowAnimation(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Analysis Animation Overlay */}
      <AnalysisAnimation 
        isLoading={showAnimation} 
        onComplete={handleAnalysisComplete} 
      />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Optimize Your Career Journey with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">AI Precision</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Upload your resume and job description to get instant insights, skill analysis, and personalized recommendations to advance your career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Document Upload Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 bg-muted/50 rounded-3xl my-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Resume</h2>
            <p className="text-muted-foreground text-lg">
              Upload your resume and job description to get detailed analysis of your skills and recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <div className="bg-background border rounded-2xl p-8">
              <div className="text-center mb-6">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your resume in PDF, DOCX, or TXT format
                </p>
              </div>
              
              <div className="border-2 border-dashed rounded-xl p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">
                      {resume ? resume.name : 'Choose File'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      PDF, DOCX, or TXT
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Job Description Upload */}
            <div className="bg-background border rounded-2xl p-8">
              <div className="text-center mb-6">
                <FileSearch className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Job Description</h3>
                <p className="text-muted-foreground text-sm">
                  Upload the job description in PDF, DOCX, or TXT format
                </p>
              </div>
              
              <div className="border-2 border-dashed rounded-xl p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleJDChange}
                  className="hidden"
                  id="jd-upload"
                />
                <label htmlFor="jd-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">
                      {jobDescription ? jobDescription.name : 'Choose File'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      PDF, DOCX, or TXT
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={handleAnalyze}
              disabled={loading || !resume || !jobDescription}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Documents...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  Analyze Documents
                </>
              )}
            </button>
            
            {error && (
              <p className="text-red-500 mt-4">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* Analysis Results */}
      {analysisData && (
        <section className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Analysis Results</h2>
              <p className="text-muted-foreground text-lg">
                Detailed insights from your resume analysis
              </p>
            </div>
            
            <AnalysisResults analysisData={analysisData} />
            
            {/* Next Steps */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-6">Continue Your Career Journey</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <BarChart3 className="h-5 w-5" />
                  View Dashboard
                </Link>
                <Link
                  to="/suggestions"
                  className="flex items-center gap-2 px-6 py-3 bg-background border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Lightbulb className="h-5 w-5" />
                  See Suggestions
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 px-6 py-3 bg-background border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  Find Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workflow Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 bg-muted/50 rounded-3xl my-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Simple steps to optimize your career profile
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
              </div>
              <div className="text-4xl font-bold text-primary/20 mb-2">0{index + 1}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Career Insights</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to understand and optimize your career profile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-background p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;