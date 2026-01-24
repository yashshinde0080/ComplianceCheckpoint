import hashlib


def calculate_file_hash(content: bytes) -> str:
    """Calculate SHA-256 hash of file content."""
    return hashlib.sha256(content).hexdigest()


def verify_file_hash(content: bytes, expected_hash: str) -> bool:
    """Verify file content matches expected hash."""
    return calculate_file_hash(content) == expected_hash