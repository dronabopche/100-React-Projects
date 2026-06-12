import argparse
import json
import sys
import urllib.request
import urllib.error

DEFAULT_URL = "http://127.0.0.1:8000"

def make_request(path, data=None):
    url = f"{DEFAULT_URL}{path}"
    headers = {"Content-Type": "application/json"}
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(
        url, 
        data=req_data, 
        headers=headers, 
        method="POST" if data else "GET"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error connecting to API server at {DEFAULT_URL}: {e}")
        print("Please ensure the backend server is running (e.g., python3 main.py)")
        sys.exit(1)

def make_multipart_request(file_path):
    import uuid
    import os
    boundary = f"Boundary-{uuid.uuid4().hex}"
    
    try:
        with open(file_path, "rb") as f:
            file_content = f.read()
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
        
    filename = os.path.basename(file_path)
    
    # Construct multipart/form-data body
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: text/plain\r\n\r\n"
    ).encode("utf-8") + file_content + f"\r\n--{boundary}--\r\n".encode("utf-8")
    
    url = f"{DEFAULT_URL}/analyze-multi"
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(body))
    }
    
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error connecting to API server at {DEFAULT_URL}: {e}")
        print("Please ensure the backend server is running (e.g., python3 main.py)")
        sys.exit(1)

def handle_health():
    res = make_request("/health")
    if res.get("status") == "healthy":
        print("Backend Status: HEALTHY")
    else:
        print(f"Backend Status: UNHEALTHY ({res})")

def handle_analyze(prompt):
    res = make_request("/analyze", {"prompt": prompt})
    print(f"Prompt: {prompt}")
    print(f"Score:  {res.get('score')}/99")
    print(f"Level:  {res.get('level')}")
    print(f"Details: {res.get('details')}")
    print("-" * 40)

def main():
    parser = argparse.ArgumentParser(description="VistaSecure AI CLI Tool")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Analyze subcommand
    analyze_parser = subparsers.add_parser("analyze")
    
    # Mutually exclusive group for inputs
    group = analyze_parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-p", "--prompt", type=str, help="Analyze a single prompt")
    group.add_argument("-p*", "--prompts", nargs="+", dest="prompts", help="Analyze multiple prompts")
    group.add_argument("-t", "--text", type=str, help="Analyze prompts from a text file")

    # Health subcommand
    subparsers.add_parser("health")

    args = parser.parse_args()

    if args.command == "health":
        handle_health()
    elif args.command == "analyze":
        if args.prompt:
            handle_analyze(args.prompt)
        elif args.prompts:
            for p in args.prompts:
                handle_analyze(p)
        elif args.text:
            result = make_multipart_request(args.text)
            print(f"File Analysis Results for: {result.get('filename')}")
            print(f"  Max Score:     {result.get('max_score')}/99")
            print(f"  Average Score: {result.get('average_score')}/99")
            print("-" * 40)
            for item in result.get('results', []):
                print(f"Prompt: {item.get('prompt')}")
                print(f"  Score:  {item.get('score')}/99 ({item.get('level')})")
                print(f"  Details: {item.get('details')}")
                print("-" * 40)

if __name__ == "__main__":
    main()

