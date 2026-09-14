import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates or updates the management owner superuser account securely.'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Owner username')
        parser.add_argument('--password', type=str, help='Owner password')
        parser.add_argument('--email', type=str, default='sahelmhd3@gmail.com', help='Owner email')

    def handle(self, *args, **options):
        username = options.get('username') or os.getenv('DJANGO_SUPERUSER_USERNAME')
        password = options.get('password') or os.getenv('DJANGO_SUPERUSER_PASSWORD')
        email = options.get('email') or os.getenv('DJANGO_SUPERUSER_EMAIL', 'sahelmhd3@gmail.com')

        if not username or not password:
            self.stdout.write(self.style.ERROR(
                "Error: Username and password must be supplied either via arguments:\n"
                "    python manage.py setup_owner --username <name> --password <pass>\n"
                "or via environment variables DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD."
            ))
            return

        user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'is_staff': True, 'is_superuser': True})
        user.set_password(password)
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"[OK] Owner superuser '{username}' successfully created."))
        else:
            self.stdout.write(self.style.SUCCESS(f"[OK] Owner superuser '{username}' credentials updated."))
