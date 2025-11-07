import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  ArrowRight,
  Target,
  Code,
  Loader2
} from 'lucide-react';
import { api } from '../apiClient';

// Function to get a company logo based on company name
const getCompanyLogo = (companyName) => {
  const companyLogos = {
    'google': <Globe className="h-6 w-6 text-blue-500" />,
    'microsoft': <Globe className="h-6 w-6 text-blue-500" />, // Changed from Windows to Globe
    'amazon': <ShoppingCart className="h-6 w-6 text-orange-500" />,
    'apple': <Apple className="h-6 w-6 text-gray-500" />,
    'facebook': <Facebook className="h-6 w-6 text-blue-600" />,
    'meta': <Facebook className="h-6 w-6 text-blue-600" />,
    'netflix': <Monitor className="h-6 w-6 text-red-600" />,
    'ibm': <Zap className="h-6 w-6 text-blue-700" />,
    'oracle': <Database className="h-6 w-6 text-red-600" />,
    'sap': <Server className="h-6 w-6 text-blue-600" />,
    'accenture': <Target className="h-6 w-6 text-blue-600" />,
    'deloitte': <Shield className="h-6 w-6 text-red-600" />,
    'infosys': <Code className="h-6 w-6 text-blue-600" />,
    'tcs': <Code className="h-6 w-6 text-blue-800" />,
    'wipro': <Cloud className="h-6 w-6 text-blue-600" />,
    'cognizant': <User className="h-6 w-6 text-blue-600" />,
    'tech': <Code className="h-6 w-6 text-blue-500" />,
    'software': <Code className="h-6 w-6 text-blue-500" />,
    'solution': <Zap className="h-6 w-6 text-yellow-500" />,
    'digital': <Globe className="h-6 w-6 text-blue-500" />,
    'data': <Database className="h-6 w-6 text-green-500" />,
    'cloud': <Cloud className="h-6 w-6 text-blue-400" />,
    'web': <Globe className="h-6 w-6 text-purple-500" />,
    'systems': <Server className="h-6 w-6 text-gray-500" />,
    'services': <User className="h-6 w-6 text-blue-500" />,
    'consulting': <Target className="h-6 w-6 text-green-500" />,
    'solutions': <Zap className="h-6 w-6 text-yellow-500" />,
    'corporation': <Building className="h-6 w-6 text-gray-500" />,
    'corp': <Building className="h-6 w-6 text-gray-500" />,
    'inc': <Building className="h-6 w-6 text-gray-500" />,
    'ltd': <Building className="h-6 w-6 text-gray-500" />,
    'llc': <Building className="h-6 w-6 text-gray-500" />,
    'group': <Users className="h-6 w-6 text-blue-500" />,
    'enterprises': <Building className="h-6 w-6 text-gray-500" />,
    'ventures': <TrendingUp className="h-6 w-6 text-green-500" />,
    'partners': <Users className="h-6 w-6 text-blue-500" />, // Changed from Handshake to Users
    'holdings': <Briefcase className="h-6 w-6 text-gray-500" />,
    'industries': <Factory className="h-6 w-6 text-gray-600" />,
    'international': <Globe className="h-6 w-6 text-blue-500" />,
    'global': <Globe className="h-6 w-6 text-blue-500" />,
    'worldwide': <Globe className="h-6 w-6 text-blue-500" />,
    'united': <Flag className="h-6 w-6 text-blue-500" />,
    'national': <Flag className="h-6 w-6 text-red-500" />,
    'american': <Flag className="h-6 w-6 text-red-500" />,
    'british': <Flag className="h-6 w-6 text-red-500" />,
    'german': <Flag className="h-6 w-6 text-black-500" />,
    'french': <Flag className="h-6 w-6 text-blue-500" />,
    'japanese': <Flag className="h-6 w-6 text-red-500" />,
    'chinese': <Flag className="h-6 w-6 text-red-500" />,
    'indian': <Flag className="h-6 w-6 text-orange-500" />,
    'canadian': <Flag className="h-6 w-6 text-red-500" />,
    'australian': <Flag className="h-6 w-6 text-blue-500" />
  };

  // Convert company name to lowercase for matching
  const lowerCompanyName = companyName.toLowerCase();
  
  // Try to find an exact match first
  for (const [key, icon] of Object.entries(companyLogos)) {
    if (lowerCompanyName.includes(key)) {
      return icon;
    }
  }
  
  // If no match found, return a default building icon
  return <Building className="h-6 w-6 text-gray-500" />;
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [resumeSkills, setResumeSkills] = useState([]);

  // Get skills from the last analysis
  useEffect(() => {
    const lastAnalysis = localStorage.getItem('lastAnalysis');
    const storedResumeSkills = localStorage.getItem('resumeSkills');
    
    if (lastAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(lastAnalysis);
        // Use resume skills from the analysis
        if (parsedAnalysis.resume_skills) {
          setSkills(parsedAnalysis.resume_skills);
          setResumeSkills(parsedAnalysis.resume_skills);
        } else {
          // Fallback to default skills if none are available
          setSkills(['JavaScript', 'React', 'Python', 'SQL']);
          setResumeSkills(['JavaScript', 'React', 'Python', 'SQL']);
        }
      } catch (e) {
        console.error('Error parsing last analysis:', e);
        // Fallback to default skills if there's an error
        setSkills(['JavaScript', 'React', 'Python', 'SQL']);
        setResumeSkills(['JavaScript', 'React', 'Python', 'SQL']);
      }
    } else {
      // Default skills if no analysis is available
      setSkills(['JavaScript', 'React', 'Python', 'SQL']);
      setResumeSkills(['JavaScript', 'React', 'Python', 'SQL']);
    }
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/jobs/', {
        params: {
          skills: skills.join(',')
        }
      });
      
      setJobs(response.data.jobs);
    } catch (err) {
      setError('Error fetching job recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skills.length > 0) {
      fetchJobs();
    }
  }, [skills]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Job <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Recommendations</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Discover job opportunities tailored to your skills and experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 bg-muted/50 rounded-3xl my-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Your Skills
            </h2>
            <p className="text-muted-foreground">
              Based on your resume, here are the skills we're matching you with
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {resumeSkills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                {skill}
              </motion.span>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding Jobs...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Refresh Recommendations
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recommended Jobs</h2>
            <p className="text-muted-foreground text-lg">
              Opportunities that match your skills and experience
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center mb-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchJobs}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-background border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                          {getCompanyLogo(job.company)}
                        </div>
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    
                    {job.salary && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      <span>Posted recently</span>
                    </div>
                    
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Apply
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any jobs matching your skills. Try updating your resume or checking back later.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Analyze Your Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prepare for Your Applications</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get personalized interview preparation materials based on your skills
          </p>
          <Link
            to="/interview-prep"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            Interview Preparation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default JobsPage;