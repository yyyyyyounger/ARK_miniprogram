echo "--------------------- Update to Github ---------------------" 
echo " "
# 修改成自己的信息
git config --global user.name "yyyyyyounger"
git config --global user.email "1049825685@qq.com"

git add -A

git commit -m "上線小功能頁"

git push origin dev
git push local dev

echo " "
echo "The program has finished ~"
echo " "
read -p "Press \"Enter\" to End"

# merge流程：
# git checkout -b newBranchName
# 修改完後
# git add -A
# git commit -m "備註"
# git checkout master/dev 
# git merge newBranchName

# Token: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
# https://TOKEN:x-oauth-basic@github.com/yyyyyyounger/xxxxxx/xxxx.git
# curl https://api.github.com/?access_token=YourToken