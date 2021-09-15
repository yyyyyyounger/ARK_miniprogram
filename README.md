# ARK Develop log

## 項目文件目錄結構說明
可前往`備註/協同開發.md`查看項目目錄簡介。

## 開發者備註
 - 使用 `Vant` 作為組件庫。[傳送門][1]
 - 使用 `ColorUI` 作為樣式庫。[傳送門][2] [Github Page][3]
 - master分支暫未使用，dev分支為最新庫

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
嘗試使用雲服務繞過HTTPS合法域名檢測，參考blog：~~https://developers.weixin.qq.com/community/develop/doc/000c82801a45e8ca18c7e8fba51800~~ 。
~~失敗~~


#### 2021-7-9
成功實現Markdown在小程序的渲染。
關鍵實現：使用 `` 符號 ` `` 括住markdown，進行無視空格的引用。然後匯入變量。
小程序使用towxml作為markdown組件庫解析渲染，該組件庫還有html渲染模式！
詳情前往 ``pages/protocol/`` 查看具體實現！
1.0.4體驗版，苦惱課程頁表現形式中...


#### 2021-7-10
對`新增課程頁面`配置了樣式和Date、Time選擇器 - 未完成。還有一些自動的細節需要改善，選填部分未完成。


#### 2021-7-11
已整合有http請求返回功能的雲函數 by Kalo。
正在進行課程頁的數據處理，是個龐大的工程。。


#### 2021-7-12
編寫course的follow狀態切換功能中...。


#### 2021-7-15
休息幾天後再度開戰。今天進行了總的ARK小程序團隊討論。
雲函數 & 數據庫使用流程：

  1. **必須：** 建議在 `app.js` 的 `OnLaunch()` 中調用
```
  wx.cloud.init({
    env: '當前雲開發環境id例如cloud1-xxxxxxxxx'
  })
```
已經實現獲取用戶openid和儲存用戶頭像、暱稱等信息於雲數據庫。


#### 2021-7-16
思考用戶與雲端的交互邏輯中，如何更小地進行讀、寫操作？
探索雲開發、Promise特性中。。。挖坑。


#### 2021-7-19
已掌握Promise基本用法和適用處。使用orderBy實現按 `升序asc / 降序desc` 排列某集合的記錄，使用時多加上 `field(控制只顯示某條字段的記錄)` 或 `limit(控制顯示多少記錄)` 。


#### 2021-7-20
user頁與數據庫互動基本完成。
**已知bug：** 修改數據時的相同數據判定有bug，推測是app的數據沒有合理更新，準備使用緩存。


#### 2021-7-22
按照凱哥的建議對部分樣式進行了修改。


#### 2021-7-23
更新了README.md，**對目前的程序結構寫了新說明，放在 `/備註/協同開發.md` 上。**


#### 2021-7-25
寫好了添加helper的邏輯。**但沒加前端的輔助提示。**


#### 2021-7-26
我要開課頁完成與數據庫的綁定，添加了頁面的提示邏輯和跳轉。**待修改：開啟小程序必定會清緩存的bug。**


#### 2021-7-27
新增日期投票模式下的時間段設置。優化了一些視覺和交互小細節。**待添加輸入校驗，修改了timePicker的數據格式還未進行校驗**


#### 2021-7-28
對user頁添加了骨架屏加載效果，體驗一級棒！
究極優化的生成對象算法！But單個設定/渲染時適用對象形式數據，for循環時適用數組數據操作。
```
  let shortNameIndex={};
  this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
    shortNameIndex[e.shortName] = e.id;
  });
