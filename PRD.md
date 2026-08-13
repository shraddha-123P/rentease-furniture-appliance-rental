# RentEase Product Requirements Document

## Product summary

RentEase lets students and working professionals rent essential furniture and appliances monthly instead of buying and transporting them during moves. The platform brings together product discovery, flexible rental tenure, delivery and pickup scheduling, maintenance support and operational visibility.

## Problem

Relocating renters face high upfront ownership costs, difficult logistics, inflexible local rental plans and unreliable support. They need a simple way to equip a home for a temporary stay and return items when they move.

## Objectives

- Offer affordable monthly rental options and flexible tenure.
- Make essential furniture and appliances easy to access, deliver, maintain and return.
- Improve urban mobility while reducing unnecessary purchases.
- Establish a scalable, multi-city rental operation.

## Users

**Renter:** Student, early-career professional or household moving for work or education.

**Vendor or operations user:** Team member managing inventory, availability, delivery, pickup and maintenance.

**Administrator:** Team member overseeing users, orders, disputes, service areas, reports and business health.

## Scope

In scope: responsive web application, catalog, account flow, rental cart, checkout, delivery scheduling, active rentals, maintenance, returns, inventory, operations reporting and service-area administration.

Out of scope: native mobile applications, cross-border rentals, advanced AI pricing and a second-hand resale marketplace.

## Core journeys

1. A renter selects a city, browses products, chooses tenure and adds items to a rental plan.
2. The renter reviews monthly rent and deposit, then provides delivery details and confirms an available slot.
3. The system reserves stock, creates an order and sends delivery updates.
4. The renter manages active rentals, extends tenure or creates a maintenance request.
5. At the end of the tenure, the renter schedules pickup. Operations records inspection, damages if any, and deposit settlement.

## Functional requirements

| Area | Requirement |
| --- | --- |
| Accounts | Register, log in, verify profile and manage addresses. |
| Catalog | Browse products with price, deposit, tenure and availability by city. |
| Checkout | Calculate recurring rent and deposit; choose city, address, date and slot. |
| Rentals | View active rentals, payment schedule, extensions, return flow and history. |
| Support | Create and track maintenance, swaps, installation or pickup requests. |
| Operations | Manage products, inventory, pricing, tenure, deliveries, pickups, returns and damages. |
| Admin | Manage users, service areas, reports, disputes and rental analytics. |

## Success metrics

- Active rentals and monthly recurring revenue.
- Product utilization rate.
- Customer retention and tenure extension rate.
- Checkout-to-delivery conversion rate.
- Average maintenance request resolution time.
- On-time delivery and pickup rate.

## MVP acceptance criteria

- Responsive catalog and checkout work on desktop and mobile browsers.
- Every product has category, monthly rent, deposit, tenure options and availability.
- Orders cannot confirm unavailable items or invalid delivery slots.
- Each active rental exposes extension, return and maintenance actions.
- Operations can see available, reserved, deployed and maintenance inventory.
- Admin can view the core KPIs by city and date range.

## Future enhancements

- Native mobile app.
- Subscription bundles and recommendations.
- Payment gateway, autopay and renewals.
- Smart appliance tracking.
- Furniture customization.
