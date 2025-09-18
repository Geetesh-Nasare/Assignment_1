import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaBriefcase, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaHeart
} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.dark};
  color: ${props => props.theme.colors.white};
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.primary};
  }

  p {
    color: ${props => props.theme.colors.gray[300]};
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.gray[300]};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.gray[700]};
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
  padding-top: 1rem;
  text-align: center;
  color: ${props => props.theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>
            <FaBriefcase style={{ marginRight: '0.5rem' }} />
            AI Jobs Portal
          </h3>
          <p>
            Connecting talented job seekers with innovative companies through 
            AI-powered matching technology. Find your dream job or discover 
            the perfect candidate today.
          </p>
          <SocialLinks>
            <SocialLink href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" aria-label="GitHub">
              <FaGithub />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>For Job Seekers</h3>
          <FooterLinks>
            <FooterLink to="/jobs">Browse Jobs</FooterLink>
            <FooterLink to="/learning">Learning Resources</FooterLink>
            <FooterLink to="/profile">Build Profile</FooterLink>
            <FooterLink to="/applications">My Applications</FooterLink>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>For Companies</h3>
          <FooterLinks>
            <FooterLink to="/post-job">Post a Job</FooterLink>
            <FooterLink to="/dashboard">Recruiter Dashboard</FooterLink>
            <FooterLink to="/jobs">Browse Candidates</FooterLink>
            <FooterLink to="/register">Sign Up as Recruiter</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Contact Us</h3>
          <ContactInfo>
            <FaEnvelope />
            <span>contact@aijobsportal.com</span>
          </ContactInfo>
          <ContactInfo>
            <FaPhone />
            <span>+1 (555) 123-4567</span>
          </ContactInfo>
          <ContactInfo>
            <FaMapMarkerAlt />
            <span>San Francisco, CA</span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>
          © 2024 AI Jobs Portal. Made with <FaHeart style={{ color: '#ef4444' }} /> for job seekers and employers.
        </p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;