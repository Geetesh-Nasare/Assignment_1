import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaClock, 
  FaBuilding,
  FaArrowLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaHeart,
  FaShare
} from 'react-icons/fa';

const JobDetailsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

const JobHeader = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: 2rem;
`;

const JobTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.5rem;
`;

const JobCompany = styled.div`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 1rem;
`;

const JobMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const JobActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  font-size: 1rem;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[700]};

    &:hover {
      background: ${props => props.theme.colors.gray[200]};
    }
  }

  &.success {
    background: ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #059669;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const JobContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1rem;
`;

const SectionContent = styled.div`
  color: ${props => props.theme.colors.gray[700]};
  line-height: 1.6;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const SidebarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1rem;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CompanyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const ApplicationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isJobSeeker, isRecruiter } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    additional_info: ''
  });

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJob(id);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isJobSeeker) return;

    try {
      setApplying(true);
      await jobsAPI.applyJob(id, applicationData);
      navigate('/applications');
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplying(false);
    }
  };

  const handleChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <JobDetailsContainer>
        <LoadingSpinner>Loading job details...</LoadingSpinner>
      </JobDetailsContainer>
    );
  }

  if (!job) {
    return (
      <JobDetailsContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Job not found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </JobDetailsContainer>
    );
  }

  return (
    <JobDetailsContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft />
        Back to Jobs
      </BackButton>

      <JobHeader>
        <JobTitle>{job.title}</JobTitle>
        <JobCompany>{job.company}</JobCompany>
        
        <JobMeta>
          <MetaItem>
            <FaMapMarkerAlt />
            {job.location}
          </MetaItem>
          <MetaItem>
            <FaBriefcase />
            {job.job_type}
          </MetaItem>
          <MetaItem>
            <FaClock />
            Posted {new Date(job.created_at).toLocaleDateString()}
          </MetaItem>
          <MetaItem>
            <FaBuilding />
            {job.applications_count || 0} applications
          </MetaItem>
        </JobMeta>

        <JobActions>
          {isJobSeeker && (
            <Button className="primary" onClick={() => document.getElementById('apply-form')?.scrollIntoView()}>
              <FaCheckCircle />
              Apply Now
            </Button>
          )}
          <Button className="secondary">
            <FaHeart />
            Save Job
          </Button>
          <Button className="secondary">
            <FaShare />
            Share
          </Button>
        </JobActions>
      </JobHeader>

      <JobContent>
        <MainContent>
          <Section>
            <SectionTitle>Job Description</SectionTitle>
            <SectionContent>
              {job.description}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Required Skills</SectionTitle>
            <SkillsList>
              {job.required_skills?.map(skill => (
                <SkillTag key={skill}>{skill}</SkillTag>
              ))}
            </SkillsList>
          </Section>

          {job.experience_required && (
            <Section>
              <SectionTitle>Experience Required</SectionTitle>
              <SectionContent>{job.experience_required}</SectionContent>
            </Section>
          )}

          {job.education_required && (
            <Section>
              <SectionTitle>Education Required</SectionTitle>
              <SectionContent>{job.education_required}</SectionContent>
            </Section>
          )}

          {isJobSeeker && (
            <Section id="apply-form">
              <SectionTitle>Apply for this Position</SectionTitle>
              <ApplicationForm onSubmit={handleApply}>
                <FormGroup>
                  <Label htmlFor="cover_letter">Cover Letter</Label>
                  <TextArea
                    id="cover_letter"
                    name="cover_letter"
                    value={applicationData.cover_letter}
                    onChange={handleChange}
                    placeholder="Tell us why you're interested in this position..."
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="additional_info">Additional Information</Label>
                  <TextArea
                    id="additional_info"
                    name="additional_info"
                    value={applicationData.additional_info}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like to share..."
                  />
                </FormGroup>
                <Button type="submit" className="primary" disabled={applying}>
                  {applying ? 'Applying...' : 'Submit Application'}
                </Button>
              </ApplicationForm>
            </Section>
          )}
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Company Information</SidebarTitle>
            <CompanyInfo>
              <CompanyDetail>
                <FaBuilding />
                {job.company}
              </CompanyDetail>
              <CompanyDetail>
                <FaMapMarkerAlt />
                {job.location}
              </CompanyDetail>
              <CompanyDetail>
                <FaBriefcase />
                {job.job_type}
              </CompanyDetail>
              {job.salary_range && (
                <CompanyDetail>
                  💰 ${job.salary_range.min?.toLocaleString()} - ${job.salary_range.max?.toLocaleString()}
                </CompanyDetail>
              )}
            </CompanyInfo>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>Job Details</SidebarTitle>
            <CompanyInfo>
              <CompanyDetail>
                <FaClock />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </CompanyDetail>
              <CompanyDetail>
                <FaBriefcase />
                {job.applications_count || 0} applications
              </CompanyDetail>
              <CompanyDetail>
                <FaExternalLinkAlt />
                {job.views_count || 0} views
              </CompanyDetail>
            </CompanyInfo>
          </SidebarCard>
        </Sidebar>
      </JobContent>
    </JobDetailsContainer>
  );
};

export default JobDetails;