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


// 完sem日數據
var semFinishDay = '2022/01/05';
// 雲端可以定義顯示的專業選擇和專業
var studentYear = ["大一", "大二", "大三", "大四"];
var studentMajor = [  // 用作用戶修改信息時的彈出選擇。
  "ECE - 電機", 
  "CIS - 計算機", 
  "CEE - 土木", 
  "EME - 機電", 
  "MAT - 數學", 
  "DPC - 物理化學", 
  "ETC - 其他", 
];
let majorTagArray = studentMajor.map((e)=>{
  // bug風險：有專業是四位，當增加專業時需留意
  return e.substring(0,3);
})
// 學會相关信息
// 如果需要修改学会信息，只需要修改下方数组
// 圖床link：https://www.hualigs.cn/
let institutionInfo = [
  { // 電腦學會
    id      : 0,
    iconSrc : 'https://i0.hdslb.com/bfs/album/5e84ac5924085d3155846926da3f32c18bbb2049.jpg',
    name    : '電腦學會',
    shortName : 'CPSUMSU',
    info    : '&nbsp;&nbsp;澳門大學學生會電腦學會是以電腦為主題的學會，希望透過活動提升電腦系同學的歸屬感及團體精神。我們亦歡迎所有不同學系的同學，目的是透過舉辦工作坊、踏上IT第一步等等教授同學不同的電腦知識及認識電腦行業的前景。電競也是我們的主打之一，現時電競遊戲是一個十分熱門的話題，我們透過舉辦大大小小的比賽及交流活動等等，如最近所舉辦的澳大電競日從而推廣電競文化，讓不論是有接觸過電競與否的朋友也可以透過活動來認識電競及享受遊戲的樂趣。',
    bottomInfo  : `聯絡電郵：umsu.cps@umac.mo
    Facebook專頁 : 澳門大學學生會電腦學會
    Instagram: cps.umsu`,
  },
  { // IET澳門學生支部
    id      : 1,
    iconSrc : 'https://i0.hdslb.com/bfs/album/d572ee89fab0391368407851137867d92d58c084.jpg',
    name    : 'IET澳門學生支部',
    shortName : 'IET',
    info    : '&nbsp;&nbsp;工程及科技學會是一個國際性的工程師學會，是一個能分享專業知識的專業平台以及向大家宣傳科學的正面訊息。工程及科技學會的總會設立於倫敦，在全球127個國家裏有超過150,000名會員。工程及科技學會分別在歐洲，北美對及香港等地方設立分會。工程及科技學會同時也能提供國際認可的專業證書。',
    bottomInfo  : `聯絡電郵 : umsu.iet@umac.mo
    Facebook專頁: The IET Hong Kong Students Section Macau`,
  },
  { // 澳門工程師學會學生分部
    id      : 2,
    iconSrc : 'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
    name    : '澳門工程師學會學生分部',
    shortName : 'AEMEUM',
    info    : `&nbsp;&nbsp;澳門工程師學會學生分部成立於2011年，宗旨是透過舉辦不同的活動讓學生關心工程界的動向、提升學生對工程專業的認知；在學界與業界間搭建溝通的橋樑，作為協助學生邁向專業及執業資格的平台。總會是澳門歷史最悠久的工程組織：澳門工程師學會。

    &nbsp;&nbsp;本會會員由澳門大學工程系學生組成，歡迎土木與環境工程、計算機科學、電機及電腦工程及機電工程學系學生入會。內閣成員除了正副會長外，還設有秘書處、財務部、宣傳及資訊部、文康部，希望有才能的你也能成為我們內閣的一員。
    
    
    Introduction:
    &nbsp;&nbsp;AEMEUM aims to let the student members concern about the trends of engineering industry as well as receive more current information apart from learning from lectures. We also set up a platform that links the students up with the industry and leads them towards professional qualifications. In the past, we have organized a variety of activities such as exchange trips, workshops, competitions and seminars etc. and there will be more in the future.

    &nbsp;&nbsp;If you are a student from the Department of Civil and Environmental Engineering, Electrical and Computer Engineering and Electromechanical Engineering, you should join us! Moreover, we welcome you to become a part of our cabinet if you would like to learn more and enrich your university life.
    `,
    bottomInfo  : `聯絡電郵 : umsu.aeme@umac.mo
    Facebook專頁: 澳門工程師學會學生分部`,
  },
  { // 英國機械工程師學會澳門大學學生分部
    id      : 3,
    iconSrc : 'https://i0.hdslb.com/bfs/album/d264a164a30556e2266a054b36f17b141451b5a0.png',
    name    : '英國機械工程師學會(機電學會)',
    shortName : 'IMECHE',   // 標準寫法為IMechE，全稱institution of mechanical engineers 
    info    : `&nbsp;&nbsp;英國機械工程師協會(簡稱IMechE)成立於 1847年，是世界上建立最早的機械工程學術 團體。它的成立標誌著機械工程已確立為一 個獨立的學科，機械工程師也被社會公認為 受尊敬的職稱。
    &nbsp;&nbsp;澳門大學學生分部建立之目的，是為了方便 澳門大學就讀有關機械學科之同學，更容易 獲得有關社會資訊、幫助同學更容易接觸社 會上的團體，以便同學們日後的發展。
    `,
    bottomInfo  : `聯絡電郵 : imeche.umac@gmail.com`,
  },
  { // 美國土木工程師學會國際學生會澳門大學土木及環境工程學系學生支部
    id      : 4,
    iconSrc : 'https://i0.hdslb.com/bfs/album/66dfe945ac679591c616dfa3b57ddbd09c4d89e8.png',
    name    : '美國土木工程師學會(土木學會)',
    shortName : 'ASCE',   // 標準寫法為IMechE，全稱institution of mechanical engineers 
    info    : `&nbsp;&nbsp;澳門大學學生會美國土木工程師學會國際學生會澳門大學土木及環境工程學系學生支部 (下簡稱 ASCE ISG UMCEE)隸屬於澳門大學學生會，並獲美國歷史最悠久的國家專業工程師協會美國土木工程師學會承認的一個學術組織。
 
    &nbsp;&nbsp;ASCE ISG UMCEE是由一班充滿熱誠的土木及環境工程學系學生所架構而成。希望透過舉辦不同活動的形式（如建技大賽，study trip，site visit...等），促進本系同學的歸屬感及團結精神，讓同學將知識理論融入實際操作，從而提高他們對專業知識學習的積極性，在實踐中鞏固所學並深入理解，增加對土木工程學系的認識。
    
    &nbsp;&nbsp;除此以外，ASCE ISG UMCEE更是提供了一個平台讓同學們能夠接觸一些土木工程界的資深人士、教授等，希望透過與專業人士的交流，能培養同學成為一位稱職及有責任感的工程師，對社會作出貢獻。
    
    &nbsp;&nbsp;對ASCE ISG UMCEE感到興趣的您，歡迎加入成為本會的會員或內閣能夠更進一步地了解ASCE ISG UMCEE（本會會員必須為FST學生，內閣則必須為土木及環境工程學系的學生）！
    `,
    bottomInfo  : `Email: umsu.asce@um.edu.mo
    asceisgumcee@gmail.com
    Facebook: ASCE ISG UMCEE`,
  },
];
let institutionShortName = institutionInfo.map((e)=>{
  return e.shortName
})

