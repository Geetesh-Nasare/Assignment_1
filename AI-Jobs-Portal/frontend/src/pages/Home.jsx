import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaBriefcase, 
  FaUsers, 
  FaRocket, 
  FaBrain,
  FaChartLine,
  FaGraduationCap,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 6rem 0;
  text-align: center;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &.primary {
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.primary};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.xl};
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.white};
    border: 2px solid ${props => props.theme.colors.white};

    &:hover {
      background: ${props => props.theme.colors.white};
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: ${props => props.theme.colors.white};
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: ${props => props.theme.colors.gray[50]};
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.gray[600]};
  font-weight: 500;
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: ${props => props.theme.colors.light};
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.6;
`;

const CTA = styled.div`
  background: ${props => props.theme.colors.dark};
  color: ${props => props.theme.colors.white};
  padding: 4rem 0;
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FaBrain />,
      title: "AI-Powered Matching",
      description: "Our advanced AI algorithm matches your skills and preferences with the perfect job opportunities."
    },
    {
      icon: <FaRocket />,
      title: "Instant Applications",
      description: "Apply to multiple jobs with one click. Our system auto-fills your information from your profile."
    },
    {
      icon: <FaChartLine />,
      title: "Smart Analytics",
      description: "Track your application progress and get insights on your job search performance."
    },
    {
      icon: <FaGraduationCap />,
      title: "Learning Resources",
      description: "Access free courses, tutorials, and upskilling materials to enhance your skills."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security and privacy measures."
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      description: "Connect with other job seekers and get support from our AI career assistant."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Job Seekers" },
    { number: "500+", label: "Partner Companies" },
    { number: "5K+", label: "Jobs Posted" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroTitle>
            Find Your Dream Job with AI
          </HeroTitle>
          <HeroSubtitle>
            Connect with top companies and discover opportunities that match your skills, 
            interests, and career goals using our intelligent matching system.
          </HeroSubtitle>
          <HeroButtons>
            {user ? (
              <Button to="/dashboard" className="primary">
                Go to Dashboard
                <FaArrowRight />
              </Button>
            ) : (
              <>
                <Button to="/register" className="primary">
                  Get Started
                  <FaArrowRight />
                </Button>
                <Button to="/login" className="secondary">
                  Sign In
                </Button>
              </>
            )}
          </HeroButtons>
        </HeroContainer>
      </HeroSection>

      <StatsSection>
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>
      </StatsSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose AI Jobs Portal?</SectionTitle>
          <SectionSubtitle>
            We leverage cutting-edge AI technology to revolutionize the job search experience
          </SectionSubtitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <CTA>
        <CTAContainer>
          <CTATitle>Ready to Transform Your Career?</CTATitle>
          <CTASubtitle>
            Join thousands of job seekers who have found their dream jobs through our platform
          </CTASubtitle>
          <CTAButtons>
            {user ? (
              <Button to="/jobs" className="primary">
                <FaSearch />
                Browse Jobs
              </Button>
            ) : (
              <>
                <Button to="/register" className="primary">
                  <FaBriefcase />
                  Start Your Journey
                </Button>
                <Button to="/login" className="secondary">
                  Sign In
                </Button>
              </>
            )}
          </CTAButtons>
        </CTAContainer>
      </CTA>
    </>
  );
};

export default Home;