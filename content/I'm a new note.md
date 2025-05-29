#deploy #test #moby-dick 


with OG Cranford Alfred:











cd /Users/heatherordover/quartz

echo "🧹 Deep cleaning CURRENT-Book folder..."
rm -rf CURRENT-Book
cp -R ~/vaults/CURRENT-Book ./CURRENT-Book

echo "🔍 Checking for contentDir in config..."
grep contentDir quartz.config.ts

echo "🧼 Removing old public folder..."
rm -rf public

echo "⚙️ Running Quartz build..."
/usr/local/opt/node@20/bin/npx quartz build

git add .
git commit -m "Clean sync and deploy from CURRENT-Book"
git push

osascript -e 'display notification "Deployed to GitHub + Netlify!" with title "CraftLit Cranford Site"'

curl -X POST -d '{}' https://api.netlify.com/build_hooks/67fd75bc013093007bf7cf3c





and this is Moby's
















cd ~/moby-quartz

echo "📂 Cleaning old public folder..."
rm -rf public

echo "🔧 Running Quartz build..."
/usr/local/opt/node@20/bin/npx quartz build

git add .
git commit --allow-empty -m "Trigger Netlify deploy from Alfred for MOBY"
git push

osascript -e 'display notification "Deployed to GitHub + Netlify!" with title "CraftLit Moby Site"'

# Trigger Netlify build webhook
curl -X POST -d '{}' https://api.netlify.com/build_hooks/67fd75bc013093007b7fcf3c