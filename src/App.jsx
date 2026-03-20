import { useState, useMemo, useEffect, useCallback } from "react";
import { db, ref, set, get } from "./firebase.js";

// 2026 KNOCKOUT POOL DATA — defaults, will be overwritten by Firebase
let B={"East":[["1","Duke",null,null,null,null,null,null,null,null,null,null,null,null],["-27.5","Karch, Eloise",null,null,null,null,null,null,null,null,null,null,null,null],["16","Siena",null,null,null,null,null,null,null,null,null,null,null,null],["27.5","Richardi, Rob",null,null,null,null,null,null,null,null,null,null,null,null],["8","Ohio State",null,null,null,null,null,null,null,null,null,null,null,null],["-2.5","Solomon, Jordan",null,null,null,null,null,null,null,null,null,null,null,null],["9","TCU",null,null,null,null,null,null,null,null,null,null,null,null],["2.5","McMahon, Rich",null,null,null,null,null,null,null,null,null,null,null,null],["5","Saint John's",null,null,null,null,null,null,null,null,null,null,null,null],["-9.5","Zaragosa, Kris",null,null,null,null,null,null,null,null,null,null,null,null],["12","Northern Iowa",null,null,null,null,null,null,null,null,null,null,null,null],["9.5","Sobieszczanski, Marguerite",null,null,null,null,null,null,null,null,null,null,null,null],["4","Kansas",null,null,null,null,null,null,null,null,null,null,null,null],["-13.5","Schmitt, Katie",null,null,null,null,null,null,null,null,null,null,null,null],["13","Cal Baptist",null,null,null,null,null,null,null,null,null,null,null,null],["13.5","Bordick, Teah",null,null,null,null,null,null,null,null,null,null,null,null],["6","Louisville",null,null,null,null,null,null,null,null,null,null,null,null],["-6.5","Bordick, Tyler",null,null,null,null,null,null,null,null,null,null,null,null],["11","South Florida",null,null,null,null,null,null,null,null,null,null,null,null],["6.5","Martin, Vin",null,null,null,null,null,null,null,null,null,null,null,null],["3","Michigan State",null,null,null,null,null,null,null,null,null,null,null,null],["-16.5","Tempesta, Rick",null,null,null,null,null,null,null,null,null,null,null,null],["14","North Dakota State",null,null,null,null,null,null,null,null,null,null,null,null],["16.5","Hicks, Dave",null,null,null,null,null,null,null,null,null,null,null,null],["7","UCLA",null,null,null,null,null,null,null,null,null,null,null,null],["-5.5","Wyville, Mark",null,null,null,null,null,null,null,null,null,null,null,null],["10","UCF",null,null,null,null,null,null,null,null,null,null,null,null],["5.5","McMahon, Julian",null,null,null,null,null,null,null,null,null,null,null,null],["2","UConn",null,null,null,null,null,null,null,null,null,null,null,null],["-20.5","Hanlon, Laura",null,null,null,null,null,null,null,null,null,null,null,null],["15","Furman",null,null,null,null,null,null,null,null,null,null,null,null],["20.5","Anderson, John",null,null,null,null,null,null,null,null,null,null,null,null]],"South":[["1","Florida",null,null,null,null,null,null,null,null,null,null,null,null],[null,"Polanskij, Bohdan",null,null,null,null,null,null,null,null,null,null,null,null],["16","Lehigh",null,null,null,null,null,null,null,null,null,null,null,null],[null,"Catanzarita, Meghan",null,null,null,null,null,null,null,null,null,null,null,null],["8","Clemson",null,null,null,null,null,null,null,null,null,null,null,null],["2.5","Molinski, Jay",null,null,null,null,null,null,null,null,null,null,null,null],["9","Iowa",null,null,null,null,null,null,null,null,null,null,null,null],["-2.5","Stagaard, Ward",null,null,null,null,null,null,null,null,null,null,null,null],["5","Vanderbilt",null,null,null,null,null,null,null,null,null,null,null,null],["-11.5","Gill, Dai",null,null,null,null,null,null,null,null,null,null,null,null],["12","McNeese",null,null,null,null,null,null,null,null,null,null,null,null],["11.5","Stagaard, Meg",null,null,null,null,null,null,null,null,null,null,null,null],["4","Nebraska",null,null,null,null,null,null,null,null,null,null,null,null],["-13.5","Moulton, Eric",null,null,null,null,null,null,null,null,null,null,null,null],["13","Troy",null,null,null,null,null,null,null,null,null,null,null,null],["13.5","Boyle, Colin",null,null,null,null,null,null,null,null,null,null,null,null],["6","North Carolina",null,null,null,null,null,null,null,null,null,null,null,null],["-2.5","Guttman, John",null,null,null,null,null,null,null,null,null,null,null,null],["11","VCU",null,null,null,null,null,null,null,null,null,null,null,null],["2.5","McMahon, Max",null,null,null,null,null,null,null,null,null,null,null,null],["3","Illinois",null,null,null,null,null,null,null,null,null,null,null,null],["-21.5","Ward, John",null,null,null,null,null,null,null,null,null,null,null,null],["14","Penn",null,null,null,null,null,null,null,null,null,null,null,null],["21.5","Taylor, Billy",null,null,null,null,null,null,null,null,null,null,null,null],["7","Saint Mary's",null,null,null,null,null,null,null,null,null,null,null,null],["-2.5","Gill, Connor",null,null,null,null,null,null,null,null,null,null,null,null],["10","Texas A&M",null,null,null,null,null,null,null,null,null,null,null,null],["2.5","Mortenson, Jim",null,null,null,null,null,null,null,null,null,null,null,null],["2","Houston",null,null,null,null,null,null,null,null,null,null,null,null],["-22.5","Karch, Dave",null,null,null,null,null,null,null,null,null,null,null,null],["15","Idaho",null,null,null,null,null,null,null,null,null,null,null,null],["22.5","McMahon, Leith",null,null,null,null,null,null,null,null,null,null,null,null]],"Midwest":[["1","Michigan",null,null,null,null,null,null,null,null,null,null,null,null],["-31.5","Fallon, Frank",null,null,null,null,null,null,null,null,null,null,null,null],["16","Howard",null,null,null,null,null,null,null,null,null,null,null,null],["31.5","Gaul, Keara",null,null,null,null,null,null,null,null,null,null,null,null],["8","Georgia",null,null,null,null,null,null,null,null,null,null,null,null],["-1.5","Richardi, Justin",null,null,null,null,null,null,null,null,null,null,null,null],["9","Saint Louis",null,null,null,null,null,null,null,null,null,null,null,null],["1.5","Scruggs, Pat",null,null,null,null,null,null,null,null,null,null,null,null],["5","Texas Tech",null,null,null,null,null,null,null,null,null,null,null,null],["-8.5","Stagaard, Ryan",null,null,null,null,null,null,null,null,null,null,null,null],["12","Akron",null,null,null,null,null,null,null,null,null,null,null,null],["8.5","Reilly Sr, Tim",null,null,null,null,null,null,null,null,null,null,null,null],["4","Alabama",null,null,null,null,null,null,null,null,null,null,null,null],["-12.5","Gaul, Erik",null,null,null,null,null,null,null,null,null,null,null,null],["13","Hofstra",null,null,null,null,null,null,null,null,null,null,null,null],["12.5","Taylor, Katherine",null,null,null,null,null,null,null,null,null,null,null,null],["6","Tennessee",null,null,null,null,null,null,null,null,null,null,null,null],[null,"Schmitt, Tom",null,null,null,null,null,null,null,null,null,null,null,null],["11","SMU/Miami (OH)",null,null,null,null,null,null,null,null,null,null,null,null],[null,"Lubarsky, Kevin",null,null,null,null,null,null,null,null,null,null,null,null],["3","Virginia",null,null,null,null,null,null,null,null,null,null,null,null],["-17.5","Bordick, Reese",null,null,null,null,null,null,null,null,null,null,null,null],["14","Wright State",null,null,null,null,null,null,null,null,null,null,null,null],["17.5","Sparaco, Erica",null,null,null,null,null,null,null,null,null,null,null,null],["7","Kentucky",null,null,null,null,null,null,null,null,null,null,null,null],["-3.5","Stagaard, Maren",null,null,null,null,null,null,null,null,null,null,null,null],["10","Santa Clara",null,null,null,null,null,null,null,null,null,null,null,null],["3.5","Wolf, Pat",null,null,null,null,null,null,null,null,null,null,null,null],["2","Iowa State",null,null,null,null,null,null,null,null,null,null,null,null],["-23.5","Specht, Willie",null,null,null,null,null,null,null,null,null,null,null,null],["15","Tennessee State",null,null,null,null,null,null,null,null,null,null,null,null],["23.5","Ward, Jack",null,null,null,null,null,null,null,null,null,null,null,null]],"West":[["1","Arizona",null,null,null,null,null,null,null,null,null,null,null,null],["-29.5","McMahon, Annie",null,null,null,null,null,null,null,null,null,null,null,null],["16","Long Island",null,null,null,null,null,null,null,null,null,null,null,null],["29.5","McGovern, Bob",null,null,null,null,null,null,null,null,null,null,null,null],["8","Villanova",null,null,null,null,null,null,null,null,null,null,null,null],["1.5","Wigdor, Paul",null,null,null,null,null,null,null,null,null,null,null,null],["9","Utah State",null,null,null,null,null,null,null,null,null,null,null,null],["-1.5","Szabo, Matt",null,null,null,null,null,null,null,null,null,null,null,null],["5","Wisconsin",null,null,null,null,null,null,null,null,null,null,null,null],["-11.5","Fallon, Dan",null,null,null,null,null,null,null,null,null,null,null,null],["12","High Point",null,null,null,null,null,null,null,null,null,null,null,null],["11.5","McCarthy, Ryan",null,null,null,null,null,null,null,null,null,null,null,null],["4","Arkansas",null,null,null,null,null,null,null,null,null,null,null,null],["-15.5","Karch, Brynn",null,null,null,null,null,null,null,null,null,null,null,null],["13","Hawaii",null,null,null,null,null,null,null,null,null,null,null,null],["15.5","Jordan, Craig",null,null,null,null,null,null,null,null,null,null,null,null],["6","BYU",null,null,null,null,null,null,null,null,null,null,null,null],["-1.5","Reilly Jr, Tim",null,null,null,null,null,null,null,null,null,null,null,null],["11","Texas",null,null,null,null,null,null,null,null,null,null,null,null],["1.5","Polanskij, Zander",null,null,null,null,null,null,null,null,null,null,null,null],["3","Gonzaga",null,null,null,null,null,null,null,null,null,null,null,null],["-18.5","Bordick, Mark",null,null,null,null,null,null,null,null,null,null,null,null],["14","Kennesaw State",null,null,null,null,null,null,null,null,null,null,null,null],["18.5","Maguire, Bill",null,null,null,null,null,null,null,null,null,null,null,null],["7","Miami (FL)",null,null,null,null,null,null,null,null,null,null,null,null],["-2.5","Hicks, Kerry",null,null,null,null,null,null,null,null,null,null,null,null],["10","Missouri",null,null,null,null,null,null,null,null,null,null,null,null],["2.5","Hanlon, Andy",null,null,null,null,null,null,null,null,null,null,null,null],["2","Purdue",null,null,null,null,null,null,null,null,null,null,null,null],["-23.5","Butterfield, Scott",null,null,null,null,null,null,null,null,null,null,null,null],["15","Queens",null,null,null,null,null,null,null,null,null,null,null,null],["23.5","Richardi, Andrew",null,null,null,null,null,null,null,null,null,null,null,null]],"FinalFour":[[null,"Final 4",null,null,"Championship",null,null,"Winner"],[null,null,null,null,null,null,null,null],["East",null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],["South",null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],["West",null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],["Midwest",null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]};

let J=[{"n":"Anderson, John","r":["Furman","","","","","",""],"o":[]},{"n":"Bordick, Mark","r":["Gonzaga","","","","","",""],"o":[]},{"n":"Bordick, Reese","r":["Virginia","","","","","",""],"o":[]},{"n":"Bordick, Teah","r":["Cal Baptist","","","","","",""],"o":[]},{"n":"Bordick, Tyler","r":["Louisville","","","","","",""],"o":[]},{"n":"Boyle, Colin","r":["Troy","","","","","",""],"o":[]},{"n":"Butterfield, Scott","r":["Purdue","","","","","",""],"o":[]},{"n":"Catanzarita, Meghan","r":["Lehigh","","","","","",""],"o":[]},{"n":"Fallon, Dan","r":["Wisconsin","","","","","",""],"o":[]},{"n":"Fallon, Frank","r":["Michigan","","","","","",""],"o":[]},{"n":"Gaul, Erik","r":["Alabama","","","","","",""],"o":[]},{"n":"Gaul, Keara","r":["Howard","","","","","",""],"o":[]},{"n":"Gill, Connor","r":["Saint Mary's","","","","","",""],"o":[]},{"n":"Gill, Dai","r":["Vanderbilt","","","","","",""],"o":[]},{"n":"Guttman, John","r":["North Carolina","","","","","",""],"o":[]},{"n":"Hanlon, Andy","r":["Missouri","","","","","",""],"o":[]},{"n":"Hanlon, Laura","r":["UConn","","","","","",""],"o":[]},{"n":"Hicks, Dave","r":["North Dakota State","","","","","",""],"o":[]},{"n":"Hicks, Kerry","r":["Miami (FL)","","","","","",""],"o":[]},{"n":"Jordan, Craig","r":["Hawaii","","","","","",""],"o":[]},{"n":"Karch, Brynn","r":["Arkansas","","","","","",""],"o":[]},{"n":"Karch, Dave","r":["Houston","","","","","",""],"o":[]},{"n":"Karch, Eloise","r":["Duke","","","","","",""],"o":[]},{"n":"Lubarsky, Kevin","r":["SMU/Miami (OH)","","","","","",""],"o":[]},{"n":"Maguire, Bill","r":["Kennesaw State","","","","","",""],"o":[]},{"n":"Martin, Vin","r":["South Florida","","","","","",""],"o":[]},{"n":"McCarthy, Ryan","r":["High Point","","","","","",""],"o":[]},{"n":"McGovern, Bob","r":["Long Island","","","","","",""],"o":[]},{"n":"McMahon, Annie","r":["Arizona","","","","","",""],"o":[]},{"n":"McMahon, Julian","r":["UCF","","","","","",""],"o":[]},{"n":"McMahon, Leith","r":["Idaho","","","","","",""],"o":[]},{"n":"McMahon, Max","r":["VCU","","","","","",""],"o":[]},{"n":"McMahon, Rich","r":["TCU","","","","","",""],"o":[]},{"n":"Molinski, Jay","r":["Clemson","","","","","",""],"o":[]},{"n":"Mortenson, Jim","r":["Texas A&M","","","","","",""],"o":[]},{"n":"Moulton, Eric","r":["Nebraska","","","","","",""],"o":[]},{"n":"Polanskij, Bohdan","r":["Florida","","","","","",""],"o":[]},{"n":"Polanskij, Zander","r":["Texas","","","","","",""],"o":[]},{"n":"Reilly Jr, Tim","r":["BYU","","","","","",""],"o":[]},{"n":"Reilly Sr, Tim","r":["Akron","","","","","",""],"o":[]},{"n":"Richardi, Andrew","r":["Queens","","","","","",""],"o":[]},{"n":"Richardi, Justin","r":["Georgia","","","","","",""],"o":[]},{"n":"Richardi, Rob","r":["Siena","","","","","",""],"o":[]},{"n":"Schmitt, Katie","r":["Kansas","","","","","",""],"o":[]},{"n":"Schmitt, Tom","r":["Tennessee","","","","","",""],"o":[]},{"n":"Scruggs, Pat","r":["Saint Louis","","","","","",""],"o":[]},{"n":"Sobieszczanski, Marguerite","r":["Northern Iowa","","","","","",""],"o":[]},{"n":"Solomon, Jordan","r":["Ohio State","","","","","",""],"o":[]},{"n":"Sparaco, Erica","r":["Wright State","","","","","",""],"o":[]},{"n":"Specht, Willie","r":["Iowa State","","","","","",""],"o":[]},{"n":"Stagaard, Maren","r":["Kentucky","","","","","",""],"o":[]},{"n":"Stagaard, Meg","r":["McNeese","","","","","",""],"o":[]},{"n":"Stagaard, Ryan","r":["Texas Tech","","","","","",""],"o":[]},{"n":"Stagaard, Ward","r":["Iowa","","","","","",""],"o":[]},{"n":"Szabo, Matt","r":["Utah State","","","","","",""],"o":[]},{"n":"Taylor, Billy","r":["Penn","","","","","",""],"o":[]},{"n":"Taylor, Katherine","r":["Hofstra","","","","","",""],"o":[]},{"n":"Tempesta, Rick","r":["Michigan State","","","","","",""],"o":[]},{"n":"Ward, Jack","r":["Tennessee State","","","","","",""],"o":[]},{"n":"Ward, John","r":["Illinois","","","","","",""],"o":[]},{"n":"Wigdor, Paul","r":["Villanova","","","","","",""],"o":[]},{"n":"Wolf, Pat","r":["Santa Clara","","","","","",""],"o":[]},{"n":"Wyville, Mark","r":["UCLA","","","","","",""],"o":[]},{"n":"Zaragosa, Kris","r":["Saint John's","","","","","",""],"o":[]}];

const TC={"Duke":"#003087","Alabama":"#9E1B32","Auburn":"#0C2340","Florida":"#0021A5","Houston":"#C8102E","Purdue":"#CEB888","Oregon":"#154733","Arizona":"#CC0033","Kentucky":"#0033A0","Tennessee":"#FF8200","Michigan":"#FFCB05","Michigan State":"#18453B","Texas Tech":"#CC0000","Wisconsin":"#C5050C","BYU":"#002E5D","UConn":"#000E2F","Baylor":"#154734","Kansas":"#0051BA","Marquette":"#003366","Iowa State":"#C8102E","Texas A&M":"#500000","Saint John's":"#BA0C2F","Creighton":"#005CA9","Arkansas":"#9D2235","Mount Saint Mary's":"#003478","VCU":"#F8B800","Robert Morris":"#14234B","Alabama State":"#C99700","Liberty":"#002D62","Akron":"#041E42","Vanderbilt":"#866D4B","Montana":"#6C2740","Saint Mary's":"#D50032","Ole Miss":"#CE1126","Illinois":"#E84A27","Gonzaga":"#002967","Maryland":"#E03A3E","Colorado State":"#1E4D2B","Memphis":"#003087","McNeese":"#00529B","North Carolina":"#7BAFD4","Norfolk State":"#007A53","Oklahoma":"#841617","Yale":"#00356B","Wofford":"#886B2C","Mississippi State":"#660000","Georgia":"#BA0C2F","Drake":"#004477","Clemson":"#F56600","Troy":"#8B2332","UCLA":"#2D68C4","Xavier":"#0C2340","Utah State":"#0F2439","Louisville":"#AD0000","Missouri":"#F1B82D","New Mexico":"#BA0C2F","UC San Diego":"#182B49","High Point":"#330072","Grand Canyon":"#522398","UNCW":"#006666","Bryant":"#000000","Lipscomb":"#231F20","SIU Edwardsville":"#CC0000","Omaha":"#000000","Ohio State":"#BB0000","TCU":"#4D1979","UCF":"#BA9B37","South Florida":"#006747","Northern Iowa":"#4B116F","Cal Baptist":"#002554","North Dakota State":"#006A32","Furman":"#582C83","Siena":"#006747","Villanova":"#003366","Miami (FL)":"#F47321","Hawaii":"#024731","Kennesaw State":"#FDBB30","Queens":"#002D62","Long Island":"#FFD204","Nebraska":"#E41C38","Iowa":"#FFCD00","Penn":"#011F5B","Idaho":"#B5985A","Lehigh":"#653819","Prairie View":"#4F2D7F","Virginia":"#232D4B","Saint Louis":"#003DA5","Santa Clara":"#862633","SMU":"#CC0035","Miami (OH)":"#B61E2E","Hofstra":"#003591","Wright State":"#007A33","Tennessee State":"#003DA5","Howard":"#003A63","UMBC":"#000000","NC State":"#CC0000","Texas":"#BF5700","Michigan State":"#18453B"};

const RC = { East:"#1a5276", South:"#922b21", Midwest:"#196f3d", West:"#7d6608" };
const TAN = "#f0d9a8";

function textFor(h){if(!h)return"#000";const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return(r*.299+g*.587+b*.114)>140?"#000":"#fff";}
function parseTeam(s){if(!s)return null;const m=s.match(/^(.+?)\s{2,}\(/);return m?m[1].trim():null;}
function fmtSeed(s){if(s==null)return"";const n=parseFloat(s);if(isNaN(n))return s;return Number.isInteger(n)?String(n):n>0&&n<17?String(Math.round(n)):s;}

const ESPN_ID={"Akron":2006,"Alabama":333,"Alabama State":2011,"Arizona":12,"Arkansas":8,"Auburn":2,"BYU":252,"Baylor":239,"Bryant":2803,"Clemson":228,"Colorado State":36,"Creighton":156,"Drake":2181,"Duke":150,"Florida":57,"Georgia":61,"Gonzaga":2250,"Grand Canyon":2253,"High Point":2272,"Houston":248,"Illinois":356,"Iowa State":66,"Kansas":2305,"Kentucky":96,"Liberty":2335,"Lipscomb":288,"Louisville":97,"Marquette":269,"Maryland":120,"McNeese":2377,"Memphis":235,"Michigan":130,"Michigan State":127,"Mississippi State":344,"Missouri":142,"Montana":149,"Mount Saint Mary's":2349,"New Mexico":167,"Norfolk State":2450,"North Carolina":153,"Oklahoma":201,"Ole Miss":145,"Omaha":2437,"Oregon":2483,"Purdue":2509,"Robert Morris":2523,"SIU Edwardsville":2565,"Saint John's":2599,"Saint Mary's":2608,"Tennessee":2633,"Texas A&M":245,"Texas Tech":2641,"Troy":2653,"UC San Diego":6555,"UCLA":26,"UConn":41,"UNCW":350,"Utah State":328,"VCU":2670,"Vanderbilt":238,"Wisconsin":275,"Wofford":2747,"Xavier":2752,"Yale":43};
function logoUrl(team){const id=ESPN_ID[team];return id?`https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`:null;}

// ═══════════════════════════════════════════════
// BRACKET CELL
// ═══════════════════════════════════════════════
function BC({val,ri,ci,data}){
  const col3x=ci%3;
  // Static matchup box positions for each round
  const BOX_ROWS=[
    null, // R1: all rows are in boxes
    new Set([2,3,4,5,10,11,12,13,18,19,20,21,26,27,28,29]),
    new Set([3,4,11,12,19,20,27,28]),
    new Set([7,8,23,24]),
    new Set([15,16]),
  ];
  if(val==null){
    // Check if this empty cell is part of a F4 box (col 12, name col 13 has data)
    if(col3x===0 && ci>=12 && data&&data[ri]&&data[ri][ci+1]!=null){
      const aboveHas=ri>0&&data[ri-1]&&data[ri-1][ci]!=null;
      return <td style={{padding:0,height:21,background:"#fff",
        borderLeft:"3px solid #000",borderRight:"1px solid #000",
        borderTop:aboveHas?"1px solid #000":"3px solid #000",
        borderBottom:"3px solid #000",minWidth:50}}/>;
    }
    // Use static box positions
    const roundGroup=Math.floor(ci/3);
    const isInBox = roundGroup===0 || (roundGroup<5 && BOX_ROWS[roundGroup] && BOX_ROWS[roundGroup].has(ri));
    
    if(isInBox){
      // This is an empty cell within a matchup box — render as white with borders
      // Determine block boundaries
      let blockStart,blockEnd;
      if(roundGroup===0){blockStart=ri-ri%4;blockEnd=blockStart+3;}
      else if(roundGroup===1){
        // R2: 4-row blocks at 4,12,20,28
        const r2Starts=[2,10,18,26];
        const s=r2Starts.find(s=>ri>=s&&ri<s+4);
        blockStart=s!=null?s:ri;blockEnd=blockStart+3;
      }else{
        // S16, E8, F4: 2-row blocks
        blockStart=ri%2===0?ri:ri-1;
        // But need to find actual block start from the box rows
        const bSet=BOX_ROWS[roundGroup];
        if(bSet){
          blockStart=ri;
          while(blockStart>0&&bSet.has(blockStart-1)){blockStart--;}
          blockEnd=ri;
          while(blockEnd<31&&bSet.has(blockEnd+1)){blockEnd++;}
        }else{blockStart=ri;blockEnd=ri;}
      }
      if(blockEnd===undefined)blockEnd=blockStart+3;
      const boxTop=(ri===blockStart);
      const boxBot=(ri===blockEnd);
      const blkSz=blockEnd-blockStart+1;
      let bTop,bBot;
      if(blkSz===2){bTop=boxTop?"3px solid #000":"1px solid #000";bBot=boxBot?"3px solid #000":"1px solid #000";}
      else{bTop=boxTop?"3px solid #000":(ri>blockStart?"1px solid #000":"none");bBot=boxBot?"3px solid #000":(ri<blockEnd?"1px solid #000":"none");}
      return <td style={{padding:"1px 4px",height:21,background:"#fff",
        borderLeft:col3x===0?"3px solid #000":(col3x>0?"1px solid #000":"none"),
        borderRight:(col3x===2||ci===13)?"3px solid #000":(col3x<2?"1px solid #000":"none"),
        borderTop:bTop,borderBottom:bBot,
        minWidth:col3x===1?130:col3x===0?50:42}}/>;
    }
    // Check if this empty cell sits between two halves of a matchup (connecting right border)
    let rightBdr="none";
    if(col3x===2 && ci>=8){
      // Use static box positions to check for halves above and below
      const rg=Math.floor(ci/3);
      const bSet=rg<5?BOX_ROWS[rg]:null;
      if(bSet){
        let aboveInBox=false,belowInBox=false;
        for(let r=ri-1;r>=0;r--){if(bSet.has(r)){aboveInBox=true;break;}}
        for(let r=ri+1;r<32;r++){if(bSet.has(r)){belowInBox=true;break;}}
        if(aboveInBox&&belowInBox){
          if(ci>=11){
            rightBdr="3px solid #000";
          }else{
            const mid=16;
            // Find nearest box row above and below
            let aboveRow=-1,belowRow=-1;
            for(let r=ri-1;r>=0;r--){if(bSet.has(r)){aboveRow=r;break;}}
            for(let r=ri+1;r<32;r++){if(bSet.has(r)){belowRow=r;break;}}
            if(aboveRow>=0&&belowRow>=0&&!((aboveRow<mid)!==(belowRow<mid))) rightBdr="3px solid #000";
          }
        }
      }
    }
    return <td style={{padding:0,height:21,background:TAN,border:"none",borderRight:rightBdr,
      minWidth:col3x===1?130:col3x===0?50:42}}/>;
  }
  const s=String(val);
  const col3=ci%3;

  // Detect margin cells: col 0 of a round group where col 1 in same row is empty
  if(col3===0 && ci>=3){
    const nc=ci+1;
    const hasName=data&&data[ri]&&data[ri][nc]!=null;
    if(!hasName){
      return <td style={{padding:0,height:21,background:TAN,border:"none",minWidth:50}}/>;
    }
  }

  // Find block start to determine position within matchup
  const nameCol=ci-col3+1;
  const isR1=(ci<3);
  let blkStart;
  if(isR1){
    blkStart=ri-ri%4;
  }else{
    blkStart=ri;
    while(blkStart>0&&data[blkStart-1]&&data[blkStart-1][nameCol]!=null){blkStart--;}
  }
  const posInBlk=(ri-blkStart)%2;
  const isTeamRow=posInBlk===0; // seed/team rows
  const isOwnerRow=posInBlk===1; // spread/owner rows

  const isTeam=col3===1&&isTeamRow;
  const isOwner=col3===1&&isOwnerRow;
  const isSeed=col3===0&&isTeamRow;
  const isSpread=col3===0&&isOwnerRow;
  const isScore=col3===2;
  const isLoss=s.startsWith("(")&&s.endsWith(")");
  const isFav=s==="FAV";

  let bg="#fff",fg="#000",fw=400,fs="normal",stroke="none";
  if(isTeam){
    const c=TC[s];
    bg=c||"#ddd"; fg=c?textFor(c):"#000"; fw=700;
    if(c)stroke=fg==="#fff"?"0.3px #000":"0.3px #fff";
  }else if(isOwner){ fw=400; }
  else if(isSeed){ bg="#000"; fg="#fff"; fw=700; }
  else if(isSpread){ fg=parseFloat(s)>0?"#006400":"#cc0000"; }
  if(isScore){
    const isR1s=(ci<3);
    if(isR1s){
      // R1: 4 contiguous rows per matchup
      const bs=ri-ri%4;
      const posInBlock=ri-bs;
      if(posInBlock===0||posInBlock===3){
        fg="#000";
      }else{
        const otherRow=posInBlock===1?ri+1:ri-1;
        const myVal=parseFloat(s.replace(/[()]/g,""));
        let otherVal=NaN;
        if(data&&data[otherRow]&&data[otherRow][ci]!=null){
          otherVal=parseFloat(String(data[otherRow][ci]).replace(/[()]/g,""));
        }
        if(!isNaN(myVal)&&!isNaN(otherVal)){
          fg=myVal>otherVal?"#006400":myVal<otherVal?"#cc0000":"#000";
        }
      }
    }else{
      // Later rounds: each matchup is two 2-row blocks separated by a gap
      // Find this block
      let bs=ri;
      while(bs>0&&data[bs-1]&&data[bs-1][nameCol]!=null){bs--;}
      let be=ri;
      while(be<data.length-1&&data[be+1]&&data[be+1][nameCol]!=null){be++;}
      const posInBlock=ri-bs;
      const blockSize=be-bs+1;
      
      if(blockSize===4){
        // Full 4-row block (R2): same as R1
        if(posInBlock===0||posInBlock===3){ fg="#000"; }
        else{
          const otherRow=posInBlock===1?ri+1:ri-1;
          const myVal=parseFloat(s.replace(/[()]/g,""));
          let otherVal=NaN;
          if(data&&data[otherRow]&&data[otherRow][ci]!=null){
            otherVal=parseFloat(String(data[otherRow][ci]).replace(/[()]/g,""));
          }
          if(!isNaN(myVal)&&!isNaN(otherVal)){
            fg=myVal>otherVal?"#006400":myVal<otherVal?"#cc0000":"#000";
          }
        }
      }else if(blockSize===2){
        // 2-row half-block. Count which block number this is (1st, 2nd, 3rd...) in this column.
        // Odd blocks = top half, even blocks = bottom half.
        let blockNum=0;
        let inBlock=false;
        for(let r=0;r<=ri;r++){
          const hasData=data[r]&&data[r][ci]!=null;
          if(hasData&&!inBlock){blockNum++;inBlock=true;}
          if(!hasData)inBlock=false;
        }
        const isTopHalf=(blockNum%2===1);
        
        // Find partner block
        let partnerRow=-1;
        if(isTopHalf){
          for(let r=be+1;r<data.length;r++){if(data[r]&&data[r][ci]!=null){partnerRow=r;break;}}
        }else{
          for(let r=bs-1;r>=0;r--){if(data[r]&&data[r][ci]!=null){partnerRow=r;break;}}
        }
        
        if(isTopHalf){
          // Top half: row0=outside(black), row1=inside(compare with partner's first row)
          if(posInBlock===0){ fg="#000"; }
          else{
            const myVal=parseFloat(s.replace(/[()]/g,""));
            let otherVal=NaN;
            if(partnerRow>=0&&data[partnerRow]&&data[partnerRow][ci]!=null){
              otherVal=parseFloat(String(data[partnerRow][ci]).replace(/[()]/g,""));
            }
            if(!isNaN(myVal)&&!isNaN(otherVal)){
              fg=myVal>otherVal?"#006400":myVal<otherVal?"#cc0000":"#000";
            }
          }
        }else{
          // Bottom half: row0=inside(compare with partner's last row), row1=outside(black)
          if(posInBlock===1){ fg="#000"; }
          else{
            const myVal=parseFloat(s.replace(/[()]/g,""));
            let otherVal=NaN;
            // Partner is above — get its last row
            if(partnerRow>=0){
              let pEnd=partnerRow;
              while(pEnd<data.length-1&&data[pEnd+1]&&data[pEnd+1][nameCol]!=null){pEnd++;}
              if(data[pEnd]&&data[pEnd][ci]!=null){
                otherVal=parseFloat(String(data[pEnd][ci]).replace(/[()]/g,""));
              }
            }
            if(!isNaN(myVal)&&!isNaN(otherVal)){
              fg=myVal>otherVal?"#006400":myVal<otherVal?"#cc0000":"#000";
            }
          }
        }
      }
    }
  }
  if(isLoss&&!isScore){ fg="#888"; }

  const display=isSeed?fmtSeed(s):s;

  // Determine matchup box boundaries (reuse nameCol and isR1 from above)
  let blockStart,blockEnd;
  if(isR1){
    // R1: matchups are always 4 rows, starting at 0,4,8,12...
    blockStart=ri-ri%4;
    blockEnd=blockStart+3;
  }else{
    // Later rounds: walk to find contiguous data block
    blockStart=ri;
    while(blockStart>0&&data[blockStart-1]&&data[blockStart-1][nameCol]!=null){blockStart--;}
    blockEnd=ri;
    while(blockEnd<data.length-1&&data[blockEnd+1]&&data[blockEnd+1][nameCol]!=null){blockEnd++;}
  }
  const boxTop=(ri===blockStart);
  const boxBot=(ri===blockEnd);
  const blkSz=blockEnd-blockStart+1;

  // Border logic: 3px on outer edges of block, 1px internal
  // For 2-row blocks: top of row0=3px, between rows=1px, bottom of row1=3px
  let bTop,bBot;
  if(blkSz===2){
    bTop=boxTop?"3px solid #000":"1px solid #000";
    bBot=boxBot?"3px solid #000":"1px solid #000";
  }else{
    bTop=boxTop?"3px solid #000":(ri>blockStart?"1px solid #000":"none");
    bBot=boxBot?"3px solid #000":(ri<blockEnd?"1px solid #000":"none");
  }

  return(
    <td style={{
      padding:"1px 4px",height:21,lineHeight:"21px",fontSize:11,
      fontFamily:"Arial,Helvetica,sans-serif",
      fontWeight:fw,fontStyle:fs,color:fg,background:bg,
      WebkitTextStroke:stroke,
      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
      textAlign:isScore?"center":isSeed||isSpread?"right":"left",
      borderLeft:col3===0?"3px solid #000":(col3>0?"1px solid #000":"none"),
      borderRight:(col3===2)?"3px solid #000":(col3<2?"1px solid #000":"none"),
      borderTop:bTop,
      borderBottom:bBot,
      minWidth:col3===1?130:col3===0?50:42,
      maxWidth:col3===1?170:undefined,
    }}>{display}</td>
  );
}

function RegionBracket({region,data}){
  const rc=RC[region]||"#333";
  return(
    <div>
      <div style={{overflowX:"auto",background:TAN,padding:"8px"}}>
        <table style={{borderCollapse:"collapse",background:TAN,tableLayout:"fixed",width:"100%"}}>
          <colgroup>
            {[0,1,2,3,4].map(r=>[
              <col key={r+"a"} style={{width:50}}/>,
              <col key={r+"b"} style={{width:170}}/>,
              <col key={r+"c"} style={{width:50}}/>,
            ])}
            <col key="logo" />
          </colgroup>          <thead>
            <tr>{["Round of 64","Round of 32","Sweet 16","Elite 8"].map((h,i)=>(
              <th key={i} colSpan={3} style={{padding:"3px 4px",fontSize:10,color:"#000",fontWeight:700,
                textAlign:"center",border:"1px solid #000",background:"#fff",
                fontFamily:"Arial,sans-serif"}}>{h}</th>
            ))}
            <th colSpan={4} style={{padding:"3px 4px",fontSize:10,color:"#000",fontWeight:700,
              textAlign:"center",border:"1px solid #000",background:"#fff",
              fontFamily:"Arial,sans-serif"}}>Final 4</th>
            </tr>
          </thead>
          <tbody>
            {(()=>{
              // F4 block is always at rows 15-16
              const f4Start=15,f4End=16;
              const f4Span=2;
              // Find F4 team name from col 13 if data exists
              let f4Team=null;
              for(let r=f4Start;r<=f4End;r++){
                if(data[r]&&data[r][13]!=null){
                  const nm=String(data[r][13]);
                  // Team row has a name that's in TC (team colors) — not an owner name
                  if(TC[nm]){f4Team=nm;break;}
                }
              }
              const f4Logo=f4Team?logoUrl(f4Team):null;
              const f4Color=f4Team?TC[f4Team]:null;
              return data.map((row,ri)=>{
                const isF4Start=(ri===f4Start);
                const inF4=(ri>=f4Start&&ri<=f4End&&f4Start>=0);
                return (
                  <tr key={ri}>
                    {row.map((v,ci)=><BC key={ci} val={v} ri={ri} ci={ci} data={data}/>)}
                    {isF4Start ? (
                      <td rowSpan={f4Span} style={{background:"#fff",
                        border:"3px solid #000",
                        verticalAlign:"middle",textAlign:"center",
                        padding:4,
                      }}>
                        {f4Logo ? (
                          <img src={f4Logo} alt={f4Team||""} style={{maxHeight:50,maxWidth:50,objectFit:"contain"}}
                            onError={e=>{e.target.style.display="none";if(e.target.nextSibling)e.target.nextSibling.style.display="block";}}/>
                        ) : null}
                        <div style={{display:f4Logo?"none":"block",fontSize:11,fontWeight:700,
                          color:f4Color||"#000",fontFamily:"Arial,sans-serif"}}>{f4Team||""}</div>
                      </td>
                    ) : !inF4 ? (
                      <td style={{background:TAN,border:"none"}}/>
                    ) : null}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FinalFourBracket({data}){
  // The FF data has 10 rows x 8 cols
  // Cols 0-2: F4 semis, Cols 3-5: Championship, Cols 6-7: Winner
  // We need to render cols 0-5 using BC (same logic as region brackets)
  // and cols 6-7 custom (winner label + name)
  
  // Strip header rows (0 and 1), build clean 6-col data for BC
  const bcData = data.slice(2).map(row => {
    const r = [];
    for(let c=0;c<6;c++) r.push(row[c]!=null?row[c]:null);
    return r;
  });
  
  return (
    <div>
      <div style={{overflowX:"auto",background:TAN,padding:"8px"}}>
        <table style={{borderCollapse:"collapse",background:TAN,tableLayout:"fixed"}}>
          <colgroup>
            <col style={{width:50}}/><col style={{width:170}}/><col style={{width:50}}/>
            <col style={{width:50}}/><col style={{width:170}}/><col style={{width:50}}/>
            <col style={{width:50}}/><col style={{width:170}}/><col style={{width:50}}/>
          </colgroup>
          <thead>
            <tr>
              <th colSpan={3} style={{padding:"3px 4px",fontSize:10,color:"#000",fontWeight:700,
                textAlign:"center",border:"1px solid #000",background:"#fff",
                fontFamily:"Arial,sans-serif"}}>Final 4</th>
              <th colSpan={3} style={{padding:"3px 4px",fontSize:10,color:"#000",fontWeight:700,
                textAlign:"center",border:"1px solid #000",background:"#fff",
                fontFamily:"Arial,sans-serif"}}>Championship</th>
              <th colSpan={3} style={{padding:"3px 4px",fontSize:10,color:"#000",fontWeight:700,
                textAlign:"center",border:"1px solid #000",background:"#fff",
                fontFamily:"Arial,sans-serif"}}>Winner</th>
            </tr>
          </thead>
          <tbody>
            {(()=>{
              // Championship box: bcData rows 2-5 (cols 3-5)
              // Winner box: bcData rows 3-4 (cols 6-7 + logo)
              const champStart=2,champEnd=5;
              const winStart=3,winEnd=4;
              const wSpan=winEnd-winStart+1;

              // Find winner team name for logo box if data exists
              let winTeam=null,winColor=null,winLogo=null;
              for(let r=winStart;r<=winEnd;r++){
                const origR=r+2;
                const v7=data[origR]&&data[origR][7]!=null?String(data[origR][7]):null;
                if(v7&&TC[v7]){winTeam=v7;winColor=TC[v7];winLogo=logoUrl(v7);break;}
              }

              return bcData.map((row,ri)=>{
                const origRi=ri+2;
                const isWStart=(ri===winStart);
                const inW=(ri>=winStart&&ri<=winEnd);
                
                // Winner data cells (cols 6-7)
                const v6=data[origRi]&&data[origRi][6]!=null?String(data[origRi][6]):null;
                const v7=data[origRi]&&data[origRi][7]!=null?String(data[origRi][7]):null;
                const hasWinData=v6!=null||v7!=null;
                
                // Is this row in the championship box area?
                const inChamp=(ri>=champStart&&ri<=champEnd);
                const champTop=(ri===champStart);
                const champBot=(ri===champEnd);
                
                return (
                  <tr key={ri}>
                    {row.map((v,ci)=> <BC key={ci} val={v} ri={ri} ci={ci} data={bcData}/>)}
                    {/* Winner data cells — show boxes even when empty */}
                    {inW ? [
                      hasWinData ? (
                        <td key="w1" style={{background:v6==="Winner"?"#000":"#fff",
                          border:"1px solid #000",height:21,padding:"1px 5px",
                          fontSize:11,fontFamily:"Arial,sans-serif",fontWeight:700,
                          color:v6==="Winner"?"#fff":(v6!=null&&parseFloat(v6)>0?"#006400":parseFloat(v6)<0?"#cc0000":"#000")}}>{v6||""}</td>
                      ) : (
                        <td key="w1" style={{background:"#fff",height:21,padding:"1px 4px",
                          borderLeft:"3px solid #000",borderRight:"1px solid #000",
                          borderTop:ri===winStart?"3px solid #000":"1px solid #000",
                          borderBottom:ri===winEnd?"3px solid #000":"1px solid #000"}}/>
                      ),
                      hasWinData ? (
                        <td key="w2" style={{
                          background:v7&&TC[v7]?TC[v7]:"#fff",
                          border:"1px solid #000",height:21,padding:"1px 5px",
                          fontSize:11,fontFamily:"Arial,sans-serif",fontWeight:700,
                          color:v7&&TC[v7]?textFor(TC[v7]):"#000",
                          WebkitTextStroke:v7&&TC[v7]?(textFor(TC[v7])==="#fff"?"0.3px #000":"0.3px #fff"):"none",
                        }}>{v7||""}</td>
                      ) : (
                        <td key="w2" style={{background:"#fff",height:21,padding:"1px 4px",
                          borderLeft:"1px solid #000",borderRight:"1px solid #000",
                          borderTop:ri===winStart?"3px solid #000":"1px solid #000",
                          borderBottom:ri===winEnd?"3px solid #000":"1px solid #000"}}/>
                      )
                    ] : [
                      <td key="w1" style={{background:TAN,border:"none",height:21}}/>,
                      <td key="w2" style={{background:TAN,border:"none",height:21}}/>
                    ]}
                    {/* Logo box to the right */}
                    {isWStart ? (
                      <td key="logo" rowSpan={wSpan} style={{background:"#fff",
                        border:"3px solid #000",
                        verticalAlign:"middle",textAlign:"center",
                        padding:4,minWidth:60,
                      }}>
                        {winLogo ? (
                          <img src={winLogo} alt={winTeam||""} style={{maxHeight:50,maxWidth:50,objectFit:"contain"}}
                            onError={e=>{e.target.style.display="none";if(e.target.nextSibling)e.target.nextSibling.style.display="block";}}/>
                        ) : null}
                        <div style={{display:winLogo?"none":"block",fontSize:13,fontWeight:800,
                          color:winColor||"#000",fontFamily:"Arial,sans-serif"}}>{winTeam||""}</div>
                      </td>
                    ) : !inW ? (
                      <td key="logo" style={{background:TAN,border:"none",height:21}}/>
                    ) : null}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STANDINGS/JOURNEY
// ═══════════════════════════════════════════════
function JourneyView({onNav}){
  const [search,setSearch]=useState("");
  const filtered=search?J.filter(j=>j.n.toLowerCase().includes(search.toLowerCase())):J;
  const hdrs=["Original Team","Round of 32","Sweet 16","Elite 8","Final 4","Championship","Final","Journey"];

  const regionMap=useMemo(()=>{
    const m={};
    ["East","South","Midwest","West"].forEach(reg=>{
      B[reg].forEach((row,ri)=>{
        if(ri%2===1&&row[1]){const name=row[1];if(J.some(j=>j.n===name))m[name]=reg;}
      });
    });
    return m;
  },[]);

  // Outcome text color: COVER=black, UPSET=red, STEAL=green
  const ocColor = (o) => o==="COVER"?"#000":o==="UPSET"?"#cc0000":o==="STEAL"?"#006400":"#000";
  const howMap = {"COVER":"Favorite Covered","UPSET":"Underdog Won","STEAL":"Favorite Stolen"};

  // Pool stats
  const stats = useMemo(()=>{
    let c=0,u=0,s=0;
    J.forEach(j=>j.o.forEach(o=>{if(o==="COVER")c++;if(o==="UPSET")u++;if(o==="STEAL")s++;}));
    return {c,u,s,t:c+u+s};
  },[]);

  return(
    <div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,padding:"4px 0"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
          style={{padding:"3px 6px",border:"1px solid #999",fontSize:11,width:170,fontFamily:"Arial,sans-serif"}}/>
        <span style={{fontSize:10,color:"#666"}}>{filtered.length} of 64</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",width:"100%"}}>
          <thead>
            <tr style={{background:"#eee"}}>
              <th style={ths}></th>
              <th style={{...ths,textAlign:"left",minWidth:155}}>Team</th>
              {hdrs.map(h => <th key={h} style={{...ths,minWidth:h==="Original Team"?180:h==="Journey"?90:130}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((j,i)=>{
              const isChamp=j.r.some(r=>r.includes("VICTORY"));
              const reg=regionMap[j.n];
              const rc=reg?RC[reg]:"#ccc";
              const elimIdx=j.r.findIndex(r=>r.includes("ELIMINATED")||r.includes("VICTORY"));
              const lastO=j.o.length>0?j.o[j.o.length-1]:"";
              const isElim=j.r.some(r=>r.includes("ELIMINATED"));
              const nameColor=isChamp?"#006400":isElim?"#cc0000":"#000";
              const nameStyle=isChamp?"italic":(isElim?"italic":"normal");
              return(
                <tr key={j.n}>
                  <td style={{padding:"1px 3px",borderLeft:`4px solid ${rc}`,width:20,textAlign:"center",
                    cursor:reg?"pointer":"default",fontSize:9,color:"#999",border:"1px solid #ccc"}}
                    onClick={()=>reg&&onNav(reg)} title={reg||""}>{i+1}</td>
                  <td style={{padding:"1px 5px",fontWeight:700,fontSize:11,fontFamily:"Arial,sans-serif",
                    color:nameColor,fontStyle:nameStyle,whiteSpace:"nowrap",border:"1px solid #ccc"}}>{j.n}</td>
                  {j.r.map((rd,ri)=>{
                    const isE=rd.includes("ELIMINATED");
                    const isV=rd.includes("VICTORY");
                    const isEmpty=!rd||rd==="nan";
                    const isPast=elimIdx>=0&&ri>elimIdx;
                    if(isPast)return <td key={ri} style={{background:"#fff",border:"none",padding:0}}/>;
                    if(isEmpty)return <td key={ri} style={{padding:0,background:"#fff",border:"1px solid #eee"}}/>;
                    if(isE)return <td key={ri} style={{padding:"1px 5px",background:"#000",color:"#f00",
                      fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif",textAlign:"center",
                      border:"1px solid #ccc"}}>ELIMINATED</td>;
                    if(isV)return <td key={ri} style={{padding:"1px 5px",background:"#006400",color:"#fff",
                      fontSize:11,fontWeight:800,fontFamily:"Arial,sans-serif",textAlign:"center",
                      border:"1px solid #ccc"}}>VICTORY!</td>;
                    if(ri===0){
                      // Original Team column: team color background with outlined text
                      const teamName=parseTeam(rd)||rd.trim();
                      const teamColor=teamName?TC[teamName]:null;
                      const bg=teamColor||"#fff";
                      const fg=teamColor?textFor(teamColor):"#000";
                      const strokeC=teamColor?(fg==="#fff"?"0.3px #000":"0.3px #fff"):"none";
                      return (
                        <td key={ri} style={{padding:"1px 5px",fontSize:11,fontFamily:"Arial,sans-serif",
                          fontWeight:700,color:fg,background:bg,WebkitTextStroke:strokeC,
                          whiteSpace:"nowrap",border:"1px solid #ccc"}}>{rd}</td>
                      );
                    }
                    const outcome=j.o[ri-1]||"COVER";
                    return(
                      <td key={ri} style={{padding:"1px 5px",fontSize:11,fontFamily:"Arial,sans-serif",
                        fontWeight:700,color:ocColor(outcome),background:"#fff",
                        whiteSpace:"nowrap",border:"1px solid #ccc"}}>{rd}</td>
                    );
                  })}
                  <td style={{padding:"1px 5px",border:"none",whiteSpace:"nowrap"}}>
                    <div style={{display:"flex",gap:2}}>
                      {j.o.map((o,oi) => (
                        <span key={oi} style={{
                          display:"inline-block",width:18,height:18,lineHeight:"18px",
                          textAlign:"center",fontSize:9,fontWeight:800,
                          fontFamily:"Arial,sans-serif",
                          background:o==="COVER"?"#000":o==="UPSET"?"#cc0000":"#006400",
                          color:"#fff",
                        }}>{o==="COVER"?"C":o==="UPSET"?"U":"S"}</span>
                      ))}
                      {/* Championship outcome for winner only */}
                      {(()=>{
                        const isChampion=j.r.some(r=>r.includes("VICTORY"));
                        if(!isChampion)return null;
                        const champRd=j.r[5]||"";
                        const m=champRd.match(/\(([^)]+)\)/);
                        const spread=m?parseFloat(m[1]):0;
                        const champOutcome=spread<0?"COVER":"UPSET";
                        return (
                          <span style={{
                            display:"inline-block",width:18,height:18,lineHeight:"18px",
                            textAlign:"center",fontSize:9,fontWeight:800,
                            fontFamily:"Arial,sans-serif",
                            background:champOutcome==="COVER"?"#000":champOutcome==="UPSET"?"#cc0000":"#006400",
                            color:"#fff",
                          }}>{champOutcome==="COVER"?"C":champOutcome==="UPSET"?"U":"S"}</span>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pool Statistics Table — round by round */}
      <div style={{marginTop:20}}>
        {(()=>{
          const rounds=["Round of 64","Round of 32","Sweet 16","Elite 8","Final 4","Championship"];
          const types=["COVER","UPSET","STEAL","PICKEM"];
          // Count outcomes per round
          const counts={};
          types.forEach(t=>{counts[t]={};rounds.forEach((_,ri)=>counts[t][ri]=0);counts[t].total=0;});
          const dogs={};rounds.forEach((_,ri)=>dogs[ri]=0);dogs.total=0;
          
          J.forEach(j=>{
            j.o.forEach((o,ri)=>{
              if(ri<rounds.length){
                const type=types.includes(o)?o:"COVER";
                counts[type][ri]++;
                counts[type].total++;
                if(o==="UPSET"||o==="STEAL"){dogs[ri]++;dogs.total++;}
              }
            });
          });
          
          // Count total underdogs in field
          let totalDogs=0;
          J.forEach(j=>{
            const rd=j.r[0]||"";
            const m=rd.match(/\(([^)]+)\)/);
            if(m){const sp=parseFloat(m[1]);if(!isNaN(sp)&&sp>0)totalDogs++;}
          });
          
          const thSt={padding:"4px 12px",fontSize:11,fontFamily:"Arial,sans-serif",fontWeight:700,textAlign:"left",borderBottom:"1px solid #ccc"};
          const tdSt={padding:"3px 12px",fontSize:11,fontFamily:"Arial,sans-serif",textAlign:"left",borderBottom:"1px solid #eee"};
          
          return (
            <table style={{borderCollapse:"collapse",fontSize:11,fontFamily:"Arial,sans-serif"}}>
              <thead>
                <tr>
                  <th style={thSt}></th>
                  <th style={thSt}>TOTAL</th>
                  {rounds.map(r=><th key={r} style={thSt}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {types.map(type=>(
                  <tr key={type}>
                    <td style={{...tdSt,fontWeight:700}}>{type}</td>
                    <td style={tdSt}>{counts[type].total}</td>
                    {rounds.map((_,ri)=><td key={ri} style={tdSt}>{counts[type][ri]}</td>)}
                  </tr>
                ))}
                <tr>
                  <td style={{...tdSt,fontWeight:700}}>DOGS = {totalDogs}</td>
                  <td style={tdSt}>{dogs.total}</td>
                  {rounds.map((_,ri)=><td key={ri} style={tdSt}>{dogs[ri]}</td>)}
                </tr>
              </tbody>
            </table>
          );
        })()}
      </div>
    </div>
  );
}

const ths={padding:"3px 5px",fontSize:10,fontWeight:700,color:"#000",textAlign:"center",
  fontFamily:"Arial,sans-serif",whiteSpace:"nowrap",borderBottom:"2px solid #000",border:"1px solid #ccc"};

// ═══════════════════════════════════════════════
// COVER/UPSET/STEAL ENGINE
// ═══════════════════════════════════════════════
function determineOutcome(favScore, dogScore, spread){
  const fav=parseFloat(favScore),dog=parseFloat(dogScore),spr=Math.abs(parseFloat(spread));
  if(isNaN(fav)||isNaN(dog)||isNaN(spr)) return null;
  if(dog>fav) return "UPSET";
  if(fav>dog) return (fav-dog)>spr?"COVER":"STEAL";
  return "PICKEM";
}

// Map team names to their region and bracket position
function findTeamInBracket(teamName){
  for(const region of ["East","South","Midwest","West"]){
    const grid=B[region];
    for(let r=0;r<grid.length;r++){
      if(grid[r][1]===teamName){
        return {region,row:r,col:1};
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════
// FIREBASE SYNC — only locked games, not full bracket
// ═══════════════════════════════════════════════
const DB_PATH="knockout2026/lockedGames";

async function loadFromFirebase(){
  try{
    const snap=await get(ref(db,DB_PATH));
    if(snap.exists()){
      console.log("Firebase: loaded lockedGames",snap.val());
      return snap.val();
    }
    console.log("Firebase: no data yet");
  }catch(e){console.error("Firebase load error:",e);}
  return {};
}

async function saveLockedGame(gameId,gameData){
  try{
    await set(ref(db,DB_PATH+"/"+gameId),gameData);
    console.log("Firebase: saved game",gameId,gameData);
  }catch(e){console.error("Firebase save error:",e);}
}

// ═══════════════════════════════════════════════
// APP — flat nav: Standings | East | South | Midwest | West | Final Four
// ═══════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("standings");
  const [ver,setVer]=useState(0);
  const [lockedGames,setLockedGames]=useState({});
  const [loaded,setLoaded]=useState(false);

  // Load from Firebase on mount — simple one-time read
  useEffect(()=>{
    loadFromFirebase().then(lg=>{
      setLockedGames(lg||{});
      setLoaded(true);
      setVer(v=>v+1);
    });
  },[]);

  const tabs=[
    {id:"standings",label:"Standings",color:"#000"},
    {id:"East",label:"East",color:RC.East},
    {id:"South",label:"South",color:RC.South},
    {id:"Midwest",label:"Midwest",color:RC.Midwest},
    {id:"West",label:"West",color:RC.West},
    {id:"FinalFour",label:"Final Four",color:"#333"},
    {id:"scores",label:"Scores",color:"#555"},
    {id:"admin",label:"Admin",color:"#555"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"Arial,Helvetica,sans-serif"}}>
      <style>{`*{box-sizing:border-box;}td,th{box-sizing:border-box;}`}</style>

      {/* Nav bar */}
      <div style={{borderBottom:"2px solid #000",padding:"0 8px",display:"flex",alignItems:"stretch",gap:0}}>
        <div style={{padding:"8px 12px 8px 4px",fontWeight:900,fontSize:16,letterSpacing:0.5,
          display:"flex",alignItems:"center",marginRight:12}}>KNOCKOUT 2026</div>
        {tabs.map(t=>{
          const active=tab===t.id;
          return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"6px 14px",border:"none",borderBottom:active?`3px solid ${t.color}`:"3px solid transparent",
              fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Arial,sans-serif",
              background:active?"#f5f5f5":"transparent",color:t.color,
              marginBottom:-2,
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{padding:"4px 8px"}}>
        {!loaded&&<div style={{padding:20,fontSize:12,color:"#666"}}>Loading from Firebase...</div>}
        {loaded&&tab==="standings"&&<JourneyView key={ver} onNav={r=>setTab(r)}/>}
        {loaded&&tab==="East"&&<RegionBracket key={ver} region="East" data={B.East}/>}
        {loaded&&tab==="South"&&<RegionBracket key={ver} region="South" data={B.South}/>}
        {loaded&&tab==="Midwest"&&<RegionBracket key={ver} region="Midwest" data={B.Midwest}/>}
        {loaded&&tab==="West"&&<RegionBracket key={ver} region="West" data={B.West}/>}
        {loaded&&tab==="FinalFour"&&<FinalFourBracket key={ver} data={B.FinalFour}/>}
        {loaded&&tab==="scores"&&<ScoresTab key={ver} lockedGames={lockedGames} onLock={(lg)=>{setLockedGames(lg);setVer(v=>v+1);}}/>}
        {loaded&&tab==="admin"&&<AdminTab/>}
      </div>
    </div>
  );
}

function ScoresTab({lockedGames={},onLock}){
  const F="Arial,sans-serif";
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [games,setGames]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  
  // First Four play-in games
  const PLAY_INS=[
    {slot:"Texas/NC State",region:"West",seed:11,team1:"Texas",team2:"NC State"},
    {slot:"Howard/UMBC",region:"Midwest",seed:16,team1:"Howard",team2:"UMBC"},
    {slot:"Lehigh/Prairie View",region:"South",seed:16,team1:"Lehigh",team2:"Prairie View"},
    {slot:"SMU/Miami (OH)",region:"Midwest",seed:11,team1:"SMU",team2:"Miami (OH)"},
  ];
  const [firstFour,setFirstFour]=useState(PLAY_INS.map(p=>({...p,status:"TBD",score1:"—",score2:"—",spread:"—",spreadDetail:"",winner:null})));
  const [autoRefresh,setAutoRefresh]=useState(true);

  const fetchScores=async(dateStr)=>{
    setLoading(true);setError(null);
    try{
      const d=(dateStr||date).replace(/-/g,"");
      const url="https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates="+d+"&groups=100&limit=100";
      setError("Fetching: "+url);
      const resp=await fetch(url);
      if(!resp.ok) throw new Error("ESPN returned "+resp.status);
      const data=await resp.json();
      setError("Found "+((data.events||[]).length)+" events");
      const allGames=(data.events||[]).map(ev=>{
        const comp=ev.competitions?.[0];const ts=comp?.competitors||[];
        const odds=comp?.odds?.[0];
        const t1name=ts[0]?.team?.displayName||ts[0]?.team?.shortDisplayName||"?";
        const t2name=ts[1]?.team?.displayName||ts[1]?.team?.shortDisplayName||"?";
        // Capture raw odds for debugging
        const rawOdds=comp?.odds||[];
        return {id:ev.id,name:ev.shortName||"",
          status:comp?.status?.type?.name||"",
          detail:comp?.status?.type?.shortDetail||comp?.status?.type?.description||"",
          clock:comp?.status?.displayClock||"",
          period:comp?.status?.period||0,
          t1:ts[0]?.team?.shortDisplayName||"?",t1full:t1name,s1:ts[0]?.score||"—",
          t2:ts[1]?.team?.shortDisplayName||"?",t2full:t2name,s2:ts[1]?.score||"—",
          sd1:ts[0]?.curatedRank?.current,sd2:ts[1]?.curatedRank?.current,
          spread:odds?.spread||odds?.pointSpread?.american||"—",
          spreadDetail:odds?.details||odds?.spread?.toString()||"",
          ou:odds?.overUnder||"—",prov:odds?.provider?.name||"",
          rawOdds:JSON.stringify(rawOdds).slice(0,500)};
      });
      
      // For games missing odds (finals), try the summary endpoint
      const gamesWithOdds=await Promise.all(allGames.map(async(g)=>{
        if(g.spread!=="—") return g;
        try{
          const sumResp=await fetch(`https://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/summary?event=${g.id}`);
          if(sumResp.ok){
            const sumData=await sumResp.json();
            // Try pickcenter, odds, or header for spread info
            const pc=sumData?.pickcenter?.[0];
            const hi=sumData?.header?.competitions?.[0];
            const hiOdds=hi?.odds?.[0];
            const spread=pc?.spread||pc?.details?.match?.(/([+-]?\d+\.?\d*)/)?.[1]||hiOdds?.spread||"—";
            const detail=pc?.details||hiOdds?.details||"";
            const ou=pc?.overUnder||hiOdds?.overUnder||g.ou;
            const prov=pc?.provider?.name||hiOdds?.provider?.name||"";
            return {...g,spread,spreadDetail:detail,ou,prov,
              rawOdds:JSON.stringify({pickcenter:sumData?.pickcenter,headerOdds:hi?.odds}).slice(0,500)};
          }
        }catch(e){console.error("Summary fetch failed for",g.id,e);}
        return g;
      }));
      setGames(gamesWithOdds);
      
      // Match First Four games
      const updated=[...firstFour];
      updated.forEach((pi,idx)=>{
        const match=gamesWithOdds.find(g=>
          (g.t1full.includes(pi.team1)&&g.t2full.includes(pi.team2))||
          (g.t1full.includes(pi.team2)&&g.t2full.includes(pi.team1))
        );
        if(match){
          const t1IsTeam1=match.t1full.includes(pi.team1);
          const isLive=match.status==="STATUS_IN_PROGRESS";
          const isFinal=match.status==="STATUS_FINAL";
          // Lock the spread when game first goes live or final (closing line)
          const shouldLock=(isLive||isFinal)&&!pi.lockedSpread;
          const locked=shouldLock?match.spread:pi.lockedSpread;
          const lockedDet=shouldLock?match.spreadDetail:pi.lockedDetail;
          // Use locked spread if available, otherwise show current
          const displaySpread=locked||match.spread;
          const displayDetail=lockedDet||match.spreadDetail;
          updated[idx]={...pi,
            score1:t1IsTeam1?match.s1:match.s2,
            score2:t1IsTeam1?match.s2:match.s1,
            spread:displaySpread,
            spreadDetail:displayDetail,
            lockedSpread:locked,
            lockedDetail:lockedDet,
            status:isFinal?"FINAL":
              isLive?`LIVE ${match.period}H ${match.clock}`:
              match.detail||"TBD",
            winner:isFinal?(
              parseInt(t1IsTeam1?match.s1:match.s2)>parseInt(t1IsTeam1?match.s2:match.s1)?pi.team1:pi.team2
            ):null,
          };
        }
      });
      setFirstFour(updated);
      
      // AUTO-LOCK: For any FINAL game not yet locked, save to Firebase
      let newLocked={...lockedGames};
      let changed=false;
      for(const g of gamesWithOdds){
        if(g.status==="STATUS_FINAL"&&!newLocked[g.id]&&g.spread!=="—"){
          const s1=parseFloat(g.s1),s2=parseFloat(g.s2);
          const sprNum=parseFloat(g.spread);
          if(isNaN(s1)||isNaN(s2)||isNaN(sprNum)) continue;
          
          // Determine fav/dog from spread detail
          let favTeam=g.t1full,dogTeam=g.t2full,favScore=s1,dogScore=s2;
          if(g.spreadDetail){
            const m=g.spreadDetail.match(/^(.+?)\s+([+-]?\d+\.?\d*)$/);
            if(m){
              const favAbbr=m[1].trim();
              const t1IsFav=g.t1full.toUpperCase().startsWith(favAbbr.toUpperCase().slice(0,3));
              if(!t1IsFav){favTeam=g.t2full;dogTeam=g.t1full;favScore=s2;dogScore=s1;}
            }
          }else if(sprNum>0){
            favTeam=g.t2full;dogTeam=g.t1full;favScore=s2;dogScore=s1;
          }
          
          const outcome=determineOutcome(favScore,dogScore,Math.abs(sprNum));
          newLocked[g.id]={
            t1:g.t1full,t2:g.t2full,s1:g.s1,s2:g.s2,
            spread:g.spread,spreadDetail:g.spreadDetail,
            favTeam,dogTeam,favScore:String(favScore),dogScore:String(dogScore),
            outcome,lockedAt:new Date().toISOString()
          };
          changed=true;
          setError(prev=>(prev||"")+" | Locked: "+g.name+" → "+outcome);
        }
      }
      if(changed){
        // Save each new game individually to Firebase
        for(const[id,gData] of Object.entries(newLocked)){
          if(!lockedGames[id]) saveLockedGame(id,gData);
        }
        if(onLock) onLock(newLocked);
      }
    }catch(e){console.error(e);setError("Error: "+e.message);setGames([]);}
    setLoading(false);
  };

  // Auto-fetch on mount
  useEffect(()=>{fetchScores();},[]);
  
  // Auto-refresh every 60s when enabled
  useEffect(()=>{
    if(!autoRefresh)return;
    const id=setInterval(()=>fetchScores(),60000);
    return ()=>clearInterval(id);
  },[autoRefresh,date]);

  const thS={padding:"4px 8px",border:"1px solid #000",background:"#eee",fontWeight:700,fontSize:11,fontFamily:F};
  const tdS={padding:"3px 6px",border:"1px solid #ccc",fontSize:11,fontFamily:F};

  return (
    <div>
      {/* Status/Error display */}
      {error&&<div style={{padding:"4px 8px",marginBottom:8,fontSize:10,fontFamily:F,
        color:error.startsWith("Error")?"#c00":"#666",background:error.startsWith("Error")?"#fff0f0":"#f0f0f0"}}>{error}</div>}
      
      {/* First Four Tracker */}
      <div style={{marginBottom:20,padding:12,border:"2px solid #000",background:"#fff"}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:8,fontFamily:F}}>First Four — Play-In Games</div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{padding:"3px 6px",border:"1px solid #999",fontSize:11,fontFamily:F}}/>
          <button onClick={()=>fetchScores()} disabled={loading} style={{padding:"4px 12px",border:"1px solid #000",background:"#000",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>
            {loading?"Loading...":"Fetch Scores"}
          </button>
          <label style={{fontSize:10,fontFamily:F,display:"flex",alignItems:"center",gap:4}}>
            <input type="checkbox" checked={autoRefresh} onChange={e=>setAutoRefresh(e.target.checked)}/>
            Auto-refresh (60s)
          </label>
        </div>
        <table style={{borderCollapse:"collapse",width:"100%"}}>
          <thead><tr>
            {["Slot","Region","Seed","Favorite","Score","Underdog","Score + Spread","Score","Spread","Status","Winner"].map(h=>
              <th key={h} style={thS}>{h}</th>
            )}
          </tr></thead>
          <tbody>{firstFour.map((pi,i)=>{
            const isFinal=pi.status==="FINAL";
            const isLive=pi.status.startsWith("LIVE");
            // Determine favorite vs underdog from spread
            const sprNum=parseFloat(pi.spread);
            const hasSpr=!isNaN(sprNum)&&sprNum!==0;
            let favName=pi.team1,dogName=pi.team2,favScore=pi.score1,dogScore=pi.score2;
            if(hasSpr&&pi.spreadDetail){
              const m=pi.spreadDetail.match(/^(.+?)\s+([+-]?\d+\.?\d*)$/);
              if(m){
                const favAbbr=m[1].trim();
                const t1IsFav=pi.team1.toUpperCase().startsWith(favAbbr.toUpperCase().slice(0,3));
                if(!t1IsFav){favName=pi.team2;dogName=pi.team1;favScore=pi.score2;dogScore=pi.score1;}
              }
            }else if(hasSpr&&sprNum>0){
              favName=pi.team2;dogName=pi.team1;favScore=pi.score2;dogScore=pi.score1;
            }
            const sprAbs=hasSpr?Math.abs(sprNum):0;
            const dogScoreNum=parseFloat(dogScore);
            const dogPlusSpread=(!isNaN(dogScoreNum)&&hasSpr)?(dogScoreNum+sprAbs).toFixed(1):"—";
            const favScoreNum=parseFloat(favScore);
            // Compare fav score vs dog+spread for color
            const dpNum=parseFloat(dogPlusSpread);
            const lineStr=hasSpr?`${dogName} +${sprAbs}`:"—";
            return (
              <tr key={i} style={{background:isFinal?"#f0fff0":isLive?"#fff8f0":"#fff"}}>
                <td style={{...tdS,fontWeight:700}}>{pi.slot}</td>
                <td style={{...tdS,color:RC[pi.region]||"#000",fontWeight:600}}>{pi.region}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700,background:"#000",color:"#fff"}}>{pi.seed}</td>
                <td style={{...tdS,fontWeight:700,background:TC[favName]||"#ddd",color:TC[favName]?textFor(TC[favName]):"#000",
                  WebkitTextStroke:TC[favName]?(textFor(TC[favName])==="#fff"?"0.3px #000":"0.3px #fff"):"none"}}>{favName}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700,
                  color:isFinal&&!isNaN(favScoreNum)&&!isNaN(dpNum)?(favScoreNum>dpNum?"#006400":"#cc0000"):"#000"}}>{favScore}</td>
                <td style={{...tdS,fontWeight:700,background:TC[dogName]||"#ddd",color:TC[dogName]?textFor(TC[dogName]):"#000",
                  WebkitTextStroke:TC[dogName]?(textFor(TC[dogName])==="#fff"?"0.3px #000":"0.3px #fff"):"none"}}>{dogName}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700,
                  color:isFinal&&!isNaN(favScoreNum)&&!isNaN(dpNum)?(dpNum>favScoreNum?"#006400":"#cc0000"):"#000"}}>{dogPlusSpread}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700}}>{dogScore}</td>
                <td style={{...tdS,textAlign:"center",color:hasSpr?"#006400":"#000"}}>
                  {hasSpr?"+"+sprAbs:"—"}{pi.lockedSpread?" 🔒":""}
                </td>
                <td style={{...tdS,fontWeight:isLive?700:400,color:isLive?"#006400":isFinal?"#000":"#666"}}>{pi.status}</td>
                <td style={{...tdS,fontWeight:800,fontSize:12,
                  color:pi.winner?"#006400":"#999",
                  background:pi.winner?(TC[pi.winner]||"#ddd"):"#fff",
                  WebkitTextStroke:pi.winner&&TC[pi.winner]?(textFor(TC[pi.winner])==="#fff"?"0.3px #000":"0.3px #fff"):"none",
                }}>{pi.winner||"TBD"}</td>
              </tr>
            );
          })}</tbody>
        </table>
        {firstFour.some(p=>p.winner)&&(
          <div style={{marginTop:8,fontSize:10,color:"#666",fontFamily:F}}>
            Resolved: {firstFour.filter(p=>p.winner).map(p=>`${p.slot} → ${p.winner} (${p.region} ${p.seed})`).join(" · ")}
          </div>
        )}
      </div>

      {/* All Games */}
      <div style={{fontWeight:700,fontSize:13,marginBottom:6,fontFamily:F}}>All Games — {date}</div>
      {games.length>0?(
        <table style={{borderCollapse:"collapse",fontSize:11,fontFamily:F,width:"100%"}}>
          <thead><tr>{["Status","Away","Score","Home","Score","Spread","O/U","Provider","Raw Odds (debug)"].map(h =>
            <th key={h} style={thS}>{h}</th>
          )}</tr></thead>
          <tbody>{games.map(g=>{
            const fin=g.status==="STATUS_FINAL";const live=g.status==="STATUS_IN_PROGRESS";
            return (<tr key={g.id}>
              <td style={{...tdS,color:live?"#006400":fin?"#000":"#666",fontWeight:live?700:400}}>{live?`LIVE ${g.period}H ${g.clock}`:fin?"FINAL":g.detail}</td>
              <td style={{...tdS,fontWeight:700}}>{g.sd2?`(${g.sd2}) `:""}{g.t2}</td>
              <td style={{...tdS,textAlign:"center",fontWeight:700}}>{g.s2}</td>
              <td style={{...tdS,fontWeight:700}}>{g.sd1?`(${g.sd1}) `:""}{g.t1}</td>
              <td style={{...tdS,textAlign:"center",fontWeight:700}}>{g.s1}</td>
              <td style={{...tdS,textAlign:"center"}}>{g.spreadDetail||g.spread}</td>
              <td style={{...tdS,textAlign:"center"}}>{g.ou}</td>
              <td style={{...tdS,fontSize:10,color:"#666"}}>{g.prov}</td>
              <td style={{...tdS,fontSize:8,color:"#999",maxWidth:300,overflow:"hidden",whiteSpace:"nowrap"}}>{g.rawOdds}</td>
            </tr>);
          })}</tbody>
        </table>
      ):<div style={{padding:20,color:"#666",fontSize:12}}>Click Fetch Scores to pull games from ESPN.</div>}
      
      {/* Locked Games from Firebase */}
      {Object.keys(lockedGames).length>0&&(
        <div style={{marginTop:20}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:6,fontFamily:F}}>Locked Results (saved to Firebase)</div>
          <table style={{borderCollapse:"collapse",fontSize:11,fontFamily:F}}>
            <thead><tr>{["Game","Favorite","Score","Underdog","Score","Spread","Outcome","Locked At"].map(h=>
              <th key={h} style={thS}>{h}</th>
            )}</tr></thead>
            <tbody>{Object.entries(lockedGames).map(([id,g])=>(
              <tr key={id}>
                <td style={tdS}>{g.t1} vs {g.t2}</td>
                <td style={{...tdS,fontWeight:700}}>{g.favTeam}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700}}>{g.favScore}</td>
                <td style={{...tdS,fontWeight:700}}>{g.dogTeam}</td>
                <td style={{...tdS,textAlign:"center",fontWeight:700}}>{g.dogScore}</td>
                <td style={{...tdS,textAlign:"center"}}>{g.spread}</td>
                <td style={{...tdS,fontWeight:800,
                  color:g.outcome==="COVER"?"#000":g.outcome==="UPSET"?"#cc0000":g.outcome==="STEAL"?"#006400":"#666"
                }}>{g.outcome||"—"}</td>
                <td style={{...tdS,fontSize:9,color:"#999"}}>{g.lockedAt?new Date(g.lockedAt).toLocaleString():""}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const PARTICIPANTS=["Anderson, John","Bordick, Mark","Bordick, Reese","Bordick, Teah","Bordick, Tyler","Boyle, Colin","Butterfield, Scott","Catanzarita, Meghan","Fallon, Dan","Fallon, Frank","Gaul, Erik","Gaul, Keara","Gill, Connor","Gill, Dai","Guttman, John","Hanlon, Andy","Hanlon, Laura","Hicks, Dave","Hicks, Kerry","Jordan, Craig","Karch, Brynn","Karch, Dave","Karch, Eloise","Lubarsky, Kevin","Maguire, Bill","Martin, Vin","McCarthy, Ryan","McGovern, Bob","McMahon, Annie","McMahon, Julian","McMahon, Leith","McMahon, Max","McMahon, Rich","Molinski, Jay","Mortenson, Jim","Moulton, Eric","Polanskij, Bohdan","Polanskij, Zander","Reilly Jr, Tim","Reilly Sr, Tim","Richardi, Andrew","Richardi, Justin","Richardi, Rob","Schmitt, Katie","Schmitt, Tom","Scruggs, Pat","Sobieszczanski, Marguerite","Solomon, Jordan","Sparaco, Erica","Specht, Willie","Stagaard, Maren","Stagaard, Meg","Stagaard, Ryan","Stagaard, Ward","Szabo, Matt","Taylor, Billy","Taylor, Katherine","Tempesta, Rick","Ward, Jack","Ward, John","Wigdor, Paul","Wolf, Pat","Wyville, Mark","Zaragosa, Kris"];

function AdminTab(){
  const F="Arial,sans-serif";
  
  const BRACKET_2026=[
    {seed:1,name:"Duke",region:"East"},{seed:2,name:"UConn",region:"East"},{seed:3,name:"Michigan State",region:"East"},{seed:4,name:"Kansas",region:"East"},
    {seed:5,name:"Saint John's",region:"East"},{seed:6,name:"Louisville",region:"East"},{seed:7,name:"UCLA",region:"East"},{seed:8,name:"Ohio State",region:"East"},
    {seed:9,name:"TCU",region:"East"},{seed:10,name:"UCF",region:"East"},{seed:11,name:"South Florida",region:"East"},{seed:12,name:"Northern Iowa",region:"East"},
    {seed:13,name:"Cal Baptist",region:"East"},{seed:14,name:"North Dakota State",region:"East"},{seed:15,name:"Furman",region:"East"},{seed:16,name:"Siena",region:"East"},
    {seed:1,name:"Arizona",region:"West"},{seed:2,name:"Purdue",region:"West"},{seed:3,name:"Gonzaga",region:"West"},{seed:4,name:"Arkansas",region:"West"},
    {seed:5,name:"Wisconsin",region:"West"},{seed:6,name:"BYU",region:"West"},{seed:7,name:"Miami (FL)",region:"West"},{seed:8,name:"Villanova",region:"West"},
    {seed:9,name:"Utah State",region:"West"},{seed:10,name:"Missouri",region:"West"},{seed:11,name:"Texas",region:"West",playIn:true},{seed:12,name:"High Point",region:"West"},
    {seed:13,name:"Hawaii",region:"West"},{seed:14,name:"Kennesaw State",region:"West"},{seed:15,name:"Queens",region:"West"},{seed:16,name:"Long Island",region:"West"},
    {seed:1,name:"Florida",region:"South"},{seed:2,name:"Houston",region:"South"},{seed:3,name:"Illinois",region:"South"},{seed:4,name:"Nebraska",region:"South"},
    {seed:5,name:"Vanderbilt",region:"South"},{seed:6,name:"North Carolina",region:"South"},{seed:7,name:"Saint Mary's",region:"South"},{seed:8,name:"Clemson",region:"South"},
    {seed:9,name:"Iowa",region:"South"},{seed:10,name:"Texas A&M",region:"South"},{seed:11,name:"VCU",region:"South"},{seed:12,name:"McNeese",region:"South"},
    {seed:13,name:"Troy",region:"South"},{seed:14,name:"Penn",region:"South"},{seed:15,name:"Idaho",region:"South"},{seed:16,name:"Lehigh/Prairie View",region:"South",playIn:true},
    {seed:1,name:"Michigan",region:"Midwest"},{seed:2,name:"Iowa State",region:"Midwest"},{seed:3,name:"Virginia",region:"Midwest"},{seed:4,name:"Alabama",region:"Midwest"},
    {seed:5,name:"Texas Tech",region:"Midwest"},{seed:6,name:"Tennessee",region:"Midwest"},{seed:7,name:"Kentucky",region:"Midwest"},{seed:8,name:"Georgia",region:"Midwest"},
    {seed:9,name:"Saint Louis",region:"Midwest"},{seed:10,name:"Santa Clara",region:"Midwest"},{seed:11,name:"SMU/Miami (OH)",region:"Midwest",playIn:true},{seed:12,name:"Akron",region:"Midwest"},
    {seed:13,name:"Hofstra",region:"Midwest"},{seed:14,name:"Wright State",region:"Midwest"},{seed:15,name:"Tennessee State",region:"Midwest"},{seed:16,name:"Howard",region:"Midwest",playIn:true},
  ];

  const [teams]=useState(BRACKET_2026);
  const [assignments,setAssignments]=useState({});
  const [dragging,setDragging]=useState(null);
  const [filterRegion,setFilterRegion]=useState("All");

  // Manual override state
  const [overrides,setOverrides]=useState([]);
  const [t1,sT1]=useState("");const [t2,sT2]=useState("");
  const [s1,sS1]=useState("");const [s2,sS2]=useState("");
  const [sp,sSp]=useState("");

  // COVER/UPSET/STEAL Engine
  const determineOutcome = (favScore, dogScore, spread) => {
    const fav=parseFloat(favScore);const dog=parseFloat(dogScore);const spr=Math.abs(parseFloat(spread));
    if(isNaN(fav)||isNaN(dog)||isNaN(spr)) return null;
    if(dog>fav) return "UPSET";
    if(fav>dog) return (fav-dog)>spr?"COVER":"STEAL";
    return "PICKEM";
  };

  // Engine tester
  const [testFav,setTestFav]=useState("");
  const [testDog,setTestDog]=useState("");
  const [testSpread,setTestSpread]=useState("");
  const testResult=determineOutcome(testFav,testDog,testSpread);

  // Assigned and unassigned participants
  const assignedNames=new Set(Object.values(assignments));
  const unassigned=PARTICIPANTS.filter(n=>!assignedNames.has(n));

  // Drop handler
  const handleDrop=(teamName)=>{
    if(!dragging)return;
    // Remove from any previous assignment
    const newA={...assignments};
    Object.keys(newA).forEach(k=>{if(newA[k]===dragging)delete newA[k];});
    newA[teamName]=dragging;
    setAssignments(newA);
    setDragging(null);
  };

  // Unassign
  const unassign=(teamName)=>{
    const newA={...assignments};
    delete newA[teamName];
    setAssignments(newA);
  };

  const filteredTeams=filterRegion==="All"?teams:teams.filter(t=>t.region.includes(filterRegion));
  const assignedCount=Object.keys(assignments).length;

  const sectionStyle={marginBottom:24,padding:12,border:"1px solid #ccc",background:"#fafafa"};
  const labelStyle={fontSize:9,color:"#666",fontFamily:F};
  const inputStyle={padding:"3px 5px",border:"1px solid #999",fontSize:11,fontFamily:F};
  const btnStyle={padding:"4px 12px",border:"1px solid #000",background:"#000",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F};
  const thStyle={padding:"3px 8px",border:"1px solid #000",background:"#eee",fontSize:11,fontFamily:F,fontWeight:700};
  const tdStyle={padding:"3px 8px",border:"1px solid #ccc",fontSize:11,fontFamily:F};

  return (
    <div>
      {/* Drag-and-Drop Roster Assignment */}
      <div style={sectionStyle}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:4,fontFamily:F}}>Roster Assignment</div>
        <div style={{fontSize:11,color:"#666",marginBottom:8,fontFamily:F}}>
          Drag names from the right and drop them onto their team. {assignedCount}/64 assigned.
        </div>

        {/* Play-in note */}
        <div style={{fontSize:10,color:"#888",marginBottom:8,fontFamily:F}}>
          Play-in games (marked ⚡): assign one team as placeholder. Swap if the other team wins.
        </div>

        {/* Region filter and drag-drop */}
        <div>
            {/* Region filter */}
            <div style={{display:"flex",gap:4,marginBottom:8}}>
              {["All","East","South","Midwest","West"].map(r=>(
                <button key={r} onClick={()=>setFilterRegion(r)} style={{
                  padding:"2px 10px",border:"1px solid "+(filterRegion===r?"#000":"#ccc"),
                  background:filterRegion===r?"#000":"#fff",color:filterRegion===r?"#fff":"#000",
                  fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F,
                }}>{r}</button>
              ))}
              <span style={{fontSize:10,color:"#666",marginLeft:8,alignSelf:"center"}}>{assignedCount}/64 assigned</span>
            </div>

            <div style={{display:"flex",gap:16}}>
              {/* Teams + assignment slots */}
              <div style={{flex:"1 1 60%",maxHeight:600,overflowY:"auto"}}>
                <table style={{borderCollapse:"collapse",width:"100%"}}>
                  <thead><tr>
                    <th style={thStyle}>Seed</th>
                    <th style={thStyle}>Team</th>
                    <th style={thStyle}>Region</th>
                    <th style={{...thStyle,minWidth:180}}>Assigned To</th>
                  </tr></thead>
                  <tbody>{filteredTeams.map(t=>{
                    const assigned=assignments[t.name];
                    const color=TC[t.name];
                    return (
                      <tr key={t.name}
                        onDragOver={e=>e.preventDefault()}
                        onDrop={()=>handleDrop(t.name)}
                        style={{background:assigned?"#f0fff0":"#fff"}}>
                        <td style={{...tdStyle,textAlign:"center",fontWeight:700,
                          background:"#000",color:"#fff",width:35}}>{t.seed}</td>
                        <td style={{...tdStyle,fontWeight:700,
                          background:color||"#ddd",color:color?textFor(color):"#000",
                          WebkitTextStroke:color?(textFor(color)==="#fff"?"0.3px #000":"0.3px #fff"):"none",
                        }}>{t.playIn?"⚡ ":""}{t.name}</td>
                        <td style={{...tdStyle,color:RC[t.region]||"#000",fontWeight:600}}>{t.region}</td>
                        <td style={{...tdStyle,minWidth:180,
                          background:assigned?"#f0fff0":"#fff8f0",
                          border:!assigned?"2px dashed #ccc":"1px solid #ccc",
                        }}>
                          {assigned?(
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <span style={{fontWeight:700}}>{assigned}</span>
                              <button onClick={()=>unassign(t.name)} style={{border:"none",background:"none",color:"#c00",cursor:"pointer",fontWeight:700,fontSize:14}}>×</button>
                            </div>
                          ):(
                            <span style={{color:"#ccc",fontSize:10}}>drop name here</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>

              {/* Unassigned participants */}
              <div style={{flex:"0 0 200px",maxHeight:600,overflowY:"auto"}}>
                <div style={{fontSize:10,fontWeight:700,marginBottom:4,fontFamily:F,color:"#666"}}>
                  UNASSIGNED ({unassigned.length})
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {unassigned.map(name=>(
                    <div key={name} draggable
                      onDragStart={()=>setDragging(name)}
                      onDragEnd={()=>setDragging(null)}
                      style={{
                        padding:"3px 8px",fontSize:11,fontFamily:F,fontWeight:600,
                        background:dragging===name?"#e0e0e0":"#fff",
                        border:"1px solid #ccc",cursor:"grab",
                        userSelect:"none",
                      }}>{name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Outcome Engine Tester */}
      <div style={sectionStyle}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:8,fontFamily:F}}>Outcome Engine Tester</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div><div style={labelStyle}>Favorite Score</div>
            <input value={testFav} onChange={e=>setTestFav(e.target.value)} style={{...inputStyle,width:70}}/></div>
          <div><div style={labelStyle}>Underdog Score</div>
            <input value={testDog} onChange={e=>setTestDog(e.target.value)} style={{...inputStyle,width:70}}/></div>
          <div><div style={labelStyle}>Spread</div>
            <input value={testSpread} onChange={e=>setTestSpread(e.target.value)} style={{...inputStyle,width:60}}/></div>
          <div style={{fontSize:13,fontWeight:800,fontFamily:F,padding:"3px 12px",
            color:testResult==="COVER"?"#000":testResult==="UPSET"?"#cc0000":testResult==="STEAL"?"#006400":"#999",
            background:testResult?"#f0f0f0":"transparent",
          }}>{testResult||"—"}</div>
        </div>
        <div style={{fontSize:10,color:"#888",marginTop:6,fontFamily:F}}>
          COVER = favorite wins & covers · UPSET = underdog wins outright · STEAL = favorite wins but doesn't cover
        </div>
      </div>

      {/* Manual Score Override */}
      <div style={sectionStyle}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:8,fontFamily:F}}>Manual Score/Spread Override</div>
        <div style={{fontSize:11,color:"#666",marginBottom:8,fontFamily:F}}>Use this if ESPN's feed gets stuck.</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",marginBottom:12,flexWrap:"wrap"}}>
          {[["Team 1",t1,sT1,120],["Score",s1,sS1,50],["Team 2",t2,sT2,120],["Score",s2,sS2,50],["Spread (neg=T1 fav)",sp,sSp,100]].map(([l,v,fn,w])=>(
            <div key={l}><div style={labelStyle}>{l}</div>
            <input value={v} onChange={e=>fn(e.target.value)} style={{...inputStyle,width:w}}/></div>
          ))}
          <button onClick={()=>{if(!t1||!t2)return;
            const outcome=determineOutcome(parseFloat(sp)<0?s1:s2,parseFloat(sp)<0?s2:s1,sp);
            setOverrides([...overrides,{t1,t2,s1,s2,sp,outcome:outcome||"?",time:new Date().toLocaleTimeString()}]);
            sT1("");sT2("");sS1("");sS2("");sSp("");
          }} style={btnStyle}>Add</button>
        </div>
        {overrides.length>0&&(
          <table style={{borderCollapse:"collapse",width:"100%"}}>
            <thead><tr>{["Time","Team 1","Score","Team 2","Score","Spread","Outcome",""].map(h=>
              <th key={h} style={thStyle}>{h}</th>
            )}</tr></thead>
            <tbody>{overrides.map((o,i)=>(
              <tr key={i}>
                <td style={tdStyle}>{o.time}</td>
                <td style={{...tdStyle,fontWeight:700}}>{o.t1}</td>
                <td style={{...tdStyle,textAlign:"center"}}>{o.s1}</td>
                <td style={{...tdStyle,fontWeight:700}}>{o.t2}</td>
                <td style={{...tdStyle,textAlign:"center"}}>{o.s2}</td>
                <td style={{...tdStyle,textAlign:"center"}}>{o.sp}</td>
                <td style={{...tdStyle,fontWeight:800,
                  color:o.outcome==="COVER"?"#000":o.outcome==="UPSET"?"#cc0000":o.outcome==="STEAL"?"#006400":"#666"
                }}>{o.outcome}</td>
                <td style={tdStyle}>
                  <button onClick={()=>setOverrides(overrides.filter((_,j)=>j!==i))} style={{border:"none",background:"none",color:"#c00",cursor:"pointer",fontWeight:700}}>×</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
