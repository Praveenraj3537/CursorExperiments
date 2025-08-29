import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Pagination, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaFilter, FaShoppingCart } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-created_at');

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, sortBy, selectedCategory, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        ordering: sortBy,
        search: searchTerm,
        category: selectedCategory,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / 10));
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleFilterReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    setSortBy('-created_at');
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {items}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Pagination>
    );
  };

  if (loading && products.length === 0) {
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
          <h2>Products</h2>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary">
                        <FaFilter className="me-1" />
                        Filter
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary"
                        onClick={handleFilterReset}
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sort Options */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          <Form.Select
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
            <option value="-rating">Highest Rated</option>
          </Form.Select>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Products Grid */}
      <Row>
        {products.map((product) => (
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
                  <div className="d-flex gap-2">
                    <Button 
                      as={Link} 
                      to={`/products/${product.id}`}
                      variant="outline-primary" 
                      className="flex-fill"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="success"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.is_in_stock}
                      title={!product.is_in_stock ? 'Out of Stock' : 'Add to Cart'}
                    >
                      <FaShoppingCart />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <small className={`text-${product.is_in_stock ? 'success' : 'danger'}`}>
                      {product.is_in_stock ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {renderPagination()}
    </Container>
  );
};

export default ProductList;
