# Food Delivery — (Personal Project)

Hello — I'm the author of this project and this README explains what this app is, how it works, and how you (or any developer) can run and contribute to it locally.

## What this project is

This is a simple Food Delivery web application built as a full-stack learning project:

- A React + Vite frontend (`/frontend`) that shows food items, lets users add items to a cart, and place orders.
- A Node.js + Express backend (`/backend`) with MongoDB (Atlas) used to store users, food items, carts and orders. Stripe is integrated for payment flow.
- An `admin` area exists in the workspace for managing the system (add/remove food items, not covered in this README in detail).

The goal was to practice building a realistic flow: product listing, cart handling (guest and per-user), authentication, orders and payment session handling.

## Major features

- Food listing with images
- Add/remove items to cart (guest cart and per-user cart stored separately)
- Authentication (JWT-based)
- Place orders which create a Stripe Checkout session
- Backend APIs to manage food, user, cart and order data

## Project structure (important folders)

- `frontend/` — React app (Vite). The main UI lives here.
- `backend/` — Node/Express server, routes, controllers and Mongoose models.
- `admin/` — Admin UI to add food (if present in this workspace).

## Quick local setup (developers)

Note: I keep secrets out of the repository. See `backend/.env.example` for required environment variables.

1. Clone the repo (or update to latest):

```bash
git clone https://github.com/mukeshkr59/Food-Delivery.git
cd Food-Delivery
```

2. Backend setup

```powershell
cd backend
npm install
# create a .env file using .env.example and fill real secrets
# copy backend/.env.example -> backend/.env and edit
# required vars: JWT_SECRET, STRIPE_SECRET_KEY and your MongoDB connection is configured in backend/config/db.js
npm run server
```

The backend listens by default on `http://localhost:4000`.

3. Frontend setup

```powershell
cd frontend
npm install
npm run dev
# open the provided Vite URL (usually http://localhost:5173)
```

4. Admin (if available)

```powershell
cd admin
npm install
npm run dev
```

## Environment variables and secrets

- Do NOT commit `.env` to git. I added `.gitignore` and an `.env.example` file for the backend.
- The backend `.env` should include at least:
  - `JWT_SECRET` — secret used to sign JWT tokens.
  - `STRIPE_SECRET_KEY` — Stripe secret (use test keys during development).

If a secret was ever committed, rotate it immediately (I removed `.env` from history, but rotation is still required for safety).

## How the cart works (important for UX)

- There are two cart concepts stored locally:
  - `cartItem_guest` in `localStorage` for guest users.
  - `cartItem_user_<userId>` in `localStorage` when a user is authenticated (also the server holds authoritative cart data for logged-in users).
- When logged in, the frontend fetches the server-side cart and uses it as the authoritative source.
- The cart is NOT cleared when an order is created and a Stripe session is produced — the cart should only be cleared once payment is confirmed (via webhook or explicit confirmation).

## Stripe / payment flow (notes)

- Placing an order creates an Order document and a Stripe Checkout session. The user is redirected to Stripe.
- Important: Do not clear user's cart until Stripe confirms payment. Use Stripe webhooks (recommended) to handle `checkout.session.completed` and then mark order as paid and clear the cart.

## MongoDB and seeding

- The backend uses Mongoose to store `food`, `user`, `order` and `cart` data. DB connection string is in `backend/config/db.js`.
- If your `food` collection shows empty arrays in Atlas, make sure:
  - The model files are correct (I fixed model export patterns in the codebase).
  - The add-food admin route is called using `multipart/form-data` with the field name `image`.
  - Backend logs show `MongoDB connected` on server start.

I can add a small seeding script if you'd like to bulk import the images/data from `frontend/src/assets` into the database.

## API overview (high level)

- `GET /api/food/list` — returns all food items.
- `POST /api/food/add` — admin endpoint to add food (multipart form with `image`).
- `POST /api/cart/add`, `POST /api/cart/remove`, `POST /api/cart/get` — cart operations (authenticated routes).
- `POST /api/order/place` — place an order (creates Stripe session). Use webhooks for confirmation.

All authenticated endpoints expect `token` header containing the user's JWT.

## Security and notes about the repository

- I removed tracked `.env` and added `.env.example`. If your secrets were exposed in earlier commits, rotate them in their providers (Stripe, etc.).
- I force-pushed a cleaned history to remove the `.env` file from git history — collaborators should re-clone or reset their local copies.

## Troubleshooting

- Blank white screen on refresh: often caused by runtime errors when data (like `food_list`) isn't loaded yet. The frontend now includes guards against missing entries when reading the cart.
- If orders are saved with empty `items`: ensure `backend/models/orderModel.js` uses `items` in the schema (plural) so the controller payload is saved.
- If images fail to upload: check `uploads/` permissions and ensure the request uses `image` as the file field name (multer config expects that).

## Development tips

- When making changes that affect API or DB schemas, update both front and back and test end-to-end.
- Use React DevTools and network tab to inspect requests and tokens in headers.
- Use Postman to test backend endpoints independently of the frontend.

## Contributing (if others will work on it)

- Please do not commit secrets.
- Use `backend/.env.example` to create local `.env` files.
- When pulling after a forced history rewrite, reclone the repo to avoid merge issues.

---

If you want, I can:

- Add a small `SEED.md` and a script to seed food items into Atlas.
- Add a `/verify` frontend page to handle Stripe redirects (success/cancel) and call a `POST /api/order/confirm` endpoint to finalize orders.
- Add a short `DEVELOPMENT.md` for environment setup per-OS.

Thanks — let me know if you want the README adjusted (tone, more details, or extra sections).
