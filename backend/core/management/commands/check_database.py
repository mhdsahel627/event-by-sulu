from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from django.db.migrations.executor import MigrationExecutor

class Command(BaseCommand):
    help = 'Tests the current database connection and displays status without exposing passwords.'

    def handle(self, *args, **options):
        db_settings = settings.DATABASES['default']
        engine = db_settings.get('ENGINE', '')
        name = db_settings.get('NAME', '')
        user = db_settings.get('USER', '')
        host = db_settings.get('HOST', 'localhost')
        port = db_settings.get('PORT', '5432')

        is_postgres = 'postgresql' in engine.lower()

        self.stdout.write(self.style.NOTICE("=== Database Configuration Status ==="))
        self.stdout.write(f"Engine: {engine}")
        self.stdout.write(f"Database Name: {name}")
        if is_postgres:
            self.stdout.write(f"User: {user}")
            self.stdout.write(f"Host: {host}:{port}")
            self.stdout.write(f"Connection Max Age: {db_settings.get('CONN_MAX_AGE', 0)}s")
        else:
            self.stdout.write("Mode: Local SQLite development fallback")

        self.stdout.write("\nTesting database connection...")
        try:
            connection.ensure_connection()
            self.stdout.write(self.style.SUCCESS("[OK] Database connection established successfully!"))

            # Check migrations
            executor = MigrationExecutor(connection)
            targets = executor.loader.graph.leaf_nodes()
            unapplied = executor.migration_plan(targets)
            if unapplied:
                self.stdout.write(self.style.WARNING(f"[!] Found {len(unapplied)} unapplied migration(s). Run 'python manage.py migrate' to apply."))
            else:
                self.stdout.write(self.style.SUCCESS("[OK] All database migrations are up to date!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"[ERROR] Database connection failed: {type(e).__name__}: {str(e)}"))
            if is_postgres:
                self.stdout.write(self.style.NOTICE("\nTroubleshooting PostgreSQL connection:"))
                self.stdout.write("1. Ensure PostgreSQL service is running.")
                self.stdout.write("2. Verify DB_NAME exists (or create it with: CREATE DATABASE event_by_sulu;).")
                self.stdout.write("3. Ensure DB_USER, DB_PASSWORD, DB_HOST, DB_PORT in backend/.env are correct.")
