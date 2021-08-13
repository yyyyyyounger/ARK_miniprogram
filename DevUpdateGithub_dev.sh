echo "--------------------- Update to Github ---------------------" 
echo " "
# 修改成自己的信息
git config --global user.name "yyyyyyounger"
git config --global user.email "1049825685@qq.com"


git add -f -A

git commit -m "修復刪除課程頁bug、遞歸法多文件上傳已實現，明天完善數據庫互動和展示邏輯。"

git push -f origin dev
git push -f local dev

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