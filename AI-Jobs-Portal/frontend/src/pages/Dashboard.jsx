import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI, resumeAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaBriefcase, 
  FaChartLine, 
  FaUser, 
  FaGraduationCap,
  FaSearch,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPlus
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.color || props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
`;

const SectionLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const JobCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.5rem;
`;

const JobCompany = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const JobLocation = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const JobSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[700]};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const JobFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchPercentage = styled.div`
  background: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled(Link)`
  background: ${props => props.theme.colors.white};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.color || props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
`;

const ApplicationCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ApplicationInfo = styled.div`
  flex: 1;
`;

const ApplicationTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const ApplicationCompany = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ApplicationDate = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.75rem;
`;

const ApplicationStatus = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'applied': return props.theme.colors.gray[100];
      case 'reviewed': return props.theme.colors.primary + '20';
      case 'shortlisted': return props.theme.colors.success + '20';
      case 'interview_scheduled': return props.theme.colors.primary + '20';
      case 'hired': return props.theme.colors.success + '20';
      case 'rejected': return props.theme.colors.danger + '20';
      default: return props.theme.colors.gray[100];
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'applied': return props.theme.colors.gray[700];
      case 'reviewed': return props.theme.colors.primary;
      case 'shortlisted': return props.theme.colors.success;
      case 'interview_scheduled': return props.theme.colors.primary;
      case 'hired': return props.theme.colors.success;
      case 'rejected': return props.theme.colors.danger;
      default: return props.theme.colors.gray[700];
    }
  }};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const Dashboard = () => {
  const { user, isJobSeeker, isRecruiter, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isJobSeeker) {
        // Load job seeker dashboard data
        const [jobsResponse, applicationsResponse] = await Promise.all([
          jobsAPI.getJobRecommendations(),
          jobsAPI.getMyApplications()
        ]);
        
        setRecommendedJobs(jobsResponse.data.recommendations || []);
        setRecentApplications(applicationsResponse.data.applications?.slice(0, 5) || []);
        
        setStats({
          totalApplications: applicationsResponse.data.applications?.length || 0,
          pendingApplications: applicationsResponse.data.applications?.filter(app => 
            ['applied', 'reviewed'].includes(app.status)
          ).length || 0,
          interviewsScheduled: applicationsResponse.data.applications?.filter(app => 
            app.status === 'interview_scheduled'
          ).length || 0,
          jobsMatched: jobsResponse.data.total || 0
        });
      } else if (isRecruiter) {
        // Load recruiter dashboard data
        const jobsResponse = await jobsAPI.getJobs({ limit: 10 });
        setRecommendedJobs(jobsResponse.data.jobs || []);
        
        setStats({
          totalJobs: jobsResponse.data.jobs?.length || 0,
          totalApplications: 0, // Would need to calculate from all jobs
          activeJobs: jobsResponse.data.jobs?.filter(job => job.is_active).length || 0,
          totalViews: jobsResponse.data.jobs?.reduce((sum, job) => sum + (job.views_count || 0), 0) || 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Loading dashboard...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>
          Welcome back, {user?.first_name}!
        </WelcomeTitle>
        <WelcomeSubtitle>
          {isJobSeeker && "Here's your personalized job search dashboard"}
          {isRecruiter && "Manage your job postings and find great candidates"}
          {isAdmin && "Monitor platform activity and manage users"}
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        {isJobSeeker && (
          <>
            <StatCard>
              <StatIcon color="#3b82f6">
                <FaBriefcase />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.totalApplications || 0}</StatNumber>
                <StatLabel>Total Applications</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#f59e0b">
                <FaClock />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.pendingApplications || 0}</StatNumber>
                <StatLabel>Pending Applications</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#10b981">
                <FaCheckCircle />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.interviewsScheduled || 0}</StatNumber>
                <StatLabel>Interviews Scheduled</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#8b5cf6">
                <FaSearch />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.jobsMatched || 0}</StatNumber>
                <StatLabel>Jobs Matched</StatLabel>
              </StatContent>
            </StatCard>
          </>
        )}

        {isRecruiter && (
          <>
            <StatCard>
              <StatIcon color="#3b82f6">
                <FaBriefcase />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.totalJobs || 0}</StatNumber>
                <StatLabel>Total Jobs Posted</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#10b981">
                <FaCheckCircle />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.activeJobs || 0}</StatNumber>
                <StatLabel>Active Jobs</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#f59e0b">
                <FaEye />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.totalViews || 0}</StatNumber>
                <StatLabel>Total Views</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon color="#8b5cf6">
                <FaChartLine />
              </StatIcon>
              <StatContent>
                <StatNumber>{stats.totalApplications || 0}</StatNumber>
                <StatLabel>Total Applications</StatLabel>
              </StatContent>
            </StatCard>
          </>
        )}
      </StatsGrid>

      <QuickActions>
        {isJobSeeker && (
          <>
            <ActionCard to="/jobs">
              <ActionIcon color="#3b82f6">
                <FaSearch />
              </ActionIcon>
              <ActionTitle>Browse Jobs</ActionTitle>
            </ActionCard>
            <ActionCard to="/profile">
              <ActionIcon color="#10b981">
                <FaUser />
              </ActionIcon>
              <ActionTitle>Update Profile</ActionTitle>
            </ActionCard>
            <ActionCard to="/learning">
              <ActionIcon color="#f59e0b">
                <FaGraduationCap />
              </ActionIcon>
              <ActionTitle>Learning Resources</ActionTitle>
            </ActionCard>
            <ActionCard to="/applications">
              <ActionIcon color="#8b5cf6">
                <FaChartLine />
              </ActionIcon>
              <ActionTitle>My Applications</ActionTitle>
            </ActionCard>
          </>
        )}

        {isRecruiter && (
          <>
            <ActionCard to="/post-job">
              <ActionIcon color="#3b82f6">
                <FaPlus />
              </ActionIcon>
              <ActionTitle>Post New Job</ActionTitle>
            </ActionCard>
            <ActionCard to="/jobs">
              <ActionIcon color="#10b981">
                <FaBriefcase />
              </ActionIcon>
              <ActionTitle>Manage Jobs</ActionTitle>
            </ActionCard>
            <ActionCard to="/profile">
              <ActionIcon color="#f59e0b">
                <FaUser />
              </ActionIcon>
              <ActionTitle>Company Profile</ActionTitle>
            </ActionCard>
          </>
        )}

        {isAdmin && (
          <>
            <ActionCard to="/admin">
              <ActionIcon color="#3b82f6">
                <FaChartLine />
              </ActionIcon>
              <ActionTitle>Admin Dashboard</ActionTitle>
            </ActionCard>
            <ActionCard to="/admin">
              <ActionIcon color="#10b981">
                <FaUser />
              </ActionIcon>
              <ActionTitle>Manage Users</ActionTitle>
            </ActionCard>
          </>
        )}
      </QuickActions>

      {isJobSeeker && (
        <>
          <Section>
            <SectionHeader>
              <SectionTitle>Recommended Jobs</SectionTitle>
              <SectionLink to="/jobs">
                View All Jobs
                <FaArrowRight />
              </SectionLink>
            </SectionHeader>
            <JobsGrid>
              {recommendedJobs.slice(0, 6).map(job => (
                <JobCard key={job._id}>
                  <JobTitle>{job.title}</JobTitle>
                  <JobCompany>{job.company}</JobCompany>
                  <JobLocation>{job.location}</JobLocation>
                  <JobSkills>
                    {job.required_skills?.slice(0, 3).map(skill => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </JobSkills>
                  <JobFooter>
                    <MatchPercentage>
                      {job.match_percentage || 0}% Match
                    </MatchPercentage>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                      View Job
                    </Link>
                  </JobFooter>
                </JobCard>
              ))}
            </JobsGrid>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Recent Applications</SectionTitle>
              <SectionLink to="/applications">
                View All Applications
                <FaArrowRight />
              </SectionLink>
            </SectionHeader>
            {recentApplications.length > 0 ? (
              recentApplications.map(application => (
                <ApplicationCard key={application._id}>
                  <ApplicationInfo>
                    <ApplicationTitle>{application.job?.title}</ApplicationTitle>
                    <ApplicationCompany>{application.job?.company}</ApplicationCompany>
                    <ApplicationDate>
                      Applied on {new Date(application.applied_at).toLocaleDateString()}
                    </ApplicationDate>
                  </ApplicationInfo>
                  <ApplicationStatus status={application.status}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </ApplicationStatus>
                </ApplicationCard>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No applications yet. Start applying to jobs!
              </div>
            )}
          </Section>
        </>
      )}

      {isRecruiter && (
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Job Postings</SectionTitle>
            <SectionLink to="/jobs">
              View All Jobs
              <FaArrowRight />
            </SectionLink>
          </SectionHeader>
          <JobsGrid>
            {recommendedJobs.slice(0, 6).map(job => (
              <JobCard key={job._id}>
                <JobTitle>{job.title}</JobTitle>
                <JobCompany>{job.company}</JobCompany>
                <JobLocation>{job.location}</JobLocation>
                <JobSkills>
                  {job.required_skills?.slice(0, 3).map(skill => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </JobSkills>
                <JobFooter>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {job.applications_count || 0} applications
                  </div>
                  <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </JobFooter>
              </JobCard>
            ))}
          </JobsGrid>
        </Section>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;