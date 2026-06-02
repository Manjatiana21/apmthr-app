"""
ASGI config for app_apmthr project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import mimetypes
from django.core.asgi import get_asgi_application

# ✅ Correction des types MIME
mimetypes.add_type("text/css", ".css", True)
mimetypes.add_type("application/javascript", ".js", True)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app_apmthr.settings')

application = get_asgi_application()
