import React, { useState, useEffect } from 'react';
import { chatbotAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaGraduationCap, 
  FaPlay, 
  FaBook, 
  FaExternalLinkAlt,
  FaYoutube,
  FaFilePdf,
  FaGlobe,
  FaCode,
  FaDatabase,
  FaMobile,
  FaCloud
} from 'react-icons/fa';

const LearningContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 3rem 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.color || props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1rem;
  text-align: center;
`;

const CategoryDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResourceItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    transform: translateX(5px);
  }
`;

const ResourceIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color || props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ResourceContent = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const ResourceDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const ResourceType = styled.span`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RecommendationsSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: 2rem;
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PriorityBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.priority) {
      case 'high': return props.theme.colors.danger;
      case 'medium': return props.theme.colors.warning;
      case 'low': return props.theme.colors.success;
      default: return props.theme.colors.gray[500];
    }
  }};
  color: ${props => props.theme.colors.white};
`;

const LearningLibrary = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await chatbotAPI.getUpskillingRecommendations();
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const learningCategories = [
    {
      title: 'Web Development',
      icon: <FaCode />,
      color: '#3b82f6',
      description: 'Learn modern web development technologies',
      resources: [
        {
          title: 'Complete Web Development Course',
          description: 'Comprehensive course covering HTML, CSS, JavaScript, and more',
          type: 'YouTube',
          icon: <FaYoutube />,
          color: '#ef4444',
          url: 'https://youtube.com/watch?v=example1'
        },
        {
          title: 'FreeCodeCamp',
          description: 'Free coding bootcamp with certifications',
          type: 'Course',
          icon: <FaGraduationCap />,
          color: '#10b981',
          url: 'https://freecodecamp.org'
        },
        {
          title: 'Frontend Mentor',
          description: 'Practice with real-world projects',
          type: 'Practice',
          icon: <FaCode />,
          color: '#8b5cf6',
          url: 'https://frontendmentor.io'
        }
      ]
    },
    {
      title: 'Data Science',
      icon: <FaDatabase />,
      color: '#10b981',
      description: 'Master data analysis and machine learning',
      resources: [
        {
          title: 'Data Science Specialization',
          description: 'Coursera course by Johns Hopkins University',
          type: 'Course',
          icon: <FaGraduationCap />,
          color: '#10b981',
          url: 'https://coursera.org/specializations/data-science'
        },
        {
          title: 'Kaggle Learn',
          description: 'Hands-on data science micro-courses',
          type: 'Practice',
          icon: <FaBook />,
          color: '#f59e0b',
          url: 'https://kaggle.com/learn'
        },
        {
          title: 'Python for Data Science',
          description: 'YouTube tutorial series',
          type: 'YouTube',
          icon: <FaYoutube />,
          color: '#ef4444',
          url: 'https://youtube.com/watch?v=example2'
        }
      ]
    },
    {
      title: 'Mobile Development',
      icon: <FaMobile />,
      color: '#8b5cf6',
      description: 'Build mobile apps for iOS and Android',
      resources: [
        {
          title: 'React Native Tutorial',
          description: 'Learn cross-platform mobile development',
          type: 'YouTube',
          icon: <FaYoutube />,
          color: '#ef4444',
          url: 'https://youtube.com/watch?v=example3'
        },
        {
          title: 'Flutter Development',
          description: 'Google\'s UI toolkit for mobile apps',
          type: 'Course',
          icon: <FaGraduationCap />,
          color: '#10b981',
          url: 'https://flutter.dev/learn'
        }
      ]
    },
    {
      title: 'Cloud Computing',
      icon: <FaCloud />,
      color: '#f59e0b',
      description: 'Master cloud platforms and services',
      resources: [
        {
          title: 'AWS Fundamentals',
          description: 'Amazon Web Services basics',
          type: 'Course',
          icon: <FaGraduationCap />,
          color: '#10b981',
          url: 'https://aws.amazon.com/training/'
        },
        {
          title: 'Google Cloud Platform',
          description: 'GCP training and certification',
          type: 'Course',
          icon: <FaGraduationCap />,
          color: '#10b981',
          url: 'https://cloud.google.com/training'
        }
      ]
    }
  ];

  return (
    <LearningContainer>
      <Header>
        <Title>
          <FaGraduationCap />
          Learning Library
        </Title>
        <Subtitle>
          Enhance your skills with free resources and courses tailored to your career goals
        </Subtitle>
      </Header>

      {recommendations.length > 0 && (
        <Section>
          <RecommendationsSection>
            <SectionTitle>Personalized Recommendations</SectionTitle>
            {recommendations.map((rec, index) => (
              <RecommendationItem key={index}>
                <PriorityBadge priority={rec.priority}>
                  {rec.priority.toUpperCase()}
                </PriorityBadge>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.25rem', color: '#1e293b' }}>
                    {rec.skill}
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Recommended based on your profile and job market trends
                  </p>
                </div>
              </RecommendationItem>
            ))}
          </RecommendationsSection>
        </Section>
      )}

      <Section>
        <SectionTitle>Learning Categories</SectionTitle>
        <CategoriesGrid>
          {learningCategories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryIcon color={category.color}>
                {category.icon}
              </CategoryIcon>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryDescription>{category.description}</CategoryDescription>
              <ResourcesList>
                {category.resources.map((resource, resIndex) => (
                  <ResourceItem key={resIndex} href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ResourceIcon color={resource.color}>
                      {resource.icon}
                    </ResourceIcon>
                    <ResourceContent>
                      <ResourceTitle>{resource.title}</ResourceTitle>
                      <ResourceDescription>{resource.description}</ResourceDescription>
                    </ResourceContent>
                    <ResourceType>{resource.type}</ResourceType>
                    <FaExternalLinkAlt style={{ color: '#6b7280' }} />
                  </ResourceItem>
                ))}
              </ResourcesList>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>
    </LearningContainer>
  );
};

export default LearningLibrary;