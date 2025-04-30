@echo off
echo ===============================
echo 🛠️  Iniciando build del proyecto...
echo ===============================
npm run build

echo.
echo ===============================
echo ✅ Añadiendo archivos al repositorio...
echo ===============================
git add .

set /p MSG="📝 Ingresa el mensaje del commit: "
git commit -m "%MSG%"

echo.
echo ===============================
echo 🚀 Subiendo cambios al repositorio remoto...
echo ===============================
git push

echo.
echo ===============================
echo 🌐 Desplegando en GitHub Pages...
echo ===============================
npm run deploy

echo.
echo ===============================
echo ✅ Proceso completo. ¡Publicación exitosa!
echo ===============================
pause
