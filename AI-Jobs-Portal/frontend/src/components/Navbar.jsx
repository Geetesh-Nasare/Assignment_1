import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaBriefcase, 
  FaChartLine,
  FaGraduationCap,
  FaCog
} from 'react-icons/fa';

const Nav = styled.nav`
  background: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: calc(100vh - 70px);
    background: ${props => props.theme.colors.white};
    flex-direction: column;
    justify-content: flex-start;
    padding: 2rem;
    transition: left 0.3s ease;
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.gray[600]};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border: none;
  font-size: 0.875rem;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};

    &:hover {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
    }
  }

  &.danger {
    background: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: #dc2626;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 0.5rem 0;
  min-width: 200px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.gray[700]};
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout, isJobSeeker, isRecruiter, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/" onClick={closeMenus}>
          <FaBriefcase />
          AI Jobs Portal
        </Logo>

        <NavMenu isOpen={isMenuOpen}>
          <NavLink 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={closeMenus}
          >
            Home
          </NavLink>

          {user && (
            <>
              <NavLink 
                to="/jobs" 
                className={isActive('/jobs') ? 'active' : ''}
                onClick={closeMenus}
              >
                <FaBriefcase />
                Jobs
              </NavLink>

              {isJobSeeker && (
                <>
                  <NavLink 
                    to="/applications" 
                    className={isActive('/applications') ? 'active' : ''}
                    onClick={closeMenus}
                  >
                    My Applications
                  </NavLink>
                  <NavLink 
                    to="/learning" 
                    className={isActive('/learning') ? 'active' : ''}
                    onClick={closeMenus}
                  >
                    <FaGraduationCap />
                    Learning
                  </NavLink>
                </>
              )}

              {isRecruiter && (
                <NavLink 
                  to="/post-job" 
                  className={isActive('/post-job') ? 'active' : ''}
                  onClick={closeMenus}
                >
                  Post Job
                </NavLink>
              )}

              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  className={isActive('/admin') ? 'active' : ''}
                  onClick={closeMenus}
                >
                  <FaChartLine />
                  Admin
                </NavLink>
              )}
            </>
          )}

          <AuthButtons>
            {user ? (
              <UserMenu>
                <Button 
                  className="secondary"
                  onClick={toggleUserMenu}
                >
                  <FaUser />
                  {user.first_name} {user.last_name}
                </Button>
                
                <UserDropdown isOpen={isUserMenuOpen}>
                  <DropdownItem to="/profile" onClick={closeMenus}>
                    <FaCog />
                    Profile Settings
                  </DropdownItem>
                  <DropdownItem to="/dashboard" onClick={closeMenus}>
                    <FaChartLine />
                    Dashboard
                  </DropdownItem>
                  <DropdownItem as="button" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </DropdownItem>
                </UserDropdown>
              </UserMenu>
            ) : (
              <>
                <Button 
                  className="secondary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="primary"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </AuthButtons>
        </NavMenu>

        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;