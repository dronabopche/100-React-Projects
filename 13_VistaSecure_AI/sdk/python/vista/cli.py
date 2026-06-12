import argparse
import sys
import httpx
from .client import VistaClient

def handle_health(url):
    try:
        with httpx.Client(base_url=url) as client:
            response = client.get("/health")
            response.raise_for_status()
            if response.json().get("status") == "healthy":
                print("Backend Status: HEALTHY")
            else:
                print(f"Backend Status: UNHEALTHY ({response.json()})")
    except Exception as e:
        print(f"Error connecting to API server at {url}: {e}")
        sys.exit(1)

def handle_analyze(client, prompt):
    try:
        result = client.scan(prompt)
        print(f"Prompt: {prompt}")
        print(f"Score:  {result.score}/99")
        print(f"Level:  {result.risk_level}")
        print(f"Details: {result.details}")
        print("-" * 40)
    except Exception as e:
        print(f"Error scanning prompt '{prompt}': {e}", file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description="Vista Secure AI SDK CLI Scanner")
    parser.add_argument("--url", type=str, default=None, help="Vista API server base URL")
    parser.add_argument("--key", type=str, default=None, help="Vista API Key")
    
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Analyze subcommand
    analyze_parser = subparsers.add_parser("analyze")
    group = analyze_parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-p", "--prompt", type=str, help="Analyze a single prompt")
    group.add_argument("-p*", "--prompts", nargs="+", dest="prompts", help="Analyze multiple prompts")
    group.add_argument("-t", "--text", type=str, help="Analyze prompts from a text file")

    # Health subcommand
    subparsers.add_parser("health")

    args = parser.parse_args()

    # Initialize client
    client = VistaClient(api_key=args.key, api_url=args.url)
    
    if args.command == "health":
        handle_health(client.api_url)
    elif args.command == "analyze":
        if args.prompt:
            handle_analyze(client, args.prompt)
        elif args.prompts:
            for p in args.prompts:
                handle_analyze(client, p)
        elif args.text:
            try:
                result = client.scan_file(args.text)
                print(f"File Analysis Results for: {result.get('filename')}")
                print(f"  Max Score:     {result.get('max_score')}/99")
                print(f"  Average Score: {result.get('average_score')}/99")
                print("-" * 40)
                for item in result.get('results', []):
                    print(f"Prompt: {item.get('prompt')}")
                    print(f"  Score:  {item.get('score')}/99 ({item.get('level')})")
                    print(f"  Details: {item.get('details')}")
                    print("-" * 40)
            except FileNotFoundError:
                print(f"Error: File '{args.text}' not found.", file=sys.stderr)
                sys.exit(1)
            except Exception as e:
                print(f"Error uploading and scanning file: {e}", file=sys.stderr)
                sys.exit(1)

if __name__ == "__main__":
    main()
