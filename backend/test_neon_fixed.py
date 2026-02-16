import asyncio
import asyncpg
import ssl

async def test():
    # Forced IP + Project ID in username (dot separator)
    dsn = "postgresql://neondb_owner.ep-gentle-hall-a1zsdgpr:npg_Y9ePG8mqDxut@13.228.46.236:5432/neondb?sslmode=require"
    
    print(f"Connecting to: {dsn[:30]}...")
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        conn = await asyncpg.connect(dsn, ssl=ssl_context)
        print("SUCCESS! Connected via IP + Username dot notation.")
        await conn.close()
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(test())
