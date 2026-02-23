#!/usr/bin/env python3
import argparse
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]

def collect_html_files():
    files = []
    for f in sorted(ROOT.glob('*.html')):
        # skip files with extra dots (backup-like) if any
        if f.name.count('.') > 1:
            continue
        files.append(f)
    return files

def original_url(f: Path):
    return f'https://promptimagelab.com/{f.name}'

def target_url(f: Path):
    if f.name == 'index.html':
        return 'https://promptimagelab.com/'
    return f'https://promptimagelab.com/{f.stem}'

def head_request(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.getcode(), resp.geturl()
    except Exception as e:
        return None, str(e)

def main(test=False):
    files = collect_html_files()
    mappings = []
    for f in files:
        orig = original_url(f)
        targ = target_url(f)
        info = {'file': f.name, 'original': orig, 'target': targ}
        if test:
            code, loc = head_request(orig)
            info['status'] = code
            info['location'] = loc
        mappings.append(info)

    for m in mappings:
        line = f"{m['file']}: {m['original']} -> {m['target']}"
        if test:
            line += f" | status={m.get('status')} location={m.get('location')}"
        print(line)

if __name__ == '__main__':
    p = argparse.ArgumentParser(description='List .html URLs and expected clean targets; optional HEAD test')
    p.add_argument('--test', action='store_true', help='Perform HEAD requests against original URLs')
    args = p.parse_args()
    main(test=args.test)
