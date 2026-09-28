# Database Layer — Metaphrase AI

This directory contains the database persistence layer, migration scripts, connection handlers, and SQLite data stores for Metaphrase AI.

## Directory Structure
- `database.py`: Core database operations, connection pooling with context management, password salting/hashing (bcrypt), and query functions.
- `__init__.py`: Package initialization exporting all public database utilities.
- `schema.sql`: Full DDL specification of tables and indexing structures.
- `metaphrase_app.db`: SQLite database file with WAL (Write-Ahead Logging) enabled.

## Tables
1. **`users`**: Authentication credentials, roles (`admin`, `user`), activity timestamps, and approval statuses.
2. **`history`**: Audit trail of text transformations, original inputs, paraphrased outputs, tone profiles, and timestamps.
3. **`personas`**: User-defined custom prompt personas with instructions and icons.
4. **`activity_logs`**: Feature usage tracking, analytics, and word count statistics.
