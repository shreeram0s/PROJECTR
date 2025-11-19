import pdfplumber
import docx2txt
import spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import nltk
import re
from collections import Counter
import string

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

class TextExtractor:
    @staticmethod
    def extract_text_from_file(file_path):
        """Extract text from PDF, DOC/DOCX, or TXT files"""
        text = ""
        try:
            if file_path.endswith('.pdf'):
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() or ""
            elif file_path.endswith('.docx'):
                text = docx2txt.process(file_path)
            elif file_path.endswith('.doc'):
                text = docx2txt.process(file_path)
            elif file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
        except Exception as e:
            print(f"Error extracting text: {e}")
        return text

class TextPreprocessor:
    def __init__(self):
        # Load spaCy model if available
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.use_spacy = True
        except OSError:
            self.nlp = None
            self.use_spacy = False
        
        # Initialize NLTK components
        self.lemmatizer = WordNetLemmatizer()
        try:
            self.stop_words = set(stopwords.words('english'))
        except LookupError:
            self.stop_words = set()
        # Add custom resume-related stopwords
        self.custom_stopwords = {
            'job', 'work', 'experience', 'skill', 'ability', 'knowledge', 'responsibility',
            'duty', 'task', 'role', 'position', 'company', 'organization', 'team', 'project',
            'year', 'month', 'education', 'degree', 'university', 'college', 'school',
            'qualification', 'certification', 'certificate', 'training', 'course',
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
            "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself',
            'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves'
        }
        self.stop_words.update(self.custom_stopwords)
    
    def preprocess_text(self, text):
        """Preprocess text using spaCy (primary) or NLTK (fallback)"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation and special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        
        if self.use_spacy and self.nlp:
            # Use spaCy for preprocessing
            doc = self.nlp(text)
            tokens = [
                token.lemma_ for token in doc 
                if token.pos_ in ['NOUN', 'PROPN', 'ADJ', 'VERB'] 
                and token.lemma_ not in self.stop_words 
                and len(token.lemma_) > 2
            ]
        else:
            # Fallback to NLTK
            try:
                tokens = word_tokenize(text)
            except LookupError:
                tokens = re.findall(r'\b\w+\b', text)
            tokens = [
                self.lemmatizer.lemmatize(token) 
                for token in tokens 
                if token not in self.stop_words 
                and len(token) > 2
                and token not in string.punctuation
            ]
        
        return ' '.join(tokens)

# Curated skill dictionaries
technical_skills = {
    # Programming Languages
    'python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    'php', 'ruby', 'scala', 'r', 'matlab', 'sql', 'typescript', 'dart', 'perl',
    
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
    'flask', 'spring', 'laravel', 'asp.net', 'ruby on rails', 'next.js', 'nuxt.js',
    'svelte', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less',
    
    # Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
    'oracle', 'sql server', 'cassandra', 'couchbase', 'dynamodb',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
    'ansible', 'terraform', 'puppet', 'chef', 'openshift', 'heroku', 'vercel',
    
    # Data Science & ML
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
    'matplotlib', 'seaborn', 'plotly', 'tableau', 'power bi', 'spark', 'hadoop',
    
    # Mobile Development
    'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
    
    # Other Technologies
    'linux', 'ubuntu', 'centos', 'bash', 'powershell', 'git', 'svn', 'agile',
    'scrum', 'kanban', 'jira', 'confluence', 'slack', 'trello', 'notion'
}

soft_skills = {
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'creativity', 'adaptability', 'time management', 'organization', 'planning',
    'decision making', 'negotiation', 'conflict resolution', 'empathy', 'patience',
    'reliability', 'work ethic', 'initiative', 'self-motivation', 'attention to detail',
    'customer service', 'interpersonal skills', 'presentation skills', 'public speaking',
    'mentoring', 'coaching', 'delegation', 'project management', 'risk management',
    'strategic thinking', 'innovation', 'flexibility', 'resilience', 'stress management'
}

class SkillExtractor:
    @staticmethod
    def extract_skills_from_text(text):
        """Extract technical and soft skills from text"""
        if not text:
            return [], [], []
        
        text_lower = text.lower()
        found_technical = []
        found_soft = []
        
        # Extract technical skills
        for skill in technical_skills:
            if skill in text_lower:
                found_technical.append(skill)
        
        # Extract soft skills
        for skill in soft_skills:
            if skill in text_lower:
                found_soft.append(skill)
        
        # Combine all skills
        all_skills = list(set(found_technical + found_soft))
        
        return found_technical, found_soft, all_skills
    
    @staticmethod
    def extract_skills_from_job_description(text):
        """Extract skills from job description with priority scoring"""
        if not text:
            return [], {}, []
        
        text_lower = text.lower()
        found_skills = []
        skill_priorities = {}
        
        # Extract all skills
        for skill in technical_skills.union(soft_skills):
            if skill in text_lower:
                found_skills.append(skill)
                # Calculate priority score
                frequency = text_lower.count(skill)
                # Boost for emphasis words
                emphasis_boost = 0
                emphasis_words = ['required', 'must have', 'essential', 'critical', 'key', 'necessary']
                for word in emphasis_words:
                    if word in text_lower[max(0, text_lower.find(skill)-50):text_lower.find(skill)+50]:
                        emphasis_boost += 1
                priority_score = frequency + emphasis_boost
                skill_priorities[skill] = priority_score
        
        # Sort by priority
        sorted_skills = sorted(skill_priorities.items(), key=lambda x: x[1], reverse=True)
        sorted_skill_dict = dict(sorted_skills)
        
        return found_skills, sorted_skill_dict, list(sorted_skill_dict.keys())

class EmbeddingAnalyzer:
    def __init__(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.use_sentence_transformers = True
        except Exception:
            self.model = None
            self.use_sentence_transformers = False
    
    def calculate_semantic_similarity(self, text1, text2):
        """Calculate semantic similarity using SentenceTransformers or TF-IDF"""
        if not text1 or not text2:
            return 0.0
        
        if self.use_sentence_transformers and self.model:
            try:
                embeddings = self.model.encode([text1, text2])
                from sklearn.metrics.pairwise import cosine_similarity
                similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
                return similarity * 100
            except Exception:
                pass
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity * 100

class YouTubeRecommendationEngine:
    def __init__(self, api_key):
        self.api_key = api_key
    
    def get_skill_recommendations(self, skills):
        """Get YouTube recommendations for skills"""
        if not skills or not self.api_key:
            return {}
        
        try:
            from googleapiclient.discovery import build
            from googleapiclient.errors import HttpError
            youtube = build('youtube', 'v3', developerKey=self.api_key)
            
            recommendations = {}
            for skill in skills[:5]:  # Limit to top 5 skills
                try:
                    search_response = youtube.search().list(
                        q=f"learn {skill} tutorial programming",
                        part='snippet',
                        type='video',
                        maxResults=3,
                        order='viewCount'
                    ).execute()
                    
                    videos = []
                    for search_result in search_response.get('items', []):
                        video = {
                            'title': search_result['snippet']['title'],
                            'url': f"https://www.youtube.com/watch?v={search_result['id']['videoId']}",
                            'thumbnail': search_result['snippet']['thumbnails']['default']['url']
                        }
                        videos.append(video)
                    
                    recommendations[skill] = videos
                except HttpError as e:
                    if 'quotaExceeded' in str(e):
                        print(f"YouTube API quota exceeded for skill: {skill}")
                        # Return empty list for this skill but continue with others
                        recommendations[skill] = []
                    else:
                        # Re-raise other HTTP errors
                        raise e
                except Exception as e:
                    print(f"Error fetching YouTube recommendations for skill {skill}: {e}")
                    recommendations[skill] = []
            
            return recommendations
        except Exception as e:
            print(f"Error fetching YouTube recommendations: {e}")
            # Return empty dict instead of failing completely
            return {}

class ResumeAnalyzer:
    def __init__(self, youtube_api_key=None):
        self.preprocessor = TextPreprocessor()
        self.skill_extractor = SkillExtractor()
        self.embedding_analyzer = EmbeddingAnalyzer()
        self.youtube_engine = YouTubeRecommendationEngine(youtube_api_key) if youtube_api_key else None
    
    def _find_missing_skills(self, resume_skills, job_skills):
        """Find missing skills in resume compared to job description"""
        return list(set(job_skills) - set(resume_skills))
    
    def _calculate_skill_match_score(self, resume_skills, job_skills):
        """Calculate skill match score as percentage with improved error handling"""
        try:
            # Handle edge cases
            if job_skills is None:
                job_skills = []
            if resume_skills is None:
                resume_skills = []
                
            # Convert to sets to ensure uniqueness
            job_skills_set = set(job_skills)
            resume_skills_set = set(resume_skills)
            
            # Handle case where there are no job skills
            if len(job_skills_set) == 0:
                return 100.0
            
            # Calculate intersection
            intersection = resume_skills_set & job_skills_set
            
            # Calculate percentage
            score = (len(intersection) / len(job_skills_set)) * 100
            
            # Ensure score is within valid range
            score = max(0.0, min(100.0, score))
            
            return score
        except Exception as e:
            print(f"Error calculating skill match score: {e}")
            return 0.0
    
    def _calculate_overall_score(self, semantic_similarity, skill_match_score, missing_skills):
        """Calculate overall match score with improved error handling"""
        try:
            # Handle None or NaN values
            if semantic_similarity is None or semantic_similarity != semantic_similarity:  # Check for NaN
                semantic_similarity = 0.0
            if skill_match_score is None or skill_match_score != skill_match_score:  # Check for NaN
                skill_match_score = 0.0
                
            # Ensure values are within valid range
            semantic_similarity = max(0.0, min(100.0, float(semantic_similarity)))
            skill_match_score = max(0.0, min(100.0, float(skill_match_score)))
            
            # Weighted combination: 40% semantic similarity, 50% skill match, 10% missing skills penalty
            missing_penalty = min(len(missing_skills) * 2, 20)  # Max 20 point penalty
            
            overall_score = (semantic_similarity * 0.4) + (skill_match_score * 0.5) - missing_penalty
            
            # Ensure score is within 0-100 range
            overall_score = max(0.0, min(100.0, overall_score))
            
            return overall_score
        except Exception as e:
            print(f"Error calculating overall score: {e}")
            return 0.0
    
    def _generate_ai_suggestions(self, resume_text, resume_skills, job_skills, missing_skills):
        """Generate AI suggestions for resume improvement"""
        suggestions = []
        
        # Suggestion based on missing skills
        if missing_skills:
            suggestions.append(f"Add these key skills to your resume: {', '.join(missing_skills[:5])}")
        
        # Suggestion based on resume length
        if len(resume_text.split()) < 300:
            suggestions.append("Your resume seems quite brief. Consider adding more details about your experiences and achievements.")
        
        # Suggestion to add metrics
        if "increased" not in resume_text.lower() and "reduced" not in resume_text.lower() and "improved" not in resume_text.lower():
            suggestions.append("Include quantifiable achievements with metrics (e.g., 'increased sales by 25%', 'reduced processing time by 40%').")
        
        # Suggestion to replace weak verbs
        weak_verbs = ['helped', 'assisted', 'worked on', 'involved in']
        for verb in weak_verbs:
            if verb in resume_text.lower():
                suggestions.append(f"Replace '{verb}' with stronger action verbs like 'led', 'managed', 'developed', 'implemented'.")
                break
        
        return suggestions
    
    def perform_comprehensive_analysis(self, resume_text, job_description_text):
        """Perform comprehensive analysis of resume and job description"""
        # Extract and preprocess texts
        processed_resume = self.preprocessor.preprocess_text(resume_text)
        processed_jd = self.preprocessor.preprocess_text(job_description_text)
        
        # Extract skills
        resume_tech_skills, resume_soft_skills, resume_all_skills = self.skill_extractor.extract_skills_from_text(resume_text)
        job_skills, job_skill_priorities, job_skills_sorted = self.skill_extractor.extract_skills_from_job_description(job_description_text)
        
        # Find missing skills
        missing_skills = self._find_missing_skills(resume_all_skills, job_skills)
        
        # Calculate semantic similarity
        semantic_similarity = self.embedding_analyzer.calculate_semantic_similarity(processed_resume, processed_jd)
        
        # Calculate skill match score
        skill_match_score = self._calculate_skill_match_score(resume_all_skills, job_skills)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(semantic_similarity, skill_match_score, missing_skills)
        
        # Generate AI suggestions
        suggestions = self._generate_ai_suggestions(resume_text, resume_all_skills, job_skills, missing_skills)
        
        # Get YouTube recommendations
        youtube_recommendations = {}
        if self.youtube_engine:
            youtube_recommendations = self.youtube_engine.get_skill_recommendations(missing_skills)
        
        # Create keyword frequency maps
        def _to_freq_map(skills_list, priorities=None):
            if priorities:
                return priorities
            return dict(Counter(skills_list))
        
        resume_keyword_freq = _to_freq_map(resume_all_skills)
        jd_keyword_freq = _to_freq_map(job_skills, job_skill_priorities)
        
        # Return comprehensive results
        return {
            'semantic_similarity': semantic_similarity,
            'skill_match_score': skill_match_score,
            'overall_score': overall_score,
            'resume_skills': resume_all_skills,
            'job_skills': job_skills,
            'missing_skills': missing_skills,
            'resume_keyword_freq': resume_keyword_freq,
            'jd_keyword_freq': jd_keyword_freq,
            'suggestions': suggestions,
            'youtube_recommendations': youtube_recommendations
        }