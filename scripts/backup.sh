
#!/usr/bin/env bash
set -Eeuo pipefail

# Blinkr backup configuration
SOURCE="$HOME/Desktop/Blinkr-Website"
BACKUP_ROOT="$HOME/Backups/Blinkr-Website"
TIMESTAMP="$(date +'%Y-%m-%d_%H-%M-%S')"
DESTINATION="$BACKUP_ROOT/Blinkr-Website_$TIMESTAMP"

# Verify the source project exists
if [[ ! -d "$SOURCE" ]]; then
    echo "ERROR: Blinkr project not found: $SOURCE"
    exit 1
fi

# Verify rsync is installed
if ! command -v rsync >/dev/null 2>&1; then
    echo "ERROR: rsync is not installed."
    echo "Install it with: sudo apt install rsync"
    exit 1
fi

# Create a separate backup for this run
mkdir -p "$BACKUP_ROOT"

if [[ -e "$DESTINATION" ]]; then
    echo "ERROR: Backup destination already exists: $DESTINATION"
    exit 1
fi

mkdir "$DESTINATION"

echo "Starting Blinkr backup..."
echo "Source:      $SOURCE"
echo "Destination: $DESTINATION"
echo

# Copy the project, preserving hidden files and permissions.
# node_modules is excluded because it can be regenerated.
if rsync -a \
    --human-readable \
    --info=progress2 \
    --exclude='node_modules/' \
    "$SOURCE/" "$DESTINATION/"; \
    bash scripts/codebase.sh; then
    echo
    echo "SUCCESS: Blinkr backup completed!"
    echo "Location: $DESTINATION"
else
    echo
    echo "ERROR: Backup failed. Check the destination before retrying."
    exit 1
fi