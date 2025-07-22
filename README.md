

# Offer Detection System

This is a backend service built with NestJS and MySQL to detect offers from Flipkart, store them, and calculate the highest discount for a given payment method.

## Table of Contents
1.  [Project Setup](#project-setup)
2.  [API Endpoints](#api-endpoints)
3.  [Assumptions](#assumptions)
4.  [Design Choices](#design-choices)
5.  [Scaling Strategy](#scaling-strategy)
6.  [Future Improvements](#future-improvements)

---

## Project Setup

Follow these steps to get the project running locally.

### 1. Prerequisites
*   Node.js (v16 or higher)
*   NPM
*   MySQL Server

### 2. Clone the Repository
```bash
git clone https://github.com/Adityaveer756/Best-Offer-Detection-System.git
cd best-offer-detection-system
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory by copying the example:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=offers
```
Update the values to match your local MySQL configuration.

### 5. Create the Database
Log in to your MySQL instance and create the database.
```sql
CREATE DATABASE offers;
```

### 6. Run the Application
Start the development server:
```bash
npm run start:dev
```
The server will be running at `http://localhost:3000`.

**Note on Migrations:** This project uses TypeORM's `synchronize: true` setting for simplicity, which automatically creates and updates the database schema based on entities.

---

## API Endpoints

### 1. POST `/offer`
This endpoint receives the complete JSON response from Flipkart's offer API, parses it, and stores the identified offers in the database.

*   **Request Body:**
    ```json
    {
      "flipkartOfferApiResponse": {
        // ... JSON from Flipkart's API
      }
    }
    ```
*   **Success Response:**
    ```json
    {
      "noOfOffersIdentified": 5,
      "noOfNewOffersCreated": 3
    }
    ```

### 2. GET `/highest-discount`
This endpoint calculates the highest possible discount for a given amount, bank, and payment instrument.

*   **Query Parameters:**
    *   `amountToPay` (number): The total amount of the transaction.
    *   `bankName` (string): The name of the bank (e.g., `AXIS`, `IDFC`).
    *   `paymentInstrument` (string, optional): The payment method (e.g., `CREDIT`, `EMI_OPTIONS`).
*   **Example Request:**
    ```bash
    curl "http://localhost:3000/highest-discount?amountToPay=10000&bankName=AXIS&paymentInstrument=CREDIT"
    ```
*   **Success Response:**
    ```json
    {
      "highestDiscountAmount": 500
    }
    ```

---

## Assumptions

*   **Flipkart API Response Structure:** The `parseOffers` function in `offer.service.ts` is based on an assumed JSON structure from the Flipkart API. The code is designed to be easily adaptable to the real response structure if/when it becomes available.
*   **Offer Uniqueness:** It is assumed that each offer from Flipkart has a unique `id` field, which is used as `offerId` to prevent duplicate entries in the database.
*   **Discount Logic:** Flat discounts are assumed not to have a `maxDiscountAmount`, while percentage-based discounts can be capped. The system does not account for other conditions like minimum transaction value.

---

## Design Choices

*   **Framework (NestJS):** Chosen for its modular architecture, dependency injection system, and first-class TypeScript support, which makes building scalable and maintainable applications straightforward. Additionally, I have been working with NestJS for quite some time and am comfortable with it, making it a natural choice for rapid development.
*   **Database (MySQL):** A reliable and widely-used relational database suitable for structured data like offers. MySQL is also a database I am experienced with, which allowed me to move quickly and confidently during development.
*   **ORM (TypeORM):** Provides excellent integration with NestJS and TypeScript, simplifying database interactions with features like decorators for entities and the repository pattern. The `synchronize` feature was used for rapid development.
*   **Schema:** The `Offer` entity is designed to capture all necessary details for each offer. Here is an explanation of each field:
    - `id`: Auto-incremented primary key for internal database use.
    - `offerId`: Unique identifier for the offer, typically mapped from the Flipkart API's `id` field. Used to prevent duplicate offers.
    - `title`: The headline or main title of the offer, shown to users.
    - `description`: A detailed description of the offer, including terms or highlights.
    - `bankName`: The name of the bank associated with the offer (e.g., AXIS, HDFC, IDFC).
    - `discountType`: The type of discount, such as `FLAT` (fixed amount) or `PERCENTAGE` (percentage off).
    - `discountValue`: The value of the discount. For `FLAT`, this is the fixed amount; for `PERCENTAGE`, this is the percent value.
    - `maxDiscountAmount`: The maximum discount that can be applied for percentage-based offers. If null, no cap is applied.
    - `paymentInstruments`: An array of payment methods (e.g., CREDIT, DEBIT, EMI_OPTIONS) that are eligible for the offer.
    - `terms`: Any additional terms and conditions or notes related to the offer.

---

## Scaling Strategy
To scale the `GET /highest-discount` endpoint to handle high request volumes, here are strategies that can be implemented directly by a backend developer:

1.  **Caching:** Integrate an in-memory cache (such as Redis) to store the results of frequent or recent discount calculations. This reduces database load and speeds up response times for repeated queries.
2.  **Database Indexing:** Ensure that the `bankName` and `paymentInstruments` columns in the `offers` table are properly indexed. This will make queries for applicable offers much faster.
3.  **Query Optimization:** Use efficient query patterns and, if necessary, custom SQL or TypeORM query builders to ensure that only the necessary data is fetched and filtered as efficiently as possible.

---

## Future Improvements

If I had more time, I would focus on the following improvements:

1.  **Production-Ready Migrations:** Replace `synchronize: true` with a robust migration system (using TypeORM's CLI) to manage database schema changes safely in a production environment.
2.  **Robust Validation and Error Handling:** Add more comprehensive input validation using `class-validator` and implement a global exception filter for consistent error responses.
3.  **Authentication & Authorization:** Secure the endpoints, especially the `POST /offer` endpoint, to ensure that only authorized users or services can add new offers.
4.  **Advanced Offer Logic:** Extend the logic to handle more complex offer conditions, such as minimum transaction values, offer expiry dates, and rules for combining multiple offers.
5.  **Automated Offer Fetching:** Implement a background job (e.g., using a cron scheduler or a message queue) to periodically fetch offers from Flipkart's API automatically, keeping the database up-to-date without manual intervention.
