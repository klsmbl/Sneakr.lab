@echo off
REM Start all Sneakr.lab services in separate terminal windows
set ROOT=%~dp0

start "Sneakr Frontend" cmd /k "cd /d "%ROOT%frontend" && npm install && npm start"
start "Sneakr Node API" cmd /k "cd /d "%ROOT%server" && npm install && npm start"
start "Sneakr Django TryOn" cmd /k "cd /d "%ROOT%backend" && set GOOGLE_APPLICATION_CREDENTIALS=..\service-account.json && python manage.py runserver"

echo Started: Frontend (3000), Node API (3001), Django TryOn (8000)