echo "--------------------- Update to Github ---------------------" 
echo " "

git add -f -A

git commit -m "update"

git push -f origin master

echo " "
echo "The program has finished ~"
echo " "
read -p "Press \"Enter\" to End"