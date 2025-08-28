from django.core.management.base import BaseCommand
from api.models import Medicine
from api.mongo import get_db, get_next_id


class Command(BaseCommand):
    help = 'Seed sample medicines data'

    def handle(self, *args, **options):
        samples = [
            {
                'name': 'Paracetamol 500mg',
                'content': 'Acetaminophen 500mg. Pain reliever and fever reducer.',
                'price': 25.00,
                'stock': 50,
            },
            {
                'name': 'Ibuprofen 200mg',
                'content': 'Ibuprofen 200mg. NSAID for pain and inflammation.',
                'price': 30.00,
                'stock': 20,
            },
            {
                'name': 'Cetirizine 10mg',
                'content': 'Antihistamine for allergy relief.',
                'price': 15.00,
                'stock': 0,
            },
        ]
        # Seed into Mongo as well
        db = get_db()
        created_sql = 0
        for s in samples:
            obj, was_created = Medicine.objects.get_or_create(name=s['name'], defaults=s)
            if was_created:
                created_sql += 1
        created_mongo = 0
        for s in samples:
            existing = db.medicines.find_one({'name': s['name']})
            if existing:
                continue
            doc = {
                'id': get_next_id('medicines'),
                'name': s['name'],
                'content': s['content'],
                'price': float(s['price']),
                'stock': s['stock'],
                'is_active': True,
            }
            db.medicines.insert_one(doc)
            created_mongo += 1
        self.stdout.write(self.style.SUCCESS(f'Seed completed. SQL:{created_sql} Mongo:{created_mongo}'))
