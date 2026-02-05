#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PACKAGE_JSON="$ROOT_DIR/package.json"
CARGO_TOML="$ROOT_DIR/src-tauri/Cargo.toml"
TAURI_CONF="$ROOT_DIR/src-tauri/tauri.conf.json"

# Extract current version from package.json
current_version=$(grep -m1 '"version"' "$PACKAGE_JSON" | sed 's/.*"version": *"\([^"]*\)".*/\1/')

usage() {
  cat <<EOF
Usage: $(basename "$0") <major|minor|patch|VERSION>

Bump the version across all project config files.

  major        Bump major version (e.g. 0.1.1 -> 1.0.0)
  minor        Bump minor version (e.g. 0.1.1 -> 0.2.0)
  patch        Bump patch version (e.g. 0.1.1 -> 0.1.2)
  VERSION      Set an explicit version (e.g. 2.0.0)

Current version: $current_version

Options:
  -h, --help   Show this help message
  --tag        Create a git commit and tag after bumping
EOF
  exit 0
}

# Parse flags
CREATE_TAG=false
POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    -h|--help) usage ;;
    --tag) CREATE_TAG=true ;;
    *) POSITIONAL+=("$arg") ;;
  esac
done

if [ ${#POSITIONAL[@]} -ne 1 ]; then
  echo "Error: exactly one version argument required."
  echo ""
  usage
fi

BUMP="${POSITIONAL[0]}"

IFS='.' read -r major minor patch <<< "$current_version"

case "$BUMP" in
  major) new_version="$((major + 1)).0.0" ;;
  minor) new_version="$major.$((minor + 1)).0" ;;
  patch) new_version="$major.$minor.$((patch + 1))" ;;
  *)
    if [[ ! "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "Error: invalid version '$BUMP'. Must be 'major', 'minor', 'patch', or a semver like X.Y.Z."
      exit 1
    fi
    new_version="$BUMP"
    ;;
esac

echo "Bumping version: $current_version -> $new_version"
echo ""

# Update package.json
sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" "$PACKAGE_JSON"
echo "  Updated package.json"

# Update Cargo.toml (only the [package] version, not dependency versions)
sed -i '' "s/^version = \"$current_version\"/version = \"$new_version\"/" "$CARGO_TOML"
echo "  Updated src-tauri/Cargo.toml"

# Update tauri.conf.json
sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" "$TAURI_CONF"
echo "  Updated src-tauri/tauri.conf.json"

echo ""
echo "Version bumped to $new_version"

if [ "$CREATE_TAG" = true ]; then
  echo ""
  cd "$ROOT_DIR"
  git add "$PACKAGE_JSON" "$CARGO_TOML" "$TAURI_CONF"
  git commit -m "release: prepare for v$new_version release"
  git tag "v$new_version"
  echo "Created commit and tag v$new_version"
fi
