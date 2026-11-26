# TechStore — React E-Commerce UI & 5-Table ERD

React + Tailwind CSS v4 E-Commerce UI and 5-table relational ERD (`docs/ecommerce-erd.drawio`) built to follow the Practical Exercises.

---

## Exercises Covered
1. **Practical Exercise 1 — Products & Shopping Cart (`/`, `/cart`)**
   - Displays the 4 products (**Laptop \$650**, **Mouse \$15**, **Keyboard \$25**, **Monitor \$120**) with **Add to Cart** buttons.
   - Shopping Cart page with View Cart, Update QTY, Remove item, Subtotal & Grand Total, and **Proceed to Checkout**.
2. **Practical Exercise 2 — Checkout Form (`/checkout`)**
   - `First Name`, `Last Name`, `Email`, `Phone Number`, `Address` with required-field validation.
   - Shipping Method (`Free Shipping $0` / `Express Shipping $9`), Order Summary, Grand Total, and **Place Order**.
3. **Practical Exercise 3 — Order Confirmation (`/checkout`)**
   - Displays `Order Placed Successfully!`, Order ID (`ORD-0001`), Customer Name, Order Date, Ordered Products, Total Amount, and `Order Status: Pending`.
4. **Practical Exercise 4 — 5-Table Database ERD (`/erd`, [`docs/ecommerce-erd.drawio`](./docs/ecommerce-erd.drawio))**
   - Tables: `customers`, `categories`, `products`, `orders`, `order_items`.
   - Open [`docs/ecommerce-erd.drawio`](./docs/ecommerce-erd.drawio) at [https://app.diagrams.net/](https://app.diagrams.net/) (`File` → `Open from` → `Device...`).

---

## Run Locally

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```
