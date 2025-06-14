@echo off
echo Setting up PostgreSQL database...

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from https://www.postgresql.org/download/windows/
    exit /b 1
)

REM Run the setup script
psql -U postgres -f setup-db.sql

if %ERRORLEVEL% neq 0 (
    echo Failed to set up database
    exit /b 1
)

echo Database setup completed successfully! 