#!/bin/bash
echo "🇦🇹 Keren Hajessod Österreich — Deployment"
echo "==========================================="
npm install
npx vercel deploy --prod --yes
echo ""
echo "✅ Done! Die URL oben ist deine Live-Seite."
