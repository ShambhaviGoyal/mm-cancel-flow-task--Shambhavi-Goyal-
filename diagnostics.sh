#!/usr/bin/env bash
set -euo pipefail

echo "## Versions"
node -v || true
npm -v || true
npx next --version || true

echo
echo "## Env (.env.local – redacted service key length only)"
if [[ -f .env.local ]]; then
  URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' .env.local || true)
  KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | sed 's/=.*/=(redacted)/' || true)
  MOCK=$(grep '^MOCK_USER_ID=' .env.local || true)
  echo "$URL"
  echo "$KEY"
  echo "$MOCK"
else
  echo "No .env.local present"
fi

echo
echo "## Important files present?"
ls -1A | sed -n '1,200p'
echo
for f in package.json tsconfig.json next.config.* app pages lib components prisma supabase public; do
  if [[ -e "$f" ]]; then echo " - found $f"; fi
done

echo
echo "## package.json"
sed -n '1,200p' package.json || true

echo
echo "## tsconfig.json"
sed -n '1,200p' tsconfig.json || true

echo
echo "## next.config.*"
( sed -n '1,200p' next.config.ts 2>/dev/null || sed -n '1,200p' next.config.js 2>/dev/null ) || true

echo
echo "## Check for common Edge runtime gotchas (Node APIs in edge routes)"
grep -R --line-number --include='route.ts' -e 'randomInt' -e "server-only" -e 'cookies(' app 2>/dev/null || true
grep -R --line-number --include='route.ts' -e 'export const runtime' app 2>/dev/null || true

echo
echo "## Supabase admin client usage"
grep -R --line-number -e 'createClient' lib 2>/dev/null || true

echo
echo "## Typecheck"
npx tsc -p . || true

echo
echo "## Lint"
npm run lint || true

echo
echo "## Build"
npm run build || true
