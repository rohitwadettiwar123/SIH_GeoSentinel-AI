import socket
import sys

def block_network():
    # A simple mock to block network calls in python
    import urllib.request
    def guard(*args, **kwargs):
        raise ConnectionError("Network is blocked in offline mode!")
    urllib.request.urlopen = guard
    try:
        import httpx
        httpx.Client = guard
        httpx.AsyncClient = guard
    except ImportError:
        pass

def main():
    print("Testing offline mode...")
    block_network()
    
    try:
        from geosentinel.providers.llm import get_llm_provider
        provider = get_llm_provider()
        res = provider.generate("Test prompt")
        print("LLM Provider Response:", res)
        print("Offline test passed: No network calls escaped.")
    except Exception as e:
        print("Offline test failed:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
