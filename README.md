# AirBnbB - Back-End

This section provides an overview of the back-end of the AirBnB application, which is built with Express.js and Node.js.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Technologies Used](#technologies-used)

![AirBnB Screenshot](https://res.cloudinary.com/dljgkzwfz/image/upload/v1694427320/Github%20ReadMe%20Screenshots/Screenshot_73_hdcphh.png)


## Project Structure

The back-end of AirBnB is organized as follows:

  - **`controllers/`**: Request handlers and logic for the API endpoints.
  - **`models/`**: Database models and schemas.
  - **`routes/`**: Express.js route definitions.
  - **`index.js`**: Entry point for the Express application.
- **`package.json`**: Contains project dependencies and scripts.

## Installation

Before proceeding, ensure that you have completed the [general installation steps](../README.md#installation).

To install and run only the back-end of BookingX:

1. Navigate to the server directory:

   ```bash
   cd server
2. Install the server dependecies:
   ```bash
   npm install
3. Start Server:
   ```bash
   npm start

This will launch the back-end server, and it will be accessible at http://localhost:8000/

## API Endpoints

BookingX backend offers the following API endpoints for various functionalities:

### Bookings

- **POST /bookings**

  - **Description:** Create a new booking.

- **GET /bookings**

  - **Description:** Retrieve a list of bookings.

- **DELETE /deleteBooking/:id**

  - **Description:** Delete a booking by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the booking to delete.
  - 
### Chats and Messages

- **POST /**

  - **Description:** Create a new chat.

- **GET /:userId**

  - **Description:** Find user chats by user ID.
  - **URL Parameter:** `userId` (string): Unique ID of the user.
  
- **GET /find/:firstId/:secondId**

  - **Description:** Find a chat between two users by their IDs.
  - **URL Parameters:**
    - `firstId` (string): ID of the first user.
    - `secondId` (string): ID of the second user.
 
- **POST /**

  - **Description:** Create a new message in a chat.
  - 
- **GET /:chatId**

  - **Description:** Get messages in a chat by chat ID.
  - **URL Parameter:** `chatId` (string): Unique ID of the chat.
 
### Orders

- **GET /getOrder/:id**

  - **Description:** Get a booked order by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the order.

- **DELETE /deleteOrder/:id**

  - **Description:** Delete an order by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the order.

- **GET /getUserOrder/:id**

  - **Description:** Get orders associated with a user by user ID.
  - **URL Parameter:** `id` (string): Unique ID of the user.
 
### Places

- **POST /places**

  - **Description:** Create a new place.

- **GET /places**

  - **Description:** Retrieve a list of places.

- **GET /allPlaces**

  - **Description:** Retrieve a list of all places.

- **GET /places/:id**

  - **Description:** Retrieve details of a place by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the place.

- **PUT /editPlace/:id**

  - **Description:** Edit details of a place by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the place.

- **DELETE /deletePlace/:id**

  - **Description:** Delete a place by its ID.
  - **URL Parameter:** `id` (string): Unique ID of the place to delete.

- **GET /placesfiltered**

  - **Description:** Retrieve a list of places with specific filters applied.
 
### Users

- **POST /register**

  - **Description:** Register a new user.
  
- **POST /login**

  - **Description:** Log in a user.

- **GET /profile**

  - **Description:** Get the user profile.

- **POST /logout**

  - **Description:** Log out the user.

- **GET /find/:userId**

  - **Description:** Find a user by their ID.
  - **URL Parameter:** `userId` (string): Unique ID of the user.

- **GET /users**

  - **Description:** Retrieve a list of users.

## Database
AirBnB uses MongoDB as its database. You can find the database configuration in the index.js file.

## Technologies Used
The back-end of AirBnB is primarily built with the following technologies:

- Express.js: A fast, unopinionated, and minimalist web framework for Node.js.
- Node.js: A JavaScript runtime for building server-side applications.
- MongoDB: A NoSQL database used to store application data.


