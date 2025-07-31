# Todo-App
#### Video Demo:  <https://youtu.be/0Oo5eQ8r4cg>
#### Description:
Todo-App is a full-stack task management app that employs a modern tech stack that is current for today purposes. It is built using React for the frontend, Express with MongoDB for the backend, using a modern tech stack makes the process quick, efficient and easy for users to manage their tasks. Overall, the application allows user to manage their task in a better way so they can manage their daily tasks and events. The users can manage their own todo lists and events due to the user authentication system to ensure user registration and login is secure. Further, the app is fully responsive and visually pleasing due to the use of Tailwind CSS. Even more, with additional complex features such as state management with Redux, navigation with React Router and some other utility libraries enhance the user experience.

This project embodies modern methodologies to web development with showcasing frontend and backend technologies by implementing best practices and mapping architectures allowing the application be scalable, and maintainable.

## Features

- 1 **User Authentication:** Secure signup and login system with password hashing and JWT-based Authentication.
- 2 **Task Management:** Ability to add, update, delete and view unique todo tasks with unique todo identifiers.
- 3 **Event Calendar:** Ability to manage calendar events with add, update, delete and view functionality.
- 4 **Responsive UI:**  Built with Tailwind CSS for a mobile-friendly user interface that looks great.
- 5 **State Management:**  Uses React Redux to manage application state.
- 6 **Routing:** React Router used to allow for routing between pages/components.
- 7 **Notifications:** Toast notifications for all user feedback (login, signup and task updates)
- 8 **Iconography:** Beautiful icons seamlessly integrated into the app using the react-icons package.
- 9 **Backend API:** Express server with RESTful routes with a MongoDB for database access.
- 10 **Date Handling:**moment.js for date manipulation and nepali-date-converter for date localization.
- 11 **Calendar Libraries:** Uses react-big-calendar and react-calendar to create beautiful calendar UI components.

## Getting Started

Follow these steps to set up and run the Todo-App on your local machine.

### Prerequisites

- Node.js and npm installed on your system.
- MongoDB instance or MongoDB Atlas cluster for database.
- Basic knowledge of terminal/command line usage.

### Frontend Setup

1. **Create the React project using Vite:**

   ```bash
   npm create vite@latest
   ```

   - When prompted, enter your project title (e.g., `Todo-App`).
   - Choose the framework as **React** and variant as **JavaScript**.

2. **Navigate to your project directory:**

   ```bash
   cd Todo-App
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Install Tailwind CSS and its Vite plugin:**

   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

5. **Configure `vite.config.js`:**

   Update the file to include Tailwind CSS plugin:

   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     server: {
       host: '0.0.0.0',
       port: 5173, // or any open port
     },
   })
   ```

6. **Configure Tailwind CSS in your styles:**

   - Remove all existing CSS from `src/index.css`.
   - Add the Tailwind import:

   ```css
   @import "tailwindcss";
   ```

7. **Run the development server:**

   ```bash
   npm run dev
   ```

   > Note: If you are using CS50 codespace (cs50.dev), the default `npm run dev` may not work without the server config above.

### Frontend Components

1. **Create a `Components` folder inside `src`.**

2. **Create the following components:**

   - `Navbar.jsx`
   - `Home.jsx`
   - `Signup.jsx`
   - `Login.jsx`
   - `Todo.jsx`
   - `Calendar.jsx`

3. **Use Tailwind CSS UI blocks for styling:**

   You can choose from [Tailwind UI Blocks](https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes) or use the provided components.

4. **Install additional UI libraries:**

   ```bash
   npm install @headlessui/react@^2.2.4 @heroicons/react@^2.2.0
   ```

5. **Install React Router DOM for routing:**

   ```bash
   npm install react-router-dom
   ```

6. **Update all `<a href=""></a>` tags to `<NavLink to=""></NavLink>` and import `NavLink` from `react-router-dom`.**

7. **Set up routing in `App.jsx`:**

   Import components and React Router elements:

   ```jsx
   import { Routes, Route } from "react-router-dom";
   import Home from './Components/Home';
   import Signup from './Components/Signup';
   import Login from './Components/Login';
   import Todo from './Components/Todo';
   import Calendar from './Components/Calendar';

   function App() {
     return (
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
         <Route path="/todo" element={<Todo />} />
         <Route path="/calendar" element={<Calendar />} />
       </Routes>
     );
   }

   export default App;
   ```

