@echo off
echo Running Prisma Generate with elevated permissions...

powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"cd %cd% && npx prisma generate\"' -Verb RunAs"

echo Script completed.
pause
