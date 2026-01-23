export const testingMethods = [
  //unit-testing
  {
    id: "unit-testing",
    title: "Unit Testing",
    shortDescription: "Test individual functions or components in isolation.",
    description:
      "Unit testing focuses on testing the smallest testable parts of an application such as functions, classes, or components. It ensures correctness at the code level before integration.",
    whenToUse: [
      "While developing new features",
      "Before committing code",
      "During refactoring",
      "For TDD (Test-Driven Development)",
      "To catch bugs early in development"
    ],

    category: "functional",
    level: "beginner",
    speed: "Fast",
    owner: "Developers",

    quickStartTemplate: {
      language: "javascript",
      code: `// Jest Unit Test Template
import { calculateTax } from './utils';

describe('Tax Calculator', () => {
  test('calculates 10% tax correctly', () => {
    const result = calculateTax(100, 0.10);
    expect(result).toBe(10);
  });

  test('handles zero amount', () => {
    const result = calculateTax(0, 0.10);
    expect(result).toBe(0);
  });

  test('throws error for negative amounts', () => {
    expect(() => calculateTax(-100, 0.10)).toThrow();
  });
});

// Run: npm test
`
    },

    codeExample: {
      title: "React Component Unit Test",
      language: "javascript",
      code: `import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from './LoginButton';

describe('LoginButton Component', () => {
  test('renders login button', () => {
    render(<LoginButton />);
    const button = screen.getByText(/login/i);
    expect(button).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<LoginButton onClick={handleClick} />);
    
    const button = screen.getByText(/login/i);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when loading', () => {
    render(<LoginButton loading={true} />);
    const button = screen.getByText(/login/i);
    expect(button).toBeDisabled();
  });
});
`
    },

    tools: [
      { name: "Jest", useCase: "JavaScript/React testing framework" },
      { name: "Mocha + Chai", useCase: "Node.js testing with assertions" },
      { name: "JUnit", useCase: "Java unit testing" },
      { name: "PyTest", useCase: "Python testing framework" },
      { name: "Vitest", useCase: "Fast Vite-native testing" }
    ],

    benefits: [
      "Early bug detection",
      "Faster development with quick feedback",
      "Improved code quality and design",
      "Easy refactoring with safety net",
      "Living documentation of code behavior"
    ],

    bestPractices: [
      "Follow AAA pattern: Arrange, Act, Assert",
      "Test one thing per test case",
      "Use descriptive test names",
      "Mock external dependencies",
      "Aim for 80%+ code coverage",
      "Keep tests fast (milliseconds)"
    ],

    commonPitfalls: [
      "Testing implementation details instead of behavior",
      "Not mocking external dependencies",
      "Writing tests that depend on each other",
      "Ignoring edge cases",
      "Over-mocking leading to false confidence"
    ],

    cicdIntegration: {
      platform: "GitHub Actions",
      config: `name: Unit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
`,
      notes: "Run unit tests on every commit to catch issues early"
    },

    realWorldExample: {
      scenario: "E-commerce Cart Calculation",
      description: "Testing cart total calculation logic in isolation",
      steps: [
        "Test adding items to cart",
        "Test removing items",
        "Test quantity updates",
        "Test discount calculations",
        "Test tax calculations",
        "Test edge cases (empty cart, negative quantities)"
      ]
    },

    example: "Testing a calculateTax() function with inputs 100 and 0.1, expecting output 10"
  },

  //integration-testing
    {
    id: "integration-testing",
    title: "Integration Testing",
    shortDescription: "Verify interaction between multiple modules.",
    description:
      "Integration testing checks how different modules or services work together after unit testing. It ensures APIs, databases, and services communicate correctly.",
    whenToUse: [
      "After unit testing",
      "When APIs interact",
      "Microservices communication",
      "Database operations",
      "Third-party integrations"
    ],

    category: "functional",
    level: "Intermediate",
    speed: "Medium",
    owner: "Developers",

    quickStartTemplate: {
      language: "javascript",
      code: `// Supertest Integration Test Template
const request = require('supertest');
const app = require('../app');

describe('User API Integration Tests', () => {
  test('POST /users creates new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com'
      })
      .expect(201);

    expect(response.body.user.email).toBe('john@example.com');
  });

  test('GET /users/:id retrieves user from database', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);

    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
  });
});
`
    },

    codeExample: {
      title: "Database Integration Test with Testcontainers",
      language: "javascript",
      code: `const { GenericContainer } = require('testcontainers');
const { Client } = require('pg');

describe('Database Integration', () => {
  let container;
  let client;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new GenericContainer('postgres:15')
      .withEnvironment({ POSTGRES_PASSWORD: 'test' })
      .withExposedPorts(5432)
      .start();

    // Connect to database
    client = new Client({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: 'postgres',
      password: 'test'
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  test('inserts and retrieves data', async () => {
    await client.query(\`
      CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)
    \`);
    await client.query('INSERT INTO users (name) VALUES ($1)', ['Alice']);
    
    const result = await client.query('SELECT * FROM users');
    expect(result.rows[0].name).toBe('Alice');
  });
});
`
    },

    tools: [
      { name: "Postman", useCase: "API testing and automation" },
      { name: "Supertest", useCase: "HTTP assertions for Node.js" },
      { name: "REST Assured", useCase: "Java REST API testing" },
      { name: "Testcontainers", useCase: "Lightweight database instances" },
      { name: "WireMock", useCase: "Mock external HTTP services" }
    ],

    benefits: [
      "Detects interface issues between modules",
      "Validates data flow across layers",
      "Improves system reliability",
      "Tests real database interactions",
      "Catches integration bugs early"
    ],

    bestPractices: [
      "Use test databases (Docker containers recommended)",
      "Clean up data after each test",
      "Test both happy and error paths",
      "Mock only external third-party services",
      "Use realistic test data",
      "Run integration tests in CI/CD"
    ],

    commonPitfalls: [
      "Testing against production database",
      "Slow tests due to lack of cleanup",
      "Not isolating tests from each other",
      "Over-relying on mocks instead of real integrations",
      "Ignoring network failures and timeouts"
    ],

    cicdIntegration: {
      platform: "GitLab CI",
      config: `integration-tests:
  stage: test
  services:
    - postgres:15
    - redis:7
  variables:
    DATABASE_URL: "postgresql://postgres:test@postgres:5432/testdb"
    REDIS_URL: "redis://redis:6379"
  script:
    - npm install
    - npm run test:integration
  only:
    - merge_requests
    - main
`,
      notes: "Use service containers for databases and dependencies"
    },

    realWorldExample: {
      scenario: "Payment Gateway Integration",
      description: "Testing the flow from order creation to payment processing",
      steps: [
        "Create order in database",
        "Call payment gateway API",
        "Receive payment confirmation",
        "Update order status",
        "Send confirmation email",
        "Verify all systems are in sync"
      ]
    },

    example: "Testing API → Service → Database flow: POST /orders creates order in DB and returns 201"
  },

//api-testing
{
  id: "api-testing",
  title: "API Testing",
  shortDescription: "Test application programming interfaces directly.",
  description:
    "API testing focuses on verifying the functionality, reliability, performance, and security of application programming interfaces. This includes testing RESTful APIs, GraphQL endpoints, SOAP services, and microservices communication.",
  whenToUse: [
    "During backend development",
    "For microservices architecture",
    "Before mobile app releases",
    "When integrating third-party services",
    "For contract testing in CI/CD"
  ],

  category: "integration",
  level: "Intermediate",
  speed: "Fast",
  owner: "Backend Developers & QA",

  quickStartTemplate: {
    language: "javascript",
    code: `// API Test with Supertest
const request = require('supertest');
const app = require('../app');

describe('User API Tests', () => {
  test('GET /api/users returns 200', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token123');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
  });

  test('POST /api/users creates user', async () => {
    const newUser = { name: 'John', email: 'john@example.com' };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
  });

  test('DELETE /api/users/:id returns 404 for non-existent', async () => {
    const response = await request(app)
      .delete('/api/users/99999');
    
    expect(response.status).toBe(404);
  });
});

// Run: npm test
`
  },

  codeExample: {
    title: "Complete REST API Test Suite with Postman/Newman",
    language: "javascript",
    code: `// rest-api-tests.js (using Jest + Axios)
const axios = require('axios');

const API_BASE_URL = 'https://api.example.com';
let authToken;
let createdUserId;

describe('Complete API Test Suite', () => {
  
  // Authentication
  describe('Authentication', () => {
    test('POST /auth/login - valid credentials', async () => {
      const response = await axios.post(\`\${API_BASE_URL}/auth/login\`, {
        email: 'test@example.com',
        password: 'Password123!'
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      authToken = response.data.token;
    });

    test('POST /auth/login - invalid credentials returns 401', async () => {
      try {
        await axios.post(\`\${API_BASE_URL}/auth/login\`, {
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  // CRUD Operations
  describe('User CRUD Operations', () => {
    test('POST /api/users - create user', async () => {
      const response = await axios.post(
        \`\${API_BASE_URL}/api/users\`,
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'user'
        },
        { headers: { Authorization: \`Bearer \${authToken}\` } }
      );
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
      createdUserId = response.data.id;
    });

    test('GET /api/users/:id - retrieve user', async () => {
      const response = await axios.get(
        \`\${API_BASE_URL}/api/users/\${createdUserId}\`,
        { headers: { Authorization: \`Bearer \${authToken}\` } }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdUserId);
    });

    test('PUT /api/users/:id - update user', async () => {
      const response = await axios.put(
        \`\${API_BASE_URL}/api/users/\${createdUserId}\`,
        { name: 'Jane Smith' },
        { headers: { Authorization: \`Bearer \${authToken}\` } }
      );
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Jane Smith');
    });

    test('DELETE /api/users/:id - delete user', async () => {
      const response = await axios.delete(
        \`\${API_BASE_URL}/api/users/\${createdUserId}\`,
        { headers: { Authorization: \`Bearer \${authToken}\` } }
      );
      
      expect(response.status).toBe(204);
    });
  });

  // Validation Tests
  describe('Input Validation', () => {
    test('POST /api/users - invalid email format', async () => {
      try {
        await axios.post(
          \`\${API_BASE_URL}/api/users\`,
          { name: 'Test', email: 'invalid-email', role: 'user' },
          { headers: { Authorization: \`Bearer \${authToken}\` } }
        );
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.errors).toContain('Invalid email format');
      }
    });
  });

  // Response Schema Validation
  describe('Response Schema Validation', () => {
    test('GET /api/users - validates response schema', async () => {
      const response = await axios.get(
        \`\${API_BASE_URL}/api/users\`,
        { headers: { Authorization: \`Bearer \${authToken}\` } }
      );
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.users)).toBe(true);
      
      response.data.users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(typeof user.id).toBe('number');
        expect(typeof user.name).toBe('string');
      });
    });
  });
});

// Run: jest rest-api-tests.js
`
  },

  tools: [
    { name: "Postman/Newman", useCase: "API development and automated testing" },
    { name: "Supertest", useCase: "Node.js API testing with Express" },
    { name: "REST Assured", useCase: "Java-based REST API testing" },
    { name: "Insomnia", useCase: "API design and testing tool" },
    { name: "Pact", useCase: "Contract testing for microservices" },
    { name: "Karate DSL", useCase: "API test automation and performance" },
    { name: "Postman", useCase: "Manual and automated API testing" }
  ],

  benefits: [
    "Catches integration issues early",
    "Faster than UI testing",
    "Tests business logic directly",
    "Enables contract-driven development",
    "Supports microservices architecture",
    "Easy to automate in CI/CD pipelines",
    "Language and platform independent"
  ],

  bestPractices: [
    "Test all HTTP methods (GET, POST, PUT, DELETE, PATCH)",
    "Validate response status codes and headers",
    "Verify response schema and data types",
    "Test authentication and authorization",
    "Include negative test cases (invalid inputs)",
    "Test error handling and edge cases",
    "Use environment variables for different stages",
    "Implement proper test data management",
    "Test API versioning",
    "Validate response times for performance"
  ],

  commonPitfalls: [
    "Not testing authentication/authorization",
    "Ignoring edge cases and error scenarios",
    "Hard-coding test data and credentials",
    "Not validating response schema",
    "Testing only happy paths",
    "Not cleaning up test data after execution",
    "Skipping security testing (SQL injection, XSS)",
    "Not testing rate limiting and throttling"
  ],

  cicdIntegration: {
    platform: "GitHub Actions",
    config: `name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start API server
        run: npm start &
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          JWT_SECRET: \${{ secrets.JWT_SECRET }}
      
      - name: Wait for API to be ready
        run: npx wait-on http://localhost:3000/health
      
      - name: Run API tests
        run: npm run test:api
      
      - name: Run Postman/Newman tests
        run: |
          npm install -g newman
          newman run tests/postman-collection.json \\
            --environment tests/postman-env.json \\
            --reporters cli,json \\
            --reporter-json-export newman-results.json
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: api-test-results
          path: |
            newman-results.json
            coverage/
`,
    notes: "Run API tests on every push and pull request to ensure API contract stability"
  },

  realWorldExample: {
    scenario: "E-commerce Payment Gateway Integration Testing",
    description: "Testing payment processing API with third-party gateway integration",
    steps: [
      "Test authentication with API key and secret",
      "Create test payment with valid card details",
      "Verify payment confirmation webhook",
      "Test payment with insufficient funds (expect decline)",
      "Test payment with expired card (expect error)",
      "Verify refund API endpoint",
      "Test duplicate transaction handling (idempotency)",
      "Validate PCI compliance in request/response",
      "Test rate limiting (max 100 requests/minute)",
      "Verify payment status webhooks are received",
      "Test error handling for network timeouts",
      "Validate currency conversion calculations"
    ]
  },

  example: "Testing POST /api/orders endpoint to verify it creates an order, returns 201 status, validates required fields, and correctly calculates total amount including taxes"
},

//system-testing
  {
    id: "system-testing",
    title: "System Testing",
    shortDescription: "Test the complete application as a whole.",
    description:
      "System testing validates the entire application against business requirements in an environment similar to production.",
    whenToUse: [
      "Before UAT (User Acceptance Testing)",
      "Before deployment to production",
      "After all integration tests pass",
      "To validate end-to-end workflows"
    ],

    category: "functional",
    level: "Advanced",
    speed: "Slow",
    owner: "QA Team",

    quickStartTemplate: {
      language: "javascript",
      code: `// Playwright E2E Test Template
const { test, expect } = require('@playwright/test');

test.describe('Complete User Journey', () => {
  test('user can sign up, login, and purchase', async ({ page }) => {
    // Sign up
    await page.goto('https://example.com/signup');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'SecurePass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);

    // Add product to cart
    await page.goto('/products');
    await page.click('text=Buy Now');
    await expect(page.locator('.cart-count')).toHaveText('1');

    // Checkout
    await page.click('text=Checkout');
    await page.fill('#card-number', '4242424242424242');
    await page.click('text=Complete Purchase');
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
`
    },

    codeExample: {
      title: "Cypress Full System Test",
      language: "javascript",
      code: `describe('E-commerce Full Flow', () => {
  beforeEach(() => {
    // Reset database to known state
    cy.task('db:seed');
  });

  it('completes full purchase journey', () => {
    // Login
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/dashboard');

    // Browse and add to cart
    cy.get('[data-testid="product-1"]').click();
    cy.get('button').contains('Add to Cart').click();
    cy.get('.cart-badge').should('contain', '1');

    // Checkout
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('button').contains('Proceed to Checkout').click();

    // Fill shipping
    cy.get('#address').type('123 Main St');
    cy.get('#city').type('New York');
    cy.get('#zip').type('10001');

    // Payment
    cy.get('#card-number').type('4111111111111111');
    cy.get('#cvv').type('123');
    cy.get('button').contains('Place Order').click();

    // Verify order confirmation
    cy.get('.order-confirmation').should('be.visible');
    cy.get('.order-number').should('exist');
  });
});
`
    },

    tools: [
      { name: "Selenium", useCase: "Cross-browser automated testing" },
      { name: "Cypress", useCase: "Modern web application testing" },
      { name: "Playwright", useCase: "Multi-browser automation" },
      { name: "TestCafe", useCase: "Node.js E2E testing" },
      { name: "Appium", useCase: "Mobile application testing" }
    ],

    benefits: [
      "End-to-end validation of complete workflows",
      "Requirement verification against specs",
      "Catches integration issues across entire system",
      "Validates user experience",
      "Provides confidence before production release"
    ],

    bestPractices: [
      "Test critical user journeys first",
      "Use Page Object Model pattern",
      "Make tests independent and reusable",
      "Run tests in parallel when possible",
      "Use data-testid attributes for selectors",
      "Implement proper wait strategies"
    ],

    commonPitfalls: [
      "Brittle tests due to UI changes",
      "Flaky tests from timing issues",
      "Testing too many scenarios (slow suite)",
      "Not cleaning up test data",
      "Hardcoding test data and credentials"
    ],

    cicdIntegration: {
      platform: "GitHub Actions",
      config: `name: E2E Tests

on: [push]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
`,
      notes: "Run E2E tests on staging environment before production deployment"
    },

    realWorldExample: {
      scenario: "Banking Application System Test",
      description: "Complete testing of online banking features",
      steps: [
        "Login to banking portal",
        "View account balance",
        "Transfer money between accounts",
        "Pay bills",
        "Download statements",
        "Logout",
        "Verify all transactions recorded correctly"
      ]
    },

    example: "Testing complete flow: Login → Browse Products → Add to Cart → Checkout → Payment → Order Confirmation"
  },

//smoke-testing
{
  id: "smoke-testing",
  title: "Smoke Testing",
  shortDescription: "Quick validation of critical functionality after build/deployment.",
  description:
    "Smoke testing (also called build verification testing) is a preliminary test suite that checks whether the most crucial functions of an application work correctly. It's a shallow but broad test to determine if the build is stable enough for further testing.",
  whenToUse: [
    "After every build/deployment",
    "Before starting detailed testing",
    "In CI/CD pipelines",
    "For production deployments",
    "After environment updates"
  ],

  category: "sanity",
  level: "Beginner",
  speed: "Very Fast",
  owner: "DevOps & QA",

  quickStartTemplate: {
    language: "bash",
    code: `#!/bin/bash
# Smoke Test Script for Web Application

echo "Starting Smoke Tests..."

# Test 1: Application is running
echo "✓ Checking if application is running..."
curl -f http://localhost:3000/health || exit 1

# Test 2: Database connection
echo "✓ Checking database connection..."
curl -f http://localhost:3000/api/health/db || exit 1

# Test 3: Critical API endpoint
echo "✓ Checking critical API endpoint..."
curl -f http://localhost:3000/api/products || exit 1

# Test 4: Static assets loading
echo "✓ Checking static assets..."
curl -f http://localhost:3000/static/logo.png || exit 1

echo "✅ All smoke tests passed!"

# Run: chmod +x smoke-test.sh && ./smoke-test.sh
`
  },

  codeExample: {
    title: "Comprehensive Smoke Test Suite with Playwright",
    language: "javascript",
    code: `// smoke-tests.spec.js (Playwright)
const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests - Critical User Journeys', () => {
  
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Verify critical elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('User can login', async ({ page }) => {
    await page.goto('https://example.com/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.welcome-message')).toBeVisible();
  });

  test('Critical API endpoints are accessible', async ({ request }) => {
    // Health check endpoint
    const healthResponse = await request.get('https://api.example.com/health');
    expect(healthResponse.ok()).toBeTruthy();
    
    // Products API
    const productsResponse = await request.get('https://api.example.com/api/products');
    expect(productsResponse.ok()).toBeTruthy();
    expect(await productsResponse.json()).toHaveProperty('products');
    
    // User API (with auth)
    const usersResponse = await request.get('https://api.example.com/api/users', {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    expect(usersResponse.status()).toBeLessThan(500); // Not a server error
  });

  test('Database connection is active', async ({ request }) => {
    const response = await request.get('https://api.example.com/api/health/db');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.database).toBe('connected');
  });

  test('Search functionality works', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Perform search
    await page.fill('input[type="search"]', 'test product');
    await page.press('input[type="search"]', 'Enter');
    
    // Verify search results page loads
    await expect(page).toHaveURL(/search/);
    await expect(page.locator('.search-results')).toBeVisible();
  });

  test('Cart functionality is accessible', async ({ page }) => {
    await page.goto('https://example.com/cart');
    
    // Verify cart page loads
    await expect(page.locator('.cart-container')).toBeVisible();
    
    // Check cart operations don't throw errors
    const cartCount = await page.locator('.cart-count').textContent();
    expect(cartCount).toBeDefined();
  });

  test('Payment gateway is reachable', async ({ request }) => {
    const response = await request.get('https://api.example.com/api/payment/status');
    expect(response.ok()).toBeTruthy();
    
    const status = await response.json();
    expect(status.gateway).toBe('online');
  });

  test('Static assets load correctly', async ({ page }) => {
    const response = await page.goto('https://example.com');
    
    // Check main CSS loads
    const cssResponse = page.waitForResponse(resp => 
      resp.url().includes('.css') && resp.status() === 200
    );
    
    // Check main JS loads
    const jsResponse = page.waitForResponse(resp => 
      resp.url().includes('.js') && resp.status() === 200
    );
    
    await Promise.all([cssResponse, jsResponse]);
  });
});

// Run: npx playwright test smoke-tests.spec.js
`
  },

  tools: [
    { name: "curl/wget", useCase: "Simple HTTP endpoint checks" },
    { name: "Playwright", useCase: "Browser-based smoke tests" },
    { name: "Selenium", useCase: "UI smoke testing automation" },
    { name: "Postman/Newman", useCase: "API smoke tests in CI/CD" },
    { name: "K6", useCase: "Lightweight smoke and load tests" },
    { name: "Cypress", useCase: "Quick E2E critical path tests" },
    { name: "Bash/Shell scripts", useCase: "Custom deployment validation" }
  ],

  benefits: [
    "Detects critical failures immediately",
    "Saves time by catching showstoppers early",
    "Very fast execution (under 5 minutes)",
    "Low maintenance overhead",
    "Prevents wasted testing effort on broken builds",
    "Provides quick feedback to developers",
    "Can run after every deployment",
    "Ideal for CI/CD pipelines"
  ],

  bestPractices: [
    "Keep tests extremely fast (under 5 minutes total)",
    "Test only critical functionality (login, homepage, key APIs)",
    "Run smoke tests before detailed test suites",
    "Fail fast - stop on first critical failure",
    "Cover all major components (frontend, backend, database)",
    "Use simple assertions - pass/fail only",
    "Automate in CI/CD pipeline",
    "Keep tests stable and deterministic",
    "Document what constitutes a 'smoke test failure'",
    "Run after every deployment to production"
  ],

  commonPitfalls: [
    "Making smoke tests too comprehensive (defeats the purpose)",
    "Including flaky or slow tests",
    "Not failing the build on smoke test failures",
    "Testing non-critical features",
    "Letting smoke tests grow over time",
    "Not updating tests when critical paths change",
    "Running detailed validations (leave for full test suite)",
    "Ignoring smoke test failures in production"
  ],

  cicdIntegration: {
    platform: "GitHub Actions",
    config: `name: Smoke Tests

on:
  deployment_status:
  push:
    branches: [ main, staging ]
  workflow_dispatch:

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success' || github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Wait for deployment to be ready
        run: |
          echo "Waiting for application to be ready..."
          timeout 300 bash -c 'until curl -f \${{ secrets.APP_URL }}/health; do sleep 5; done'
      
      - name: Run smoke tests
        env:
          APP_URL: \${{ secrets.APP_URL }}
          API_URL: \${{ secrets.API_URL }}
        run: |
          # Quick API checks
          echo "Testing critical endpoints..."
          curl -f \${APP_URL}/health || exit 1
          curl -f \${API_URL}/api/health || exit 1
          curl -f \${API_URL}/api/products || exit 1
          
          # Run Playwright smoke tests
          npx playwright test smoke-tests.spec.js --reporter=line
      
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: '🔥 Smoke tests failed on \${{ github.event.deployment.environment }}'
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}
      
      - name: Rollback on critical failure
        if: failure() && github.event.deployment.environment == 'production'
        run: |
          echo "Critical smoke test failure - initiating rollback"
          # Add rollback script here
`,
    notes: "Run smoke tests immediately after deployment. Rollback automatically if critical tests fail in production."
  },

  realWorldExample: {
    scenario: "E-commerce Platform Post-Deployment Validation",
    description: "Verify critical e-commerce functionality after deploying to production",
    steps: [
      "Check homepage loads within 3 seconds",
      "Verify product listing page is accessible",
      "Test search returns results",
      "Confirm user can login with valid credentials",
      "Verify 'Add to Cart' button works",
      "Check cart page displays items",
      "Test checkout page loads",
      "Verify payment gateway status is 'online'",
      "Check order history page for logged-in users",
      "Test database connection via health endpoint",
      "Verify CDN is serving static assets",
      "Confirm email service is reachable"
    ]
  },

  example: "After deploying to production, automatically check that the homepage loads, users can login, products are displayed, and the payment gateway is online - all within 2 minutes"
},


//regression-testing
  {
    id: "regression-testing",
    title: "Regression Testing",
    shortDescription: "Ensure existing features still work after changes.",
    description:
      "Regression testing ensures that new code changes do not break existing functionality. It's critical for maintaining software quality over time.",
    whenToUse: [
      "After bug fixes",
      "After new feature addition",
      "Before every release",
      "After refactoring code",
      "During hotfix deployments"
    ],

    category: "functional",
    level: "Intermediate",
    speed: "Medium",
    owner: "QA Team",

    quickStartTemplate: {
      language: "javascript",
      code: `// Regression Test Suite Template
const { test, expect } = require('@playwright/test');

// Tag tests for regression suite
test.describe('Regression Suite', () => {
  test('@regression: Login functionality', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@regression: Search feature', async ({ page }) => {
    await page.goto('/search');
    await page.fill('#search-input', 'laptop');
    await page.press('#search-input', 'Enter');
    await expect(page.locator('.search-results')).toBeVisible();
  });

  test('@regression: Cart operations', async ({ page }) => {
    // Test that cart still works after checkout changes
    await page.goto('/products');
    await page.click('text=Add to Cart');
    await expect(page.locator('.cart-count')).toHaveText('1');
  });
});

// Run: npx playwright test --grep @regression
`
    },

    codeExample: {
      title: "Automated Regression Test Suite",
      language: "javascript",
      code: `// Visual Regression Testing with Percy
const { test } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');

test.describe('Visual Regression', () => {
  test('homepage visual regression', async ({ page }) => {
    await page.goto('/');
    await percySnapshot(page, 'Homepage');
  });

  test('product page visual regression', async ({ page }) => {
    await page.goto('/products/1');
    await percySnapshot(page, 'Product Page');
  });
});

// Comparison Test Suite
describe('API Regression Tests', () => {
  const baselineResponses = require('./baseline-responses.json');

  test('user API returns same structure', async () => {
    const response = await fetch('/api/users/1');
    const data = await response.json();
    
    // Compare with baseline
    expect(Object.keys(data)).toEqual(
      Object.keys(baselineResponses.user)
    );
  });
});
`
    },

    tools: [
      { name: "Selenium Grid", useCase: "Parallel regression testing" },
      { name: "Cypress", useCase: "Fast regression test execution" },
      { name: "TestNG", useCase: "Java test suite management" },
      { name: "Percy", useCase: "Visual regression testing" },
      { name: "BackstopJS", useCase: "CSS regression testing" }
    ],

    benefits: [
      "Prevents unexpected failures from new changes",
      "Improves software stability",
      "Catches side effects of code changes",
      "Provides safety net for refactoring",
      "Reduces production bugs"
    ],

    bestPractices: [
      "Automate regression tests completely",
      "Maintain a focused regression suite (don't test everything)",
      "Run regression tests before every release",
      "Use test tags to organize regression tests",
      "Keep regression suite fast (under 30 mins)",
      "Update tests when requirements change"
    ],

    commonPitfalls: [
      "Running full test suite for every change (too slow)",
      "Not updating tests when features change",
      "Including flaky tests in regression suite",
      "Testing too many edge cases",
      "Not prioritizing critical user paths"
    ],

    cicdIntegration: {
      platform: "Jenkins",
      config: `pipeline {
  agent any
  
  stages {
    stage('Regression Tests') {
      parallel {
        stage('API Regression') {
          steps {
            sh 'npm run test:api:regression'
          }
        }
        stage('UI Regression') {
          steps {
            sh 'npm run test:e2e:regression'
          }
        }
        stage('Visual Regression') {
          steps {
            sh 'npm run test:visual:regression'
          }
        }
      }
    }
  }
  
  post {
    failure {
      emailext (
        subject: "Regression Test Failed",
        body: "Check Jenkins for details",
        to: "team@example.com"
      )
    }
  }
}
`,
      notes: "Run regression tests nightly and before releases"
    },

    realWorldExample: {
      scenario: "Social Media App After New Feature",
      description: "After adding 'Stories' feature, verify existing features still work",
      steps: [
        "Login/Logout functionality",
        "Post creation and editing",
        "Comment and like features",
        "Profile updates",
        "Friend requests",
        "Messaging",
        "Verify 'Stories' didn't break any existing feature"
      ]
    },

    example: "After adding password reset feature, re-test login flow to ensure it still works correctly"
  },

//edge-case testing
  {
  "id": "edge-case-testing",
  "title": "Edge Case Testing",
  "shortDescription": "Test extreme boundaries, minimum/maximum values, and unusual conditions.",
  "description": "Edge case testing focuses on the boundaries of input domains, extreme conditions, and scenarios that occur rarely but could break the system. This includes testing minimum/maximum values, first/last items, empty/full states, and transition points.",
  "whenToUse": [
    "When designing data validation logic",
    "Before major releases",
    "For mission-critical features",
    "When handling numerical computations",
    "During performance optimization"
  ],
  "category": "functional",
  "level": "Advanced",
  "speed": "Slow",
  "owner": "Senior QA & Developers",
  "quickStartTemplate": {
    "language": "python",
    "code": `# Edge Case Test Examples
import pytest

def test_boundary_conditions():
    # Test min boundary
    assert process_value(0) == "minimum"
    
    # Test max boundary
    assert process_value(MAX_INT) == "maximum"
    
    # Test just below/above boundaries
    assert process_value(-1) == "error"
    assert process_value(MAX_INT + 1) == "error"

def test_empty_states():
    # Empty list
    assert calculate_average([]) == 0
    
    # Single item
    assert calculate_average([5]) == 5
    
    # All same values
    assert calculate_average([10, 10, 10]) == 10`
  },
  "tools": [
    { "name": "Jest", "useCase": "Boundary value testing" },
    { "name": "Pytest", "useCase": "Python edge case parameterized tests" },
    { "name": "TestNG", "useCase": "Data-driven edge case testing" },
    { "name": "Cypress", "useCase": "UI edge condition testing" },
    { "name": "Karate", "useCase": "API boundary testing" }
  ],
  "realWorldExample": {
    "scenario": "Flight Booking System",
    "description": "Testing extreme booking scenarios",
    "steps": [
      "Book flight for 1 passenger (minimum)",
      "Book flight for 9 passengers (maximum group)",
      "Book flight for tomorrow (minimum advance)",
      "Book flight 365 days in advance (maximum)",
      "Select all seats on a plane",
      "Book with maximum baggage allowance"
    ]
  }
},

//negative-testing
{
  "id": "negative-testing",
  "title": "Negative Testing",
  "shortDescription": "Validate system behavior with invalid, unexpected, or erroneous inputs.",
  "description": "Negative testing focuses on how the system responds to invalid inputs, unexpected user behavior, or edge conditions outside normal operation. The goal is to ensure the system handles errors gracefully without crashing or compromising data integrity.",
  "whenToUse": [
    "During security testing phases",
    "When validating user input forms",
    "For API boundary testing",
    "Before production deployment",
    "When testing error handling mechanisms"
  ],
  "category": "functional",
  "level": "Intermediate",
  "speed": "Medium",
  "owner": "QA Engineers & Developers",
  "quickStartTemplate": {
    "language": "javascript",
    "code": `// Negative Test Examples
describe('Login Form Negative Tests', () => {
  test('rejects empty username', async () => {
    const result = await login('', 'password123');
    expect(result.error).toBe('Username is required');
  });

  test('rejects SQL injection attempt', async () => {
    const result = await login("admin'; DROP TABLE users;--", 'password');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid characters');
  });

  test('handles extremely long input', async () => {
    const longString = 'a'.repeat(10000);
    const result = await login(longString, 'password');
    expect(result.error).toBe('Input too long');
  });
});`
  },
  "codeExample": {
    "title": "API Negative Testing",
    "language": "javascript",
    "code": `import { validateUserInput } from './validation';

describe('Input Validation - Negative Cases', () => {
  test('invalid email format', () => {
    expect(validateUserInput('invalid-email')).toMatchObject({
      valid: false,
      error: 'Invalid email format'
    });
  });

  test('negative age', () => {
    expect(validateUserInput({ age: -5 })).toMatchObject({
      valid: false,
      error: 'Age must be positive'
    });
  });

  test('malformed JSON body', () => {
    expect(() => validateUserInput('{invalid json}'))
      .toThrow('Invalid JSON format');
  });
});`
  },
  "tools": [
    { "name": "Postman", "useCase": "API negative testing with invalid payloads" },
    { "name": "Jest", "useCase": "JavaScript negative test automation" },
    { "name": "RestAssured", "useCase": "Java API negative testing" },
    { "name": "Selenium", "useCase": "UI negative testing automation" },
    { "name": "Fiddler", "useCase": "Modifying requests for negative testing" }
  ],
  "benefits": [
    "Identifies security vulnerabilities",
    "Improves system robustness",
    "Prevents data corruption",
    "Enhances user experience during errors",
    "Reduces production incidents"
  ],
  "bestPractices": [
    "Test all input validation rules",
    "Simulate malformed network requests",
    "Test boundary conditions beyond limits",
    "Verify error messages are user-friendly",
    "Ensure no sensitive data leaks in errors"
  ],
  "commonPitfalls": [
    "Only testing happy paths",
    "Assuming users will always follow expected flows",
    "Not testing for SQL/NoSQL injection",
    "Ignoring special character handling",
    "Forgetting to test timeout scenarios"
  ],
  "cicdIntegration": {
    "platform": "GitLab CI",
    "config": `negative-tests:
  stage: test
  script:
    - npm run test:negative
    - npm run security-scans
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"`,
    "notes": "Run negative tests in security-focused pipeline stages"
  },
  "realWorldExample": {
    "scenario": "Payment Processing System",
    "description": "Testing payment failures and invalid transactions",
    "steps": [
      "Test expired credit cards",
      "Test insufficient funds scenarios",
      "Test invalid CVV entries",
      "Test duplicate transaction attempts",
      "Test malformed currency amounts",
      "Test network timeouts during payment"
    ]
  }
},

//performance-testing
  {
    id: "performance-testing",
    title: "Performance Testing",
    shortDescription: "Measure speed, scalability, and stability.",
    description:
      "Performance testing evaluates how the system behaves under various load conditions, measuring response times, throughput, and resource utilization.",
    whenToUse: [
      "Before production release",
      "For high-traffic systems",
      "After infrastructure changes",
      "To establish performance baselines",
      "Before marketing campaigns (expected traffic spike)"
    ],

    category: "non-functional",
    level: "Advanced",
    speed: "Slow",
    owner: "DevOps/QA",

    quickStartTemplate: {
      language: "javascript",
      code: `// k6 Load Test Template
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}

// Run: k6 run script.js
`
    },

    codeExample: {
      title: "JMeter-like Stress Test with Artillery",
      language: "yaml",
      code: `# artillery-config.yml
config:
  target: "https://api.example.com"
  phases:
    - duration: 60
      arrivalRate: 10        # 10 users/sec for 1 min
      name: "Warm up"
    - duration: 300
      arrivalRate: 50        # 50 users/sec for 5 min
      name: "Sustained load"
    - duration: 120
      arrivalRate: 100       # 100 users/sec for 2 min
      name: "Stress test"
  
scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/products"
          capture:
            - json: "$.products[0].id"
              as: "productId"
      - get:
          url: "/api/products/{{ productId }}"
      - think: 2               # Wait 2 seconds
      - post:
          url: "/api/cart"
          json:
            productId: "{{ productId }}"
            quantity: 1

# Run: artillery run artillery-config.yml
`
    },

    tools: [
      { name: "k6", useCase: "Modern load testing, developer-friendly" },
      { name: "JMeter", useCase: "Enterprise-grade performance testing" },
      { name: "Gatling", useCase: "Scala-based load testing" },
      { name: "Artillery", useCase: "Quick HTTP/WebSocket load tests" },
      { name: "Locust", useCase: "Python-based distributed load testing" }
    ],

    benefits: [
      "Identifies bottlenecks before production",
      "Improves user experience through faster responses",
      "Validates infrastructure capacity",
      "Prevents downtime during high traffic",
      "Helps with capacity planning"
    ],

    bestPractices: [
      "Test on production-like environment",
      "Start with baseline tests",
      "Gradually increase load (ramp-up)",
      "Monitor server resources (CPU, memory, network)",
      "Test different scenarios (peak load, sustained load, stress)",
      "Set clear performance goals (SLAs)",
      "Run tests from multiple geographic locations"
    ],

    commonPitfalls: [
      "Testing on local/development environment",
      "Not monitoring backend metrics",
      "Testing with unrealistic data volumes",
      "Ignoring database performance",
      "Not testing edge cases (timeouts, errors)",
      "Running tests during production hours"
    ],

    cicdIntegration: {
      platform: "GitHub Actions",
      config: `name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Run nightly at 2 AM
  workflow_dispatch:     # Manual trigger

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/performance/load-test.js
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: summary.json
      
      - name: Check thresholds
        run: |
          if grep -q "failed" summary.json; then
            echo "Performance thresholds failed!"
            exit 1
          fi
`,
      notes: "Run performance tests nightly on staging environment"
    },

    realWorldExample: {
      scenario: "Black Friday E-commerce Load Test",
      description: "Prepare for 100x normal traffic during sale event",
      steps: [
        "Simulate 10,000 concurrent users",
        "Test product browsing under load",
        "Test checkout process",
        "Test payment gateway capacity",
        "Monitor database query performance",
        "Check CDN and caching effectiveness",
        "Verify system can handle 500 orders/minute",
        "Ensure error rate stays below 0.1%"
      ]
    },

    example: "Simulating 10,000 concurrent users hitting /api/products and measuring if 95% of requests complete under 500ms"
  },

//compatibility-testing
{
  id: "compatibility-testing",
  title: "Compatibility Testing",
  shortDescription: "Test application across different environments, devices, and configurations.",
  description:
    "Compatibility testing ensures that software functions correctly across various browsers, operating systems, devices, network environments, and hardware configurations. This includes testing responsive design, browser-specific behaviors, and backward compatibility with legacy systems.",
  whenToUse: [
    "Before multi-platform releases",
    "When supporting legacy systems",
    "For consumer-facing web applications",
    "When using third-party dependencies",
    "After browser/OS updates"
  ],

  category: "non-functional",
  level: "Intermediate",
  speed: "Slow",
  owner: "QA Engineers",

  quickStartTemplate: {
    language: "markdown",
    code: `# Compatibility Testing Checklist

## Test Details
**Application:** [App Name]  
**Version:** [Version Number]  
**Tester:** [Name]  
**Date:** [Date]

## Browser Compatibility Matrix

### Desktop Browsers
- [ ] Chrome (Latest)
- [ ] Chrome (Latest - 1)
- [ ] Firefox (Latest)
- [ ] Firefox ESR
- [ ] Safari (Latest)
- [ ] Edge (Latest)
- [ ] IE11 (if required)

### Mobile Browsers
- [ ] Safari iOS (Latest)
- [ ] Chrome Android (Latest)
- [ ] Samsung Internet
- [ ] Firefox Mobile

## Operating Systems
- [ ] Windows 11
- [ ] Windows 10
- [ ] macOS Sonoma
- [ ] macOS Ventura
- [ ] Ubuntu 22.04
- [ ] iOS 17
- [ ] iOS 16
- [ ] Android 14
- [ ] Android 13

## Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet Portrait (768x1024)
- [ ] Tablet Landscape (1024x768)
- [ ] Mobile Large (414x896)
- [ ] Mobile Medium (375x667)
- [ ] Mobile Small (320x568)

## Key Features to Verify
- [ ] Layout and responsive design
- [ ] Form submissions
- [ ] File uploads/downloads
- [ ] Payment processing
- [ ] Video/audio playback
- [ ] Third-party integrations
- [ ] Print functionality
- [ ] Keyboard navigation
- [ ] Touch interactions

## Issues Found
| Browser/Device | Issue | Severity | Screenshot |
|---|---|---|---|
| Safari 17 iOS | Button overlaps text on iPhone SE | Medium | [Link] |
| IE11 | CSS Grid not supported | High | [Link] |

## Sign-off
All critical paths tested across target platforms: ✅ / ❌

// Save as: compatibility-test-[version]-[date].md
`
  },

  codeExample: {
    title: "Cross-Browser Compatibility Test Report",
    language: "markdown",
    code: `# Compatibility Testing Report - E-Commerce Platform v3.2

## Test Information
- **Application:** ShopNow E-Commerce Platform
- **Version:** 3.2.0-rc1
- **Test Date:** 2024-01-20 to 2024-01-22
- **Tester:** Mike Chen
- **Test Environment:** Production-like staging
- **Test Scope:** Full checkout flow + dashboard

---

## Executive Summary

**Overall Status:** ⚠️ PARTIAL PASS  
**Critical Issues:** 2  
**High Priority Issues:** 5  
**Medium Priority Issues:** 8  
**Browsers Tested:** 12  
**Devices Tested:** 15  
**Pass Rate:** 78%

**Major Findings:**
- IE11 has critical CSS layout issues (flexbox fallbacks needed)
- Safari iOS has payment button rendering bug
- Android Chrome experiencing slow checkout on older devices
- All modern browsers (Chrome, Firefox, Edge, Safari desktop) performing well

---

## Detailed Browser Compatibility Results

### ✅ Chrome Desktop (v120.x)
**OS Tested:** Windows 11, macOS Sonoma, Ubuntu 22.04  
**Status:** PASS  
**Notes:**
- All features working as expected
- Performance excellent (page load < 2s)
- No layout issues across all resolutions

### ✅ Firefox Desktop (v121.x)
**OS Tested:** Windows 11, macOS Sonoma, Ubuntu 22.04  
**Status:** PASS  
**Notes:**
- Minor font rendering difference (acceptable)
- CSS animations smooth
- File upload works perfectly

### ✅ Edge Desktop (v120.x)
**OS Tested:** Windows 11  
**Status:** PASS  
**Notes:**
- Chromium-based, behaves like Chrome
- No unique issues found

### ✅ Safari Desktop (v17.x)
**OS Tested:** macOS Sonoma  
**Status:** PASS  
**Notes:**
- Date picker uses native Safari UI (expected)
- Minor box-shadow rendering difference
- WebP images displaying correctly

### ❌ Internet Explorer 11
**OS Tested:** Windows 10  
**Status:** FAIL (Critical Issues)  

**BUG-401 [CRITICAL]:** Product grid layout broken
- **Description:** CSS Grid not supported, layout collapses
- **Impact:** Users cannot browse products properly
- **Repro:** Open homepage on IE11, grid items stack vertically
- **Fix Needed:** Add flexbox fallback with autoprefixer
- **Screenshot:** ie11-grid-layout-bug.png

**BUG-402 [CRITICAL]:** Checkout button invisible
- **Description:** CSS custom properties not supported
- **Impact:** Cannot complete purchase
- **Repro:** Add item to cart, go to checkout, button missing
- **Fix Needed:** Add CSS variable fallbacks
- **Screenshot:** ie11-checkout-button.png

**BUG-403 [HIGH]:** Arrow functions breaking JS
- **Description:** ES6+ syntax not transpiled
- **Impact:** Cart quantity update fails
- **Fix Needed:** Update Babel config to transpile for IE11

### ⚠️ Safari iOS (v17.x)
**Devices Tested:** iPhone 15 Pro, iPhone 12, iPhone SE (2022)  
**Status:** PARTIAL PASS  

**BUG-404 [HIGH]:** Payment button cut off on iPhone SE
- **Description:** "Complete Purchase" button bottom 20px hidden
- **Impact:** Users must scroll to see full button
- **Repro:** iPhone SE (375x667), portrait mode, checkout page
- **Fix Needed:** Adjust bottom padding on mobile viewports
- **Screenshot:** iphone-se-button-cutoff.jpg

**BUG-405 [MEDIUM]:** Input focus zoom behavior
- **Description:** Page zooms to 150% when focusing input fields
- **Impact:** Annoying UX, but functional
- **Fix Needed:** Add \`maximum-scale=1\` to viewport meta tag (carefully)

### ✅ Chrome Android (v120.x)
**Devices Tested:** Samsung Galaxy S23, Pixel 7, OnePlus 9  
**Status:** PASS  
**Notes:**
- Smooth performance on flagship devices
- Touch targets appropriately sized (44px minimum)

### ⚠️ Chrome Android - Older Devices
**Devices Tested:** Samsung Galaxy S8 (Android 9)  
**Status:** PARTIAL PASS  

**BUG-406 [MEDIUM]:** Slow checkout performance
- **Description:** Payment processing UI lags on older hardware
- **Impact:** 5+ second delay, may frustrate users
- **Metrics:** Time to Interactive: 8.2s (target: <3s)
- **Fix Needed:** Lazy load non-critical checkout components

### ✅ Samsung Internet (v23.x)
**Devices Tested:** Galaxy S23  
**Status:** PASS  
**Notes:**
- Samsung-specific browser features working
- Dark mode support functioning

---

## Responsive Design Testing

### Desktop Resolutions

| Resolution | Status | Issues |
|---|---|---|
| 1920x1080 | ✅ PASS | None |
| 1680x1050 | ✅ PASS | None |
| 1440x900 | ✅ PASS | None |
| 1366x768 | ✅ PASS | None |
| 1280x720 | ⚠️ PARTIAL | Sidebar slightly cramped |

### Tablet Resolutions

| Device | Resolution | Status | Issues |
|---|---|---|---|
| iPad Pro 12.9" | 1024x1366 | ✅ PASS | None |
| iPad Air | 820x1180 | ✅ PASS | None |
| iPad Mini | 768x1024 | ⚠️ PARTIAL | BUG-407: Nav menu overlaps |
| Galaxy Tab S8 | 800x1280 | ✅ PASS | None |

**BUG-407 [MEDIUM]:** iPad Mini navigation overlap
- Hamburger menu icon overlaps with logo at 768px width
- Fix: Adjust breakpoint to collapse menu at 800px instead

### Mobile Resolutions

| Device | Resolution | Status | Issues |
|---|---|---|---|
| iPhone 15 Pro Max | 430x932 | ✅ PASS | None |
| iPhone 15 | 393x852 | ✅ PASS | None |
| iPhone SE | 375x667 | ⚠️ PARTIAL | BUG-404 (button cutoff) |
| Galaxy S23 Ultra | 412x915 | ✅ PASS | None |
| Galaxy S23 | 360x780 | ✅ PASS | None |
| Small devices | 320x568 | ❌ FAIL | BUG-408: Text overflow |

**BUG-408 [HIGH]:** Content overflow on 320px width
- Product titles overflow container on very small screens
- Affects iPhone 5/SE (original) and similar devices
- Fix: Add \`overflow-wrap: break-word\` and reduce font size

---

## Operating System Compatibility

### Windows
- ✅ Windows 11: All browsers working
- ✅ Windows 10: All browsers working
- ⚠️ Windows 8.1: IE11 issues (see above)

### macOS
- ✅ Sonoma (14.x): Perfect compatibility
- ✅ Ventura (13.x): Perfect compatibility
- ✅ Monterey (12.x): Safari working, minor rendering differences

### Linux
- ✅ Ubuntu 22.04: Chrome & Firefox working perfectly
- ✅ Fedora 38: Firefox working
- Note: Limited testing on other distributions

### Mobile OS
- ✅ iOS 17: Working (with BUG-404)
- ✅ iOS 16: Working
- ⚠️ iOS 15: Minor CSS issues with backdrop-filter
- ✅ Android 14: Working perfectly
- ✅ Android 13: Working perfectly
- ⚠️ Android 9: Performance issues (see BUG-406)

---

## Feature-Specific Testing

### Payment Processing
| Browser/Device | Stripe Integration | PayPal | Apple Pay | Google Pay |
|---|---|---|---|---|
| Chrome Desktop | ✅ | ✅ | N/A | ✅ |
| Safari Desktop | ✅ | ✅ | ✅ | N/A |
| Safari iOS | ✅ | ✅ | ✅ | N/A |
| Chrome Android | ✅ | ✅ | N/A | ✅ |
| IE11 | ❌ | ⚠️ | N/A | N/A |

### File Uploads (Product Images)
- ✅ Chrome/Firefox/Edge/Safari: Drag & drop working
- ✅ Mobile: Camera integration working
- ❌ IE11: Multiple file selection broken (BUG-409)

### Video Product Demos
- ✅ MP4 H.264: Universal support
- ⚠️ WebM: Not supported on Safari/iOS (fallback working)
- ✅ Adaptive streaming: Working on all modern browsers

### PDF Invoice Generation
| Browser | Status | Notes |
|---|---|---|
| Chrome | ✅ | Perfect rendering |
| Firefox | ✅ | Perfect rendering |
| Safari | ⚠️ | Fonts slightly different |
| Edge | ✅ | Perfect rendering |
| IE11 | ❌ | BUG-410: Missing CSS |

---

## Accessibility Testing

### Screen Readers
- ✅ NVDA (Windows): Checkout flow accessible
- ✅ JAWS (Windows): Minor improvements needed
- ✅ VoiceOver (macOS): Working well
- ✅ VoiceOver (iOS): BUG-411: Some buttons not labeled

### Keyboard Navigation
- ✅ Tab order logical on all browsers
- ✅ Focus indicators visible
- ⚠️ Skip navigation link missing

---

## Performance Metrics by Browser

| Browser | First Paint | Time to Interactive | Total Load Time |
|---|---|---|---|
| Chrome Desktop | 0.8s | 2.1s | 3.2s |
| Firefox Desktop | 0.9s | 2.3s | 3.5s |
| Safari Desktop | 1.1s | 2.4s | 3.8s |
| Edge Desktop | 0.8s | 2.2s | 3.3s |
| Safari iOS | 1.5s | 3.1s | 4.6s |
| Chrome Android | 1.8s | 3.5s | 5.1s |
| IE11 | 3.2s | 8.9s | 12.1s |

---

## Third-Party Integration Testing

### Google Analytics
- ✅ Tracking working on all modern browsers
- ⚠️ IE11: Some events not firing (low priority)

### Stripe Checkout
- ✅ All modern browsers working
- ❌ IE11: Form styling broken

### Social Media Sharing
- ✅ Open Graph tags rendering correctly
- ✅ Twitter cards working
- ⚠️ LinkedIn preview occasionally missing image

---

## Network Conditions Testing

| Condition | Chrome | Safari | Firefox | Status |
|---|---|---|---|---|
| 4G (Fast) | ✅ | ✅ | ✅ | Good |
| 3G (Slow) | ⚠️ | ⚠️ | ⚠️ | Usable but slow |
| 2G | ❌ | ❌ | ❌ | Times out |
| Offline | ⚠️ | ⚠️ | ⚠️ | No offline support |

**Recommendation:** Implement service worker for offline fallback

---

## Critical Issues Summary

### Must Fix Before Release
1. **BUG-401:** IE11 grid layout (if IE11 support required)
2. **BUG-402:** IE11 checkout button
3. **BUG-404:** iPhone SE button cutoff
4. **BUG-408:** Content overflow on 320px screens

### Should Fix Soon
5. **BUG-405:** iOS input zoom
6. **BUG-406:** Android performance on older devices
7. **BUG-407:** iPad Mini navigation
8. **BUG-409:** IE11 file uploads

---

## Recommendations

### Immediate Actions
1. Add CSS Grid fallbacks for IE11 or drop IE11 support
2. Implement CSS variable fallbacks
3. Fix iPhone SE viewport issues
4. Add overflow handling for small screens

### Short-Term Improvements
1. Optimize bundle size for mobile performance
2. Add service worker for offline support
3. Implement progressive enhancement for older browsers
4. Add more comprehensive tablet breakpoints

### Long-Term Considerations
1. Officially drop IE11 support (communicate to stakeholders)
2. Implement automated cross-browser testing in CI/CD
3. Set up BrowserStack integration for regular compatibility checks
4. Create device lab for physical device testing

---

## Test Coverage Summary

**Browsers Tested:** 12/12 planned  
**Devices Tested:** 15/15 planned  
**Feature Coverage:** 95%  
**Platform Coverage:** 100%

---

## Sign-off

**Recommendation:** CONDITIONAL APPROVAL  
- Approve for modern browsers (Chrome, Firefox, Safari, Edge)
- Block release until IE11 critical issues fixed OR confirm IE11 not supported
- Fix iPhone SE issues before mobile release

**Tested by:** Mike Chen  
**Date:** 2024-01-22  
**Next Review:** After bug fixes implemented
`
  },

  tools: [
    { name: "BrowserStack/Sauce Labs", useCase: "Cross-browser testing platforms with real devices" },
    { name: "Selenium Grid", useCase: "Distributed compatibility testing automation" },
    { name: "LambdaTest", useCase: "Cloud-based device and browser testing" },
    { name: "Responsively App", useCase: "Responsive design testing across multiple viewports" },
    { name: "Docker", useCase: "Environment compatibility testing with containerization" },
    { name: "Can I Use", useCase: "Browser feature support lookup" },
    { name: "Autoprefixer", useCase: "Automatic vendor prefix addition" },
    { name: "Modernizr", useCase: "Feature detection and polyfill loading" },
    { name: "BrowserShots", useCase: "Screenshot comparison across browsers" },
    { name: "CrossBrowserTesting", useCase: "Live testing on real browsers" },
    { name: "Chrome DevTools Device Mode", useCase: "Device emulation and responsive testing" },
    { name: "ngrok", useCase: "Local testing on real mobile devices" }
  ],

  benefits: [
    "Ensures consistent user experience across platforms",
    "Identifies browser-specific bugs early",
    "Validates responsive design implementations",
    "Reduces customer support tickets from compatibility issues",
    "Builds trust with users on all platforms",
    "Prevents revenue loss from unsupported browsers",
    "Validates third-party integration compatibility",
    "Ensures accessibility across different assistive technologies",
    "Identifies performance issues on different devices",
    "Supports informed decisions about browser support"
  ],

  bestPractices: [
    "Define browser/device support matrix before testing",
    "Test on real devices when possible, not just emulators",
    "Prioritize testing based on user analytics data",
    "Use progressive enhancement approach",
    "Test critical user journeys on all platforms",
    "Automate compatibility testing where possible",
    "Keep a physical device lab for key platforms",
    "Document all compatibility issues with screenshots",
    "Test with different network conditions",
    "Validate with assistive technologies",
    "Use feature detection instead of browser detection",
    "Test print functionality across browsers",
    "Verify file upload/download on all platforms",
    "Check video/audio playback compatibility"
  ],

  commonPitfalls: [
    "Only testing on latest browsers, ignoring user analytics",
    "Relying solely on emulators instead of real devices",
    "Not testing on different operating systems",
    "Ignoring older but still-used browser versions",
    "Testing only happy paths, missing edge cases",
    "Not documenting exact browser versions tested",
    "Forgetting to test third-party integrations",
    "Ignoring mobile landscape orientation",
    "Not testing with different zoom levels",
    "Skipping accessibility testing on different platforms",
    "Testing only on high-end devices",
    "Not considering network speed variations"
  ],

  cicdIntegration: {
    platform: "GitHub Actions",
    config: `name: Cross-Browser Compatibility Tests

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

env:
  BROWSERSTACK_USERNAME: \${{ secrets.BROWSERSTACK_USERNAME }}
  BROWSERSTACK_ACCESS_KEY: \${{ secrets.BROWSERSTACK_ACCESS_KEY }}

jobs:
  compatibility-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser:
          - { name: 'chrome', version: 'latest' }
          - { name: 'firefox', version: 'latest' }
          - { name: 'safari', version: 'latest' }
          - { name: 'edge', version: 'latest' }
          - { name: 'ie', version: '11' }
        include:
          - browser: { name: 'chrome', version: 'latest-1' }
          - browser: { name: 'firefox', version: 'latest-1' }
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start local server
        run: |
          npm run serve &
          npx wait-on http://localhost:3000
      
      - name: Run compatibility tests on BrowserStack
        run: |
          npm run test:compatibility -- \\
            --browser=\${{ matrix.browser.name }} \\
            --version=\${{ matrix.browser.version }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: compatibility-results-\${{ matrix.browser.name }}-\${{ matrix.browser.version }}
          path: test-results/
      
      - name: Generate compatibility report
        if: always()
        run: npm run report:compatibility
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('test-results/summary.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: \`## Compatibility Test Results - \${{ matrix.browser.name }} \${{ matrix.browser.version }}\\n\\n\${report}\`
            });

  mobile-compatibility:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        device:
          - { name: 'iPhone 14', os: 'iOS', version: '16' }
          - { name: 'iPhone SE', os: 'iOS', version: '16' }
          - { name: 'Samsung Galaxy S23', os: 'Android', version: '13' }
          - { name: 'Google Pixel 7', os: 'Android', version: '13' }
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for mobile
        run: npm run build:mobile
      
      - name: Run mobile tests on \${{ matrix.device.name }}
        run: |
          npm run test:mobile -- \\
            --device="\${{ matrix.device.name }}" \\
            --os=\${{ matrix.device.os }} \\
            --version=\${{ matrix.device.version }}
      
      - name: Upload mobile test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: mobile-results-\${{ matrix.device.name }}
          path: mobile-test-results/

  visual-regression:
    runs-on: ubuntu-latest
    needs: [compatibility-tests]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run visual regression tests
        run: npm run test:visual
      
      - name: Upload visual diff screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: screenshots/diffs/
      
      - name: Fail if visual differences found
        run: npm run test:visual:verify

  compatibility-report:
    runs-on: ubuntu-latest
    needs: [compatibility-tests, mobile-compatibility]
    if: always()
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download all test results
        uses: actions/download-artifact@v3
      
      - name: Generate comprehensive compatibility report
        run: |
          npm run report:generate-compatibility-matrix
      
      - name: Upload full compatibility report
        uses: actions/upload-artifact@v3
        with:
          name: full-compatibility-report
          path: reports/compatibility-matrix.html
      
      - name: Post Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: |
            Compatibility Tests: \${{ job.status }}
            View full report: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}
`,
    notes: "Runs compatibility tests across multiple browsers and devices using BrowserStack. Generates reports and notifies team of any failures. Runs daily and on every PR."
  },

  realWorldExample: {
    scenario: "SaaS Dashboard Compatibility",
    description: "Testing business analytics dashboard across enterprise environments",
    steps: [
      "Test on Chrome, Firefox, Safari, Edge (latest versions)",
      "Verify IE11 compatibility if required by enterprise clients",
      "Test on Windows 10, Windows 11, macOS Sonoma, Ubuntu 22.04",
      "Check mobile responsive design on iOS and Android",
      "Test with different screen resolutions (1920x1080, 1366x768, 1280x720)",
      "Verify PDF export generation across all browsers",
      "Test Excel export compatibility",
      "Verify SSO integration works across browsers",
      "Test data visualization charts render correctly",
      "Check keyboard navigation on all platforms",
      "Verify screen reader compatibility (NVDA, JAWS, VoiceOver)",
      "Test with browser zoom at 150%, 200%",
      "Verify print functionality produces correct layouts",
      "Test file upload from different OS file systems",
      "Check third-party integrations (Salesforce, Slack)",
      "Test on different network speeds (4G, 3G, throttled)",
      "Verify session persistence across browser restarts",
      "Test with browser extensions disabled and enabled",
      "Check dark mode compatibility on macOS/Windows",
      "Document all browser-specific CSS issues"
    ]
  },

  example: "A QA engineer tests an e-commerce checkout flow across Chrome, Firefox, Safari, and Edge on Windows, macOS, and Linux. They discover the payment button is cut off on iPhone SE, IE11 doesn't support CSS Grid causing layout issues, and video playback fails on Safari 15. They document all issues with screenshots, browser versions, and reproduction steps in a compatibility matrix."
},

//accessibility-testing
{
  id: "accessibility-testing",
  title: "Accessibility Testing",
  shortDescription: "Ensure applications are usable by people with disabilities.",
  description:
    "Accessibility testing verifies that web and mobile applications are usable by people with various disabilities, including visual, auditory, motor, and cognitive impairments. Testing focuses on compliance with standards like WCAG and ensuring assistive technologies work properly.",
  whenToUse: [
    "During UI development",
    "Before public releases",
    "For government/compliance projects",
    "When redesigning user interfaces",
    "For customer-facing applications"
  ],

  category: "compliance",
  level: "Intermediate",
  speed: "Medium",
  owner: "QA & UX Teams",

  quickStartTemplate: {
    language: "javascript",
    code: `// Accessibility Test with axe-core and Jest
const { axe, toHaveNoViolations } = require('jest-axe');
const { render } = require('@testing-library/react');
const LoginPage = require('./LoginPage');

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('Login page has no accessibility violations', async () => {
    const { container } = render(<LoginPage />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('Form has proper labels', () => {
    const { getByLabelText } = render(<LoginPage />);
    
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  test('Buttons are keyboard accessible', () => {
    const { getByRole } = render(<LoginPage />);
    const submitButton = getByRole('button', { name: /submit/i });
    
    submitButton.focus();
    expect(submitButton).toHaveFocus();
  });
});

// Run: npm test
`
  },

  codeExample: {
    title: "Comprehensive Accessibility Test Suite with Playwright",
    language: "javascript",
    code: `// accessibility-tests.spec.js
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Testing Suite', () => {
  
  test('Homepage passes WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('https://example.com');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation works throughout the site', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    
    // Navigate to main content with skip link
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    
    // Test form navigation
    await page.goto('https://example.com/contact');
    await page.keyboard.press('Tab'); // First name
    await page.keyboard.type('John');
    await page.keyboard.press('Tab'); // Last name
    await page.keyboard.type('Doe');
    await page.keyboard.press('Tab'); // Email
    await page.keyboard.type('john@example.com');
    await page.keyboard.press('Tab'); // Submit button
    await page.keyboard.press('Enter');
    
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('Color contrast meets AA standards', async ({ page }) => {
    await page.goto('https://example.com');
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();
    
    expect(contrastResults.violations).toEqual([]);
  });

  test('All images have alt text', async ({ page }) => {
    await page.goto('https://example.com');
    
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
    
    // Verify decorative images have empty alt
    const decorativeImages = await page.locator('img[role="presentation"]').count();
    if (decorativeImages > 0) {
      const decorativeWithEmptyAlt = await page.locator('img[role="presentation"][alt=""]').count();
      expect(decorativeWithEmptyAlt).toBe(decorativeImages);
    }
  });

  test('Form inputs have proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('https://example.com/register');
    
    // Check all inputs have labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const hasLabel = await page.locator(\`label[for="\${id}"]\`).count() > 0;
      
      // Input should have either a label, aria-label, or aria-labelledby
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
    
    // Check required fields have aria-required
    const requiredInputs = await page.locator('input[required]').all();
    for (const input of requiredInputs) {
      const ariaRequired = await input.getAttribute('aria-required');
      expect(ariaRequired).toBe('true');
    }
  });

  test('Error messages are announced to screen readers', async ({ page }) => {
    await page.goto('https://example.com/login');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check error messages have proper ARIA attributes
    const errorMessages = await page.locator('[role="alert"]').all();
    expect(errorMessages.length).toBeGreaterThan(0);
    
    // Verify aria-live regions for dynamic errors
    const liveRegion = await page.locator('[aria-live="polite"], [aria-live="assertive"]').first();
    await expect(liveRegion).toBeVisible();
  });

  test('Modal dialogs trap focus and have proper ARIA', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Open modal
    await page.click('button:has-text("Open Modal")');
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Check modal has aria-modal
    expect(await modal.getAttribute('aria-modal')).toBe('true');
    
    // Check modal has aria-labelledby or aria-label
    const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
    const ariaLabel = await modal.getAttribute('aria-label');
    expect(ariaLabelledBy || ariaLabel).toBeTruthy();
    
    // Test focus trap
    await page.keyboard.press('Tab');
    const focusInModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal.contains(document.activeElement);
    });
    expect(focusInModal).toBeTruthy();
    
    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Page has proper heading hierarchy', async ({ page }) => {
    await page.goto('https://example.com');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(headings => 
      headings.map(h => parseInt(h.tagName.substring(1)))
    );
    
    // Check there's exactly one h1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);
    
    // Check heading hierarchy doesn't skip levels
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('Interactive elements have visible focus indicators', async ({ page }) => {
    await page.goto('https://example.com');
    
    const links = await page.locator('a, button').all();
    
    for (const link of links.slice(0, 5)) { // Test first 5 for performance
      await link.focus();
      
      const hasOutline = await link.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || 
               styles.outlineWidth !== '0px' || 
               styles.boxShadow !== 'none';
      });
      
      expect(hasOutline).toBeTruthy();
    }
  });

  test('Page works with 200% zoom', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Set zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });
    
    // Check critical elements are still visible and functional
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Test horizontal scrolling isn't required
    const hasHorizontalScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('Skip navigation links exist and work', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check skip link exists
    const skipLink = page.locator('a[href="#main-content"], a:has-text("Skip to main content")').first();
    await expect(skipLink).toBeAttached();
    
    // Click skip link
    await skipLink.focus();
    await skipLink.click();
    
    // Verify focus moved to main content
    const mainContent = page.locator('#main-content, main');
    await expect(mainContent).toBeFocused();
  });
});

// Run: npx playwright test accessibility-tests.spec.js
`
  },

  tools: [
    { name: "axe-core", useCase: "Automated accessibility testing in CI/CD" },
    { name: "Wave Evaluation Tool", useCase: "Browser extension for accessibility analysis" },
    { name: "NVDA/JAWS", useCase: "Screen reader testing (Windows)" },
    { name: "VoiceOver", useCase: "Screen reader testing (macOS/iOS)" },
    { name: "Color Contrast Analyzers", useCase: "Visual accessibility and contrast testing" },
    { name: "Lighthouse", useCase: "Chrome DevTools accessibility audits" },
    { name: "Pa11y", useCase: "Automated accessibility testing tool" },
    { name: "Accessibility Insights", useCase: "Microsoft accessibility testing extension" },
    { name: "axe DevTools", useCase: "Browser extension for detailed a11y testing" }
  ],

  benefits: [
    "Expands user base to include people with disabilities",
    "Ensures legal compliance (ADA, Section 508, WCAG)",
    "Improves overall usability for all users",
    "Enhances SEO and search engine rankings",
    "Reduces legal risks and potential lawsuits",
    "Demonstrates corporate social responsibility",
    "Better keyboard navigation benefits power users",
    "Improves mobile and responsive design"
  ],

  bestPractices: [
    "Test with real assistive technologies (screen readers)",
    "Combine automated and manual testing",
    "Test keyboard-only navigation throughout the app",
    "Verify proper ARIA attributes and roles",
    "Check color contrast ratios (4.5:1 for text)",
    "Ensure all interactive elements are keyboard accessible",
    "Test with browser zoom at 200%",
    "Verify form labels and error messages",
    "Include accessibility in code reviews",
    "Test with users who have disabilities",
    "Follow WCAG 2.1 AA standards minimum",
    "Provide text alternatives for non-text content"
  ],

  commonPitfalls: [
    "Relying only on automated tools (catch only 30-40% of issues)",
    "Missing keyboard navigation support",
    "Poor color contrast ratios",
    "Images without alt text or improper alt text",
    "Forms without proper labels",
    "Missing focus indicators",
    "Improper heading hierarchy",
    "Not testing with actual screen readers",
    "Missing skip navigation links",
    "Inaccessible modals and pop-ups",
    "Using color alone to convey information",
    "Auto-playing videos without controls"
  ],

  cicdIntegration: {
    platform: "GitHub Actions",
    config: `name: Accessibility Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
      
      - name: Wait for app to be ready
        run: npx wait-on http://localhost:3000
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run automated accessibility tests
        run: npx playwright test accessibility-tests.spec.js
      
      - name: Run Pa11y accessibility audit
        run: |
          npm install -g pa11y-ci
          pa11y-ci --sitemap http://localhost:3000/sitemap.xml \\
            --threshold 0 \\
            --standard WCAG2AA
      
      - name: Run Lighthouse accessibility audit
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/products
            http://localhost:3000/contact
          configPath: './.lighthouserc.json'
          uploadArtifacts: true
      
      - name: Upload accessibility reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-reports
          path: |
            playwright-report/
            lighthouse-results/
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('accessibility-summary.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: \`## Accessibility Test Results\\n\\n\${report}\`
            });
`,
    notes: "Run accessibility tests on every pull request. Fail build if WCAG AA violations are detected."
  },

  realWorldExample: {
    scenario: "Banking Website WCAG 2.1 AA Compliance",
    description: "Testing financial application for accessibility and legal compliance",
    steps: [
      "Test keyboard-only navigation through entire banking workflow",
      "Verify screen reader announces account balances correctly",
      "Check color contrast ratios meet 4.5:1 minimum (AA standard)",
      "Test form labels for 'Transfer Money' form with NVDA",
      "Verify focus indicators on all clickable elements",
      "Test with browser zoom at 200% - ensure no horizontal scroll",
      "Verify error messages in forms are announced by screen readers",
      "Test transaction history table with screen reader (proper headers)",
      "Check all graphs/charts have text alternatives",
      "Test mobile app with VoiceOver (iOS) and TalkBack (Android)",
      "Verify modal dialogs trap focus and can be closed with Escape",
      "Test 'Skip to main content' link functionality",
      "Ensure all time-sensitive operations can be extended",
      "Verify PDF statements are accessible (tagged PDFs)"
    ]
  },

  example: "Testing a login form to ensure: email and password inputs have visible labels, error messages are announced by screen readers, the form can be completed using only keyboard, focus indicators are visible, and color contrast meets WCAG AA standards (4.5:1 ratio)"
},

//exploratory-testing
{
  id: "exploratory-testing",
  title: "Exploratory Testing",
  shortDescription: "Simultaneous learning, test design, and test execution.",
  description:
    "Exploratory testing is an unscripted, hands-on approach where testers explore the application without predefined test cases. Testers design and execute tests dynamically based on their observations, knowledge, and intuition about the system.",
  whenToUse: [
    "Early in development cycles",
    "When requirements are unclear",
    "For discovering unknown bugs",
    "After major changes",
    "When time is limited for formal testing"
  ],

  category: "unscripted",
  level: "Expert",
  speed: "Variable",
  owner: "QA Analysts",

  quickStartTemplate: {
    language: "markdown",
    code: `# Exploratory Testing Session Template

## Charter: Test User Registration Flow
**Timebox:** 90 minutes  
**Tester:** [Name]  
**Date:** [Date]  
**Build:** [Version/Build Number]

## Mission Statement:
Explore the user registration flow to discover edge cases, usability issues, and potential security vulnerabilities.

## Focus Areas:
- Form validation and error handling
- User experience and accessibility
- Data persistence and security
- Integration with email service
- Performance under different conditions

## Test Ideas & Scenarios:
1. Try submitting empty form
2. Test password visibility toggle
3. Attempt duplicate registration
4. Test with special characters in name/email
5. Verify email confirmation workflow
6. Test password strength requirements
7. Try SQL injection in input fields
8. Test with extremely long inputs
9. Check browser back button behavior
10. Test session timeout during registration

## Bugs Found:
1. **[CRITICAL]** Form accepts invalid phone numbers (e.g., "abc123")
2. **[MEDIUM]** No loading indicator during submission
3. **[LOW]** Error messages disappear too quickly

## Questions & Observations:
- What happens if server times out during registration?
- Is there rate limiting on registration attempts?
- Password requirements not clearly communicated upfront
- Success message redirects too quickly to read

## Coverage:
- ✅ Happy path
- ✅ Boundary values
- ✅ Invalid inputs
- ⚠️ Security testing (partial)
- ❌ Performance testing (deferred)

## Debrief Notes:
The registration flow is generally solid but needs clearer error messaging and better handling of edge cases in phone number validation.

// Save as: exploratory-session-[feature]-[date].md
`
  },

  codeExample: {
    title: "Session-Based Test Management (SBTM) Session Charter",
    language: "markdown",
    code: `# Exploratory Testing Charter - Payment Processing

## Session Information
- **Charter ID:** ET-2024-015
- **Tester:** Jane Smith
- **Date:** 2024-01-15
- **Duration:** 120 minutes (Timeboxed)
- **Build/Version:** v2.5.3-staging
- **Environment:** Staging
- **Test Data:** Test credit cards, PayPal sandbox

---

## Charter Statement
**Explore** the payment processing workflow  
**With** various payment methods and edge cases  
**To discover** security vulnerabilities, error handling issues, and UX problems

---

## Areas to Explore

### 1. Payment Methods
- Credit card (Visa, Mastercard, Amex)
- Debit card
- PayPal
- Apple Pay / Google Pay
- Gift cards

### 2. Test Heuristics to Apply
- **Boundary values:** $0.01, $999,999.99
- **Goldilocks:** Too little, too much, just right
- **CRUD:** Create, Read, Update, Delete payment methods
- **Interruptions:** Network loss, app backgrounding
- **Personas:** New user, returning user, VIP customer

### 3. Risk Areas
- Payment data security (PCI compliance)
- Duplicate charge prevention
- Failed transaction handling
- Refund processing
- Currency conversion

---

## Test Session Notes

### Time: 0-30 minutes - Initial Exploration
**What I tested:**
- Added credit card with valid details ✅
- Attempted purchase with $0.00 amount - **BUG: Allowed to proceed**
- Tested with expired card - Error handled correctly ✅
- Tried CVV with letters - **BUG: Not validated client-side**

**Observations:**
- Loading states are clear
- Error messages are helpful
- No visible security warnings

### Time: 30-60 minutes - Edge Cases
**What I tested:**
- Interrupted payment by closing app mid-transaction
- **BUG: Charge went through but order shows as "pending" indefinitely**
- Tested with VPN to simulate international user
- **Issue: Currency conversion rate not displayed before purchase**
- Attempted SQL injection in cardholder name field - Properly sanitized ✅

**Questions:**
- What happens if payment succeeds but order creation fails?
- Is there a webhook retry mechanism?

### Time: 60-90 minutes - Multiple Payment Methods
**What I tested:**
- PayPal integration flow - Smooth ✅
- Saved payment methods display correctly ✅
- **BUG: Can't delete primary payment method**
- Switching payment methods during checkout works ✅

### Time: 90-120 minutes - Security & Performance
**What I tested:**
- XSS attempt in address fields - Properly escaped ✅
- Network throttling (3G speed) - Takes 15+ seconds, no timeout warning
- **BUG: Sensitive data appears in browser console logs**
- Multiple rapid submissions - **BUG: Created duplicate charges**

---

## Bugs Discovered

| ID | Severity | Description | Reproduction |
|---|---|---|---|
| BUG-301 | **CRITICAL** | Duplicate charges on rapid submission | Click "Pay Now" 5 times quickly |
| BUG-302 | **CRITICAL** | Payment data in console logs | Open DevTools, make payment, check console |
| BUG-303 | **HIGH** | $0.00 payment allowed | Enter cart with $0.00, proceed to checkout |
| BUG-304 | **HIGH** | CVV not validated client-side | Enter letters in CVV field |
| BUG-305 | **MEDIUM** | Can't delete primary payment | Try to delete saved card marked as primary |
| BUG-306 | **LOW** | No timeout warning on slow network | Throttle to 3G, attempt payment |

---

## Questions & Follow-up Items

1. **Security Review Needed:** Why is payment data logged to console?
2. **PM Question:** What's expected behavior for interrupted transactions?
3. **UX Suggestion:** Add currency conversion preview
4. **Test Automation:** Add idempotency tests for duplicate submissions
5. **Documentation:** PCI compliance audit needed for console logging

---

## Coverage Assessment

### What I Tested (✅)
- All major payment methods
- Basic validation
- Error handling for declined cards
- UI/UX flow
- Security basics (XSS, SQL injection)

### What I Didn't Test (❌)
- Performance under high load
- Refund processing (requires separate session)
- Gift card balance edge cases
- Subscription payment workflows
- Failed webhook scenarios

### Risks Not Covered
- Multi-currency transactions
- International card processing
- Payment dispute handling

---

## Session Metrics
- **Time Used:** 120/120 minutes
- **Bugs Found:** 6 (2 Critical, 2 High, 1 Medium, 1 Low)
- **Test Ideas Explored:** 15/20
- **Questions Raised:** 5
- **Follow-up Sessions Needed:** Yes (Refund testing)

---

## Debrief Summary

**What went well:**
- Found critical security issue with console logging
- Discovered duplicate charge vulnerability
- Payment method integrations are solid

**What could be improved:**
- Need better client-side validation
- Missing idempotency keys for submissions
- UX could be clearer on currency conversion

**Recommended Actions:**
1. **IMMEDIATE:** Fix console logging (BUG-302)
2. **IMMEDIATE:** Implement idempotency for payments (BUG-301)
3. **SHORT-TERM:** Add client-side CVV validation
4. **FOLLOW-UP:** Schedule refund testing session

---

## Attachments
- Screenshots: /evidence/payment-bugs/
- Screen recordings: /evidence/payment-session-recording.mp4
- Network traces: /evidence/network-har-files/

**Sign-off:** Jane Smith | 2024-01-15
`
  },

  tools: [
    { name: "Session-based Test Management (SBTM)", useCase: "Structured exploratory testing with time-boxing" },
    { name: "Browser DevTools", useCase: "Real-time debugging and exploration" },
    { name: "Postman/Insomnia", useCase: "API exploration and ad-hoc testing" },
    { name: "Charles Proxy/Fiddler", useCase: "Network traffic analysis and manipulation" },
    { name: "TestRail/Qase", useCase: "Documenting exploratory findings" },
    { name: "Rapid Reporter", useCase: "Note-taking during exploratory sessions" },
    { name: "ScreenToGif/OBS", useCase: "Recording test sessions for evidence" },
    { name: "Mind Mapping Tools", useCase: "Planning test ideas and coverage" }
  ],

  benefits: [
    "Finds bugs automated tests miss",
    "Uncovers usability and UX issues",
    "Adapts to what's actually built (not just specs)",
    "Leverages tester creativity and intuition",
    "Works well with agile and iterative development",
    "Discovers unexpected behaviors and edge cases",
    "Provides rapid feedback to developers",
    "Cost-effective for applications with unclear requirements",
    "Identifies real-world usage scenarios",
    "Complements scripted testing approaches"
  ],

  bestPractices: [
    "Use time-boxing (60-120 minute sessions)",
    "Define a clear charter/mission before starting",
    "Take detailed notes during exploration",
    "Use test heuristics (CRUD, boundary values, personas)",
    "Pair with developers for immediate feedback",
    "Record sessions for evidence and review",
    "Focus on one area at a time to avoid scattered testing",
    "Document bugs immediately with reproduction steps",
    "Debrief after each session to capture learnings",
    "Combine with automation for regression coverage",
    "Use mind maps to visualize coverage",
    "Ask 'what if' questions constantly"
  ],

  commonPitfalls: [
    "No clear charter - aimless exploration",
    "Not time-boxing sessions (testing becomes endless)",
    "Poor note-taking - can't reproduce bugs",
    "Testing without a strategy or heuristics",
    "Not documenting findings in real-time",
    "Ignoring the 'boring' happy paths",
    "Exploring without understanding business context",
    "Relying only on exploratory testing (no automation)",
    "Not sharing findings with the team promptly",
    "Testing in production instead of staging"
  ],

  cicdIntegration: {
    platform: "GitHub Actions",
    config: `name: Exploratory Testing Trigger

on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM
  workflow_dispatch:      # Manual trigger
    inputs:
      feature_area:
        description: 'Feature area to explore'
        required: true
        type: choice
        options:
          - checkout
          - user-profile
          - search
          - payment

jobs:
  prepare-exploratory-session:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Create exploratory testing charter
        run: |
          mkdir -p exploratory-sessions
          cat > exploratory-sessions/charter-\$(date +%Y%m%d).md << 'EOF'
          # Exploratory Testing Charter
          
          ## Session Information
          - **Date:** \$(date +%Y-%m-%d)
          - **Feature Area:** \${{ github.event.inputs.feature_area || 'general' }}
          - **Build:** \${{ github.sha }}
          - **Environment:** Staging
          
          ## Mission
          Explore the \${{ github.event.inputs.feature_area || 'application' }} to discover:
          - Edge cases and boundary conditions
          - Usability issues
          - Security vulnerabilities
          - Performance problems
          
          ## Test Ideas
          1. Test with invalid inputs
          2. Test error handling
          3. Test under poor network conditions
          4. Test with different user roles
          5. Test interruption scenarios
          
          ## Session Notes
          [Add notes during testing]
          
          ## Bugs Found
          [Document bugs with reproduction steps]
          
          ## Follow-up Items
          [List questions and areas needing more investigation]
          EOF
      
      - name: Deploy to staging for testing
        run: |
          echo "Deploying build \${{ github.sha }} to staging..."
          # Add deployment commands here
      
      - name: Send Slack notification to QA team
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "🔍 Exploratory Testing Session Scheduled",
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Exploratory Testing Session Ready*\\n\\n*Feature Area:* \${{ github.event.inputs.feature_area || 'General' }}\\n*Build:* \`\${{ github.sha }}\`\\n*Environment:* Staging\\n\\nCharter template created in \`exploratory-sessions/\` directory"
                  }
                },
                {
                  type: "actions",
                  elements: [
                    {
                      type: "button",
                      text: {
                        type: "plain_text",
                        text: "View Staging"
                      },
                      url: "https://staging.example.com"
                    }
                  ]
                }
              ]
            }
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}
      
      - name: Upload charter template
        uses: actions/upload-artifact@v3
        with:
          name: exploratory-charter
          path: exploratory-sessions/
`,
    notes: "Trigger exploratory testing sessions weekly or on-demand. Creates charter template and notifies QA team when staging environment is ready."
  },

  realWorldExample: {
    scenario: "E-commerce Mobile App Checkout Flow",
    description: "Unscripted exploration of new checkout flow after major redesign",
    steps: [
      "Start with happy path - complete a normal purchase",
      "Try different payment methods randomly (credit card, PayPal, Apple Pay)",
      "Switch apps during checkout process (test state persistence)",
      "Test with poor network connection (airplane mode, 3G)",
      "Try unusual navigation paths (back button, deep links)",
      "Test with different user roles (guest, logged-in, premium member)",
      "Interrupt checkout with phone call or notification",
      "Apply multiple discount codes simultaneously",
      "Test with items going out of stock during checkout",
      "Try changing shipping address mid-checkout",
      "Test with cart containing 50+ items",
      "Attempt to checkout with $0.00 total (100% coupon)",
      "Test session timeout scenarios",
      "Explore accessibility with VoiceOver enabled",
      "Try rapid clicking on 'Place Order' button",
      "Test with device orientation changes",
      "Explore what happens when payment succeeds but order fails",
      "Test saving payment methods for future use",
      "Document any confusing UI elements or unclear error messages"
    ]
  },

  example: "A tester explores a new search feature by trying unusual queries (emoji, SQL injection, very long strings), filtering with extreme values, sorting by different criteria, testing pagination boundaries, checking behavior with zero results, and documenting 5 usability issues and 3 bugs found during a 90-minute time-boxed session"
},

//manual-testing
  {
    id: "manual-testing",
    title: "Manual Testing",
    shortDescription: "Testing software by hand without automation tools",
    description:
      "Manual testing means checking the application manually to find bugs by following real user scenarios.",
    whenToUse: [
      "When learning how an application works",
      "During early development",
      "For UI and user flow testing",
      "For exploratory testing",
      "When automation is not cost-effective"
    ],
    
    category: "functional",
    level: "Beginner",
    speed: "Slow",
    owner: "QA Team",
    
   
    quickStartTemplate: {
      language: "markdown",
      code: `# Manual Test Case Template

## Test Case ID: TC_001
## Feature: User Login

### Pre-conditions:
- User must have valid credentials
- Application is accessible

### Test Steps:
1. Navigate to login page
2. Enter valid username
3. Enter valid password
4. Click "Login" button

### Expected Result:
- User is redirected to dashboard
- Welcome message displays username

### Actual Result:
[To be filled during testing]

### Status: 
[ ] Pass  [ ] Fail

### Notes:
[Any observations or issues]
`
    },

    codeExample: {
      title: "Selenium Script for Manual Test Validation",
      language: "python",
      code: `# You can automate manual test steps later
from selenium import webdriver

def test_login_flow():
    driver = webdriver.Chrome()
    driver.get("https://example.com/login")
    
    # Step 1: Enter username
    driver.find_element("id", "username").send_keys("test@example.com")
    
    # Step 2: Enter password
    driver.find_element("id", "password").send_keys("password123")
    
    # Step 3: Click login
    driver.find_element("id", "login-btn").click()
    
    # Verify: Check dashboard loads
    assert "Dashboard" in driver.title
    driver.quit()
`
    },

    tools: [
      { name: "Browser DevTools", useCase: "Inspect elements, check console logs" },
      { name: "Spreadsheet", useCase: "Document test cases and results" },
      { name: "Screen Recorder", useCase: "Record bug reproduction steps" },
      { name: "Postman", useCase: "API testing manually" }
    ],

    benefits: [
      "Easy for beginners",
      "No coding required",
      "Helps understand application behavior",
      "Catches UX issues automation might miss",
      "Cost-effective for small projects"
    ],

    
    bestPractices: [
      "Document every test case clearly",
      "Use a consistent test case template",
      "Take screenshots for defects",
      "Test on multiple browsers and devices",
      "Create regression test checklists"
    ],

    
    commonPitfalls: [
      "Not documenting test steps properly",
      "Skipping edge cases",
      "Testing only happy paths",
      "Forgetting to test on different environments",
      "Not reporting issues promptly"
    ],

    cicdIntegration: {
      platform: "N/A",
      config: `# Manual testing doesn't integrate with CI/CD
# But you can use tools like TestRail or Zephyr to manage test cases
# and link them to your deployment pipeline for tracking`,
      notes: "Manual testing is typically done after automated tests pass in CI/CD pipeline"
    },

    realWorldExample: {
      scenario: "E-commerce Checkout Flow",
      description: "Testing the complete purchase journey manually to ensure smooth user experience",
      steps: [
        "Add product to cart",
        "Proceed to checkout",
        "Enter shipping details",
        "Select payment method",
        "Review order",
        "Complete purchase",
        "Verify confirmation email"
      ]
    },

    example: "Open login page → enter wrong password → check error message shows → verify user cannot access dashboard"
  },


];