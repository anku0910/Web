@echo off
echo Deploying React app to GitHub Pages...

REM 切換到專案資料夾（如果你要讓這個檔案可以放在其他位置，請自行修改 cd 指令）
cd /d %~dp0

REM 確保已經安裝依賴
echo Installing dependencies...
npm install

REM 執行部署
echo Running deploy script...
npm run deploy

echo.
echo Done! Check https://anku0910.github.io after a few seconds.
pause
