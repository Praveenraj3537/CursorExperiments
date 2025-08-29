import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { productsAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getInStock();
      // Get first 6 products as featured
      setFeaturedProducts(response.data.results?.slice(0, 6) || response.data.slice(0, 6));
    } catch (err) {
      setError('Failed to load featured products');
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-3">
                Welcome to Our Ecommerce Store
              </h1>
              <p className="lead mb-4">
                Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
              </p>
              <Button 
                as={Link} 
                to="/products" 
                variant="light" 
                size="lg"
                className="me-3"
              >
                Shop Now <FaArrowRight className="ms-2" />
              </Button>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-light" 
                size="lg"
              >
                Sign Up
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <div className="display-1">🛍️</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Products Section */}
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4">Featured Products</h2>
          </Col>
        </Row>

        {loading && (
          <Row>
            <Col className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Col>
          </Row>
        )}

        {error && (
          <Row>
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {!loading && !error && (
          <Row>
            {featuredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="product-card h-100">
                  {product.image && (
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      className="product-image"
                      alt={product.name}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted mb-2">
                      {product.description?.substring(0, 100)}...
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5 text-primary mb-0">
                          ${product.price}
                        </span>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <Button 
                        as={Link} 
                        to={`/products/${product.id}`}
                        variant="outline-primary" 
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Call to Action */}
        <Row className="mt-5">
          <Col className="text-center">
            <h3>Ready to Start Shopping?</h3>
            <p className="lead mb-4">
              Browse our complete collection of products and find exactly what you're looking for.
            </p>
            <Button 
              as={Link} 
              to="/products" 
              variant="primary" 
              size="lg"
            >
              View All Products <FaArrowRight className="ms-2" />
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
