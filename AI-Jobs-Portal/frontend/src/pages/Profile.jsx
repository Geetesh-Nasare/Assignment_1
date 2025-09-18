import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import styled from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaSave,
  FaUpload,
  FaEdit
} from 'react-icons/fa';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const ExperienceItem = styled.div`
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ExperienceTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
`;

const ExperienceCompany = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const ExperienceDetails = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
`;

const EducationItem = styled.div`
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const EducationTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const EducationInstitution = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const EducationYear = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
`;

const FileUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getProfile();
      setProfile(response.data.profile || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const response = await resumeAPI.uploadResume(file);
      
      if (response.data.parsed_data) {
        const parsedData = response.data.parsed_data;
        setProfile({
          ...profile,
          first_name: parsedData.name?.split(' ')[0] || profile.first_name,
          last_name: parsedData.name?.split(' ').slice(1).join(' ') || profile.last_name,
          skills: parsedData.skills || profile.skills,
          experience: parsedData.experience || profile.experience,
          education: parsedData.education || profile.education,
          phone: parsedData.contact_info?.phone || profile.phone
        });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading profile...
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile Settings</ProfileTitle>
        <ProfileSubtitle>
          Keep your profile updated to get better job recommendations
        </ProfileSubtitle>
      </ProfileHeader>

      <ProfileContent>
        <ProfileSection>
          <SectionTitle>
            <FaUser />
            Personal Information
          </SectionTitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={profile.first_name || ''}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={profile.last_name || ''}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                required
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <Button type="submit" disabled={saving}>
              <FaSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaBriefcase />
            Professional Skills
          </SectionTitle>
          
          <SkillsContainer>
            {profile.skills?.map((skill, index) => (
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
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill}>
              Add
            </Button>
          </AddSkillInput>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaUpload />
            Resume Upload
          </SectionTitle>
          
          <FileUpload>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="resume-upload"
            />
            <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
              <FaUpload style={{ fontSize: '2rem', marginBottom: '1rem', color: '#6b7280' }} />
              <UploadText>Upload Resume</UploadText>
              <UploadSubtext>PDF, DOC, DOCX, or TXT files</UploadSubtext>
            </label>
          </FileUpload>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaBriefcase />
            Work Experience
          </SectionTitle>
          
          {profile.experience?.map((exp, index) => (
            <ExperienceItem key={index}>
              <ExperienceHeader>
                <div>
                  <ExperienceTitle>{exp.position}</ExperienceTitle>
                  <ExperienceCompany>{exp.company}</ExperienceCompany>
                </div>
              </ExperienceHeader>
              <ExperienceDetails>
                {exp.duration} • {exp.location}
              </ExperienceDetails>
            </ExperienceItem>
          ))}
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaGraduationCap />
            Education
          </SectionTitle>
          
          {profile.education?.map((edu, index) => (
            <EducationItem key={index}>
              <EducationTitle>{edu.degree}</EducationTitle>
              <EducationInstitution>{edu.institution}</EducationInstitution>
              <EducationYear>{edu.year}</EducationYear>
            </EducationItem>
          ))}
        </ProfileSection>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;