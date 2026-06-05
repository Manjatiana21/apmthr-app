// frontend/src/App.js
import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import de tes composants
import Connexion from "./components/Connexion";
import Inscription from "./components/Inscription";
import EspaceClient from "./components/EspaceClient";
import TableauAdmin from "./components/TableauAdmin";
import CatalogueAdmin from "./components/CatalogueAdmin";
import CatalogueListe from "./components/CatalogueListe";
import MesCommandes from "./components/MesCommandes";
import MesNotifications from "./components/MesNotifications";
import MesPaiements from "./components/MesPaiements";
import ListeLivraisonsClient from "./components/ListeLivraisonsClient";
import GestionLivraison from "./components/GestionLivraison";
import NotificationsAdmin from "./components/NotificationsAdmin";
import GestionUtilisateurs from "./components/GestionUtilisateurs";
import ProduitDetail from "./components/ProduitDetail";
import CommandesAnnulees from "./components/CommandesAnnulees";
import ModifierProduit from "./components/ModifierProduit";
import SupprimerProduit from "./components/SupprimerProduit";
import GestionStock from "./components/GestionStock";
import PrivateRoute from "./components/PrivateRoute"; 
import Logout from "./components/Logout";
import GestionPaiement from "./components/GestionPaiement";
import GestionCommandes from "./components/GestionCommandes";
import CorbeilleProduits from "./components/CorbeilleProduits";
import Catalogue from "./components/Catalogue";
import PageCommande from"./components/PageCommande";
import DetailCommandeClient from "./components/DetailCommandeClient";
import CommandeDetail from "./components/CommandeDetail";
import CommandesValideesAdmin from "./components/CommandesValideesAdmin"; 
import CommandesAnnuleesAdmin from "./components/CommandesAnnuleesAdmin";
import CommandeDetailAdmin from "./components/CommandeDetailAdmin";
import FacturePage from "./components/FacturePage";
import MesFactures from "./components/MesFactures";
import ListeFacture from "./components/ListeFacture";
import FactureDetailPage from "./components/FactureDetailPage";
import ListeLivraisonsAdmin from "./components/ListeLivraisonsAdmin";
import ModifierProfil from "./components/ModifierProfil";
import ModifierAdresse from "./components/ModifierAdresse";
import ModifierEmail from "./components/ModifierEmail";
import ModifierMotDePasse from "./components/ModifierMotDePasse";
import ModifierNom from "./components/ModifierNom";
import ModifierTelephone from "./components/ModifierTelephone";
import Panier from "./components/Panier";


