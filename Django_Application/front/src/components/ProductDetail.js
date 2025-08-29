import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaStar, FaShoppingCart, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      // Show success message or redirect to cart
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'Product not found'}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate('/products')}>
          <FaArrowLeft className="me-2" />
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/products')}
          >
            <FaArrowLeft className="me-2" />
            Back to Products
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card>
            {product.image ? (
              <Card.Img 
                variant="top" 
                src={product.image} 
                alt={product.name}
                className="img-fluid"
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <span className="text-muted">No image available</span>
              </div>
            )}
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Body>
              <div className="mb-3">
                <Badge bg="secondary" className="mb-2">
                  {product.category?.name}
                </Badge>
                <h2 className="mb-2">{product.name}</h2>
                <div className="d-flex align-items-center mb-3">
                  <FaStar className="text-warning me-1" />
                  <span className="me-2">{product.rating}</span>
                  <span className="text-muted">({product.rating} out of 5)</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-primary mb-3">${product.price}</h3>
                <p className="text-muted mb-3">{product.description}</p>
                
                <div className="mb-3">
                  <strong>Availability: </strong>
                  <span className={`text-${product.is_in_stock ? 'success' : 'danger'}`}>
                    {product.is_in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>

                <div className="mb-3">
                  <strong>SKU: </strong>
                  <span className="text-muted">#{product.id}</span>
                </div>
              </div>

              {product.is_in_stock && (
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <strong className="me-3">Quantity:</strong>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-3">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isInCart(product.id)}
                    >
                      <FaShoppingCart className="me-2" />
                      {isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
                    </Button>
                    
                    <Button variant="outline-danger" size="lg">
                      <FaHeart className="me-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              )}

              {!product.is_in_stock && (
                <Alert variant="warning">
                  <strong>Out of Stock</strong>
                  <br />
                  This product is currently unavailable. Please check back later or contact us for more information.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h4>Product Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Product Details</h6>
                  <ul className="list-unstyled">
                    <li><strong>Category:</strong> {product.category?.name}</li>
                    <li><strong>Price:</strong> ${product.price}</li>
                    <li><strong>Rating:</strong> {product.rating}/5</li>
                    <li><strong>Status:</strong> 
                      <Badge bg={product.is_active ? 'success' : 'secondary'} className="ms-2">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Additional Details</h6>
                  <ul className="list-unstyled">
                    <li><strong>Added:</strong> {new Date(product.created_at).toLocaleDateString()}</li>
                    <li><strong>Last Updated:</strong> {new Date(product.updated_at).toLocaleDateString()}</li>
                    <li><strong>Product ID:</strong> {product.id}</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
