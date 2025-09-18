import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import styled from 'styled-components';
import { FaPlus, FaSave, FaBriefcase } from 'react-icons/fa';

const PostJobContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const FormContainer = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

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

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AddSkillInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    salary_range: { min: '', max: '' },
    required_skills: [],
    experience_required: '',
    education_required: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salary_min' || name === 'salary_max') {
      setFormData({
        ...formData,
        salary_range: {
          ...formData.salary_range,
          [name === 'salary_min' ? 'min' : 'max']: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.required_skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await jobsAPI.postJob(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostJobContainer>
      <Header>
        <Title>
          <FaBriefcase />
          Post a New Job
        </Title>
        <Subtitle>
          Create a job posting to attract the best candidates
        </Subtitle>
      </Header>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Job Description *</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Your company name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="location">Location *</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., San Francisco, CA or Remote"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="experience_required">Experience Required</Label>
              <Input
                type="text"
                id="experience_required"
                name="experience_required"
                value={formData.experience_required}
                onChange={handleChange}
                placeholder="e.g., 3+ years"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="salary_min">Minimum Salary</Label>
              <Input
                type="number"
                id="salary_min"
                name="salary_min"
                value={formData.salary_range.min}
                onChange={handleChange}
                placeholder="e.g., 80000"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="salary_max">Maximum Salary</Label>
              <Input
                type="number"
                id="salary_max"
                name="salary_max"
                value={formData.salary_range.max}
                onChange={handleChange}
                placeholder="e.g., 120000"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="education_required">Education Required</Label>
            <Input
              type="text"
              id="education_required"
              name="education_required"
              value={formData.education_required}
              onChange={handleChange}
              placeholder="e.g., Bachelor's degree in Computer Science"
            />
          </FormGroup>

          <FormGroup>
            <Label>Required Skills *</Label>
            <SkillsContainer>
              {formData.required_skills.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveButton onClick={() => removeSkill(skill)}>
                    ×
                  </RemoveButton>
                </SkillTag>
              ))}
            </SkillsContainer>
            <AddSkillInput>
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a required skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>
                Add Skill
              </Button>
            </AddSkillInput>
          </FormGroup>

          <Button type="submit" disabled={isSubmitting}>
            <FaSave />
            {isSubmitting ? 'Posting Job...' : 'Post Job'}
          </Button>
        </Form>
      </FormContainer>
    </PostJobContainer>
  );
};

export default PostJob;