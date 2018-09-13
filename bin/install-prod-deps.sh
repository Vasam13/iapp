cd ./../server
echo 'Part 1/4: Installing server dependencies, it would take few minutes please wait...'
npm install  --only=production
cd ./../client/
echo 'Part 2/4: Installing Client dependencies, it would take few minutes please wait...'
npm install  --only=production
echo 'Installing dependencies completed, now run ./build-prod.sh'