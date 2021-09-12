// 空數據模板
let userInfoInput_empty = [
  { id:0, name:"UM ID:",    shortName:"umId",         input:"未登入", display:true,   canEdit:true },
  { id:1, name:"姓名:",     shortName:"name",         input:"未登入", display:true,   canEdit:true },
  { id:2, name:"專業:",     shortName:"studentMajor", input:"未登入", display:true,   canEdit:true, majorTag:"", },
  { id:3, name:"年級:",     shortName:"studentYear",  input:"未登入", display:true,   canEdit:true },
  { id:4, name:"組織次數:", shortName:"holdTimes",    input:0,        display:true,   canEdit:false },
  { id:5, name:"參與次數:", shortName:"joinTimes",    input:0,        display:true,   canEdit:false },
  { id:6, name:"星級評分:", shortName:"stars",        input:0,        display:false,  canEdit:false },
  { id:7, name:"註冊時間:", shortName:"signUpTime",   input:"未登入",  display:true,  canEdit:false },
  { id:8, name:"ARKid:",   shortName:"arkId",        input:"未登入",  display:true,  canEdit:false },
  {       name:"isSignUp:", shortName:"isSignUp",    input: false, },
];
var courseInfo_empty = [
    { id:0, name:"分享编號", shortName:"courseId",       input:"None",                    canEdit:false,     display:false },  // 雲端給該課程分配的編號
    { id:1, name:"分享主題", shortName:"courseName",     input:"None",                    canEdit:true,      display:true },   // 講者設定的主體
    { id:2, name:"分享內容", shortName:"courseContent",  input:"None",                    canEdit:true,      display:true },   // 建設設定的課程詳細說明
    { id:3, name:"分享分類", shortName:"courseTag",      input:["None", "None", "None",], canEdit:true,      display:true },   // 設定標籤，便於搜索，例如ECEN、編程
    { id:4, name:"分享地址", shortName:"courseAdres",    input:"None",                    canEdit:true,      display:true },   // 講者設定的課程地址
    { id:5, name:"分享時間", shortName:"courseTime",     input:["None", "None","None",],  canEdit:true,      display:true },   // 講者設定的課程舉辦時間，input[0]為date，input[1]為timeBegin，input[2]為timeEnd
    { id:6, name:"講師",     shortName:"speakerName",    input:"None",                    canEdit:false,     display:true },   // 講者設定名稱(可編輯) 或 直接獲取講者的名稱(不可編輯)
    { id:7, name:"講師id",   shortName:"speakerid",      input:"None",                    canEdit:false,     display:true },   // 講者的ARKid或UMid
    { id:8, name:"助手",     shortName:"helper",         input:[],                        canEdit:false,     display:true  },   // 同上
    { id:9, name:"追蹤人數", shortName:"followers",      input:"None",                    canEdit:false,      display:true  },    // 該分享受追蹤的人數
    { id:10, name:"課程狀態", shortName:"courseState",   input:"None",                    canEdit:false,      display:true  },    // 可設定為 "預備中", "講課中", "已結束"
    { id:11, name:"課程星級", shortName:"courseStars",   input:"None",                    canEdit:false,      display:true  },    // 將影響講者星級
    { id:12, name:"簽到密碼", shortName:"attendCode",    input:"None",                    canEdit:true,       display:true },    // 簡明易了
];


// 完sem日服務器數據
var semFinishDay = '2022/01/05';
// 雲端可以定義顯示的專業選擇和專業
var studentYear = ["大一", "大二", "大三", "大四"];
var studentMajor = [  // 用作用戶修改信息時的彈出選擇。
  "ECE - 電機", 
  "CIS - 計算機", 
  "CEE - 土木", 
  "EME - 機電", 
  "MMA - 數學", 
  "PHC - 物理化學", 
  "ETC - 其他", 
];
let majorTagArray = studentMajor.map((e)=>{
  // bug風險：有專業是四位，當增加專業時需留意
  return e.substring(0,3);
})
// 学会数量 和 學會相关信息
var institutionNum = 2;
// 如果需要修改学会信息，只需要修改数组和上方institutionNum为学会数量即可
let institutionInfo = [
  {
    id      : 0,
    iconSrc : 'https://i0.hdslb.com/bfs/album/5e84ac5924085d3155846926da3f32c18bbb2049.jpg',
    name    : '電腦學會',
    info    : '&nbsp;&nbsp;澳門大學學生會電腦學會是以電腦為主題的學會，希望透過活動提升電腦系同學的歸屬感及團體精神。我們亦歡迎所有不同學系的同學，目的是透過舉辦工作坊、踏上IT第一步等等教授同學不同的電腦知識及認識電腦行業的前景。電競也是我們的主打之一，現時電競遊戲是一個十分熱門的話題，我們透過舉辦大大小小的比賽及交流活動等等，如最近所舉辦的澳大電競日從而推廣電競文化，讓不論是有接觸過電競與否的朋友也可以透過活動來認識電競及享受遊戲的樂趣。',
    bottomInfo  : `聯絡電郵：umsu.cps@umac.mo
    Facebook專頁 : 澳門大學學生會電腦學會
    Instagram: cps.umsu`,
  },
  {
    id      : 1,
    iconSrc : 'https://i0.hdslb.com/bfs/album/d572ee89fab0391368407851137867d92d58c084.jpg',
    name    : 'IET澳門學生支部',
    info    : '&nbsp;&nbsp;工程及科技學會是一個國際性的工程師學會，是一個能分享專業知識的專業平台以及向大家宣傳科學的正面訊息。工程及科技學會的總會設立於倫敦，在全球127個國家裏有超過150,000名會員。工程及科技學會分別在歐洲，北美對及香港等地方設立分會。工程及科技學會同時也能提供國際認可的專業證書。',
    bottomInfo  : `聯絡電郵 : umsu.iet@umac.mo
    Facebook專頁: The IET Hong Kong Students Section Macau`,
  },
];

