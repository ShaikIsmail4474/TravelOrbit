# ✈️ TravelOrbit — Travel & Tourism Portal

TravelOrbit is a full-stack Travel & Tourism Portal designed to provide a complete platform for customers to explore travel packages, make bookings, manage payments, and download booking confirmations.

The system also provides an Admin Dashboard for managing travel packages, users, bookings, payments, and other platform operations.

## 🌐 Live Application

**Frontend:**  
https://travel-orbit-ten.vercel.app/

**Backend API:**  
https://travelorbit-production.up.railway.app

**GitHub Repository:**  
https://github.com/ShaikIsmail4474/TravelOrbit

---

## 📌 Project Overview

TravelOrbit provides separate experiences for **Customers** and **Administrators**.

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse travel packages
- View package details
- Search and explore travel packages
- Book travel packages
- Make payments
- View booking history
- View upcoming and past bookings
- Cancel bookings
- Download booking confirmation PDF
- Manage account settings
- Responsive mobile-friendly interface

### 🛠️ Admin Features

- Secure Admin authentication
- Admin dashboard
- Manage travel packages
- Add new travel packages
- Update travel packages
- Delete travel packages
- Manage users
- Activate/deactivate users
- Manage bookings
- Update booking status
- View payment information
- Monitor booking and payment records

---

## 🔐 Authentication & Security

TravelOrbit implements a secure authentication system using:

- Spring Security
- JWT (JSON Web Token)
- BCrypt password hashing
- Role-based authorization
- CUSTOMER and ADMIN roles
- Protected API endpoints
- JWT authentication filter
- CORS configuration
- Environment-based secrets

Passwords are never returned through API responses.

---

## 💳 Payment System

The application includes a booking payment workflow with:

- Payment records
- Transaction information
- Payment status
- Payment method
- Booking-payment relationship
- Admin payment management

---

## 📄 Booking Confirmation

After completing a booking, customers can access their booking confirmation and generate/download a PDF containing important booking information.

---

## 🏗️ Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Lucide React

### Backend

- Java 17+
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven
- Bean Validation

### Database

- MySQL

### Deployment

- Vercel — Frontend
- Railway — Backend
- Railway MySQL — Database

---

## 🏛️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       Vite          │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Spring Boot API    │
                    │                     │
                    │ Spring Security     │
                    │ JWT Authentication  │
                    │ Service Layer       │
                    │ REST Controllers    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MySQL          │
                    │      Database       │
                    └─────────────────────┘


## 🔄 Application Flow

### 👤 Customer Flow

```text
                    ┌──────────────────────┐
                    │   Open TravelOrbit   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Register / Login     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ JWT Authentication   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Browse Packages      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ View Package Details │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Create Booking       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Make Payment         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Booking Confirmed    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Download PDF         │
                    │ Confirmation         │
                    └──────────────────────┘
```

### 🛠️ Admin Flow

```text
                    ┌──────────────────────┐
                    │    Admin Login       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ JWT + ADMIN Role     │
                    │ Authorization        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Admin Dashboard    │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │   Packages   │  │    Users     │  │   Bookings   │
     │   Management │  │  Management  │  │  Management  │
     └──────────────┘  └──────────────┘  └──────┬───────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │   Payments   │
                                         │  Management  │
                                         └──────────────┘
```

### 🔐 Backend Request Flow

```text
React Frontend
      │
      │ HTTP Request + JWT
      ▼
Spring Security
      │
      ▼
JWT Authentication Filter
      │
      ▼
Role Authorization
      │
      ▼
REST Controller
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
MySQL Database
      │
      ▼
Response
      │
      ▼
React Frontend
```

### 🗄️ Core Data Flow

```text
User
 │
 ├──────────────► Booking
 │                    │
 │                    ├──────────► Travel Package
 │                    │
 │                    └──────────► Payment
 │
 └──────────────► Authentication / Authorization
```
