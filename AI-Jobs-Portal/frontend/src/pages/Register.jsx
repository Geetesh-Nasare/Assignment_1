import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaEye, FaEyeSlash, FaBriefcase, FaUser, FaCog } from 'react-icons/fa';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  padding: 2rem 1rem;
`;

const RegisterCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 3rem;
  width: 100%;
  max-width: 500px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 2rem;
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

  @media (max-width: 480px) {
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

const PasswordInput = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 0.25rem;
`;

const Button = styled.button`
  padding: 0.75rem;
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
  justify-content: center;
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

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.colors.gray[300]};
  }

  span {
    background: ${props => props.theme.colors.white};
    padding: 0 1rem;
    color: ${props => props.theme.colors.gray[500]};
    font-size: 0.875rem;
  }
`;

const LinkText = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const UserTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const UserTypeButton = styled.button`
  padding: 0.75rem;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.gray[700]};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ConditionalFields = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
`;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    user_type: 'job_seeker',
    company_name: '',
    company_size: '',
    industry: '',
    website: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    // Prepare data based on user type
    const submitData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      user_type: formData.user_type
    };

    // Add role-specific fields
    if (formData.user_type === 'recruiter') {
      submitData.company_name = formData.company_name;
      submitData.company_size = formData.company_size;
      submitData.industry = formData.industry;
      submitData.website = formData.website;
    }

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const userTypes = [
    { key: 'job_seeker', label: 'Job Seeker', icon: FaUser },
    { key: 'recruiter', label: 'Recruiter', icon: FaBriefcase },
    { key: 'admin', label: 'Admin', icon: FaCog }
  ];

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <h1>
            <FaBriefcase />
            AI Jobs Portal
          </h1>
        </Logo>
        
        <Title>Create Your Account</Title>
        <Subtitle>Join thousands of professionals finding their dream jobs</Subtitle>

        <Form onSubmit={handleSubmit}>
          <UserTypeSelector>
            {userTypes.map(type => (
              <UserTypeButton
                key={type.key}
                type="button"
                active={formData.user_type === type.key}
                onClick={() => setFormData({ ...formData, user_type: type.key })}
              >
                <type.icon />
                {type.label}
              </UserTypeButton>
            ))}
          </UserTypeSelector>

          <FormRow>
            <FormGroup>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <PasswordInput>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </PasswordInput>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </FormGroup>
          </FormRow>

          <ConditionalFields show={formData.user_type === 'recruiter'}>
            <FormGroup>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter your company name"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="company_size">Company Size</Label>
                <Select
                  id="company_size"
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Enter your industry"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="website">Company Website</Label>
              <Input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />
            </FormGroup>
          </ConditionalFields>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <Divider>
          <span>Already have an account?</span>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <LinkText to="/login">Sign in to your account</LinkText>
        </div>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;