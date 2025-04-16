# StayHealthy

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://ageorge556.github.io/StayHealthy/)
[![React Version](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-ISC-green)](https://opensource.org/licenses/ISC)

StayHealthy is a modern healthcare platform that allows users to book in-person medical appointments and schedule instant online consultations with healthcare professionals. Built with React, this application provides a seamless user experience for both patients and healthcare providers.

![StayHealthy Screenshot](public/screenshot.png)

## 🌟 Features

- **User Authentication**: Secure login and registration system
- **Book Appointments**: Schedule in-person appointments with doctors
- **Instant Consultation**: Connect with healthcare professionals instantly online
- **Doctor Search**: Find doctors by specialty and location
- **User Profiles**: Manage your healthcare information in one place
- **Appointment Management**: View, reschedule, or cancel appointments
- **Reviews**: Share your experience with the healthcare community
- **Offline Mode**: Application works even when server is unavailable

## 📋 Table of Contents

- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technologies](#-technologies)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Demo

You can access the live demo of the StayHealthy application at: [https://ageorge556.github.io/StayHealthy/](https://ageorge556.github.io/StayHealthy/)

**Demo Account**:
- Email: demo@example.com
- Password: demo1234

## 💻 Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/AGeorge556/StayHealthy.git
   cd StayHealthy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. To run with backend server (optional):
   ```bash
   cd server
   npm install
   npm start
   ```

## 🔍 Usage

### Client Application

The client application will be available at [http://localhost:3000](http://localhost:3000)

### Backend Server (Optional)

The backend server runs on [http://localhost:8181](http://localhost:8181)

### Deployment

To deploy to GitHub Pages:

```bash
npm run deploy
```

## 🛠️ Technologies

- **Frontend**:
  - React.js (19.1.0)
  - React Router (7.5.0)
  - CSS3 for styling
  - LocalStorage/SessionStorage for data persistence

- **Backend** (Optional):
  - Node.js
  - Express.js
  - MongoDB (Mongoose ODM)
  - JSON Web Tokens for authentication

## 📁 Project Structure

```
StayHealthy/
├── public/                 # Static files
├── server/                 # Backend server (optional)
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── db.js               # Database connection
│   └── index.js            # Server entry point
└── src/
    ├── Components/         # React components
    │   ├── BookingConsultation/     # Appointment booking
    │   ├── InstantConsultationBooking/ # Instant consultations
    │   ├── Login/          # Authentication
    │   ├── Navbar/         # Navigation
    │   ├── Notification/   # User notifications
    │   ├── ProfileCard/    # User profile
    │   └── ...
    ├── App.js              # Main component
    ├── config.js           # Application configuration
    └── index.js            # Entry point
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

Made with ❤️ by [AGeorge556](https://github.com/AGeorge556)

© 2025 StayHealthy. All rights reserved.
