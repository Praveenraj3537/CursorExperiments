import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaEye, FaShoppingBag, FaCalendar, FaDollarSign } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      processing: { variant: 'info', text: 'Processing' },
      shipped: { variant: 'primary', text: 'Shipped' },
      delivered: { variant: 'success', text: 'Delivered' },
      cancelled: { variant: 'danger', text: 'Cancelled' },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert variant="info">
          Please <strong>login</strong> to view your orders.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <FaShoppingBag size={32} className="text-primary me-3" />
            <div>
              <h2 className="mb-0">My Orders</h2>
              <p className="text-muted mb-0">Track your order history and status</p>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {orders.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <FaShoppingBag size={64} className="text-muted mb-3" />
                <h4>No Orders Yet</h4>
                <p className="text-muted mb-4">
                  You haven't placed any orders yet. Start shopping to see your order history here.
                </p>
                <Button variant="primary" href="/products">
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Order History ({orders.length})</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.order_number}</strong>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendar className="text-muted me-2" />
                            {formatDate(order.created_at)}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaDollarSign className="text-success me-1" />
                            <strong>${order.total_amount}</strong>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(order.status)}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Order Details Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details - {selectedOrder?.order_number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Order Number:</strong> {selectedOrder.order_number}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Total Amount:</strong> ${selectedOrder.total_amount}</p>
                </Col>
                <Col md={6}>
                  <h6>Shipping Information</h6>
                  <p><strong>Phone:</strong> {selectedOrder.phone_number}</p>
                  <p><strong>Shipping Address:</strong></p>
                  <p className="text-muted">{selectedOrder.shipping_address}</p>
                </Col>
              </Row>

              {selectedOrder.notes && (
                <Row className="mb-3">
                  <Col>
                    <h6>Notes</h6>
                    <p className="text-muted">{selectedOrder.notes}</p>
                  </Col>
                </Row>
              )}

              <Row>
                <Col>
                  <h6>Order Items</h6>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product?.image && (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="me-2 rounded"
                                />
                              )}
                              <span>{item.product?.name}</span>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>${item.unit_price}</td>
                          <td>${item.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;