```


#### 2021-7-29
製作課程詳情頁中。。。稍有頭緒，仍在試探。今天還修了幾個bug。


#### 2021-7-30
新增管理員權限下可以編輯課程的edit和display參數。沒有什麼大改動，還有半個月要上線，焦慮。


#### 2021-7-31
轉眼已經7月最後一天，，，課程数据新增使用時間戳表示所選時間，方便比較出最新的課程。
8.1計劃：完成課程詳情頁，follow按鈕邏輯。


#### 2021-8-1
follow按鈕邏輯大致完成，差訂閱的邏輯。
8.2計劃：完成課程詳情頁。


#### 2021-8-2
麼都冇做，看re0去了😁。為了放鬆~~摸魚~~一下，明天開干。


#### 2021-8-3
與凱哥進行課程詳情頁的設計中。


#### 2021-8-3
與凱哥進行課程詳情頁的設計中。


#### 2021-8-4
完成了基本的頁面帶參跳轉邏輯，明天計劃：主頁顯示Follow的課程。


#### 2021-8-5
增加了一些場景下的提示。明天計劃：對已過期的課程添加禁止操作，並提示刷新再試。


#### 2021-8-6
因為開發課程頁中發現存在很多權限、邏輯的問題，正在起草關於課程的邏輯結構。新增了跳轉選咩課和打開客服消息。明天計劃：完善課程的邏輯結構。


#### 2021-8-7
今天修改了user頁的某些顯示。明天計劃：從開課頁開始，梳理好所有的課程邏輯。


#### 2021-8-8
今天修改了user頁註冊邏輯，現在必須看完協議頁才可以通過註冊。明天計劃：開始寫開課頁的邏輯。


#### 2021-8-9
course集合的_id改為num類型。用於索引、排序。目前發現一切正常。明天計劃：課程詳情頁、開課頁轉編輯頁（獲取已寫入的數據）、admin轉courseState為opening。所有課程頁可以單獨製作。


#### 2021-8-10
已完成課程opening狀態下修改課程信息。明天計劃：從開課頁580行開始繼續刪除課程的邏輯。


#### 2021-8-11
所有課程頁：數據庫負責返回分類，本地負責排序。明天計劃：課程頁-最新發佈顯示講者checking狀態的課。


#### 2021-8-12
Box大佬修改了課程頁的樣式。明天計劃：解決user的majorTag問題和course的tag問題。完成文件上傳邏輯。完成郵件發送功能。


#### 2021-8-13
已實現多個文件上傳雲儲存、user註冊時的majorTag。明天計劃：解決course的tag問題。完成文件上傳邏輯。完成郵件發送功能。


#### 2021-8-14
courseTag目前版本默認只添加用戶的majorTag，但仍留有2個tag位等待後續開發。完成編輯頁文件上傳邏輯。明天計劃：編輯頁文件刪除邏輯。詳情頁文件顯示、下載邏輯。郵件發送功能


#### 2021-8-15
完成文件上傳邏輯。明天計劃：編輯頁文件刪除邏輯。詳情頁文件顯示、下載邏輯。郵件發送功能。


#### 2021-8-16
完成文件刪除邏輯。完成結課邏輯(用戶體驗問題，結課後刪除recentFollowId後，我的follow消失)。明天計劃：課程詳情頁文件下載邏輯。郵件發送功能。


#### 2021-8-17
暑假最後一更。完成文件下載邏輯。修復了一部分bug。明天計劃：郵件發送功能、課程頁刷新邏輯、簽到功能。


#### 2021-8-18
已實現郵件發送功能，待整合進開課頁邏輯。已完善課程頁刷新邏輯。明天計劃：簽到功能、管理者查看checking權限。


#### 2021-8-19
已實現課程頁管理者查看checking權限。
寫了非常多課程詳情頁簽到的邏輯，已經完成雲函數功能，明天把wxml寫好就可以了。BUG察覺：設定密碼如果為字母形式會出bug。


#### 2021-8-20
提上日程：
1 √ 結課的雲函數加上為參與者和舉辦者計算參與、舉辦記錄。
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 各種提示
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
已將簽到邏輯放入結構內。明天計劃：完成簽到邏輯wxml的樣式。


#### 2021-8-22
摸魚一天，已寫好課程詳情頁的wxml展示形式，目前邏輯為文件也需要簽到後獲取，用戶可以在課程尚未結束前、課程開始前十五分鐘開始簽到。


#### 2021-8-23
修改update和delete courseInfo的雲函數功能中。**delete雲文件出現故障**，待修改！
**新增代辦**：已存在簽到列表才可以結課，否則提示不能，在hold.js的777行。
**提上日程**：
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 各種提示
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
已將簽到邏輯放入結構內。明天計劃：完成簽到邏輯wxml的樣式。


#### 2021-8-24
已完成刪除課程的雲函數功能。今天還成功請求回澳大巴士報站的數據，神奇的本地請求竟然在真機測試成功。
**提上日程**：
1 **BUG**已存在簽到列表才可以結課，否則會提示不能，在hold.js的773行。
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 各種提示
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
已將簽到邏輯放入結構內。明天計劃：完成簽到邏輯wxml的樣式。


#### 2021-8-26
寫了一下工作日誌，修改了首頁的輪播圖。
**提上日程**：
1 **BUG**已存在簽到列表才可以結課，否則會提示不能，在hold.js的773行。
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 檢查提示是否足夠
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
已將簽到邏輯放入結構內。明天計劃：完成簽到邏輯wxml的樣式。


#### 2021-8-27
修改了簽到邏輯，有人follow且有人簽到才可以結課。
**提上日程**：
1 **BUG察覺**進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時再拉取一次最新數據。
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 檢查提示是否足夠
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
已將簽到邏輯放入結構內。明天計劃：完成簽到邏輯wxml的樣式。


#### 2021-8-28
優化了用戶頁的載入速度。
已準備好開課頁wxml的dialog彈出層。
修改了用戶頁Cell樣式，更往中間靠攏。
新增課程頁引導用戶點擊進入詳情頁。
修改了一言的樣式，更具文藝范。
增加了課程頁可點擊範圍。
**提上日程**：
1 **BUG察覺**進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時再拉取一次最新數據。
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 檢查提示是否足夠
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖


#### 2021-8-29
已整合新小功能頁佈局，但雲函數的npm模塊可能出bug。
反饋頁加入引導教程。
詳情頁新增用戶頭像跳轉詳情信息。
**提上日程**：
1 **BUG察覺**進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時再拉取一次最新數據。
1x 小功能頁真機無法顯示icon的圖片
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
6 檢查提示是否足夠
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
10 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）

#### 2021-8-31
8月最後一更，新增主頁的Q&A。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時再拉取一次最新數據。
**BUG** 小功能頁真機無法顯示icon的圖片
**BUG** 巴士報站未整合為雲函數請求
2 訂閱功能，先做預約工具類的訂閱。
3 開課前的郵箱驗證
4 第一次進入小程序的操作介紹
5 關於頁的介紹
7 邀請曾開過ARK的講者，復原歷史ARK
8 ARK Logo
9 宣傳圖
10 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）


#### 2021-9-2
完成開課前郵箱驗證邏輯。
Toast.loading狀態下設置duration : 0,可以提升延時效率。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時再拉取一次最新數據。
**BUG** 小功能頁真機無法顯示icon的圖片
**BUG** 巴士報站未整合為雲函數請求
**BUG** 更多頁學會輪播圖實機遮擋bug
1 訂閱功能，先做預約工具類的訂閱。
2 第一次進入小程序的操作介紹
3 關於頁的介紹
4 邀請曾開過ARK的講者，復原歷史ARK
5 ARK Logo
6 宣傳圖
7 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度


#### 2021-9-3
小功能頁icon替換順序。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 更多頁學會輪播圖實機遮擋bug
1 訂閱功能，先做預約工具類的訂閱。
2 第一次進入小程序的操作介紹
3 關於頁的介紹
4 邀請曾開過ARK的講者，復原歷史ARK
5 ARK Logo
6 宣傳圖
7 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度


#### 2021-9-4
定時推送訂閱成功。正在設計完整的訂閱邏輯。
明天計劃：完成課程即將開始推送訂閱功能。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 更多頁學會輪播圖實機遮擋bug
1 訂閱功能，先做預約工具類的訂閱。
2 第一次進入小程序的操作介紹
3 關於頁的介紹
4 邀請曾開過ARK的講者，復原歷史ARK
5 ARK Logo
6 宣傳圖
7 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度


#### 2021-9-5
新版更多頁和關於頁上線 by 凱哥。凱哥還寫了小船動畫
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
1 訂閱功能，先做預約工具類的訂閱。
2 邀請曾開過ARK的講者，復原歷史ARK
3 ARK Logo
4 宣傳圖
5 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度
5 第一次進入小程序的操作介紹


#### 2021-9-6
test頁完成15min檢查課程狀態的主要邏輯，準備進入推送環節。
明天計劃：完成課程即將開始推送訂閱功能。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
1 訂閱功能，先做預約工具類的訂閱。
2 邀請曾開過ARK的講者，復原歷史ARK
3 ARK Logo
4 宣傳圖
5 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度
5 第一次進入小程序的操作介紹


#### 2021-9-7
修改了主頁小船動畫觸發機制。修改了主頁QA交互機制。
**提上日程**：
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
1 訂閱功能，先做預約工具類的訂閱。
2 邀請曾開過ARK的講者，復原歷史ARK
3 ARK Logo
4 宣傳圖
5 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
6 checking和opening不夠明白。
7 結課說明不清晰
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 圖片更換為雲儲存id提升速度
5 第一次進入小程序的操作介紹
6 距離今天最近的假期


#### 2021-9-8
修復： 課程頁 - 歸檔、我要開課 分欄，下拉刷新不斷加載bug；
課程頁奇怪的不能follow的bug；
修改了user頁的加載結構，提速。
更新了課程頁，我要開課欄目的教程說明。
增加了個性化的Toast提示。
修改了頁面說明。
建立了書院菜單頁。
修復課程詳情頁finish狀態課程仍能follow的bug。
訂閱成功發送。
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
**提上日程**：
1 訂閱功能，先做預約工具類的訂閱。
2 邀請曾開過ARK的講者，復原歷史ARK
3 ARK Logo
4 宣傳圖
5 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
6 結課按鈕擺到課程頁卡片上。
7 課程詳情頁分享出去的跳轉沒寫好。
8 發送訂閱的跳轉沒寫好。
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期


#### 2021-9-9
修復課程頁展示follower過長問題。
完成課程詳情頁轉發的卡片跳轉。
已完成訂閱卡片的跳轉和附帶正確信息。
修改了雲函數的使用內存，節省流量。
更新了隨處獲取用戶的訂閱邏輯。
**可能的BUG** 進入課程編輯後如果信息有更新，將不能同步。可能的辦法：提交修改時的updateLocalData前再拉取一次最新數據。or 進入編輯頁時再請求服務器。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 額外加文件mode無效
**提上日程**：
1 訂閱功能，先做預約工具類的訂閱。
2 邀請曾開過ARK的講者，復原歷史ARK
3 宣傳圖
4 主頁刷新時判斷recentFollow列表的課是否過期，過期的操作數據庫除去recentFollowIdArr。（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
5 結課按鈕擺到課程頁卡片上。
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期


#### 2021-9-11
完成觸發器邏輯！
課程頁改為獲取半年數據，後續可以添加下拉獲取更多，分批獲取。
用戶頁提速，修改雲返回major為本地獲取。
課程刪除邏輯測試完成。
已將followMember可能的不同步消除，改為雲函數最後更新。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 額外加文件mode無效
**BUG** 點擊推送的訂閱卡片跳轉，會來不及更新緩存信息，如需強制重新登錄，但跳轉後的畫面仍是登錄態
**提上日程**：
1 邀請曾開過ARK的講者，復原歷史ARK
2 宣傳圖
3 主頁刷新時判斷recentFollow列表的課是否過期，已結束超過一星期的課將在主頁隱藏。
在我的Follow欄目過期半年的課則操作數據庫除去recentFollowIdArr。
（思路：定義鏈式調用查詢recentFollowIdArray，then判斷過期與否進行刪除，then正常獲取邏輯）
4 結課按鈕擺到課程頁卡片上。
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期
6 設置一言的返回分類
7 課程頁數據分批獲取


#### 2021-9-12
主頁默認課程邏輯只獲取最多前15天內的課程展示結束。
修改了課程頁排序，finish置底。
增加其他專業分類。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 點擊推送的訂閱卡片跳轉，會來不及更新緩存信息，如需強制重新登錄，但跳轉後的畫面仍是登錄態
**提上日程**：
1 邀請曾開過ARK的講者，復原歷史ARK
2 宣傳圖
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期
6 設置一言的返回分類
7 課程頁數據分批獲取
8 使用雲函數看門狗，課程頁過期半年的課則操作數據庫除去recentFollowIdArr。（思路：判斷當前時間戳，超過半年的課且為finish時，搜索user集合recentFollowIdArr裡仍有該courseId的用戶，對其刪除。
9 ARK時間軸


#### 2021-9-13
巴士報站爬蟲數據整理完畢。
主頁follow分享列表取消顯示。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 點擊推送的訂閱卡片跳轉，會來不及更新緩存信息，如需強制重新登錄，但跳轉後的畫面仍是登錄態
**提上日程**：
1 邀請曾開過ARK的講者，復原歷史ARK
2 主頁恢復彈出層，未登錄放ARK介紹，登錄後不彈出
3 相關的功能按鈕需到主頁固定
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期
6 設置一言的返回分類
7 課程頁數據分批獲取
8 使用雲函數看門狗，課程頁過期半年的課則操作數據庫除去recentFollowIdArr。（思路：判斷當前時間戳，超過半年的課且為finish時，搜索user集合recentFollowIdArr裡仍有該courseId的用戶，對其刪除。
9 ARK時間軸


#### 2021-9-15
加入工程師學會的說明。
寫好主頁按鈕跳轉。
書院菜單模板。
未登錄用戶，展示ARK用途。
修改了主頁輪播圖。
添加一言的補充說明。
所有課程頁跳轉。
**BUG** 巴士報站未整合為雲函數請求
**BUG** 點擊推送的訂閱卡片跳轉，會來不及更新緩存信息，如需強制重新登錄，但跳轉後的畫面仍是登錄態
**提上日程**：
1 邀請曾開過ARK的講者，復原歷史ARK
2 相關的功能按鈕需到主頁固定
**Additional**
1 課程頁 - 歸檔記錄 - 所有課程 的排序
2 課程頁 - 歸檔記錄 - 參與記錄
3 課程頁 - 歸檔記錄 - 我的開課頁 搜索、排序等
4 第一次進入小程序的操作介紹 - （呼聲不大）
5 距離今天最近的假期
6 設置一言的返回分類
7 課程頁數據分批獲取
8 使用雲函數看門狗，課程頁過期半年的課則操作數據庫除去recentFollowIdArr。（思路：判斷當前時間戳，超過半年的課且為finish時，搜索user集合recentFollowIdArr裡仍有該courseId的用戶，對其刪除。
9 ARK時間軸



  [1]: https://youzan.github.io/vant-weapp/#/home
  [2]: http://demo.color-ui.com/
  [3]: https://github.com/weilanwl/ColorUI
