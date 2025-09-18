import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaBriefcase,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';

const JobsContainer = styled.div`
  max-width: 1200px;
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

const SearchSection = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const JobCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.2s ease;
  border: 1px solid ${props => props.theme.colors.gray[200]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const JobCompany = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-weight: 500;
`;

const JobType = styled.span`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const JobLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const JobDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const Jobs = () => {
  const { isJobSeeker } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs(filters);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  return (
    <JobsContainer>
      <Header>
        <Title>Find Your Dream Job</Title>
        <Subtitle>
          Discover opportunities that match your skills and career goals
        </Subtitle>
      </Header>

      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <FormGroup>
            <Label htmlFor="search">Search Jobs</Label>
            <Input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Job title, company, or keywords"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City, state, or remote"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="job_type">Job Type</Label>
            <Select
              id="job_type"
              name="job_type"
              value={filters.job_type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </Select>
          </FormGroup>
          
          <Button type="submit">
            <FaSearch />
            Search
          </Button>
        </SearchForm>
      </SearchSection>

      {loading ? (
        <LoadingSpinner>Loading jobs...</LoadingSpinner>
      ) : jobs.length > 0 ? (
        <JobsGrid>
          {jobs.map(job => (
            <JobCard key={job._id}>
              <JobHeader>
                <div>
                  <JobTitle>{job.title}</JobTitle>
                  <JobCompany>{job.company}</JobCompany>
                </div>
                <JobType>{job.job_type}</JobType>
              </JobHeader>
              
              <JobLocation>
                <FaMapMarkerAlt />
                {job.location}
              </JobLocation>
              
              <JobDescription>
                {job.description}
              </JobDescription>
              
              <JobSkills>
                {job.required_skills?.slice(0, 4).map(skill => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
                {job.required_skills?.length > 4 && (
                  <SkillTag>+{job.required_skills.length - 4} more</SkillTag>
                )}
              </JobSkills>
              
              <JobFooter>
                <JobMeta>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaClock />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  {job.applications_count > 0 && (
                    <div>{job.applications_count} applications</div>
                  )}
                </JobMeta>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isJobSeeker && job.match_percentage && (
                    <MatchPercentage>
                      {job.match_percentage}% Match
                    </MatchPercentage>
                  )}
                  <ViewButton to={`/jobs/${job._id}`}>
                    View Job
                    <FaArrowRight />
                  </ViewButton>
                </div>
              </JobFooter>
            </JobCard>
          ))}
        </JobsGrid>
      ) : (
        <EmptyState>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities.</p>
        </EmptyState>
      )}
    </JobsContainer>
  );
};

export default Jobs;