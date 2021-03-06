import React, { useState, useContext } from "react";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import firebaseApp from "../../Firebase";
import { AuthContext } from "../../UserAuth";
import { CurrentUserDetailsContext } from "../../CurrentUserDetailsProvider";
import "./Login.css";
import FavIcon from "./favicon240.png";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const Login = (props) => {
  let userDetails;
  const db = firebaseApp.firestore();
  const [currentUser, setCurrentUser] = useContext(AuthContext);
  const [currentUserDetails, setCurrentUserDetails] = useContext(
    CurrentUserDetailsContext
  );

  const history = useHistory();
  const auth = firebaseApp.auth();
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

  const loginHandler = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, passWord)
      .then((auth) => {
        db.collection("users")
          .where("email", "==", email)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              currentUserDetails.id = doc.id;
              currentUserDetails.name = doc.data().displayName;
              currentUserDetails.email = doc.data().email;
              currentUserDetails.userName = doc.data().userName;
              currentUserDetails.verified = doc.data().verified;
              currentUserDetails.profileImage = doc.data().profileImage;
            });

            console.log(currentUserDetails);
            console.log(email);
          });
        history.push("/");
      })
      .catch((e) => alert(e.message));
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login__comp">
      <div className="icon__close">
        <HighlightOffIcon
          onClick={props.activeStatusHandler}
          className="closeButton"
        />
        <img className="login__favIcon" src={FavIcon} alt="" />
      </div>
      <form onSubmit={loginHandler} className="login__comp__form" action="">
        <div className="user__name__form">
          <label class="main__input__label" htmlFor="username">
            Phone, email or username
          </label>
          <input
            className="main__login__input"
            type="text"
            name="username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="user__password__form">
          <label class="main__input__label" htmlFor="password">
            Password
          </label>
          <input
            className="main__login__input"
            type="text"
            name="password"
            type="password"
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
          />
          <a className="forgot__link" href="#">
            Forgot password?
          </a>
        </div>
        <a onClick={loginHandler} href="#" className="main__login__button">
          Login
        </a>
      </form>
    </div>
  );
};

export default Login;
