echo 'Production buid would take 20-30 min, depending on your system & network configuration'
./install-prod-deps.sh
#building server 
cd ./../server/
echo 'Part 3/4: Building server for prod mode, it would taks few minutes please wait...'
npm run build-prod
#building client
cd ./../client/
echo 'Part 4/4: Building client for prod mode, it would taks few minutes please wait...'
npm run build-prod
echo "Congratulations, the build is done, now you can run ./start.sh to start the server"