// ARK協議 v3.0
const indexAnnouncement = 'ARK 協議 v3.0 已發佈！點擊查看';
const ARKLogo = 'https://i0.hdslb.com/bfs/album/68141ba6e13483d36d4f2ca5cb14e60c140000ed.png';
const ARK = 
`ARK 方舟活動 協議 3.0 ：
=================

前言：
---
  制定本協議的目的是為了盡可能保證該活動能順利長久進行下去。在確認參與前請仔細閱讀本協議。
  本協議**與您在該活動中擔當的角色息息相關**，**若參與ARK方舟活動則視為已閱讀並願意遵守實行本協議**。
  **ARK UM微信小程式只作為一個發佈工具，發佈者立場與平台方無關，任何不當內容一經發現，立刻刪除。**
  若認為部分規則存在漏洞/過於強硬/不合理，可以提出討論修改。

總則：
---
 - 講者、聽者應認真對待每一次分享；
 - 分享內容不限，形式不限；
 - 希望 Top N 的同學應有更多次分享；
 - 我們由衷地希望作為聽者參與過分享活動的同學，在畢業前也能至少有一次分享；

細則：
---
 - 分享內容可包羅萬物，例如：
   - 課堂知識，
   - 某些技巧/方法，
   - 聯繫各學會負責人準備workshop（可以先聯繫管理員），
   - 講者應不斷嘗試向更高階的內容挑戰；
 - 講者準備的分享應盡力做到自己滿意、聽者滿意；
 - 每次分享都應在不同地方上比上一次做得更好；（講解技巧、課件製作...）
 - 準備程度應到可以回答聽者問題、向聽者提出問題；
 - 可以邀請兩個Helper一齊解答；
 - 講者可由同學投票決定，但應順從講者當時意願；
 - 每次分享皆是一次鍛煉機會而不是任務；
 - 每次分享準備階段，活動組織會向講者提供建議及幫助，或可向管理員主動求助；

協議的更新：
------
 - 由活動組織決定最終條例修改。 |´・ω・)ノ  `;


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
  ARK     :    ARK,
  ARKLogo :    ARKLogo,

  institutionInfo:institutionInfo,
  institutionShortName:institutionShortName,
}