function App() {
  // ✅ Bloc pour forcer reload si état incohérent
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.reload(); // force un vrai reload si l’état est vide
    }
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        <Route path="/logout" element={<Logout />} />

        <Route
          path="/espace-client"
          element={
            <PrivateRoute>
              
                <EspaceClient />
              
            </PrivateRoute>
          }
        />

        <Route
          path="/modifier-profil"
          element={
            <PrivateRoute>
              
                <ModifierProfil />
              
            </PrivateRoute>
          }
        />

         <Route
          path="/profil/modifier-nom"
          element={
            <PrivateRoute>
              
                <ModifierNom />
              
            </PrivateRoute>
          }
        />

         <Route
          path="/profil/modifier-email"
          element={
            <PrivateRoute>
              
                <ModifierEmail />
              
            </PrivateRoute>
          }
        />

         <Route
          path="/profil/modifier-telephone"
          element={
            <PrivateRoute>
              
                <ModifierTelephone />
              
            </PrivateRoute>
          }
        />

         <Route
          path="/profil/modifier-adresse"
          element={
            <PrivateRoute>
              
                <ModifierAdresse />
              
            </PrivateRoute>
          }
        />

         <Route
          path="/profil/modifier-motdepasse"
          element={
            <PrivateRoute>
              
                <ModifierMotDePasse />
              
            </PrivateRoute>
          }
        />

          <Route
          path="/panier"
          element={
            <PrivateRoute>
              
                <Panier />
              
            </PrivateRoute>
          }
        />

       <Route path="/mes-factures" element={<MesFactures />} />
       <Route path="/factures/:id" element={<FactureDetailPage />} />

        <Route
          path="/client-commandes"
          element={
            <PrivateRoute>
              
                <MesCommandes />
              
            </PrivateRoute>
          }
        />

        <Route 
          path="/commandes/:id" 
          element={<CommandeDetail />
          } 
          />

          <Route
          path="/commandes/:id"
          element={
            <PrivateRoute>
              
                <DetailCommandeClient />
              
            </PrivateRoute>
          }
        />

        <Route
          path="/mes-notifications"
          element={
            <PrivateRoute>
             
                <MesNotifications />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/mes-paiements"
          element={
            <PrivateRoute>
              
                <MesPaiements />
             
            </PrivateRoute>
          }
        />
        <Route
          path="/client-livraisons"
          element={
            <PrivateRoute>
              
                <ListeLivraisonsClient />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/produits/:id"
          element={
            <PrivateRoute>
              
                <ProduitDetail />
             
            </PrivateRoute>
          }
        />
        <Route
          path="/passer-commande/:id"
          element={
            <PrivateRoute>
              
                <PageCommande />
              
            </PrivateRoute>
          }
        />

      <Route
          path="/commandes-annulees"
          element={
            <PrivateRoute>
              
                <CommandesAnnulees />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/catalogue"
          element={
            <PrivateRoute>
              
                <Catalogue />
              
            </PrivateRoute>
          }
        />


   
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <TableauAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/catalogue"
          element={
            <PrivateRoute>
              
                <CatalogueListe />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/catalogue/ajouter"
          element={
            <PrivateRoute>
              
                <CatalogueAdmin />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produits/:id/modifier"
          element={
            <PrivateRoute>
              
                <ModifierProduit />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produits/:id/supprimer"
          element={
            <PrivateRoute>
              
                <SupprimerProduit />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/commandes"
          element={
            <PrivateRoute>
              
                <GestionCommandes/>
              
            </PrivateRoute>
          }
        />

        <Route
          path="/commandes/validees"
          element={
            <PrivateRoute>
              
                <CommandesValideesAdmin />
              
            </PrivateRoute>
          }
        />
        
        <Route
          path="/commandes/annulees"
          element={
            <PrivateRoute>
              
                <CommandesAnnuleesAdmin />
              
            </PrivateRoute>
          }
        />

        <Route
          path="/GestionCommandes"
          element={
            <PrivateRoute>
              
                <GestionCommandes />
              
            </PrivateRoute>
          }
        />

        <Route
          path="/commandes/:id/detail"
          element={
            <PrivateRoute>
              
                <CommandeDetailAdmin />
              
            </PrivateRoute>
          }
        />
     


        <Route
          path="/admin/livraisons"
          element={
            <PrivateRoute>
              
                <GestionLivraison />
              
            </PrivateRoute>
          }
        />

          <Route
          path="/admin/livraisons-en-cours"
          element={
            <PrivateRoute>
              
                <ListeLivraisonsAdmin />
              
            </PrivateRoute>
          }
        />
    
      
        <Route
          path="/admin/notifications"
          element={
            <PrivateRoute>
             
                <NotificationsAdmin />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/gestion_utilisateurs"
          element={
            <PrivateRoute>
              
                <GestionUtilisateurs />
              
            </PrivateRoute>
          }
        />
        
        <Route 
        path="/catalogue-admin" 
        element={<CatalogueAdmin 
        />} />

        <Route
          path="/stocks"
          element={
            <PrivateRoute>
              
                <GestionStock/>
              
            </PrivateRoute>
          }
        />

          <Route
          path="/admin/paiements"
          element={
            <PrivateRoute>
              
                <GestionPaiement/>
              
            </PrivateRoute>
          }
        />

        <Route
          path="/corbeille-produits"
          element={
            <PrivateRoute>
              <CorbeilleProduits />
            </PrivateRoute>
          }
        />

       <Route path="/paiements/:id/facture" element={<FacturePage />} />
      
        <Route path="/factures/:id" element={<FactureDetailPage />} />
      
          <Route
          path="/admin/factures"
          element={
            <PrivateRoute>
              
                <ListeFacture/>
              
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
