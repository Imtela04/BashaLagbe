import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/basha lagbe.png";
import axios from "axios";

const LoginFrom = () => {
  const [registerEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `cdearer ${token}`;
      setIsLogin(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/customer/login",
        {
          registerEmail,
          password,
        }
      );
      console.log(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setIsLogin(true);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-26 w-auto"
          style={{ height: "250px" }}
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!isLogin ? (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="registerEmail"
                  name="registerEmail"
                  type="email"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-gray-900 hover:text-gray-700"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  focusBorderColor="black"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        ) : (
          <div>Your are Already Logged In</div>
        )}
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6  hover:text-gray-500"
          >
            Signup Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginFrom;
