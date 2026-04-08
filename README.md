# ModelShop eShop 🏎️🎨

A moderately advanced e-commerce application for modelling supplies, painting tools, RC cars and parts.

## Technology Stack

### Backend
- **Java 17** + **Spring Boot 2.7** – Application framework
- **Spring Security 5** + **JWT** (jjwt 0.9.1) – Authentication & authorization
- **Spring Data JPA** + **Hibernate** – ORM and persistence layer
- **PostgreSQL 15** – Relational database
- **Flyway** – Database schema migrations with seed data
- **SpringFox (Swagger 3.0)** – Interactive API documentation
- **Lombok** – Boilerplate reduction
- **MapStruct** – Object mapping

### Frontend
- **Angular 16** – SPA framework with lazy-loaded routing
- **Angular Material 16** – Material Design UI components
- **RxJS 7** – Reactive programming
- **TypeScript 5** – Type-safe development

### Infrastructure
- **Docker + Docker Compose** – Containerised deployment
- **Nginx** – Frontend server and API reverse proxy

## Features

### Customer Features
- 🛍️ **Product Catalog** – Browse products with search, filter by category/price/brand, sort options
- 🔍 **Product Search** – Full-text search across name, description, and brand
- 📄 **Product Detail** – Image gallery, specifications tab, stock status
- ⭐ **Reviews & Ratings** – Star ratings, written reviews with average score
- 🛒 **Shopping Cart** – Persistent cart with quantity controls, real-time totals
- 💳 **Checkout** – Multi-step form (shipping → payment → review), order confirmation
- 📦 **Order History** – View past orders with status tracking
- 👤 **User Profile** – Edit personal info and delivery address

### Admin Features
- 📊 **Dashboard** – Overview stats (products, orders, users) and recent orders
- 📦 **Product Management** – CRUD operations with pagination
- 🏷️ **Category Management** – Hierarchical category tree (parent/children)
- 📋 **Order Management** – View all orders, update status (PENDING → SHIPPED → DELIVERED)

### Business Logic
- **Role-based access control** – ROLE_USER and ROLE_ADMIN roles
- **JWT authentication** – Stateless security with token in Authorization header
- **Inventory management** – Stock quantity decremented on order placement
- **Price logic** – Support for sale prices with discount badge display
- **Free shipping** – Orders over £100 get free shipping
- **Tax calculation** – 20% VAT applied at checkout
- **Order snapshots** – Product name/price captured at order time (no stale data)

## Domain Model

```
User ──────── Cart ──────── CartItem ──── Product ──── Category
 │                                           │
 └──── Order ──── OrderItem                  └──── ProductImage
 │
 └──── Review
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/register` | Public | Register |
| GET | `/api/products` | Public | List products (paginated) |
| GET | `/api/products/search` | Public | Filter/search products |
| GET | `/api/products/featured` | Public | Featured products |
| GET | `/api/products/{id}` | Public | Product detail |
| GET | `/api/categories` | Public | Category tree |
| GET | `/api/cart` | User | Get user cart |
| POST | `/api/cart/items` | User | Add to cart |
| PUT | `/api/cart/items/{id}` | User | Update cart item qty |
| DELETE | `/api/cart/items/{id}` | User | Remove cart item |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders` | User | My orders |
| GET | `/api/products/{id}/reviews` | Public | Product reviews |
| POST | `/api/products/{id}/reviews` | User | Submit review |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update order status |
| POST | `/api/categories` | Admin | Create category |
| POST | `/api/products` | Admin | Create product |

Full interactive API docs available at: `http://localhost:8080/api/swagger-ui/index.html`

## Quick Start with Docker

```bash
# Clone the repository
git clone <repo-url>
cd eshop

# Start all services (backend, frontend, PostgreSQL)
docker compose up -d

# Wait for services to be ready (first startup takes ~2 minutes)
docker compose logs -f backend

# Access the application
# Frontend:  http://localhost
# API Docs:  http://localhost:8080/api/swagger-ui/index.html
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@modelshop.com | password |
| User | john@example.com | password |

> ⚠️ Change these credentials in production!

## Local Development

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+

### Backend

```bash
cd backend

# Configure database (create database and user first)
# Edit src/main/resources/application.properties or set env vars:
export DB_URL=jdbc:postgresql://localhost:5432/eshop
export DB_USERNAME=eshop
export DB_PASSWORD=eshop_secret

# Run (Flyway will auto-migrate and seed the database)
mvn spring-boot:run
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies API to localhost:8080)
npm start

# Open http://localhost:4200
```

## Project Structure

```
eshop/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/eshop/
│   │   ├── config/            # Security, CORS, Swagger config
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── exception/         # Custom exceptions + global handler
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JWT filter, UserDetails, EntryPoint
│   │   └── service/           # Business logic
│   └── src/main/resources/
│       └── db/migration/      # Flyway SQL migrations
│           ├── V1__init_schema.sql
│           └── V2__seed_data.sql
├── frontend/                   # Angular application
│   └── src/app/
│       ├── core/              # Models, services, guards, interceptors
│       ├── shared/            # Reusable components (header, footer, product-card)
│       └── features/          # Feature modules (lazy-loaded)
│           ├── home/
│           ├── products/
│           ├── cart/
│           ├── checkout/
│           ├── auth/
│           ├── account/
│           └── admin/
├── docker-compose.yml
└── README.md
```

## Seed Data

The database is pre-populated with:
- **Categories**: Scale Models, Paints & Tools, RC Cars (with subcategories)
- **Products**: ~18 sample products (Tamiya Tiger I, Vallejo paints, Traxxas RC cars, Iwata airbrush, etc.)
- **Users**: admin + test user

## Security

- Passwords hashed with BCrypt
- JWT tokens for stateless authentication (24h expiry)
- CORS configured for development
- Input validation on all DTOs
- SQL injection prevention via JPA parameterized queries
