@echo off
setlocal
cd /d "%~dp0"

set PORT=5500

echo Starting local server in: %cd%
echo URL: http://localhost:%PORT%/html/index.html
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/html/index.html"
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/html/index.html"
  python -m http.server %PORT%
  goto :eof
)

echo Python not found.
pause
