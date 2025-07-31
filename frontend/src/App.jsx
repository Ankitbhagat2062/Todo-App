import React from 'react'
import Home from './Components/Home';
import Signup from './Components/Signup';
import Todo from './Components/Todo';
import Login from './Components/Login';
import About from './Components/About';
import { Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser, login } from './features/user/userSlice';
import Calandar from './Components/Calandar';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    // const email = localStorage.getItem('email');
    if (userId) {
      dispatch(setUser({ userId, }));
      dispatch(login());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/calandar" element={<Calandar />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
