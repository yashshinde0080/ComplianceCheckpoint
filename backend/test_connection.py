import asyncio
import asyncpg
import ssl
import sys
import os

# Add the parent directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.core.config import settings
from sqlalchemy.engine.url import make_url

async def test():
    print("--- Database Connection Test ---")
    db_url = settings.DATABASE_URL
    # Mask password for printing
    safe_url = db_url
    if "@" in db_url:
        part1 = db_url.split("@")[0]
        part2 = db_url.split("@")[1]
        if ":" in part1:
            user_part = part1.split(":")[0] + ":****"
            safe_url = f"{user_part}@{part2}"
            
    print(f"URL from settings: {safe_url}")
    
    try:
        url_obj = make_url(db_url)
    except Exception as e:
        print(f"Failed to parse URL: {e}")
        return

    print(f"Host: {url_obj.host}")
    print(f"User: {url_obj.username}")
    print(f"Database: {url_obj.database}")
    
    # SSL Context matching env.py
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        print("Attempting asyncpg connection...")
        conn = await asyncpg.connect(
            user=url_obj.username,
            password=url_obj.password,
            database=url_obj.database,
            host=url_obj.host,
            port=url_obj.port,
            ssl=ssl_context
        )
        print("SUCCESS: Connection established!")
        version = await conn.fetchval("SELECT version()")
        print(f"Server Version: {version}")
        await conn.close()
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(test())
