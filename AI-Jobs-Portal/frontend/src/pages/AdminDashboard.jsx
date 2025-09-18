import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaUsers, 
  FaBriefcase, 
  FaChartLine, 
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
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
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.gray[700]};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  font-size: 0.875rem;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #2563eb;
    }
  }

  &.danger {
    background: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #dc2626;
    }
  }

  &.success {
    background: ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #059669;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'active': return props.theme.colors.success + '20';
      case 'inactive': return props.theme.colors.gray[100];
      case 'pending': return props.theme.colors.warning + '20';
      default: return props.theme.colors.gray[100];
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'active': return props.theme.colors.success;
      case 'inactive': return props.theme.colors.gray[600];
      case 'pending': return props.theme.colors.warning;
      default: return props.theme.colors.gray[600];
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, jobsResponse, applicationsResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllJobs({ limit: 5 }),
        adminAPI.getAllApplications({ limit: 5 })
      ]);

      setStats(statsResponse.data.statistics || {});
      setRecentJobs(jobsResponse.data.jobs || []);
      setRecentApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await adminAPI.deleteJob(jobId);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminContainer>
        <LoadingSpinner>Loading admin dashboard...</LoadingSpinner>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>Monitor platform activity and manage users</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3b82f6">
            <FaUsers />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.job_seekers || 0}</StatNumber>
            <StatLabel>Job Seekers</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981">
            <FaBriefcase />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.recruiters || 0}</StatNumber>
            <StatLabel>Recruiters</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.total_jobs || 0}</StatNumber>
            <StatLabel>Total Jobs</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#8b5cf6">
            <FaEye />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.total_applications || 0}</StatNumber>
            <StatLabel>Total Applications</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Job Postings</SectionTitle>
        </SectionHeader>
        <Table>
          <thead>
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Applications</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentJobs.map(job => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.applications_count || 0}</TableCell>
                <TableCell>
                  <StatusBadge status={job.is_active ? 'active' : 'inactive'}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button className="primary">
                      <FaEye />
                      View
                    </Button>
                    <Button className="danger" onClick={() => handleDeleteJob(job._id)}>
                      <FaTrash />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Applications</SectionTitle>
        </SectionHeader>
        <Table>
          <thead>
            <tr>
              <TableHeader>Job Title</TableHeader>
              <TableHeader>Candidate</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Applied Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map(application => (
              <TableRow key={application._id}>
                <TableCell>{application.job?.title}</TableCell>
                <TableCell>{application.job_seeker?.name}</TableCell>
                <TableCell>
                  <StatusBadge status={application.status}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {new Date(application.applied_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button className="primary">
                      <FaEye />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>
    </AdminContainer>
  );
};

export default AdminDashboard;