// frontend/src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // ✅ supprime les tokens et le rôle
    navigate("/login"); // ✅ redirige vers la page de connexion
  }, [navigate]);

  return null; // ✅ pas besoin d'affichage
}

export default Logout;
