import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaEye, FaEyeSlash, FaBriefcase, FaUser, FaCog } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  padding: 2rem 1rem;
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 1rem;
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 3rem;
  width: 100%;
  max-width: 400px;
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_type: 'job_seeker'
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
    setIsLoading(true);

    const result = await login(formData.email, formData.password, formData.user_type);
    
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
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>
            <FaBriefcase />
            AI Jobs Portal
          </h1>
        </Logo>
        
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>

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
            <Label htmlFor="password">Password</Label>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordInput>
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <Divider>
          <span>Don't have an account?</span>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <LinkText to="/register">Create a new account</LinkText>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;