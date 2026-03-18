@echo off
REM Start Sneakr.lab Django Backend Server
cd /d "%~dp0backend"
cmd /k python manage.py runserver
