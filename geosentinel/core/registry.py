from typing import Dict, Any, Callable

REGISTRY: Dict[str, Dict[str, Any]] = {
    "embedding": {},
    "vector_store": {},
    "change_detector": {},
    "llm": {},
    "map": {}
}

def register(category: str, name: str) -> Callable:
    def decorator(cls: Any) -> Any:
        if category not in REGISTRY:
            REGISTRY[category] = {}
        REGISTRY[category][name] = cls
        return cls
    return decorator

def get_plugin(category: str, name: str) -> Any:
    if category not in REGISTRY:
        raise ValueError(f"Category {category} not found in registry")
    if name not in REGISTRY[category]:
        raise ValueError(f"Plugin {name} not found in category {category}")
    return REGISTRY[category][name]
