
Authentication
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user 
GET    /api/auth/profile           - Get current user profile
PUT    /api/auth/password          - Update password

Products
GET    /api/products               - Get all products (with filters)
GET    /api/products/:id           - Get product detail
GET    /api/products/categories    - Get all categories
GET    /api/products/brands        - Get all brands
POST   /api/products               - Create product (admin)
PUT    /api/products/:id           - Update product (admin)
DELETE /api/products/:id           - Delete product (admin)

Cart
GET    /api/cart                   - Get user cart
POST   /api/cart/items             - Add item to cart
PUT    /api/cart/items/:id         - Update cart item
DELETE /api/cart/items/:id         - Remove cart item
DELETE /api/cart/clear              - Clear cart

Orders
GET    /api/orders                 - Get user orders
GET    /api/orders/:id             - Get order detail
POST   /api/orders                 - Create order (PENDING)
PATCH  /api/orders/:id/status      - Update order status
POST   /api/orders/:id/payment     - Create payment (PENDING→PAID)
POST   /api/orders/:id/shipment    - Create shipment (PAID→SHIPPED)
PATCH  /api/orders/:id/shipment/status - Update shipment status
PATCH  /api/orders/:id/complete    - Complete order (DELIVERED→COMPLETED)
PATCH  /api/orders/:id/cancel      - Cancel order

Payments
GET    /api/payments               - Get all payments (admin)
GET    /api/payments/:id           - Get payment detail
POST   /api/payments               - Create payment
PUT    /api/payments/:id           - Update payment
DELETE /api/payments/:id           - Delete payment

Shipments
GET    /api/shipments              - Get all shipments
GET    /api/shipments/:id          - Get shipment detail
GET    /api/shipments/track/:tracking_number - Track shipment (public)
POST   /api/shipments              - Create shipment
PUT    /api/shipments/:id          - Update shipment
DELETE /api/shipments/:id          - Delete shipment

Users & Addresses
GET    /api/users                  - Get all users
GET    /api/users/:id              - Get user detail
PUT    /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user
GET    /api/users/:id/addresses    - Get user addresses
POST   /api/users/:id/addresses    - Add address
PUT    /api/users/:id/addresses/:addressId - Update address
DELETE /api/users/:id/addresses/:addressId - Delete address
