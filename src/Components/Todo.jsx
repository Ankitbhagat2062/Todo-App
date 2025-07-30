import React, { useEffect, useRef, useCallback } from 'react'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './Navbar'
import { useForm } from "react-hook-form"
import { useDispatch, } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { LiaSaveSolid } from "react-icons/lia";
import { MdCancel } from "react-icons/md";
import { login } from '../features/user/userSlice';
import { FaTimes } from 'react-icons/fa';
const Todo = () => {
  const dispatch = useDispatch();
  const Todobody = React.useRef(null);
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const [showFinished, setShowFinished] = useState(false);
  const [title, setTitle] = useState("");
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [prevTitle, setPrevTitle] = useState('');
  const [prevBody, setPrevBody] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTodos, setShowTodos] = useState(false);
  const todoRef = useRef(null);
  const AddTodos = () => {
    setShowTodos(true);
  };
  const closeTodos = () => {
    setShowTodos(false);
  };
  const handleClickOutside = useCallback((event) => {
    if (todoRef.current && !todoRef.current.contains(event.target)) {
      closeTodos();
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  // Display error message in UI
  const ErrorMessage = () => {
    if (!errorMessage) return null;
    return (
      <div className="text-red-600 font-semibold mb-2 text-center">
        {errorMessage}
      </div>
    );
  };
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (data) => {
    if (!data.title.trim() || !data.body.trim()) {
      setErrorMessage('Title and body are required.');
      return;
    }
    if (data.title === prevTitle && data.body === prevBody) {
      setErrorMessage('You have already submitted this task.');
      toast('You have already submitted this task.');
      return;
    }
    setErrorMessage('');
    setPrevTitle(data.title);
    setPrevBody(data.body);
    setTodos([...todos, { id: uuidv4(), title: data.title, body: data.body, email: email, isCompleted: false }]);
    setTitle("");
    setTodo("");
    setShowTodos(false)
    if (userId) {
      const response = await fetch(`${window.location.origin}/api/v2/addTask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: data.title, body: data.body, email: email })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (response.ok) {
        setTodos([...todos, { id: uuidv4(), title: data.title, body: data.body, email: email, isCompleted: false }]);
        setTitle("");
        setTodo("");
        toast(`${result.list.title} has been Added and uploaded to th server`);
      }
    }
    (!userId) && toast('Your Task is not uploaded to server. Please signup to save your Task in server')
  };

  if (userId) { dispatch(login()) }
  function displayErrorMessage(message) {
    // You can customize this to display the message in your UI
    const errorElement = document.createElement('div');
    errorElement.textContent = message;
    errorElement.style.color = 'red'; // Optional: style the message
    document.body.appendChild(errorElement); // Append to the body or a specific container
  }
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${window.location.origin}/api/v2/getTask/${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data && Array.isArray(data.list)) {
            setTodos(data.list.map(todo => ({
              todoId: todo._id,
              id: uuidv4(),
              ...todo
            })));
          } else if (data && data.message === "No Task Found") {
            setTodos([]);
            toast('No tasks found for user in DataBase. Please sign up to save your task in server');
          } else {
            setTodos([]);
          }
        } catch {
          console.log('Fetch error:', { message: 'Your connection with the server has been lost' });
          // Assuming you have a function to display messages to the user
          displayErrorMessage('Your connection with the server has been lost');
        }
      };
      fetchData();
    }
  }, [userId]);
  // Delete todo by id
  const handleDelete = async (id, todoId) => {
    if (userId) {
      await fetch(`${window.location.origin}/api/v2/deleteTask/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
        .then(response => {
          if (response.ok) {
            // Handle successful deletion (e.g., update state, show success message)
            toast(`Item deleted successfully.`);
          } else {
            toast('Failed to delete item.');
          }
        })
        .catch(error => {
          toast('Error during delete request:', error);
        });
    }
    setTodos(todos.filter((item) => item.id !== id));
    if (editId === id) setEditId(null);
    (!userId) && toast('Please Login to delete item. This feauture is temporary');
  };

  // Start editing
  const handleEdit = (id, body, title) => {
    setEditId(id);
    setEditText(body);
    setEditTitle(title);
  };

  // Save edited todo
  const handleSaveEdit = async (id, todoId) => {
    // Find the todo item being edited to get current title and body
    const todoItem = todos.find(item => item.id === id);
    const currentTitle = editTitle || (todoItem ? todoItem.title : title);
    const currentBody = editText || (todoItem ? todoItem.body : todo);
    if (userId) {
      await fetch(`${window.location.origin}/api/v2/updateTask/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: currentTitle, body: currentBody, email: email })
      }).then(response => {
        if (response.ok) {
          toast(`Task with ${currentTitle} has been Updated successfully.`);
          setTodos(todos.map((item) => item.id === id ? { ...item, title: currentTitle, body: currentBody } : item));
          setEditId(null);
          setEditText("");
          setEditTitle("");
        } else {
          toast('Failed to Update item.');
        }
      })
        .catch(error => {
          toast('Error during update request:', error);
        });
    }
    setTodos(todos.map((item) => item.id === id ? { ...item, title: currentTitle, body: currentBody } : item));
    setEditId(null);
    setEditText("");
    setEditTitle("");
    (!userId) && toast('You data has been updated temporarily. Please login to update data on server.');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
    setEditTitle("");
  };

  // Handle checkbox toggle
  const handleCheckbox = (id) => {
    setTodos(todos.map((item) => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="container md:p-20 p-10 mx-auto xl:w-1/2 md:w-3/4 w-full [@media(max-width:480px)]:p-5 [@media(max-width:380px)]:p-0">
        <div className='mr-1'>
          <button onClick={AddTodos} type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >
            Add Todos
          </button>
        </div>
        {(showTodos) && (
          <div ref={todoRef} className="todo fixed top-20 z-20 border-2 border-gray-300 rounded-lg p-4 m-4 bg-white shadow-lg">
            <button onClick={closeTodos} className="hover:text-gray-700 cursor-pointer" aria-label="Close" >
              <FaTimes />
            </button>
            <h1 className="text-3xl font-bold text-center my-4">Add Tasks</h1>
            <div className="task-list">
              <div className="add-task flex justify-between items-center flex-col p-1 w-full md:gap-2 gap-10">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto">
                  <h2 className="text-xl font-bold mb-4">Test Form with React Hook Form</h2>
                  <div className="mb-4">
                    <label htmlFor="title" className="block mb-1">Title</label>
                    <input id="title"{...register('title', { required: 'Title is required' })} className="w-full border border-gray-300 rounded px-3 py-2" />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="body" className="block mb-1">Body</label>
                    <textarea id="body" {...register('body', { required: 'Body is required' })} className="w-full border border-gray-300 rounded px-3 py-2" />
                    {errors.body && <p className="text-red-500">{errors.body.message}</p>}
                  </div>
                  <button disabled={isSubmitting} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="todo border-2 border-gray-300 rounded-lg p-4 m-4 bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center my-4">Todo List</h1>
        {/* Show Finished Checkbox */}
        {todos.some(item => item.isCompleted) && (
          <div className="flex items-center mb-4">
            <input name='allcheckbox'
              type="checkbox"
              id="showFinished"
              checked={showFinished}
              onChange={e => setShowFinished(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showFinished" className="text-gray-700">Show Finished</label>
          </div>
        )}
        {/* No tasks message */}
        {todos.length === 0 && (
          <div className="text-center text-gray-400">No tasks yet.</div>
        )}
        {/* Render todos based on showFinished */}
        <div className="columns-1 md:columns-2 [@media(min-width:1000px)]:columns-3 gap-4 space-y-4">
          {todos.filter(item => showFinished || !item.isCompleted).map((item) => (
           <div key={item.id} className="break-inside-avoid task-item flex justify-between items-center border-2 rounded p-3 border-gray-200 flex-col md:flex-row md:gap-0 gap-6 w-full bg-white shadow-sm"> 
            <div className="flex items-start md:gap-4 gap-2 w-full md:w-auto my-2">
                <input className='mt-2' name='todocheckbox' type="checkbox" checked={item.isCompleted} onChange={() => handleCheckbox(item.id)} />
                <div className={item.isCompleted ? "task-text line-through flex flex-col break-words whitespace-normal max-w-xs md:max-w-md overflow-wrap border border-gray-400" : "task-text break-words flex flex-col p-1 whitespace-normal mr-1 rounded w-full max-w-xs md:max-w-md overflow-wrap"}>
                  {editId === item.id ? (
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus type="text" className='border-3 border-amber-600 rounded p-1' />
                  ) : (

                    <h1 className='text-red-600 font-bold mb-1'>{item.title}</h1>
                  )}
                  {editId === item.id ? (
                    <input value={editText} ref={Todobody} onChange={e => setEditText(e.target.value)}
                      autoFocus className="task-text break-words whitespace-normal max-w-xs md:max-w-md overflow-wrap border-3 border-amber-600 mt-1 p-1 rounded" />

                  ) : (
                    <div className='task-input w-full break-words whitespace-normal max-w-xs md:max-w-md overflow-wrap p-1 rounded'>
                      {item.body}
                    </div>
                  )}
                </div>
              </div>
              <div className="btn flex space-x-2 justify-center items-start self-start my-2 md:mx-0 mx-auto">
                {editId === item.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(item.id, item.todoId)} className="edit-button cursor-pointer hover:bg-green-600 bg-green-500 text-white p-1 rounded"><LiaSaveSolid /></button>
                    <button onClick={handleCancelEdit} className="delete-button cursor-pointer hover:bg-red-600 bg-red-500 text-white p-1 rounded"><MdCancel /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(item.id, item.body, item.title)} className="edit-button cursor-pointer hover:bg-green-600 bg-green-500 text-white p-1 rounded"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.id, item.todoId)} className="delete-button cursor-pointer hover:bg-red-600 bg-red-500 text-white p-1 rounded"><RiDeleteBin6Fill /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Todo
