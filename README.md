# SmartBus Management System

Local MongoDB version of the Bus Ticket Management System case study.

## Run
1. Make sure MongoDB Community Server is running.
2. In the project folder run:
   npm install
   npm run dev
3. Open http://localhost:5000

## Database
MongoDB is local:
mongodb://127.0.0.1:27017/smartbus

MongoDB Compass is only used to view/manage the local database.

## Main APIs
- POST /api/auth/register
- POST /api/auth/login
- GET/POST/PUT/DELETE /api/routes
- GET/POST/PUT/DELETE /api/schedules
- GET/POST/PUT/DELETE /api/buses
- POST/GET/DELETE /api/bookings
- GET /api/seats?busId=...
- GET /api/reports/bookings
- GET /api/reports/revenue
- GET /api/reports/cancellations
- POST /api/notifications/send

## Note
The case study lists Firebase authentication and Firebase notifications as options. This demo uses JWT authentication and a simulated notification endpoint so it can run completely locally without Atlas or external cloud services.
