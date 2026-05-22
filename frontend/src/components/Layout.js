import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaBars, FaTimes, FaBell, FaShoppingCart} from "react-icons/fa";
import { NotificationsContext } from "./NotificationsContext";
import logoImg from "../assets/Logo.png";
import { getFacturesRecues } from "../api";
import { FaUserCog } from "react-icons/fa";
import { FaUserCircle, FaSignOutAlt, FaHome, FaFileInvoice, FaStore, FaStoreSlash} from "react-icons/fa";

function Layout({ children }) {
  const { nbNonLues, loading, user } = useContext(NotificationsContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuProfilOpen, setMenuProfilOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getFacturesRecues().then((data) => setCount(data.length));
  }, []);

  // 🔑 Charger le nombre de produits dans le panier depuis localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);

    // écoute les changements de localStorage (si ajout depuis Catalogue)
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="layout">
      <header className="header shadow-sm">
        <div className="header-left">
          <img src={logoImg} alt="Logo" className="logo" id="LOGO" />
        </div>

        <nav className="nav" id="nav-layout">
          <ul>
            {user?.role === "CLIENT" && (
              <>
                
                <li><Link to="/espace-client">Accueil</Link></li>
                <li><Link to="/catalogue">Nos Produits</Link></li>
                <li><Link to="/client-commandes">Mes Commandes</Link></li>
                {/* Icône panier avec badge */}
                <div className="panier-icon">
                  <li>
                  <Link to="/panier">
                    <FaShoppingCart />Panier
                    {cartCount > 0 && <span className="badge-2">{cartCount}</span>}
                  </Link></li>
                </div>
                <li>
                  <Link to="/mes-factures" onClick={() => setCount(0)}>
                    Facture(s) reçu(s)
                    {count > 0 && <span className="badge">{count}</span>}
                  </Link>
                </li>

                <li className="notification-link">
                  <Link to="/mes-notifications">
                    🔔 Notifications
                    {!loading && nbNonLues > 0 && (
                      <span className="badge">{nbNonLues}</span>
                    )}
                  </Link>
                  </li>
                    <div className="profil-dropdown">
                      <button
                        className="profil-icon-btn"
                        onClick={() => setMenuProfilOpen(!menuProfilOpen)}
                      >
                        <FaUserCircle size={22} />
                      </button>

                      {menuProfilOpen && (
                        <div className="profil-menu-dropdown">
                          <Link to="/modifier-profil" onClick={() => setMenuProfilOpen(false)}>
                            <FaUserCog /> Profil
                          </Link>
                          <Link to="/logout" className="btn-logout" onClick={() => setMenuProfilOpen(false)}>
                            <FaSignOutAlt /> Déconnexion
                          </Link>
                        </div>
                      )}
                    </div>
              </>
            )}
            {user?.role === "ADMIN" && (
              <>
                <li><Link to="/admin">Tableau de bord</Link></li>
                <li><Link to="/admin/catalogue">Nos Produits</Link></li>
                <li className="notification-link">
                  <Link to="/admin/notifications">
                    🔔 Notifications Admin
                    {!loading && nbNonLues > 0 && (
                      <span className="badge">{nbNonLues}</span>
                    )}
                  </Link>
                </li>
                <li><Link to="/corbeille-produits">Corbeille</Link></li>
                <li><Link className="btn-logout" to="/logout">Déconnexion</Link></li>
              </>
            )}
          </ul>
        </nav>


        {user?.role === "CLIENT" && (
          <div className="Icone-mobile" id="Icone-mobile">
            <div className="Icone-flex-mobile">
            <div className="Acceuil-mobile" id="Acceuil-mobile">
              <li><Link to="/espace-client" onClick={() => setMenuOpen(false)}><FaHome className="i-home" />
              </Link></li>
            </div>
            <div className="panier-icon-mobile" id="panier-icon-mobile">
              <li>
                <Link to="/panier">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="badge-2">{cartCount}</span>}
                </Link></li>
            </div>
            <div className="icone-catalogue">
              <li>
                <Link to="/catalogue" onClick={() => setMenuOpen(false)}>
                <FaStore className="i-catalogue"/>
                </Link>
              </li>
            </div>
            </div>
          </div>
        )}
            
        {user && (
          <div className="Notif-facture" id="Notif-facture">
          <div className="notification-icon" id="notification-icon">
              <Link to={user.role === "CLIENT" ? "/mes-notifications" : "/admin/notifications"}>
                <FaBell />
                {!loading && nbNonLues > 0 && (
                  <span className="badge">{nbNonLues}</span>
                )}
              </Link>        
          </div>
          <div className="facture-icone-mobile">
          <li>
                    <Link to="/mes-factures"><FaFileInvoice className="i-facture"/>
                      {count > 0 && <span className="badge">{count}</span>}
                    </Link></li>
          </div>
          </div>
        )}

        <button className="burger-btn" id="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>


        <nav className={`nav-mobile ${menuOpen ? "open" : ""}`}>
          <ul>
            {user?.role === "CLIENT" && (
              <>
                <li><Link to="/espace-client" onClick={() => setMenuOpen(false)}><FaHome />Accueil</Link></li>
                <li><Link to="/catalogue" onClick={() => setMenuOpen(false)}><FaStore/>Nos Produits</Link></li>
                <li>
                  <Link to="/mes-factures"><FaFileInvoice/>
                    Facture(s) reçu(s)
                    {count > 0 && <span className="badge" id="Facture-badge">{count}</span>}
                  </Link>
                </li>
                <li><Link to="/client-commandes" onClick={() => setMenuOpen(false)}><FaStoreSlash/>Mes Commandes</Link></li>
                <li><Link to="/modifier-profil" onClick={() => setMenuProfilOpen(false)}>
                            <FaUserCog /> Profil
                          </Link></li>
                <li><Link className="btn-logout" to="/logout" onClick={() => setMenuOpen(false)}> <FaSignOutAlt /> Déconnexion</Link></li>
              </>
            )}
            {user?.role === "ADMIN" && (
              <>
                <li><Link to="/admin/catalogue" onClick={() => setMenuOpen(false)}>Nos Produits</Link></li>
                <li><Link to="/corbeille-produits" onClick={() => setMenuOpen(false)}>Corbeille</Link></li>
                <li><Link className="btn-logout" to="/logout" onClick={() => setMenuOpen(false)}>Déconnexion</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="main">{children}</main>

      {/* Footer inchangé */}
      <footer className="footer">
        <div className="footer-info">
          <div className="footer-item" id="F-Adresse">
            <FaMapMarkerAlt className="footer-icon" />
            <p>Lot AK 97 Ankadikely Ilafy</p>
          </div>
          <div className="footer-item" id="F-Telephone">
            <FaPhoneAlt className="footer-icon" />
            <p>034 09 071 90</p>
          </div>
          <div className="footer-item" id="F-Facebook">
            <a href="https://www.facebook.com/p/Apmthr-100075991061336/?_rdr" target="_blank" rel="noopener noreferrer" className="footer-link">
              <FaFacebook className="footer-icon" />
              <p className="redirection">Suivez-nous sur notre page Facebook - Apmthr</p>
            </a>
          </div>
          <div className="footer-item" id="F-Email">
            <FaEnvelope className="footer-icon" />
            <p>aapmthr@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 APMTHR — Votre satisfaction, notre priorité !</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
