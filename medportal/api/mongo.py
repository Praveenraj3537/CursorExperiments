import os
from pymongo import MongoClient, ReturnDocument


_client = None


def get_db():
    global _client
    if _client is None:
        uri = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017')
        _client = MongoClient(uri)
    db_name = os.environ.get('MONGODB_DB', 'medportal')
    return _client[db_name]


def get_next_id(sequence_name: str) -> int:
    db = get_db()
    doc = db.counters.find_one_and_update(
        {'_id': sequence_name},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(doc['seq'])
