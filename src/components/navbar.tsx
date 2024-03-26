import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const logOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Home </Link>
        {user ? (
          <Link to="/createpost">Post! </Link>
        ) : (
          <Link to="/login">Log In</Link>
        )}
      </div>

      <div className="user">
        {user && (
          <>
            <p>{user?.displayName}</p>
            {user?.photoURL && (
              <img
                src={user?.photoURL || ""}
                alt=""
                width="40px"
                height="40px"
              />
            )}

            <button onClick={logOut}>Log Out</button>
          </>
        )}
      </div>
    </div>
  );
};
