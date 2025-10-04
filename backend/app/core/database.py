# app/core/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

# Global database instance
db = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        logger.info("🔄 Connecting to MongoDB...")
        
        # Create client with timeout settings
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=5000,
            maxPoolSize=50,
            minPoolSize=10
        )
        
        # Get database
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        
        # Create indexes for users collection
        await create_indexes()
        
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        logger.error("Make sure MongoDB is running on your system")
        logger.error("Install MongoDB: https://www.mongodb.com/try/download/community")
        db.database = None
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error connecting to MongoDB: {e}")
        db.database = None
        raise

async def close_mongo_connection():
    """Close database connection"""
    try:
        if db.client:
            db.client.close()
            db.database = None
            logger.info("✅ Closed MongoDB connection")
    except Exception as e:
        logger.error(f"❌ Error closing MongoDB connection: {e}")

async def create_indexes():
    """Create database indexes"""
    try:
        if db.database is not None:
            # Create unique index on email
            await db.database.users.create_index("email", unique=True)
            logger.info("✅ Created database indexes")
    except Exception as e:
        logger.error(f"❌ Error creating indexes: {e}")

def get_database():
    """Get database instance"""
    if db.database is None:
        logger.error("❌ Database not connected")
        return None
    return db.database

async def check_database_health():
    """Check database connection health"""
    try:
        if db.database is not None:
            await db.client.admin.command('ping')
            return True
        return False
    except Exception:
        return False
