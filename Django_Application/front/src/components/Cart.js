import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to checkout page or order creation
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (cart.length === 0) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card>
              <Card.Body className="py-5">
                <FaShoppingCart size={64} className="text-muted mb-3" />
                <h3>Your cart is empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleContinueShopping}
                >
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Shopping Cart</h2>
            <Button 
              variant="outline-secondary" 
              onClick={handleContinueShopping}
            >
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Cart Items ({cart.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              className="me-3 rounded"
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-muted">
                              {item.category?.name}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            min="1"
                            style={{ width: '60px', textAlign: 'center', margin: '0 8px' }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="h5 text-primary mb-0">
                  ${getCartTotal().toFixed(2)}
                </strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>

              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={clearCart}
              >
                Clear Cart
              </Button>

              {!isAuthenticated && (
                <Alert variant="info" className="mt-3">
                  <small>
                    Please <strong>login</strong> to complete your purchase.
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
