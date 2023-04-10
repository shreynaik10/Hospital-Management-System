import React, { createContext, useState } from "react";

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState();

  const signOutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser({});
    setIsLoggedIn(false);
  }

  const signInUser = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(user.userType);
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        setCurrentUser,
        setIsLoggedIn,
        signInUser,
        signOutUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };