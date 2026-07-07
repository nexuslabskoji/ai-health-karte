const STORE="kenko_karte_v12_3";
const ORDER="kenko_karte_v12_3_order";
const cats={urine:"🚽 排尿",water:"🥤 飲水",weight:"⚖️ 体重",glucose:"🩸 血糖値",bp:"❤️ 血圧",meal:"🍽️ 食事",bowel:"💩 排便",medicine:"💊 服薬",memo:"🩺 体調メモ"};
const defOrder=["urine","water","weight","glucose","bp","meal","bowel","medicine","memo"];
function today(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function selectedDate(){return document.getElementById("recordDate")?.value || today()}
function slash(){return selectedDate().replaceAll("-","/")}
function now(){const d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function data(){try{return JSON.parse(localStorage.getItem(STORE+"_"+selectedDate()))||[]}catch(e){return[]}}
function setData(a){localStorage.setItem(STORE+"_"+selectedDate(),JSON.stringify(a));render()}
function order(){try{return JSON.parse(localStorage.getItem(ORDER))||defOrder}catch(e){return defOrder}}
function setOrder(o){localStorage.setItem(ORDER,JSON.stringify(o));render()}
function add(type,obj){const a=data();a.push({type,time:obj.time||now(),date:selectedDate(),...obj});setData(a);toast("保存しました")}
function n(v){return parseFloat(String(v||"").replace(",","."))||0}
function v(id){return document.getElementById(id)?.value||""}
function clearInputs(ids){ids.forEach(id=>{let e=document.getElementById(id);if(e)e.value=""});setTimes()}
function setTimes(){document.querySelectorAll('input[type="time"]').forEach(e=>{if(!e.value)e.value=now()})}
function tick(){const d=new Date();document.getElementById("clock").textContent=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0");document.getElementById("dateText").textContent=d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日（"+"日月火水木金土"[d.getDay()]+"）"}
function form(type){
 if(type==="urine")return `<section class="card"><h2>🚽 排尿</h2><label>時刻</label><input id="urineTime" type="time"><div class="grid2"><div><label>排尿前 kg</label><input id="beforeKg" inputmode="decimal"></div><div><label>排尿後 kg</label><input id="afterKg" inputmode="decimal"></div></div><label>推定尿量 mL</label><input id="urineMl" inputmode="numeric"><label>排尿回数</label><input id="urineCount" inputmode="numeric" placeholder="例 1"><label>メモ</label><textarea id="urineMemo"></textarea><button class="primary" onclick="saveUrine()">保存</button></section>`;
 if(type==="water")return `<section class="card"><h2>🥤 飲水</h2><label>時刻</label><input id="waterTime" type="time"><label>飲水量 mL</label><input id="waterMl" inputmode="numeric"><label>メモ</label><textarea id="waterMemo"></textarea><button class="primary" onclick="saveWater()">保存</button></section>`;
 if(type==="weight")return `<section class="card"><h2>⚖️ 体重</h2><label>時刻</label><input id="weightTime" type="time"><label>体重 kg</label><input id="weightKg" inputmode="decimal" placeholder="例 97.6"><button class="primary" onclick="saveWeight()">保存</button></section>`;
 if(type==="glucose")return `<section class="card"><h2>🩸 血糖値</h2><label>時刻</label><input id="glucoseTime" type="time"><label>血糖値 mg/dL</label><input id="glucoseValue" inputmode="numeric"><label>タイミング</label><select id="glucoseTiming"><option>起床時</option><option>食前</option><option>食後30分</option><option>食後1時間</option><option>食後2時間</option><option>就寝前</option><option>その他</option></select><label>メモ</label><textarea id="glucoseMemo"></textarea><button class="primary" onclick="saveGlucose()">保存</button></section>`;
 if(type==="bp")return `<section class="card"><h2>❤️ 血圧</h2><label>時刻</label><input id="bpTime" type="time"><div class="grid2"><div><label>上</label><input id="bpHigh" inputmode="numeric"></div><div><label>下</label><input id="bpLow" inputmode="numeric"></div></div><label>脈拍</label><input id="bpPulse" inputmode="numeric"><label>メモ</label><textarea id="bpMemo"></textarea><button class="primary" onclick="saveBp()">保存</button></section>`;
 if(type==="meal")return `<section class="card"><h2>🍽️ 食事</h2><label>時刻</label><input id="mealTime" type="time"><label>内容</label><textarea id="mealMemo"></textarea><label>推定カロリー kcal</label><input id="calorie" inputmode="numeric"><button class="primary" onclick="saveMeal()">保存</button></section>`;
 if(type==="bowel")return `<section class="card"><h2>💩 排便</h2><label>時刻</label><input id="bowelTime" type="time"><label>回数</label><input id="bowelCount" inputmode="numeric" placeholder="例 1"><label>状態</label><select id="bowelState"><option>普通</option><option>コロコロ</option><option>硬い</option><option>柔らかい</option><option>下痢気味</option></select><label>メモ</label><textarea id="bowelMemo"></textarea><button class="primary" onclick="saveBowel()">保存</button></section>`;
 if(type==="medicine")return `<section class="card"><h2>💊 服薬</h2><label>時刻</label><input id="medicineTime" type="time"><label>タイミング</label><select id="medicineTiming"><option>朝</option><option>昼</option><option>夜</option><option>寝る前</option><option>その他</option></select><label>薬名</label><textarea id="medicineMemo"></textarea><button class="primary" onclick="saveMedicine()">保存</button></section>`;
 if(type==="memo")return `<section class="card"><h2>🩺 体調メモ</h2><label>時刻</label><input id="memoTime" type="time"><label>内容</label><textarea id="memoText"></textarea><button class="primary" onclick="saveMemo()">保存</button></section>`;
}
function saveUrine(){let ml=n(v("urineMl")),before=n(v("beforeKg")),after=n(v("afterKg"));if(before&&after)ml=Math.max(0,Math.round((before-after)*1000));if(!ml)return alert("尿量を入力してください");add("urine",{time:v("urineTime"),ml,count:n(v("urineCount"))||1,memo:v("urineMemo")});clearInputs(["beforeKg","afterKg","urineMl","urineCount","urineMemo"])}
function saveWater(){if(!n(v("waterMl")))return alert("飲水量を入力してください");add("water",{time:v("waterTime"),ml:n(v("waterMl")),memo:v("waterMemo")});clearInputs(["waterMl","waterMemo"])}
function saveWeight(){if(!n(v("weightKg")))return alert("体重を入力してください");add("weight",{time:v("weightTime"),kg:n(v("weightKg"))});clearInputs(["weightKg"])}
function saveGlucose(){if(!n(v("glucoseValue")))return alert("血糖値を入力してください");add("glucose",{time:v("glucoseTime"),value:n(v("glucoseValue")),timing:v("glucoseTiming"),memo:v("glucoseMemo")});clearInputs(["glucoseValue","glucoseMemo"])}
function saveBp(){if(!n(v("bpHigh"))||!n(v("bpLow")))return alert("血圧を入力してください");add("bp",{time:v("bpTime"),high:n(v("bpHigh")),low:n(v("bpLow")),pulse:n(v("bpPulse")),memo:v("bpMemo")});clearInputs(["bpHigh","bpLow","bpPulse","bpMemo"])}
function saveMeal(){if(!v("mealMemo"))return alert("食事内容を入力してください");add("meal",{time:v("mealTime"),memo:v("mealMemo"),cal:n(v("calorie"))});clearInputs(["mealMemo","calorie"])}
function saveBowel(){add("bowel",{time:v("bowelTime"),count:n(v("bowelCount"))||1,state:v("bowelState"),memo:v("bowelMemo")});clearInputs(["bowelCount","bowelMemo"])}
function saveMedicine(){add("medicine",{time:v("medicineTime"),timing:v("medicineTiming"),memo:v("medicineMemo")});clearInputs(["medicineMemo"])}
function saveMemo(){if(!v("memoText"))return alert("内容を入力してください");add("memo",{time:v("memoTime"),memo:v("memoText")});clearInputs(["memoText"])}
function totals(){const a=data();return{urineCount:a.filter(x=>x.type=="urine").reduce((s,x)=>s+(x.count||1),0),urineMl:a.filter(x=>x.type=="urine").reduce((s,x)=>s+n(x.ml),0),water:a.filter(x=>x.type=="water").reduce((s,x)=>s+n(x.ml),0),bowel:a.filter(x=>x.type=="bowel").reduce((s,x)=>s+(x.count||1),0),cal:a.filter(x=>x.type=="meal").reduce((s,x)=>s+n(x.cal),0),med:a.filter(x=>x.type=="medicine").length,lastWeight:[...a].reverse().find(x=>x.type=="weight"),lastBp:[...a].reverse().find(x=>x.type=="bp"),lastGlucose:[...a].reverse().find(x=>x.type=="glucose")}}
function render(){let o=order();document.getElementById("categoryArea").innerHTML=o.map(form).join("");setTimes();renderOrder(o);renderQuick();renderRecords();renderAI()}
function renderQuick(){let t=totals();qWeight.textContent=t.lastWeight?t.lastWeight.kg+"kg":"未記録";qBp.textContent=t.lastBp?`${t.lastBp.high}/${t.lastBp.low}`:"未記録";qGlucose.textContent=t.lastGlucose?t.lastGlucose.value+"mg/dL":"未記録";qUrineCount.textContent=t.urineCount+"回";qUrineMl.textContent=t.urineMl+"mL";qWaterMl.textContent=t.water+"mL";qBowel.textContent=t.bowel+"回";qCal.textContent=t.cal+"kcal";qMed.textContent=t.med+"回"}
function renderOrder(o){orderList.innerHTML=o.map((x,i)=>`<div class="orderRow"><div class="orderName">${cats[x]}</div><button class="moveBtn" onclick="move(${i},-1)">↑</button><button class="moveBtn" onclick="move(${i},1)">↓</button></div>`).join("")}
function move(i,d){let o=order(),j=i+d;if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];setOrder(o);toast("並び替えました")}
function renderRecords(){let a=data();records.innerHTML=a.length?a.map((x,i)=>`<div class="record">${line(x)}<div class="actions"><button class="small del" onclick="del(${i})">削除</button></div></div>`).join(""):"記録なし"}
function line(x){if(x.type=="urine")return `${x.time} 排尿 約${x.ml}mL / ${x.count||1}回 ${x.memo||""}`;if(x.type=="water")return `${x.time} 飲水 ${x.ml}mL ${x.memo||""}`;if(x.type=="weight")return `${x.time} 体重 ${x.kg}kg`;if(x.type=="glucose")return `${x.time} 血糖値 ${x.value}mg/dL / ${x.timing} ${x.memo||""}`;if(x.type=="bp")return `${x.time} 血圧 ${x.high}/${x.low}${x.pulse?"/脈拍"+x.pulse:""} ${x.memo||""}`;if(x.type=="meal")return `${x.time} 食事 約${x.cal||0}kcal\n${x.memo}`;if(x.type=="bowel")return `${x.time} 排便 ${x.count||1}回 / ${x.state} ${x.memo||""}`;if(x.type=="medicine")return `${x.time} 服薬 ${x.timing}\n${x.memo||""}`;if(x.type=="memo")return `${x.time} 体調メモ\n${x.memo}`}
function del(i){let a=data();a.splice(i,1);setData(a)}
function renderAI(){
  let t=totals(),a=data();
  if(!a.length){
    aiBox.innerHTML='記録を入力すると、ここに大きくAI診断を表示します。';
    return;
  }

  let score=75;
  let good=[];
  let warn=[];
  let advice=[];

  if(t.lastBp){
    if(t.lastBp.high<130 && t.lastBp.low<85){
      score+=10;
      good.push(`血圧は良好です（${t.lastBp.high}/${t.lastBp.low}）。`);
    }else if(t.lastBp.high<140 && t.lastBp.low<90){
      score+=4;
      good.push(`血圧は概ね良好です（${t.lastBp.high}/${t.lastBp.low}）。`);
    }else if(t.lastBp.high>=160 || t.lastBp.low>=100){
      score-=18;
      warn.push(`血圧が高めです（${t.lastBp.high}/${t.lastBp.low}）。`);
      advice.push("安静後に再測定し、高い状態が続く場合は医師に相談してください。");
    }else{
      score-=6;
      warn.push(`血圧は少し高めです（${t.lastBp.high}/${t.lastBp.low}）。`);
    }
  }

  if(t.lastGlucose){
    if(t.lastGlucose.value<70){
      score-=20;
      warn.push(`血糖値が低めです（${t.lastGlucose.value}mg/dL）。`);
      advice.push("低血糖症状がある場合はブドウ糖などで対応してください。");
    }else if(t.lastGlucose.value<=140){
      score+=10;
      good.push(`血糖値は良好です（${t.lastGlucose.value}mg/dL）。`);
    }else if(t.lastGlucose.value<200){
      score-=8;
      warn.push(`血糖値は少し高めです（${t.lastGlucose.value}mg/dL）。`);
      advice.push("食後の数値なら食事内容と時間を一緒に記録すると傾向が見えます。");
    }else{
      score-=15;
      warn.push(`血糖値が高めです（${t.lastGlucose.value}mg/dL）。`);
      advice.push("水分、食事量、服薬状況を確認し、同じ高さが続く場合は相談してください。");
    }
  }

  if(t.lastWeight){
    good.push(`体重は${t.lastWeight.kg}kgで記録されています。`);
  }

  if(t.water===0){
    warn.push("飲水量がまだ記録されていません。");
  }else if(t.water<1200){
    score-=5;
    warn.push(`飲水量が少なめです（${t.water}mL）。`);
    advice.push("無理のない範囲で、少しずつ水分を追加してください。");
  }else if(t.water<=2500){
    score+=5;
    good.push(`飲水量は良い範囲です（${t.water}mL）。`);
  }else if(t.water>3500){
    warn.push(`飲水量が多めです（${t.water}mL）。`);
  }

  if(t.bowel>0){
    good.push(`排便が${t.bowel}回あり、腸の動きは記録されています。`);
  }

  score=Math.max(0,Math.min(100,score));

  let grade = score>=90 ? "とても良好" : score>=75 ? "概ね良好" : score>=60 ? "注意しながら継続" : "要注意";
  let html = `<span class="aiScore">${score}点</span><strong>${grade}</strong>`;

  html += `<span class="aiTitle">🟢 良い点</span><div class="aiGood">${good.length?good.join("<br>"):"良い点は、記録が増えるほど詳しく表示されます。"}</div>`;
  html += `<span class="aiTitle">🟡 注意点</span><div class="aiWarn">${warn.length?warn.join("<br>"):"大きな注意点はありません。"}</div>`;
  html += `<span class="aiTitle">💡 今日のアドバイス</span><div class="aiAdvice">${advice.length?advice.join("<br>"):"この調子で記録を続けましょう。血圧・血糖値・体重の流れを見ることが大切です。"}</div>`;

  aiBox.innerHTML=html;
}
function makeSummary(){let t=totals(),a=data();let txt=`健康カルテ記録\n\n${slash()}\n\n【この日の集計】\n排尿回数：${t.urineCount}回\n総尿量：約${t.urineMl}mL\n飲水量：約${t.water}mL\n尿量−飲水：約${t.urineMl-t.water}mL\n排便：${t.bowel}回\n服薬：${t.med}回\n推定カロリー：約${t.cal}kcal\n\n【記録一覧】\n${a.map(line).join("\n")||"記録なし"}\n\n糖尿病・高血圧・体重管理の観点から評価してください。`;result.textContent=txt;setTimeout(function(){result.scrollIntoView({behavior:"smooth",block:"start"});},200);return txt}
async function copySummary(){let txt=makeSummary();try{await navigator.clipboard.writeText(txt);toast("コピーしました")}catch(e){toast("コピーできませんでした")}}
function clearSelectedDay(){if(confirm("選択中の日付の記録をすべて削除しますか？")){localStorage.removeItem(STORE+"_"+selectedDate());render();result.textContent="集計ボタンを押すと表示されます。"}}
function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}
function toast(s){let e=document.getElementById("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1400)}
function init(){recordDate.value=today();recordDate.addEventListener("change",function(){render();result.textContent="集計ボタンを押すと表示されます。";toast("記録日を変更しました")});setInterval(tick,1000);tick();render()}
document.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});
document.addEventListener("gesturechange",e=>e.preventDefault(),{passive:false});
document.addEventListener("gestureend",e=>e.preventDefault(),{passive:false});
let lastTouchEnd=0;document.addEventListener("touchend",function(e){let nowTime=Date.now();if(nowTime-lastTouchEnd<=300){e.preventDefault()}lastTouchEnd=nowTime},{passive:false});
init();


