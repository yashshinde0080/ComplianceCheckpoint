import asyncio
import asyncpg
import ssl
import sys
import os
from sqlalchemy.engine.url import make_url

# Add the parent directory to sys.path so we can import app
sys.path.append(os.getcwd())
from app.core.config import settings

async def test():
    print("--- Database Connection Test ---")
    db_url = settings.DATABASE_URL
    print(f"Testing URL: {db_url[:20]}...")
    
    try:
        url_obj = make_url(db_url)
        print(f"Parsed Host: {url_obj.host}")
        print(f"Parsed User: {url_obj.username}")
        print(f"Parsed Pass: {'***' if url_obj.password else 'None'}")
        print(f"Parsed DB: {url_obj.database}")
    except Exception as e:
        print(f"URL Parse Error: {e}")
        return

    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        print("Connecting...")
        conn = await asyncpg.connect(
            user=url_obj.username,
            password=url_obj.password,
            database=url_obj.database,
            host=url_obj.host,
            port=url_obj.port,
            ssl=ssl_context
        )
        print("SUCCESS!")
        version = await conn.fetchval("SELECT version()")
        print(f"Version: {version}")
        await conn.close()
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(test())
