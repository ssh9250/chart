from typing import Dict, Any


def summarize_post(content: str) -> Dict[str, Any]:
    return {"summary": content[:120] + ("..." if len(content) > 120 else "")}