/* =========================================================
   AI健康カルテ Ver.13
   健康履歴・比較・見やすい集計
   ========================================================= */

function allStoredDatesV13(){
  const dates = [];
  const prefix = STORE + "_";
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k && k.startsWith(prefix)){
      const d = k.replace(prefix,"");
      if(/^\d{4}-\d{2}-\d{2}$/.test(d)) dates.push(d);
    }
  }
  return dates.sort().reverse();
}

function dataForDateV13(date){
  try{return JSON.parse(localStorage.getItem(STORE+"_"+date))||[]}catch(e){return[]}
}

function totalsForDateV13(date){
  const a=dataForDateV13(date);
  return{
    urineCount:a.filter(x=>x.type=="urine").reduce((s,x)=>s+(x.count||1),0),
    urineMl:a.filter(x=>x.type=="urine").reduce((s,x)=>s+n(x.ml),0),
    water:a.filter(x=>x.type=="water").reduce((s,x)=>s+n(x.ml),0),
    bowel:a.filter(x=>x.type=="bowel").reduce((s,x)=>s+(x.count||1),0),
    cal:a.filter(x=>x.type=="meal").reduce((s,x)=>s+n(x.cal),0),
    med:a.filter(x=>x.type=="medicine").length,
    lastWeight:[...a].reverse().find(x=>x.type=="weight"),
    lastBp:[...a].reverse().find(x=>x.type=="bp"),
    lastGlucose:[...a].reverse().find(x=>x.type=="glucose")
  };
}

function jpDateV13(d){
  return d.replaceAll("-","/");
}

function renderHistoryV13(){
  const el=document.getElementById("historyList");
  if(!el) return;
  const dates=allStoredDatesV13();
  if(!dates.length){
    el.innerHTML='<div class="hint">まだ履歴はありません。</div>';
    return;
  }
  el.innerHTML=dates.slice(0,14).map(d=>{
    const t=totalsForDateV13(d);
    const count=dataForDateV13(d).length;
    return `<div class="historyDay">
      <div><strong>${jpDateV13(d)}</strong><br><span class="hint">${count}件 / 体重 ${t.lastWeight?t.lastWeight.kg+"kg":"未記録"} / 血糖 ${t.lastGlucose?t.lastGlucose.value:"-"}</span></div>
      <button onclick="selectHistoryDateV13('${d}')">表示</button>
    </div>`;
  }).join("");
}

function selectHistoryDateV13(d){
  const input=document.getElementById("recordDate");
  if(input){input.value=d;}
  render();
  result.textContent="集計ボタンを押すと表示されます。";
  toast("履歴を表示しました");
  setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),100);
}

function previousDateWithDataV13(current){
  const dates=allStoredDatesV13().filter(d=>d<current);
  return dates.length?dates[0]:null;
}

function diffTextV13(name, nowVal, oldVal, unit, lowerBetter=false){
  if(nowVal==null || oldVal==null) return `<div class="compareRow"><b>${name}</b><br>比較データがまだ足りません。</div>`;
  const diff = Math.round((nowVal-oldVal)*10)/10;
  const arrow = diff>0 ? "↑" : diff<0 ? "↓" : "→";
  const cls = diff===0 ? "" : ((lowerBetter ? diff<0 : diff>0) ? "compareGood" : "compareWarn");
  const sign = diff>0 ? "+" : "";
  return `<div class="compareRow"><b>${name}</b><br>前回：${oldVal}${unit} → 今回：${nowVal}${unit}<br><span class="${cls}">${arrow} ${sign}${diff}${unit}</span></div>`;
}

function renderCompareV13(){
  const el=document.getElementById("compareBox");
  if(!el) return;
  const cur=selectedDate();
  const prev=previousDateWithDataV13(cur);
  if(!prev){
    el.innerHTML="比較できる過去データがまだありません。";
    return;
  }
  const t=totalsForDateV13(cur);
  const p=totalsForDateV13(prev);
  const rows=[];
  rows.push(`<div class="compareRow"><b>比較対象</b><br>${jpDateV13(prev)} → ${jpDateV13(cur)}</div>`);
  rows.push(diffTextV13("⚖️ 体重", t.lastWeight?.kg, p.lastWeight?.kg, "kg", true));
  rows.push(diffTextV13("🩸 血糖値", t.lastGlucose?.value, p.lastGlucose?.value, "mg/dL", true));
  if(t.lastBp && p.lastBp){
    rows.push(diffTextV13("❤️ 血圧 上", t.lastBp.high, p.lastBp.high, "", true));
    rows.push(diffTextV13("❤️ 血圧 下", t.lastBp.low, p.lastBp.low, "", true));
  }else{
    rows.push(`<div class="compareRow"><b>❤️ 血圧</b><br>比較データがまだ足りません。</div>`);
  }
  rows.push(diffTextV13("🥤 飲水量", t.water, p.water, "mL", false));
  rows.push(diffTextV13("🚽 尿量", t.urineMl, p.urineMl, "mL", false));
  el.innerHTML=rows.join("");
}

function statusV13(type, value, value2){
  if(type==="bp"){
    if(value==null||value2==null) return ["未記録","statusWarn"];
    if(value<130 && value2<85) return ["良好","statusGood"];
    if(value>=160 || value2>=100) return ["要注意","statusBad"];
    if(value>=140 || value2>=90) return ["注意","statusWarn"];
    return ["概ね良好","statusGood"];
  }
  if(type==="glucose"){
    if(value==null) return ["未記録","statusWarn"];
    if(value<70) return ["低め","statusBad"];
    if(value<=140) return ["良好","statusGood"];
    if(value<200) return ["やや高め","statusWarn"];
    return ["高め","statusBad"];
  }
  if(type==="water"){
    if(value===0) return ["未記録","statusWarn"];
    if(value<1200) return ["少なめ","statusWarn"];
    if(value>3500) return ["多め","statusWarn"];
    return ["良好","statusGood"];
  }
  return ["記録","statusGood"];
}

function cardV13(icon,name,value,status){
  return `<div class="summaryCardItem">
    <div class="sIcon">${icon}</div>
    <div class="sName">${name}</div>
    <div class="sValue">${value}</div>
    <span class="summaryStatus ${status[1]}">${status[0]}</span>
  </div>`;
}

function makeSummaryTextV13(){
  let t=totals(),a=data();
  return `健康カルテ記録

${slash()}

【この日の集計】
排尿回数：${t.urineCount}回
総尿量：約${t.urineMl}mL
飲水量：約${t.water}mL
尿量−飲水：約${t.urineMl-t.water}mL
排便：${t.bowel}回
服薬：${t.med}回
推定カロリー：約${t.cal}kcal

【記録一覧】
${a.map(line).join("\n")||"記録なし"}

糖尿病・高血圧・体重管理の観点から評価してください。`;
}

function makeSummary(){
  const t=totals();
  const bpStatus=statusV13("bp", t.lastBp?.high, t.lastBp?.low);
  const gStatus=statusV13("glucose", t.lastGlucose?.value);
  const wStatus=t.lastWeight?["記録済み","statusGood"]:["未記録","statusWarn"];
  const waterStatus=statusV13("water", t.water);
  const detail=makeSummaryTextV13();

  const html = `
  <div class="summaryCards">
    <div class="summaryGrid">
      ${cardV13("❤️","血圧",t.lastBp?`${t.lastBp.high}/${t.lastBp.low}`:"未記録",bpStatus)}
      ${cardV13("🩸","血糖値",t.lastGlucose?`${t.lastGlucose.value}mg/dL`:"未記録",gStatus)}
      ${cardV13("⚖️","体重",t.lastWeight?`${t.lastWeight.kg}kg`:"未記録",wStatus)}
      ${cardV13("🥤","飲水量",`${t.water}mL`,waterStatus)}
      ${cardV13("🚽","排尿",`${t.urineCount}回 / ${t.urineMl}mL`,["記録","statusGood"])}
      ${cardV13("💩","排便",`${t.bowel}回`,t.bowel?["記録","statusGood"]:["未記録","statusWarn"])}
      ${cardV13("💊","服薬",`${t.med}回`,t.med?["記録","statusGood"]:["未記録","statusWarn"])}
      ${cardV13("🔥","カロリー",`${t.cal}kcal`,t.cal?["記録","statusGood"]:["未記録","statusWarn"])}
    </div>
    <details class="detailData">
      <summary>ChatGPTへ送る詳細データを開く</summary>
      <pre>${detail.replace(/[&<>]/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))}</pre>
    </details>
  </div>`;
  result.innerHTML=html;
  setTimeout(function(){result.scrollIntoView({behavior:"smooth",block:"start"});},200);
  return detail;
}

async function copySummary(){
  let txt=makeSummaryTextV13();
  try{await navigator.clipboard.writeText(txt);toast("コピーしました")}catch(e){toast("コピーできませんでした")}
}

const oldRenderV13 = render;
render = function(){
  oldRenderV13();
  renderHistoryV13();
  renderCompareV13();
};
setTimeout(()=>{renderHistoryV13();renderCompareV13();},300);
