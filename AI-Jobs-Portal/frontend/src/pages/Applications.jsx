import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaBriefcase, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaCalendarAlt
} from 'react-icons/fa';

const ApplicationsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const ApplicationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ApplicationCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ApplicationInfo = styled.div`
  flex: 1;
`;

const ApplicationTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const ApplicationCompany = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ApplicationDate = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
      case 'interviewed': return props.theme.colors.primary + '20';
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
      case 'interviewed': return props.theme.colors.primary;
      case 'hired': return props.theme.colors.success;
      case 'rejected': return props.theme.colors.danger;
      default: return props.theme.colors.gray[700];
    }
  }};
`;

const ApplicationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const ApplicationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const MatchPercentage = styled.div`
  background: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ViewButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getMyApplications();
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'applied': return <FaClock />;
      case 'reviewed': return <FaEye />;
      case 'shortlisted': return <FaCheckCircle />;
      case 'interview_scheduled': return <FaCalendarAlt />;
      case 'interviewed': return <FaCheckCircle />;
      case 'hired': return <FaCheckCircle />;
      case 'rejected': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return (
      <ApplicationsContainer>
        <LoadingSpinner>Loading applications...</LoadingSpinner>
      </ApplicationsContainer>
    );
  }

  return (
    <ApplicationsContainer>
      <Header>
        <Title>My Applications</Title>
        <Subtitle>
          Track the status of your job applications
        </Subtitle>
      </Header>

      {applications.length > 0 ? (
        <ApplicationsList>
          {applications.map(application => (
            <ApplicationCard key={application._id}>
              <ApplicationHeader>
                <ApplicationInfo>
                  <ApplicationTitle>{application.job?.title}</ApplicationTitle>
                  <ApplicationCompany>{application.job?.company}</ApplicationCompany>
                  <ApplicationDate>
                    <FaClock />
                    Applied on {new Date(application.applied_at).toLocaleDateString()}
                  </ApplicationDate>
                </ApplicationInfo>
                <ApplicationStatus status={application.status}>
                  <StatusIcon>
                    {getStatusIcon(application.status)}
                    {application.status.replace('_', ' ').toUpperCase()}
                  </StatusIcon>
                </ApplicationStatus>
              </ApplicationHeader>

              <ApplicationDetails>
                <DetailItem>
                  <FaBriefcase />
                  {application.job?.job_type}
                </DetailItem>
                <DetailItem>
                  📍 {application.job?.location}
                </DetailItem>
                {application.skill_match_percentage && (
                  <DetailItem>
                    <MatchPercentage>
                      {application.skill_match_percentage}% Match
                    </MatchPercentage>
                  </DetailItem>
                )}
              </ApplicationDetails>

              <ApplicationFooter>
                <div>
                  {application.notes && (
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      Note: {application.notes}
                    </div>
                  )}
                </div>
                <ViewButton to={`/jobs/${application.job_id}`}>
                  <FaEye />
                  View Job
                </ViewButton>
              </ApplicationFooter>
            </ApplicationCard>
          ))}
        </ApplicationsList>
      ) : (
        <EmptyState>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here!</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Jobs
          </Link>
        </EmptyState>
      )}
    </ApplicationsContainer>
  );
};

export default Applications;