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
            self.stdout.write(self.style.NOTICE(
                "Notice: DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD not set. Skipping superuser setup."
            ))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f"[INFO] Superuser '{username}' already exists. Skipping creation."))
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"[OK] Superuser '{username}' successfully created."))
