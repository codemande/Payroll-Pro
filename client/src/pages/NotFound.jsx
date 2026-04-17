import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#f3f4f6" 
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ 
          marginBottom: "1rem", 
          fontSize: "2.25rem", 
          fontWeight: "bold" 
        }}>
          404
        </h1>
        <p style={{ 
          marginBottom: "1rem", 
          fontSize: "1.25rem", 
          color: "gray" 
        }}>
          Oops! Page not found
        </p>
        <Link to="/" style={{ 
          color: "#2563eb", 
          textDecoration: "underline" 
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;