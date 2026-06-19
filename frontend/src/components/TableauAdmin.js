// frontend/src/components/TableauAdmin.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { getAdminStats, getNotificationsAdmin } from "../api";
import "../styles/TableauAdmin.css";
import ChartComponent from "./ChartComponent";
import { FaUsers, FaFileInvoice, FaTruck,FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TableauAdmin() {
  const [stats, setStats] = useState({
    commandes_validees: 0,
    commandes_attente: 0,
    paiements_recus: 0,
    paiements_attente: 0,
    livraisons_en_cours: 0,
    livraisons_livrees: 0,
    ventes_par_mois: [],
    produits_vendus: [],
    annee: new Date().getFullYear(),
    clients_today: 0,
    clients_total:0,
  });

  const [nbNotif, setNbNotif] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getAdminStats();
        setStats(statsRes.data || {});

        const notifRes = await getNotificationsAdmin();
        setNbNotif(notifRes.nb_non_lues || 0);

        setLoading(false);
      } catch (err) {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les statistiques.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

   // ✅ Bloquer retour vers /login : refresh au lieu de revenir
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      navigate(0); // refresh la page courante
    };
  }, [navigate]);g

  // ✅ Données pour les graphiques
  const commandesData = {
    labels: ["Validées", "En attente"],
    datasets: [
      {
        label: "Commandes",
        data: [stats.commandes_validees || 0, stats.commandes_attente || 0],
        backgroundColor: ["#2e7d32", "#ff9800"],
      },
    ],
  };

  const paiementsData = {
    labels: ["Reçus", "En attente"],
    datasets: [
      {
        label: "Paiements",
        data: [stats.paiements_recus || 0, stats.paiements_attente || 0],
        backgroundColor: ["#2e7d32", "#d32f2f"],
      },
    ],
  };

  const livraisonsData = {
    labels: ["En cours", "Livrées"],
    datasets: [
      {
        label: "Livraisons",
        data: [stats.livraisons_en_cours || 0, stats.livraisons_livrees || 0],
        backgroundColor: ["#ff9800", "#2e7d32"],
      },
    ],
  };

  // ✅ Produits vendus (Top 5)
  const produitsLabels = stats.produits_vendus?.map(p => p.produit__designation) || [];
  const produitsData = stats.produits_vendus?.map(p => p.total_vendu) || [];

  const produitsBarData = {
    labels: produitsLabels,
    datasets: [
      {
        label: "Top 5 Produits vendus",
        data: produitsData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const produitsPieData = {
    labels: produitsLabels,
    datasets: [
      {
        label: "Répartition des ventes",
        data: produitsData,
        backgroundColor: [
          "#2e7d32", "#ff9800", "#d32f2f", "#1976d2", "#9c27b0"
        ],
      },
    ],
  };

  return (
    <div className="espace-admin">
      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : (
        <>
          {/* ✅ Header spécifique Admin */}
          <header className="header-admin">
            <div className="header-top">
              <div className="TableauAdmin">📊 Tableau de Bord ADMIN</div>
              <nav className="header-links">
                <Link to="/admin/notifications">
                  🔔 Notifications {nbNotif > 0 && <span className="badge">{nbNotif}</span>}
                </Link>
                <Link to="/logout">Déconnexion</Link>
              </nav>
            </div>

            <div className="header-middle">
              <h2>Bienvenue dans l’espace Admin</h2>
              <p>Suivez vos statistiques et gérez vos opérations</p>
            </div>

            <div className="header-bottom">
              <ul className="nav-admin">
                <li><Link to="/stocks">Rapport des mouvements</Link></li>
                <li><Link to="/admin/paiements">Gestion des paiements</Link></li>
                <li><Link to="/admin/gestion_utilisateurs">Gestion des utilisateurs</Link></li>
                <li><Link to="/admin/commandes">Gestion des commandes</Link></li>
                <li><Link to="/admin/livraisons">Gestion des livraisons</Link></li>
                <li><Link to="/admin/catalogue/ajouter">Ajouter un produit</Link></li>
                <li><Link to="/admin/catalogue">Liste des produits</Link></li>
              </ul>
            </div>
          </header>
          {/* ✅ Cards rapides en haut */}
          <div className="quick-cards-row">
            <div className="card quick-card" id="clients">
              <h3 id="card-titre"><FaUsers /> Clients inscrits</h3>
              <p className="card-para">Aujourd'hui : {stats.clients_today || 0}</p>
              <p className="card-para">Total : {stats.clients_total || 0}</p>
              <p className="pourcentage">
                {(stats.clients_today && stats.clients_total)
                  ? ((stats.clients_today / stats.clients_total) * 100).toFixed(1) + "%"
                  : "0%"} aujourd'hui
              </p>
            </div>

            <div className="card quick-card" id="facture">
              <h3 id="card-titre"><FaFileInvoice /> Factures</h3>
              <p className="card-para">Accéder à la liste des factures</p>
              <Link to="/admin/factures" className="link-white">
                Voir les factures
              </Link>
            </div>


            <div className="card quick-card" id="livraison">
              <h3 id="card-titre"><FaTruck /> Livraisons EN COURS</h3>
              <p className="card-para">Les livraisons EN COURS</p>
              <Link to="/admin/livraisons-en-cours" className="link-white">
                Voir les livraisons
              </Link>
            </div>
          </div>



          {/* ✅ Cards + Graphiques */}
          <div className="cards-grid">
            <div className="card">
              <h3>Commandes</h3>
              <p>Validées : {stats.commandes_validees || 0}</p>
              <p>En attente : {stats.commandes_attente || 0}</p>
              <Bar data={commandesData} />
            </div>

            <div className="card">
              <h3>Paiements</h3>
              <p>Reçus : {stats.paiements_recus || 0}</p>
              <p>En attente : {stats.paiements_attente || 0}</p>
              <Bar data={paiementsData} />
            </div>

            <div className="card">
              <h3>Livraisons</h3>
              <p>En cours : {stats.livraisons_en_cours || 0}</p>
              <p>Livrées : {stats.livraisons_livrees || 0}</p>
              <Pie data={livraisonsData} />
            </div>

            <div className="card">
              <h3>Top 5 Produits vendus</h3>
              {produitsLabels.length > 0 ? (
                <>
                  <Bar data={produitsBarData} />
                  <Pie data={produitsPieData} />
                </>
              ) : (
                <p>Aucun produit vendu</p>
              )}
            </div>
            <div className="statistique">
              <h3>Statistiques de ventes</h3>
              <ChartComponent ventesParMois={stats.ventes_par_mois} annee={stats.annee} />
            </div>
          </div>

          

          <footer className="footer">
            <div className="footer-info">
              <div className="footer-item">
                <FaMapMarkerAlt className="footer-icon" />
                <p>Lot AK 97 Ankadikely Ilafy</p>
              </div>
              <div className="footer-item">
                <FaPhoneAlt className="footer-icon" />
                <p>034 09 071 90</p>
              </div>
              <div className="footer-item">
                <a href="https://www.facebook.com/p/Apmthr-100075991061336/?_rdr" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <FaFacebook className="footer-icon" />
                  <p className="redirection">Suivez-nous sur notre page Facebook - Apmthr</p>
                </a>
              </div>
              <div className="footer-item">
                <FaEnvelope className="footer-icon" />
                <p>aapmthr@gmail.com</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 APMTHR — Votre satisfaction, notre priorité !</p>
            </div>
          </footer>

        </>
      )}


    </div>

  );
}

export default TableauAdmin;
