from rest_framework import serializers
from .models import Facture
from commandes.models import Commande, Details
from paiements.models import Paiement
from comptes.models import Utilisateur


class DetailCommandeSerializer(serializers.ModelSerializer):
    produit = serializers.CharField(source="produit.designation", read_only=True)

    class Meta:
        model = Details
        fields = ["id", "produit", "quantite", "prix_unitaire"]


class PaiementSerializer(serializers.ModelSerializer):
    mode_paiement = serializers.CharField(source="mode_paiement.mode_paiement", read_only=True)
    date_paiement = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S%z", read_only=True)  # ✅ correction

    class Meta:
        model = Paiement
        fields = ["id", "montant", "statut", "date_paiement", "mode_paiement"]



class CommandeSerializer(serializers.ModelSerializer):
    details = DetailCommandeSerializer(many=True, read_only=True)

    class Meta:
        model = Commande
        fields = ["id", "details", "statut", "total"]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ["username", "email", "adresse", "telephone"]


class FactureSerializer(serializers.ModelSerializer):
    commande = CommandeSerializer(read_only=True)
    paiement = PaiementSerializer(read_only=True)
    # ✅ correction : on relie le client via la commande (plus cohérent que via paiement)
    client = ClientSerializer(source="commande.client", read_only=True)

    class Meta:
        model = Facture
        fields = [
            "id",
            "numero",
            "date_emission",
            "montant_total",
            "envoyee",
            "client",
            "commande",
            "paiement",
        ]


class FactureListSerializer(serializers.ModelSerializer):
    date_emission = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Facture
        fields = ["id", "numero", "date_emission", "montant_total"]
