# ARK_Developing_version

## 項目文件目錄結構說明

 - 開發中：
   - 註冊頁
   - ARK協議頁
   - 主頁
   - 其他頁

 - 已完成(完成度較高):
   - user頁
   - user頁的編輯個人信息頁


## 頁面查看說明
在根目錄 `/ARK` (默認)的 `app.json` 中切換 `pages` 的路徑順序即可查看效果。

**注意：** 某些功能必須在某個頁面載入才能發生，例如想測試個人信息更新時直接打開 `editPage` ，和在 `user` 頁中打開 `editPage` 有所不同，正常使用邏輯應在 `個人頁` 中點選進入 `編輯頁` 。

## 開發者備註
若要達到某些組件的效果需要引入 WeUI