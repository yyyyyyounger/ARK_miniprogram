echo "--------------------- Update to Github ---------------------" 
echo " "
# 修改成自己的信息
git config --global user.name "yyyyyyounger"
git config --global user.email "1049825685@qq.com"


git add -f -A

git commit -m "update"

git push -f origin dev

echo " "
echo "The program has finished ~"
echo " "
read -p "Press \"Enter\" to End"