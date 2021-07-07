# ARK_Developing_version

## 項目文件目錄結構說明

 - 開發中：
   - ARK協議頁（等後端發力
   - 主頁
   

 - 已完成(完成度較高):
   - user頁 & 個人信息編輯mode & 註冊
   - 其他頁


## 頁面查看說明
在根目錄 `/ARK` (默認)的 `app.json` 中切換 `pages` 的路徑順序即可查看效果。

**注意：** 某些功能必須在某個頁面載入才能發生，例如想測試個人信息更新時直接打開 `editPage` ，和在 `user` 頁中打開 `editPage` 有所不同，正常使用邏輯應在 `個人頁` 中點選進入 `編輯頁` 。

## 開發者備註
 - 若要達到某些組件的效果需要引入 WeUI
 - 參考“通過Github託管代碼.docx”教程，用於在github託管代碼

## 開發日誌
#### 2021-6-23
對editPage.js寫入了保留上次輸入的邏輯，便於用戶修改。


#### 2021-6-24
input輸入框增加了一鍵清除按鈕。

**已知bug：** 一鍵清除按鈕的樣式有bug，邏輯已實現。


#### 2021-6-25
6-23的bug已解決，開始進行index頁的編寫，完善了部分交互體驗。完成功能：“剩餘多少天、已過多少天”。


#### 2021-6-26
新增了許多頁面結構，等待寫好的其他人寫好頁面進行整合。


#### 2021-6-27
為user頁增加了progress顯示，完善了部分計日期的算法。添加了全局下拉動作，某些頁面配置了下拉刷新(調用onLoad)。

<!-- **已知bug：**  -->


#### 2021-6-28
新增了些花里胡哨的東西（動畫）。


#### 2021-7-1
對user頁的微信登錄邏輯進行修改。


#### 2021-7-2
在寫註冊邏輯。轉戰Vant組件庫。

**已知bug：** 用戶會有多種操作狀態，需要一一列舉，畫出狀態機才能繼續編程。


#### 2021-7-3
究極大重寫，界面好看了不少。



#### 2021-7-4
發現js的究極特性！！！使用下方代碼才能好好複製數組！！而使用`let`、`var`、`setData`變量`a` = 變量`b`都只是引用變量`b`，本質上數據互相綁定。
    
    var b = JSON.parse(JSON.stringify(數組a));  //複製一份數組a的數據到數組b



#### 2021-7-5
對頁面做了一些美化，指定了課程數據的格式。詳見`根目錄/data/cloudData_Course.js`。
有空更新Vant！！！！根目錄下運行：

    npm i @vant/weapp -S --production




#### 2021-7-6
開始製作 /pages/category 所有課程頁。


#### 2021-7-7
嘗試使用雲服務繞過HTTPS合法域名檢測，參考blog：https://developers.weixin.qq.com/community/develop/doc/000c82801a45e8ca18c7e8fba51800 。