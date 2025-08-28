from django.core.management.base import BaseCommand
from api.models import Medicine


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
        created = 0
        for s in samples:
            obj, was_created = Medicine.objects.get_or_create(name=s['name'], defaults=s)
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f'Seed completed. {created} new medicines added.'))
