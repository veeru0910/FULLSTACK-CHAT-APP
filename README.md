# Veeru

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO, designed to deliver a secure and dynamic messaging experience with a modern, responsive UI.  

## **Features**  

### **Frontend**  
- **React & Tailwind CSS:** Fully responsive and clean UI for an optimal user experience on all devices.  
- **State Management:** Zustand for efficient and lightweight state management.  
- **Theming:** DaisyUI integration with 30+ themes, stored in local storage for persistence.  
- **Skeleton Loaders:** Enhanced loading experience with smooth transitions.  
- **Notifications:** React Hot Toast for real-time notifications.  
- **Socket.IO Client:** Real-time updates for messaging and user activity indicators.  

### **Backend**  
- **Authentication:**  
  - JSON Web Tokens (JWT) for secure authentication, stored in cookies with a 7-day expiry.  
  - Expiration handling for enhanced security.  
- **Database:** MongoDB and Mongoose for data modeling and storage.  
- **Data Security:** Passwords hashed using bcrypt following best practices.  
- **File Storage:** Cloudinary for uploading and retrieving images.  
- **Real-Time Communication:** Socket.IO for real-time chat functionality.  
- **REST API:** Built with Express.js for robust backend functionality.  

### **Key Functionalities**  
1. **Authentication:**  
   - Secure login and registration.  
2. **Home Screen:**  
   - Displays all registered users in a sidebar with live activity indicators (online/offline).  
3. **Chat:**  
   - Real-time messaging with support for text, images, or both.  
4. **Profile Section:**  
   - View profile details, update profile picture (instantly updated via Cloudinary).  
5. **Settings:**  
   - Choose from 30+ themes to customize the UI experience.  
6. **Sidebar Toggle:**  
   - Filter to show only online users.  

## **Tech Stack**  

### **Frontend**  
- React  
- Tailwind CSS  
- DaisyUI  
- Zustand  
- Axios  
- React Hot Toast  
- Socket.IO Client  

### **Backend**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Socket.IO  
- JSON Web Tokens (JWT)  
- Bcrypt  
- Cloudinary  

## How to Use
1) Register or log in to the app.
2) View users on the sidebar with live status indicators.
3) Click a user to start chatting in real-time.
4) Access settings to personalize the theme and profile to manage your details.

## Demo 

### Home
![image](https://github.com/user-attachments/assets/d029d6fd-1e0d-4e37-8870-748372dbe4df)

### Profile
![image](https://github.com/user-attachments/assets/d67a2187-a051-485e-918e-04c81f400c7d)

### Settings
![image](https://github.com/user-attachments/assets/3140652f-b957-4c3c-9a1e-e418910bf327)

### Signup Page
![image](https://github.com/user-attachments/assets/0a11deb9-c748-414d-87ea-b216ab85fa4a)



# Contributing
Contributions are welcome! Please fork the repository and submit a pull request.


## **Deployment**  
Deployed link:    *https://fullstack-chat-app-xoai.onrender.com/*
The app is deployed on [Render](https://render.com) for a seamless full-stack experience.  


### **Prerequisites**  
- Node.js and npm installed  
- MongoDB running locally or a MongoDB Atlas connection string

## - Acknowledgments
Render for deployment
Cloudinary for image storage
DaisyUI for themes

### **Clone the Repository**  
```bash
git clone https://github.com/SamVerse/FullStack-Chat-App/
cd FullStack-Chat-App


