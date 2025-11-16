#!/bin/bash

# Automation Ecosystem - Database Backup Script
# This script creates automated backups of the MySQL database
# Usage: ./scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/backups"
DB_HOST="mysql"
DB_NAME="automation_ecosystem"
DB_USER="automation_user"
DB_PASS="secure_password"
RETENTION_DAYS=30
S3_BUCKET="${S3_BACKUP_BUCKET:-automation-ecosystem-backups}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/automation_ecosystem_${TIMESTAMP}.sql"

echo "🔄 Starting database backup at $(date)"

# Create database backup
echo "📊 Creating MySQL backup..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --add-drop-table \
  --create-options \
  --disable-keys \
  --extended-insert \
  --lock-tables=false \
  --quick \
  --set-charset \
  "$DB_NAME" > "$BACKUP_FILE"

# Compress the backup
echo "🗜️ Compressing backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully: $BACKUP_FILE ($BACKUP_SIZE)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Upload to S3 if configured
if [ ! -z "$S3_BUCKET" ]; then
    echo "☁️ Uploading to S3..."
    aws s3 cp "$BACKUP_FILE" "s3://${S3_BUCKET}/database/$(basename "$BACKUP_FILE")"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup uploaded to S3 successfully"
    else
        echo "⚠️ Failed to upload to S3, backup remains local"
    fi
fi

# Cleanup old backups (keep last 30 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "automation_ecosystem_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# List current backups
echo "📋 Current backups:"
ls -lah "$BACKUP_DIR"/automation_ecosystem_*.sql.gz | tail -5

# Backup metrics
TOTAL_BACKUPS=$(ls -1 "$BACKUP_DIR"/automation_ecosystem_*.sql.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR"/automation_ecosystem_*.sql.gz 2>/dev/null | awk '{sum += $1} END {print sum "M"}')

echo "📊 Backup Summary:"
echo "   • Total backups: $TOTAL_BACKUPS"
echo "   • Total size: $TOTAL_SIZE"
echo "   • Latest backup: $(basename "$BACKUP_FILE")"
echo "   • Retention: $RETENTION_DAYS days"

# Send notification (if webhook configured)
if [ ! -z "$BACKUP_WEBHOOK_URL" ]; then
    echo "📨 Sending backup notification..."
    curl -X POST "$BACKUP_WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"event\": \"backup_completed\",
        \"file\": \"$(basename "$BACKUP_FILE")\",
        \"size\": \"$BACKUP_SIZE\",
        \"status\": \"success\",
        \"timestamp\": \"$(date -Iseconds)\"
      }" || echo "⚠️ Failed to send notification"
fi

echo "🎉 Backup process completed at $(date)"