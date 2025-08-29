import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🛍️ Ecommerce Store
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <FaShoppingCart size={20} />
              {getCartItemCount() > 0 && (
                <Badge 
                  bg="danger" 
                  className="cart-badge"
                >
                  {getCartItemCount()}
                </Badge>
              )}
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile" className="me-2">
                  <FaUser size={16} className="me-1" />
                  {user?.username}
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">
                  Login
                </Nav.Link>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
