import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="container">
       <div className="col-md-6 m-auto mt-5 shadow-lg bg-white p-3">
          <form className="d-flex flex-column " onSubmit={handleClick}>
            <h3 className="text-center">Login Here</h3>
            <input
              placeholder="Email"
              type="email"
              required
              className="my-3 p1"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="mb-3 p1"
              ref={password}
            />
            <button className="bg-primary text-white mb-3 p1" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="primary" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <Link to={"/register"} className="btn bg-secondary text-white mb-3 p1">
              {isFetching ? (
                <CircularProgress color="primary" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </Link>
          </form>
    </div>
    </div>
  );
}
