# AraiPortfolio
Description
AraiPortfolio is a comprehensive web application for managing a portfolio of dramas. It incorporates modern features like secure user authentication with Two-Factor Authentication (2FA), role-based access control, and seamless integration with third-party APIs for dynamic data visualization. This platform allows admins and editors to collaborate effectively while offering a user-friendly interface.
Features
Authentication:
User registration and login with 2FA (email-based code verification).
Password encryption for enhanced security.
Role-Based Access Control:
Admin: Full CRUD access to all features.
Editor: Can create new dramas and visualizations.
Viewer: Can only view dramas and visualizations.
Portfolio Management:
Add, update, and delete drama entries.
Includes title, description, images (carousel-supported), release date, genres, and more.
API Integrations:
NewsAPI: Fetch and display news articles based on a keyword.
Alpha Vantage: Fetch and visualize stock market data dynamically.
Interactive Visualizations:
Data displayed using Chart.js for dynamic and user-friendly charts.
Visualization creation is restricted to editors.
Email Notifications:
Automatic emails sent during registration and CRUD actions using Nodemailer.
Setup Instructions
Prerequisites
Install Node.js (v14+).
Set up a MongoDB database (local or cloud, e.g., MongoDB Atlas).
Obtain API keys for:
NewsAPI
Alpha Vantage



Install dependencies:
npm install

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/auth2fa
NEWS_API_KEY=c678b00896ea4a6390203412760f72fb
ALPHA_VANTAGE_API_KEY=7B3EIWUOOULM6HAB
EMAIL_USER=Arailym.gainullova05@gmail.com
EMAIL_PASS=bnwdanoimdeeivsh


Start the application:
node index.js

Open the application in your browser:
http://localhost:3000


API Usage
Authentication
POST /api/auth/register: Register a new user.
POST /api/auth/login: Login with username, password, and 2FA code.

Portfolio Management
GET /api/dramas: Fetch all dramas.

POST /api/dramas: Add a new drama.

Request Body:
{
  "title": "Drama Title",
  "description": "Description of the drama",
  "images": ["https://image1.url", "https://image2.url"],
  "releaseDate": "YYYY-MM-DD",
  "genres": ["genre1", "genre2"],
  "episodes": 12,
  "duration": "60 minutes"
}


PUT /api/dramas/:id: Update a drama (Admin only).

DELETE /api/dramas/:id: Delete a drama (Admin only).

API Integrations
NewsAPI:

GET /api/news?q=<keyword>: Fetch news articles related to <keyword>.
Example: /api/news?q=Korea.
Alpha Vantage:

GET /api/finance/:symbol: Fetch financial data for a given stock symbol.
Example: /api/finance/AAPL.Design Rationale
2FA Implementation: Adds an additional layer of security to prevent unauthorized access.
Role-Based Access Control: Enforces strict access control by role, enhancing security and usability.
Dynamic Visualizations: Engages users with real-time data visualizations using Chart.js.
Responsive Design: Built with Bootstrap to ensure compatibility across devices.Future Improvements
Add support for real-time data updates in visualizations.
Expand API integrations (e.g., cultural events or sports data).
Enhance user interface for better accessibility and interactivity.
Authors
Araiqa
Contact: Arailym.gainullova05@mail.ru

