"""Compare skill entrypoints in the supplied directories."""
import argparse
import hashlib
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("roots", nargs="+", type=Path)
entries = {}
for root in parser.parse_args().roots:
    if not root.is_dir():
        parser.error(f"Missing directory: {root}")
    for path in sorted(root.glob("*/SKILL.md")):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        entries.setdefault(path.parent.name, {})[path.resolve()] = digest
for name, copies in sorted(entries.items()):
    state = "single" if len(copies) == 1 else "identical"
    if len(set(copies.values())) > 1:
        state = "different"
    print(f"{name}: {state}")
    for path, digest in copies.items():
        print(f"  {digest}  {path}")
