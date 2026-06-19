from django.contrib import admin
from .models import Facture

@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display = ("numero", "commande", "paiement", "montant_total", "envoyee")

