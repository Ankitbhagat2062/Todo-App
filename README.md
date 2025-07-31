# Todo App

#### Video Demo:  <https://youtu.be/0Oo5eQ8r4cg>


# Description

Welcome to the **Todo App**! This project is a full-stack Todo application built with modern web technologies including **Vite + React** for the frontend, **Tailwind CSS** for styling, and **Express + MongoDB** for the backend. This README will guide you step-by-step through the features, setup, and development process so that anyone can build this project from scratch.

---

## Features

- **User Authentication:** Signup and login functionality to manage your personal todos securely.
- **Todo Management:** Add, update, delete, and view your todo items with ease.
- **Event Calendar:** Integrated calendar view to visualize your todos and events.
- **Responsive UI:** Built with Tailwind CSS for a clean, modern, and responsive design.
- **Backend API:** RESTful API built with Express.js connected to MongoDB Atlas for data persistence.
- **Real-time Updates:** Seamless interaction between frontend and backend for CRUD operations.

---

## How I Made This Project

This project was built step-by-step using the following technologies and tools:

### 1. Getting Started with Vite + React

Vite is a fast frontend build tool that works great with React. To create the React app using Vite, run the following commands in your terminal.

#### Windows

```copy
npm create vite@latest todo-app -- --template react
cd todo-app
npm install
npm run dev
```

#### Mac / Linux

```copy
npm create vite@latest todo-app -- --template react
cd todo-app
npm install
npm run dev
```

This will scaffold a new React project with Vite and start the development server.

---

### 2. Installing Tailwind CSS

Tailwind CSS is a utility-first CSS framework that makes styling easy and efficient.

To install Tailwind CSS, run the following commands:

#### Windows

```copy
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Mac / Linux

```copy
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This will install Tailwind CSS and generate the `tailwind.config.js` and `postcss.config.js` files.

---

### 3. Configuring Tailwind CSS

In your `tailwind.config.js`, include the paths to your React components so Tailwind can purge unused styles:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Then, include Tailwind directives in your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 4. Creating Components

I created the following React components using Tailwind CSS UI blocks from [Tailwind UI Blocks - Marketing Sections - Heroes](https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes):

- **Home.jsx** - The main landing page.
- **Navbar.jsx** - Navigation bar for routing and user actions.
- **Signup.jsx** - Signup form for new users.
- **Login.jsx** - Login form for existing users.

These components are styled with Tailwind CSS classes for a clean and responsive UI.

---

### 5. Backend Setup

The backend is built with **Express.js** and connected to **MongoDB Atlas** for cloud database hosting.

#### Creating a MongoDB Cluster

1. Go to [MongoDB Cloud](https://cloud.mongodb.com/) and create a free cluster.
2. Create a database user and whitelist your IP address.
3. Get the connection string URI for your cluster.

#### Connecting Backend to MongoDB

In the backend folder, the connection is established in `conn/conn.js` using the MongoDB URI.

#### Backend API

The backend supports CRUD operations for todos and events:

- **Create:** Add new todos/events.
- **Read:** Get all todos/events.
- **Update:** Modify existing todos/events.
- **Delete:** Remove todos/events.

These routes are defined in the `Backend/routes` folder and models in `Backend/models`.

---

### 6. Calendar Component

The calendar is implemented in `Calander.jsx` using the `react-calendar` library.

#### Installing the Calendar Library

Run the following command to install:

```copy
npm install react-calendar
```

#### How the Calendar Works

- The calendar displays events and todos on their respective dates.
- It fetches data from the backend API and updates dynamically.
- Users can interact with the calendar to view details of their tasks.

---

## How to Run the Project Locally

1. Clone the repository.
2. Navigate to the frontend directory and install dependencies:

```copy
npm install
```

3. Start the frontend development server:

```copy
npm run dev
```

4. Navigate to the backend directory:

```copy
cd Backend
npm install
```

5. Start the backend server:

```copy
npm start
```

6. Open your browser and go to `http://localhost:3000` (or the port Vite uses) to see the app in action.

---

## Additional Resources

- Tailwind CSS UI Blocks: [https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes](https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes)
- MongoDB Atlas: [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
- React Calendar Library: [https://www.npmjs.com/package/react-calendar](https://www.npmjs.com/package/react-calendar)
- Vite Documentation: [https://vitejs.dev/](https://vitejs.dev/)

---

## Conclusion

This Todo App project demonstrates how to build a modern, full-stack web application using React, Vite, Tailwind CSS, Express, and MongoDB. The step-by-step guide in this README should help you understand the development process and replicate the project on your own.

Happy coding!