### Backend Setup

1. **Create a `Backend` directory.**

2. **Navigate to the Backend directory:**

   ```bash
   cd Backend
   ```

3. **Initialize a new Node.js project:**

   ```bash
   npm init -y
   ```

4. **Install Express:**

   ```bash
   npm install express@latest
   ```

5. **Create `app.js` and set up a basic Express server:**

   ```js
   import express from 'express';

   const app = express();
   const port = 3000;

   app.get('/', (req, res) => {
     res.send('Hello World!');
   });

   app.listen(port, () => {
     console.log(`Example app listening on port ${port}`);
   });
   ```

6. **Install MongoDB and Mongoose:**

   ```bash
   npm install mongoose@latest
   ```

7. **Connect to MongoDB:**

   Replace the connection string with your MongoDB cluster link:

   ```js
   import mongoose from 'mongoose';

   mongoose.connect('mongodb://127.0.0.1:27017/myapp');
   const MyModel = mongoose.model('Test', new mongoose.Schema({ name: String }));

   // Example usage
   await MyModel.findOne();
   ```

8. **Install additional backend dependencies:**

   ```bash
   npm install bcrypt@latest bcryptjs@latest cors@latest
   ```

9. **Create routes for signup and login:**

   Use resources like [this tutorial](https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d) to implement secure user authentication.

### Frontend to Backend Integration

- Use `react-hook-form` for form handling:

  ```bash
  npm install react-hook-form
  ```

- Submit signup and login forms to backend API endpoints.

- Use `react-redux` for managing authentication state and UI changes:

  ```bash
  npm install react react-dom react-redux
  ```

- Use `react-toastify` for notifications and `react-icons` for icons:

  ```bash
  npm install react-icons react-toastify
  ```

### Todo and Calendar Features

- Create `Todo.jsx` component to add, update, and delete todo tasks.

- Use `uuid` to generate unique IDs for todo items:

  ```bash
  npm i uuid@latest
  ```

- Backend routes for todo tasks:

  1. `addTask`
  2. `updateTask`
  3. `deleteTask`
  4. `getTask`

- Similarly, create calendar event features with routes:

  1. `addEvent`
  2. `updateEvent`
  3. `deleteEvent`
  4. `getEvent`

- Use calendar libraries:

  ```bash
  npm install react-big-calendar@latest react-calendar@latest
  ```

- Additional libraries for animations and state management:

  ```bash
  npm install @gsap/react@latest @reduxjs/toolkit@latest
  ```

- Use `moment` and `moment-timezone` for date handling:

  ```bash
  npm install moment@latest moment-timezone@latest
  ```

- Use `nepali-date-converter` for Nepali calendar support:

  ```bash
  npm i nepali-date-converter@latest
  ```

## Cloning and Running the Project

1. **Clone the repository and navigate to the Todo-App directory:**

   ```bash
   cd Todo-App
   ```

2. **Install all frontend dependencies:**
   -- Open Frontend in terminal and run this command
   ```bash
   npm install @gsap/react@latest @headlessui/react@latest @heroicons/react@latest @reduxjs/toolkit@latest @tailwindcss/vite@latest bcryptjs@latest cors@latest gsap@latest moment@latest moment-timezone@latest nepali-date-converter@latest react@latest react-big-calendar@latest react-calendar@latest react-dom@latest react-hook-form@latest react-icons@latest react-redux@latest react-router-dom@latest react-toastify@latest tailwindcss@latest uuid@latest
   ```

3. **Navigate to the Backend directory and install backend dependencies:**
   -- Open Backend in terminal and run this command
   ```bash
   cd ../Backend
   npm install bcrypt@latest bcryptjs@latest cors@latest express@latest mongoose@latest
   ```

4. **To preview the website Run the Backend development server:**
   -- Open Backend in terminal and run this command
   ```bash
   cd ../Backend
   node app.js
   ```
## Conclusion

The Todo-App project is a Deep-Dive project of a modern web application that combines technologies like React, Tailwind CSS, Express, and MongoDB. It has the basic essentials like user-authentication (with JWT), user task and event management, and a responsive UI. Hopefully this README can help developers setup, understand and extend to make the Todo-App their own.

Have fun coding!
