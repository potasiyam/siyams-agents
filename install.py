"""Copy portable skills or named Markdown agents into a harness directory."""
import argparse
from pathlib import Path

SOURCE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skills-dir", type=Path, help="destination for skill folders")
    parser.add_argument("--agents-dir", type=Path, help="destination for Markdown agents")
    args = parser.parse_args()
    if not (args.skills_dir or args.agents_dir):
        parser.error("choose --skills-dir, --agents-dir, or both")

    pending = []
    for name, directory in [("skills", args.skills_dir), ("agents", args.agents_dir)]:
        if directory is None:
            continue
        root = directory.expanduser().resolve()
        for source in sorted((SOURCE / name).rglob("*")):
            if not source.is_file():
                continue
            target = root / source.relative_to(SOURCE / name)
            if target.resolve() != target:
                parser.error(f"destination contains a symbolic link: {target}")
            if target.is_file() and source.read_bytes() == target.read_bytes():
                continue
            if target.exists():
                parser.error(f"existing file differs: {target}")
            for parent in target.parents:
                if parent.exists() and not parent.is_dir():
                    parser.error(f"expected a directory: {parent}")
            pending.append((source, target))

    for source, target in pending:
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("xb") as output:
            output.write(source.read_bytes())
    print(f"Installed {len(pending)} new files.")


if __name__ == "__main__":
    main()
