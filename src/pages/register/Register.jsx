import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {

    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      
      try {
        await axios.post("https://ancient-woodland-67815.herokuapp.com/api/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <div className="col-md-6 m-auto mt-5 shadow-lg bg-white p-3">
      <h3 className="text-center">Register here</h3>
          <form className="d-flex flex-column" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="my-3 p-1"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="mb-3 p-1"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="mb-3 p-1"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="mb-3 p-1"
              type="password"
            />
            <button className="mb-3 p-1  bg-primary text-white" type="submit">
              Sign Up
            </button>
            <Link to={'/login'} className="btn mb-3 p-1 bg-secondary text-white">Log into Account</Link>
          </form>
     
      </div>
    </div>
  );
}
