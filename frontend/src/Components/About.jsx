import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-10 max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">About This Todo App</h1>
        <p className="text-lg text-gray-700 mb-4">
          This Todo App is designed to help you organize your tasks efficiently and boost your productivity.
          With a clean and intuitive interface, you can easily add, edit, and manage your todos.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Built with React and Tailwind CSS, this app offers a seamless user experience and responsive design.
          Whether you are managing daily chores or work projects, this app is your perfect companion.
        </p>
        <div className="flex justify-center space-x-6">
          <div className="text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
            </svg>
            <p className="font-semibold">Easy to Use</p>
          </div>
          <div className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
            </svg>
            <p className="font-semibold">Time Saving</p>
          </div>
          <div className="text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold">Productive</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;
