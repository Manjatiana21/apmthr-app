// frontend/src/components/EspaceClient.js
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/EspaceClient.css";
import { getProduits, getMesNotifications } from "../api";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,FaBell, FaFacebook, FaShoppingCart } from "react-icons/fa";
import headerImg from "../assets/Presentation.png";
import logoImg from "../assets/Logo.png";
import CarouselClient from "./CarouselClient";
import MessageModal from "./MessageModal";

import { FaUserCog } from "react-icons/fa";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function EspaceClient() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [search, setSearch] = useState("");
  const [nbNotif, setNbNotif] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuProfilOpen, setMenuProfilOpen] = useState(false);

  const produitsSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les produits
        const res = await getProduits();
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setProduits((data || []).slice(0, 5));
        setLoading(false);

        // Charger les notifications client
        const notifRes = await getMesNotifications();
        setNbNotif(notifRes.nb_non_lues || 0);
      } catch (err) {
        console.error("❌ Erreur API:", err.response?.data || err);
        setMessage("❌ Impossible de charger les données.");
        setMessageType("error");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

   // ✅ Bloquer retour vers /login : refresh au lieu de revenir (desktop + mobile)
  useEffect(() => {
    const handlePopState = () => {
      navigate(0); // refresh la page courante
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleSearch = async () => {
    if (!search) return;
    try {
      const res = await getProduits();
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      const filtered = (data || []).filter((p) =>
        p.designation.toLowerCase().includes(search.toLowerCase())
      );
      setProduits(filtered);

      if (produitsSectionRef.current) {
        produitsSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("❌ Erreur recherche:", err.response?.data || err);
      setMessage("❌ Aucun produit trouvé.");
      setMessageType("error");
    }
  };

  return (
    <div className="espace-client">
      <header className="header-client">
          <div className="notification-icon" id="notification-mobile">
                        <Link to={ "/mes-notifications" }>
                          <FaBell />
                            <span className="badge">{nbNotif}</span>
                        </Link>        
          </div>

        <img src={headerImg} alt="Header de l’espace client" className="header-image" />
        <div className="header-top-client">
          <div className="logo">
            <img src={logoImg} alt="Header de l’espace client" className="logo-image" />
          </div>
          <nav className="header-links">
            <Link to="/panier" className="panier-icon">
              <FaShoppingCart className="iconShop"/>Panier
              {cartCount > 0 && <span className="badge-2">{cartCount}</span>}
            </Link>

            <Link to="/mes-notifications" className="Notifications-Espace" >
              🔔 Notifications {nbNotif > 0 && <span className="badge">{nbNotif}</span>}
            </Link>
          </nav>
            <div className="profil-dropdown-espace" id="drop-profil">
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
          </div>

        <div className="header-middle-client">
          <h1>Maîtrisez votre Art, </h1>
          <h1> Professionalisez votre pratique</h1>
          <p>Votre satisfaction, notre priorité</p>
        </div>


         <div className="Recherche">
          <input
            className="InputRech"
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="BtnRech" onClick={handleSearch}>🔍</button>
        </div>
        
        <div className="header-bottom-client" id="header-bottom-client">
          <ul className="nav-client">
            <li id="Accueil-bottom"><Link to="/espace-client">Accueil</Link></li>
            <li id="Produit-bottom"><Link to="/catalogue">Nos Produits</Link></li>
            <li id="Commandes-bottom"><Link to="/client-commandes">Mes Commandes</Link></li>
            <li id="Services-bottom">
              <Link 
                  to="/espace-client" 
                  onClick={() => {
                    const section = document.getElementById("SECTION_services");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Nos Services
              </Link></li>
          </ul>
        </div>
        <div className="bottom-responsive" id="bottom-reponsive">
        <div className="nav-client1" id="Espacenav">
            <Link to="/espace-client">Accueil</Link>
            <Link to="/catalogue">Nos Produits</Link>
            <Link to="/client-commandes">Mes Commandes</Link>
            <Link 
                  to="/espace-client" 
                  onClick={() => {
                    const section = document.getElementById("SECTION_services");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Nos Services</Link>
          </div>
        </div>
      </header>

      <section >
        <div className="SLIDE">
          <CarouselClient className="Carousel"/>
        </div>
      </section>

      <section className="section_PROPOS">
        <h2 className="section-title" id="litle-PROPOS">A PROPOS DE NOUS</h2>
        <h4>APMTHR</h4>
        <h5>Association pour la Professionnalisation aux Métiers du Tourisme et de l'Hôtellerie Restauration</h5>
        <p className="petiteintro">
          APMTHR est prestataire de formation du Fonds Malgache de Formation Professionnelle depuis sa création en 2020, et intervient aussi bien à Antananarivo qu'en régions.
        </p>
        <p className="petiteintro">Elle organise et réalise des formations de courtes durées</p>
        <h5>Ce qui nous anime</h5>
        <h6>La transmission entre pairs :</h6>
        <p className="petiteintro">Nous croyons que rien ne remplace l'expérience...</p>
        <h6>La professionnalisation durable :</h6>
        <p className="petiteintro">Maîtriser son geste ne suffit pas...</p>
      </section>

    
      <section className="section-produits" ref={produitsSectionRef} >
        <h2 className="section-title">NOS PRODUITS</h2>
        <p className="petiteintro">
          Découvrez une sélection unique de créations artisanales et de délices gourmands...
        </p>
        {loading ? (
          <p>Chargement des produits...</p>
        ) : (
          <div className="produits-gridEspace" id="GRIDESPACEPRODUITS">
            {produits.length > 0 ? (
              produits.map((p) => (
                <div key={p.id} className="produit-cardEspace" id="CARD-RESPONSIVE">
                  <div className="flex">
                    <img src={p.image || "/images/default.png"} alt={p.designation} className="Image-card" />
                    <h3 className="T-Designation">{p.designation}</h3>
                    <div className="P-PrixEspace">
                      <p className="prix">{p.prix} Ar</p>
                    </div>
                    {p.type_produit && (
                      <p className="T-Type">Type : {p.type_produit.libelleTP}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun produit disponible</p>
            )}

            <div className="cardindication">
              <div className="indication">
                <p className="petiteintro">
                  Pour plus de détails et aussi d'autres produits, cliquez sur Voir plus..
                </p>
              </div>
              <Link to="/catalogue" className="btn-more1">Voir plus...</Link>
            </div>
          </div>
        )}
      </section>

      
      <section className="section-commandes">
        <h2 className="section-title" id="VOTRECOMMANDE">CONSULTEZ VOTRE COMMANDE</h2>
        <p className="petiteintro" id="paragraphe-commande">
          Suivez facilement l'évolution de votre commande en quelques clics...
        </p>
        <Link to="/client-commandes" className="btn-Commande">Voir mes commandes</Link>
      </section>

      
      <section className="section-service" id="SECTION_services">
        <h2 className="section-title">NOS SERVICES</h2>
        <p className="petiteintro" id="paragraphe-service">
          Notre engagement ne s'arrête pas aux produits...
        </p>
        <h1 className="titre-Service">Formation Professionnelle</h1>
        <p className="Service" id="paragraphe-service">
          L'APMTHR oeuvre à la professionnalisation aux différent métiers du Tourisme-Hôtellerie-Restauration et métiers connexes.
        </p>
        <h1 className="titre-Service">Formations proposées</h1>
        <li className="liste-Service">Personnel d'acceuil et de service</li>
        <li className="liste-Service">Concierge</li>
        <li className="liste-Service">Femme de chambre</li>
        <li className="liste-Service" >Valet</li>
        <li className="liste-Service" >Lingère</li>
        <li className="liste-Service" >Serveur</li>
        <li className="liste-Service" >Agent d'accueil</li>
        <li className="liste-Service" >Guide et accompagnateurs touristiques</li>
        <li className="liste-Service" >Personnel de maison</li>
        <h1 className="titre-Service">Formations et conseil</h1>
        <p className="Service" id="paragraphe-service">
          Compte tenu des spécialités de ses membres (formateurs, enseignants, étudiants) et partenaires, l'assocition répond à des demandes en : FORMATION et CONSEIL, pour les secteurs : PUBLIC et PRIVE
        </p>
        <h1 className="titre-Service">Zone d'intervention</h1>
        <li className="liste-Service" >Nationale</li>
        <li className="liste-Service" >Internationale</li>
        
      </section>

      <footer className="footer">
        <div className="footer-info">
          <div className="footer-item" id="F-Adresse">
            <FaMapMarkerAlt className="footer-icon" />
            <p>Lot 97 AK Ankadikely Ilafy</p>
          </div>
          <div className="footer-item" id="F-Telephone">
            <FaPhoneAlt className="footer-icon" />
            <p>034 09 071 90</p>
          </div>
          <div className="footer-item" id="F-Facebook">
            <a href="https://www.facebook.com/p/Apmthr-100075991061336/?_rdr"
               target="_blank" rel="noopener noreferrer" className="footer-link">
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

      
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </div>
  );
}

export default EspaceClient;
