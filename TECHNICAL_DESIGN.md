# RentEase Technical Design

## Prototype status

The delivered application is a static frontend prototype using HTML5, CSS3 and vanilla JavaScript. It demonstrates the intended user and admin workflows with in-memory sample data. It does not include authentication, persistent storage, payment processing or real inventory reservation.

## Recommended production architecture

| Layer | Recommendation | Responsibility |
| --- | --- | --- |
| Web app | React with Next.js | Responsive customer and admin interfaces. |
| API | Node.js with Express or Next.js route handlers | Authentication, catalog, checkout, rental and operations APIs. |
| Database | PostgreSQL | Transactional inventory, rentals, orders, payments and audit records. |
| Cache and jobs | Redis with a worker queue | Slot holds, notifications, retries and payment reminders. |
| Files | Object storage | Product images, inspection photos and damage evidence. |
| Hosting | Vercel for web, AWS for API/jobs/storage | Deployment, observability and scaling. |

## Domain model

| Entity | Important fields |
| --- | --- |
| User | id, role, name, email, phone, verification status |
| Address | id, user id, city, locality, address, serviceable |
| Product | id, category, name, description, monthly rent, deposit, tenure rules, active |
| Inventory item | id, product id, city, condition, lifecycle state, serial number |
| Cart | id, user id, city, tenure, expires at |
| Rental order | id, user id, status, delivery slot, address, total rent, deposit |
| Rental line | order id, product id, inventory item id, monthly rent, deposit, start/end dates |
| Maintenance request | id, rental line id, type, status, priority, assigned partner |
| Pickup / inspection | id, rental line id, scheduled time, condition notes, damage charge, deposit settlement |

## Inventory lifecycle

`available -> held -> deployed -> pickup_scheduled -> inspection -> available`

Alternative paths include `deployed -> maintenance -> deployed` and `inspection -> refurbishment -> available`. Damage and loss states must preserve a full audit trail.

## Essential API surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /auth/register | Create account and begin verification. |
| POST | /auth/login | Authenticate user and issue a secure session. |
| GET | /products | List products by category, city, tenure and availability. |
| GET | /products/:id | Return price, deposit, tenure and product details. |
| POST | /carts | Create or update a rental cart. |
| POST | /checkout/quote | Calculate pricing and reserve a short inventory hold. |
| POST | /orders | Create rental order and delivery schedule after payment authorization. |
| GET | /rentals | List a renter's active and historic rentals. |
| POST | /rentals/:id/extend | Quote and apply a tenure extension. |
| POST | /maintenance-requests | Open a support request. |
| GET | /admin/inventory | Inspect item availability by city and lifecycle state. |

## Reliability and security

- Enforce role-based authorization for renter, vendor and admin actions.
- Store passwords only with an adaptive password hash; use secure, expiring sessions or access tokens.
- Retain payment-provider tokens only, never raw payment data.
- Use database transactions and row-level locks for inventory reservation and order confirmation.
- Make order, payment, delivery and return mutations idempotent.
- Record immutable operational audits for stock, pricing, condition and damage decisions.
- Add rate limiting, input validation, structured logs, monitoring and daily backups.

## Performance approach

- Serve optimized product images through a CDN with responsive sizing and lazy loading.
- Keep catalog queries indexed by city, category and active status.
- Cache read-heavy catalog and service-area responses.
- Move notifications, report generation and payment reminders to background jobs.
- Target an initial page load below three seconds on a mid-range mobile network.

## Delivery phases

1. Establish accounts, service areas, catalog, inventory and renter checkout.
2. Add delivery and pickup operations, maintenance workflow and renter self-service.
3. Add payment automation, analytics, audit tooling and multi-city scaling safeguards.
