import { NavLink } from 'react-router-dom'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import {login} from '../features/user/userSlice'
import {useDispatch} from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
const Signup = () => {
  const dispatch = useDispatch()
  const {  register, handleSubmit, watch, formState: { errors },} = useForm()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${window.location.origin}/api/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (response.ok) {
        navigate('/login')
        dispatch(login())
        toast(result.email + ' you have been registered successfully')
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
    <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Write Your User Name
              </label>
              <div className="mt-2">
                <input id="username" {...register("username", { required: true })} autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                {errors.username && <div className="text-red-500">{errors.username.message}</div>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input id="email" {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address"
                  }
                })} autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                {errors.email && <div className="text-red-500">{errors.email.message}</div>}

              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <NavLink to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </NavLink>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center rounded-md bg-white text-base px-3 text-gray-900  placeholder:text-gray-400  sm:text-sm/6 outline-1 -outline-offset-1 outline-gray-300 cursor-pointer focus-within:outline-amber-500 focus-within:-outline-offset-2" tabIndex={0}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]).{8,}$/,
                      message:
                        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
                    },
                  })}
                  autoComplete="current-password"
                  className="block w-full py-1.5 focus:outline-0"
                />
                {showPassword ? (
                  <BiSolidShow onClick={togglePasswordVisibility} className="cursor-pointer" />
                ) : (
                  <BiSolidHide onClick={togglePasswordVisibility} className="cursor-pointer" />
                )}
              </div>
                {errors.password && (
                  <div className="text-red-500">{errors.password.message}</div>
                )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                  Retype Password
                </label>
              </div>
              <div className="mt-2 flex items-center justify-center rounded-md bg-white text-base px-3 text-gray-900  placeholder:text-gray-400  sm:text-sm/6 outline-1 -outline-offset-1 outline-gray-300 cursor-pointer focus-within:outline-amber-500 focus-within:-outline-offset-2" tabIndex={0}>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch('password') || "Passwords do not match",
                  })}
                  autoComplete="current-password"
                  className="block w-full py-1.5 focus:outline-0"
                />
                {showPassword ? (
                  <BiSolidShow onClick={togglePasswordVisibility} className="cursor-pointer" />
                ) : (
                  <BiSolidHide onClick={togglePasswordVisibility} className="cursor-pointer" />
                )}
              </div>
                {errors.confirmPassword && (
                  <div className="text-red-500">{errors.confirmPassword.message}</div>
                )}
            </div>

            <div>

              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            If you have already an account,{' '}
            <NavLink to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              please login
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}

export default Signup