// ARK協議 v2.0
const indexAnnouncement = 'ARK協議v2.0已發佈！點擊查看';
const ARK = 
`ARK 方舟活動 協議 2.0 ：
=================
----------

前言：
---
  制定本協議的目的是為了盡可能保證該活動能順利長久進行下去。在確認參與前請仔細閱讀本協議。
  本協議**與您在該活動中擔當的角色息息相關**，**若參與ARK方舟活動則視為已閱讀並願意遵守實行本協議**。
  若認為部分規則存在漏洞/過於強硬/不合理，可以提出討論修改。

----------


首要目標：
-----
 - 幫助同學總結、溫習課程內容，解決難題；
 - **鍛煉講者研究、準備、講解課題等能力**；
 - 營造良好的溝通氛圍；

次要目標：
-----
 - 令講者更熟悉所準備內容；
 - 督促同學不斷學習；
 - 保持系裡同學的良好溝通；

舉辦原因：
-----
 - 讓學習不那麼枯燥；    
 - 工程師專業與其他專業不同，需要更多的合作、交流、辯論等；
 - 教授日常講課潦草，每人吸收程度不同，每人時間精力有限，有機會能吸收認真總結出來的知識便最好；


總則：
---
 - 講者、聽者應認真對待每一次分享；
 - 分享內容不限，形式不限；
 - 希望 Top N 的同學應有更多次分享；
 - 我們由衷地希望作為聽者參與過分享活動的同學，在畢業前也能至少有一次分享；

細則：
---
 -每次分享只有講者視為舉辦ARK活動
 - 分享內容可包羅萬物，
  - 初階可以是課堂知識，
  - 進階可以是某些技巧/方法，
  - 高階可以是總結自己在某方面所學所得，
  - 更高階可以聯繫IET負責人準備workshop，
  - 講者應不斷嘗試向更高階的內容挑戰；
 - 講者準備的分享應盡力做到自己滿意、聽者滿意；（>=100%的認真）
 - 每次分享都應在不同地方上比上一次做得更好；（講解技巧、課件製作...）
 - 準備程度應到可以回答聽者問題、向聽者提出問題；
 - 一般會有兩位或以上Helper一齊解答；
 - 講者可由同學投票決定，但應順從講者當時意願；（除過於繁忙，可減少分享次數外，其他原由有待商酌）
  - 當自發/投票的講者不足時，將從參與過ARK卻未舉辦過ARK的人中抽籤決定講者；
 - 講者應將自己的分享視為鍛煉的機會而不是任務；
 - 每次分享準備階段，活動組織會向講者提供建議及幫助；

補充：
---
 - 周常：講者可準備上個星期所學的專業課內容（完全消化那一章節）；
    

流程：
---
 1、由活動組織/同學自發提出分享內容；
 2、活動組織/同學們一齊討論剛需程度/感興趣程度；
 3、立題後確定講者，由自發、投票、抽籤選出；
 4、活動組織者擬定/同學們一齊投票確定舉行日期；（可變）
 5、準備階段活動組織會向講者提供幫助；（技巧教學，製作建議，課程審核等）
 6、講者在小程序中開啟課程，聽者Follow課程確定大約人數，確定時間，預定合適房間；
 7、進行分享；


未來計劃：
-----
 - 成為IET周/月常活動，**ECE、FST乃至UM傳統節目**；
 - 與CS同學合作(或自己做)，開設**專屬網站、公眾號，升級微信小程序**，提供分享資訊、公告；
  - 如有興趣參與該項目建設，~~請加WeChat: Rookie_yyyyyyang~~
 - 開設課程資料庫、功課庫、答案庫；
 - ...


協議的更新：
------
 - 由活動組織決定最終條例修改。 |´・ω・)ノ 
`;


// 對外的數據接口
module.exports = {
  // 出口名為testJsonList，類型為jsonDIY數據
  userInfoInput_empty :   userInfoInput_empty,
  semFinishDay :          semFinishDay,
  studentYear :           studentYear,
  studentMajor :          studentMajor,
  majorTagArray :          majorTagArray,
  courseInfo_empty :      courseInfo_empty,
  
  indexAnnouncement : indexAnnouncement,
  ARK :    ARK,

  institutionNum:institutionNum,
  institutionInfo:institutionInfo
}