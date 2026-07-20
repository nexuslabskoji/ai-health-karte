const STORE="kenko_karte_v12_3";
const ORDER="kenko_karte_v12_3_order";
const cats={urine:"🚽 排尿",water:"🥤 飲水",weight:"🏋️ 体重",glucose:"🩸 血糖値",bp:"❤️ 血圧",meal:"🍽️ 食事",bowel:"💩 排便",medicine:"💊 服薬",memo:"🩺 体調メモ"};
const defOrder=["urine","water","weight","glucose","bp","meal","bowel","medicine","memo"];
function today(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function selectedDate(){return document.getElementById("recordDate")?.value || today()}
function slash(){return selectedDate().replaceAll("-","/")}
function now(){const d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function data(){try{return JSON.parse(localStorage.getItem(STORE+"_"+selectedDate()))||[]}catch(e){return[]}}
function setData(a){createAutoBackupV142("保存前");localStorage.setItem(STORE+"_"+selectedDate(),JSON.stringify(a));createAutoBackupV142("保存後");render();updateBackupStatusV142()}
function order(){try{return JSON.parse(localStorage.getItem(ORDER))||defOrder}catch(e){return defOrder}}
function setOrder(o){localStorage.setItem(ORDER,JSON.stringify(o));render()}
function add(type,obj){const a=data();a.push({type,time:obj.time||now(),date:selectedDate(),...obj});setData(a);toast("保存しました")}
function n(v){return parseFloat(String(v||"").replace(",","."))||0}
function v(id){return document.getElementById(id)?.value||""}
function clearInputs(ids){ids.forEach(id=>{let e=document.getElementById(id);if(e)e.value=""});setTimes()}
function setTimes(){document.querySelectorAll('input[type="time"]').forEach(e=>{if(!e.value)e.value=now()})}
function tick(){const d=new Date();document.getElementById("clock").textContent=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0");document.getElementById("dateText").textContent=d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日（"+"日月火水木金土"[d.getDay()]+"）"}
function form(type){
 if(type==="urine")return `<section class="card categoryCard" id="category-urine" data-category="urine"><h2>🚽 排尿</h2><label>時刻</label><input id="urineTime" type="time"><div class="grid2"><div><label>排尿前 kg</label><div class="weightPartsV137"><input id="beforeKgWhole" type="text" inputmode="numeric" autocomplete="off" name="before-weight-whole" placeholder="97"><span>.</span><input id="beforeKgDec" type="text" inputmode="numeric" autocomplete="off" name="before-weight-decimal" maxlength="2" placeholder="75"></div></div><div><label>排尿後 kg</label><div class="weightPartsV137"><input id="afterKgWhole" type="text" inputmode="numeric" autocomplete="off" name="after-weight-whole" placeholder="96"><span>.</span><input id="afterKgDec" type="text" inputmode="numeric" autocomplete="off" name="after-weight-decimal" maxlength="2" placeholder="80"></div></div></div><div class="weightHelpV137">例：97.75kg → 左に97、右に75</div><label>推定尿量 mL</label><input id="urineMl" inputmode="numeric"><label>排尿回数</label><input id="urineCount" inputmode="numeric" placeholder="例 1"><label>メモ</label><textarea id="urineMemo"></textarea><button class="primary" onclick="saveUrine()">保存</button></section>`;
 if(type==="water")return `<section class="card categoryCard" id="category-water" data-category="water"><h2>🥤 飲水</h2><label>飲み物</label><div class="drinkChoicesV14"><button type="button" class="drinkChoiceV14" data-drink="水" onclick="selectDrinkV14('水')">💧 水</button><button type="button" class="drinkChoiceV14" data-drink="コーヒー" onclick="selectDrinkV14('コーヒー')">☕ コーヒー</button><button type="button" class="drinkChoiceV14" data-drink="お茶" onclick="selectDrinkV14('お茶')">🍵 お茶</button><button type="button" class="drinkChoiceV14" data-drink="紅茶" onclick="selectDrinkV14('紅茶')">🫖 紅茶</button><button type="button" class="drinkChoiceV14" data-drink="牛乳" onclick="selectDrinkV14('牛乳')">🥛 牛乳</button><button type="button" class="drinkChoiceV14" data-drink="ケフィア" onclick="selectDrinkV14('ケフィア')">🥛 ケフィア</button><button type="button" class="drinkChoiceV14" data-drink="ジュース" onclick="selectDrinkV14('ジュース')">🧃 ジュース</button><button type="button" class="drinkChoiceV14" data-drink="炭酸飲料" onclick="selectDrinkV14('炭酸飲料')">🥤 炭酸飲料</button><button type="button" class="drinkChoiceV14" data-drink="その他" onclick="selectDrinkV14('その他')">✏️ その他</button></div><input id="waterDrink" type="hidden"><div id="waterOtherWrap" class="waterOtherWrapV14" hidden><label>飲み物名</label><input id="waterOther" type="text" placeholder="例：スポーツドリンク"></div><label>時刻</label><input id="waterTime" type="time"><label>飲水量 mL</label><input id="waterMl" inputmode="numeric"><label>メモ</label><textarea id="waterMemo"></textarea><button class="primary" onclick="saveWater()">保存</button></section>`;
 if(type==="weight")return `<section class="card categoryCard" id="category-weight" data-category="weight"><h2>🏋️ 体重</h2><label>時刻</label><input id="weightTime" type="time"><label>体重 kg</label><div class="weightPartsV137 singleWeightV137"><input id="weightKgWhole" type="text" inputmode="numeric" autocomplete="off" name="body-weight-whole" placeholder="96"><span>.</span><input id="weightKgDec" type="text" inputmode="numeric" autocomplete="off" name="body-weight-decimal" maxlength="2" placeholder="20"></div><div class="weightHelpV137">例：96.2kg → 左に96、右に2</div><button class="primary" onclick="saveWeight()">保存</button></section>`;
 if(type==="glucose")return `<section class="card categoryCard" id="category-glucose" data-category="glucose"><h2>🩸 血糖値</h2><label>時刻</label><input id="glucoseTime" type="time"><div class="glucoseDualV139"><div><label>mg/dL</label><input id="glucoseMg" type="text" inputmode="numeric" autocomplete="off" autocorrect="off" spellcheck="false" name="glucose-mgdl" placeholder="例 194"></div><div class="convertMarkV139">⇄</div><div><label>mmol/L</label><input id="glucoseMmol" type="text" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" name="glucose-mmol" placeholder="例 10.8"></div></div><div class="glucoseHelpV139">どちらか一方を入力すると、もう一方が自動表示されます。</div><label>タイミング</label><select id="glucoseTiming"><option>起床時</option><option>食前</option><option>食後30分</option><option>食後1時間</option><option>食後2時間</option><option>就寝前</option><option>その他</option></select><label>メモ</label><textarea id="glucoseMemo"></textarea><button class="primary" onclick="saveGlucose()">保存</button></section>`;
 if(type==="bp")return `<section class="card categoryCard" id="category-bp" data-category="bp"><h2>❤️ 血圧</h2><label>時刻</label><input id="bpTime" type="time"><div class="grid2"><div><label>上</label><input id="bpHigh" inputmode="numeric"></div><div><label>下</label><input id="bpLow" inputmode="numeric"></div></div><label>脈拍</label><input id="bpPulse" inputmode="numeric"><label>メモ</label><textarea id="bpMemo"></textarea><button class="primary" onclick="saveBp()">保存</button></section>`;
 if(type==="meal")return `<section class="card categoryCard" id="category-meal" data-category="meal"><h2>🍽️ 食事</h2><label>時刻</label><input id="mealTime" type="time"><label>内容</label><textarea id="mealMemo"></textarea><label>推定カロリー kcal</label><input id="calorie" inputmode="numeric"><button class="primary" onclick="saveMeal()">保存</button></section>`;
 if(type==="bowel")return `<section class="card categoryCard" id="category-bowel" data-category="bowel"><h2>💩 排便</h2><label>時刻</label><input id="bowelTime" type="time"><label>回数</label><input id="bowelCount" inputmode="numeric" placeholder="例 1"><label>状態</label><select id="bowelState"><option>普通</option><option>コロコロ</option><option>硬い</option><option>柔らかい</option><option>下痢気味</option></select><label>メモ</label><textarea id="bowelMemo"></textarea><button class="primary" onclick="saveBowel()">保存</button></section>`;
 if(type==="medicine")return `<section class="card categoryCard medicineCardV143" id="category-medicine" data-category="medicine"><h2>💊 服薬</h2><div class="medicineHelpV143">飲んだら丸を押してください。押した時刻を自動で記録します。</div><button type="button" id="medicineMorningBtn" class="medicineToggleV143" onclick="toggleMedicineV143('朝')"><span class="medicineCircleV143">⚪️</span><span class="medicineLabelV143">朝の薬</span><span class="medicineTimeV143">未記録</span></button><button type="button" id="medicineNightBtn" class="medicineToggleV143" onclick="toggleMedicineV143('夜')"><span class="medicineCircleV143">⚪️</span><span class="medicineLabelV143">夜の薬</span><span class="medicineTimeV143">未記録</span></button><label for="medicineNoteV143">メモ（任意）</label><textarea id="medicineNoteV143" placeholder="薬の変更、飲み忘れて後から飲んだ時など"></textarea><button type="button" class="medicineMemoSaveV143" onclick="saveMedicineNoteV143()">メモを保存</button></section>`;
 if(type==="memo")return `<section class="card categoryCard" id="category-memo" data-category="memo"><h2>🩺 体調メモ</h2><label>時刻</label><input id="memoTime" type="time"><label>内容</label><textarea id="memoText"></textarea><button class="primary" onclick="saveMemo()">保存</button></section>`;
}

/* Ver.13.7 体重入力共通処理 */
function digitsV137(id, maxLen){
  const el = document.getElementById(id);
  let value = String((el && el.value) || "").replace(/[^\d]/g, "");
  if(maxLen) value = value.slice(0, maxLen);
  if(el && el.value !== value) el.value = value;
  return value;
}
function joinedWeightV137(wholeId, decimalId){
  const wholeText = digitsV137(wholeId, 3);
  const decimalText = digitsV137(decimalId, 2);
  if(!wholeText) return 0;
  const whole = parseInt(wholeText,10);
  let fraction = 0;
  if(decimalText.length===1) fraction = parseInt(decimalText,10)/10;
  if(decimalText.length===2) fraction = parseInt(decimalText,10)/100;
  return Math.round((whole+fraction)*100)/100;
}
function setupWeightInputsV137(){
  const settings=[
    ["weightKgWhole",3,"weightKgDec"],
    ["weightKgDec",2,null],
    ["beforeKgWhole",3,"beforeKgDec"],
    ["beforeKgDec",2,null],
    ["afterKgWhole",3,"afterKgDec"],
    ["afterKgDec",2,null]
  ];

  settings.forEach(([id,maxLen,nextId])=>{
    const el=document.getElementById(id);
    if(!el || el.dataset.v141==="1") return;

    el.dataset.v141="1";
    let moveTimer=null;

    el.addEventListener("input",()=>{
      const value=digitsV137(id,maxLen);

      if(moveTimer){
        clearTimeout(moveTimer);
        moveTimer=null;
      }

      /*
       * 通常の体重（2桁）を入力したら小数欄へ移動。
       * 100kg以上を入力する場合は、素早く3桁目を押せば移動しません。
       */
      if(nextId && value.length===2){
        moveTimer=setTimeout(()=>{
          const current=digitsV137(id,maxLen);
          if(current.length!==2) return;

          const next=document.getElementById(nextId);
          if(next){
            next.focus();
            try{next.setSelectionRange(next.value.length,next.value.length)}catch(e){}
          }
        },320);
      }
    });
  });
}

function saveUrine(){let ml=n(v("urineMl")),before=joinedWeightV137("beforeKgWhole","beforeKgDec"),after=joinedWeightV137("afterKgWhole","afterKgDec");if(before&&after)ml=Math.max(0,Math.round((before-after)*1000));if(!ml)return alert("尿量を入力してください");add("urine",{time:v("urineTime"),ml,count:n(v("urineCount"))||1,memo:v("urineMemo")});clearInputs(["beforeKgWhole","beforeKgDec","afterKgWhole","afterKgDec","urineMl","urineCount","urineMemo"])}

/* Ver.14 飲み物選択 */
const LAST_DRINK_V14="kenko_karte_last_drink_v14";
function selectedDrinkV14(){const c=v("waterDrink");return c==="その他"?(String(v("waterOther")||"").trim()||"その他"):(c||"水")}
function selectDrinkV14(name){const h=document.getElementById("waterDrink"),w=document.getElementById("waterOtherWrap");if(h)h.value=name;if(w)w.hidden=name!=="その他";document.querySelectorAll(".drinkChoiceV14").forEach(b=>b.classList.toggle("selectedV14",b.dataset.drink===name));try{localStorage.setItem(LAST_DRINK_V14,name)}catch(e){}if(name==="その他")setTimeout(()=>document.getElementById("waterOther")?.focus(),50)}
function setupDrinkChoicesV14(){if(!document.getElementById("waterDrink"))return;let last="水";try{last=localStorage.getItem(LAST_DRINK_V14)||"水"}catch(e){}const ok=[...document.querySelectorAll(".drinkChoiceV14")].some(b=>b.dataset.drink===last);selectDrinkV14(ok?last:"水")}

function saveWater(){let ml=n(v("waterMl"));if(!ml)return alert("飲水量を入力してください");let drink=selectedDrinkV14();add("water",{time:v("waterTime"),ml:ml,drink:drink,memo:v("waterMemo")});clearInputs(["waterMl","waterMemo","waterOther"]);setupDrinkChoicesV14()}
function saveWeight(){let kg=joinedWeightV137("weightKgWhole","weightKgDec");if(!kg)return alert("体重を入力してください。例：左に96、右に2");add("weight",{time:v("weightTime"),kg});clearInputs(["weightKgWhole","weightKgDec"])}

/* =========================================================
   AI健康カルテ Ver.13.9
   mg/dL・mmol/L 相互換算
   ========================================================= */
function cleanGlucoseNumberV139(value, allowDecimal){
  let raw=String(value||"").trim()
    .replace(/[，、。]/g,".")
    .replace(/,/g,".");
  raw=allowDecimal ? raw.replace(/[^\d.]/g,"") : raw.replace(/[^\d]/g,"");
  if(allowDecimal){
    const parts=raw.split(".");
    if(parts.length>2) raw=parts.shift()+"."+parts.join("");
  }
  return raw;
}
function glucoseMgToMmolV139(mg){
  return Math.round((mg/18.0182)*10)/10;
}
function glucoseMmolToMgV139(mmol){
  return Math.round(mmol*18.0182);
}
function syncGlucoseFromMgV139(){
  const mgEl=document.getElementById("glucoseMg");
  const mmolEl=document.getElementById("glucoseMmol");
  if(!mgEl||!mmolEl) return;
  const raw=cleanGlucoseNumberV139(mgEl.value,false).slice(0,3);
  mgEl.value=raw;
  if(raw){
    const mg=parseInt(raw,10);
    mmolEl.value=Number.isFinite(mg)?String(glucoseMgToMmolV139(mg)):"";
  }else{
    mmolEl.value="";
  }
}
function syncGlucoseFromMmolV139(){
  const mgEl=document.getElementById("glucoseMg");
  const mmolEl=document.getElementById("glucoseMmol");
  if(!mgEl||!mmolEl) return;
  let raw=cleanGlucoseNumberV139(mmolEl.value,true);
  const parts=raw.split(".");
  if(parts[0]) parts[0]=parts[0].slice(0,2);
  if(parts.length>1) parts[1]=parts[1].slice(0,1);
  raw=parts.join(".");
  mmolEl.value=raw;
  const mmol=parseFloat(raw);
  if(raw && Number.isFinite(mmol)){
    mgEl.value=String(glucoseMmolToMgV139(mmol));
  }else{
    mgEl.value="";
  }
}
function setupGlucoseDualV139(){
  const mgEl=document.getElementById("glucoseMg");
  const mmolEl=document.getElementById("glucoseMmol");
  if(mgEl && mgEl.dataset.v139!=="1"){
    mgEl.dataset.v139="1";
    mgEl.addEventListener("input",syncGlucoseFromMgV139);
  }
  if(mmolEl && mmolEl.dataset.v139!=="1"){
    mmolEl.dataset.v139="1";
    mmolEl.addEventListener("input",syncGlucoseFromMmolV139);
  }
}

function saveGlucose(){let mg=parseInt(cleanGlucoseNumberV139(v("glucoseMg"),false),10);let mmol=parseFloat(cleanGlucoseNumberV139(v("glucoseMmol"),true));if(!Number.isFinite(mg)&&Number.isFinite(mmol))mg=glucoseMmolToMgV139(mmol);if(!Number.isFinite(mmol)&&Number.isFinite(mg))mmol=glucoseMgToMmolV139(mg);if(!Number.isFinite(mg)||mg<=0)return alert("血糖値を入力してください");mmol=Math.round(mmol*10)/10;add("glucose",{time:v("glucoseTime"),value:mg,mmol:mmol,timing:v("glucoseTiming"),memo:v("glucoseMemo")});clearInputs(["glucoseMg","glucoseMmol","glucoseMemo"])}
function saveBp(){if(!n(v("bpHigh"))||!n(v("bpLow")))return alert("血圧を入力してください");add("bp",{time:v("bpTime"),high:n(v("bpHigh")),low:n(v("bpLow")),pulse:n(v("bpPulse")),memo:v("bpMemo")});clearInputs(["bpHigh","bpLow","bpPulse","bpMemo"])}
function saveMeal(){if(!v("mealMemo"))return alert("食事内容を入力してください");add("meal",{time:v("mealTime"),memo:v("mealMemo"),cal:n(v("calorie"))});clearInputs(["mealMemo","calorie"])}
function saveBowel(){add("bowel",{time:v("bowelTime"),count:n(v("bowelCount"))||1,state:v("bowelState"),memo:v("bowelMemo")});clearInputs(["bowelCount","bowelMemo"])}
const MED_NOTE_V143="kenko_karte_v12_3_medicine_note";
function medicineNoteKeyV143(){return MED_NOTE_V143+"_"+selectedDate()}
function medicineRecordV143(timing){return data().find(x=>x.type==="medicine"&&x.timing===timing)}
function toggleMedicineV143(timing){
  const a=data();
  const index=a.findIndex(x=>x.type==="medicine"&&x.timing===timing);
  if(index>=0){
    if(!confirm(timing+"の服薬記録を取り消しますか？"))return;
    a.splice(index,1);
    setData(a);
    toast(timing+"の記録を取り消しました");
    return;
  }
  const note=v("medicineNoteV143").trim();
  a.push({type:"medicine",time:now(),date:selectedDate(),timing,memo:note});
  setData(a);
  toast(timing+"の薬を記録しました");
}
function saveMedicineNoteV143(){
  localStorage.setItem(medicineNoteKeyV143(),v("medicineNoteV143"));
  const note=v("medicineNoteV143").trim();
  const a=data();
  let changed=false;
  a.forEach(x=>{if(x.type==="medicine"&&(x.timing==="朝"||x.timing==="夜")){x.memo=note;changed=true}});
  if(changed)setData(a);else renderMedicineV143();
  toast("服薬メモを保存しました");
}
function renderMedicineV143(){
  const note=document.getElementById("medicineNoteV143");
  if(note)note.value=localStorage.getItem(medicineNoteKeyV143())||medicineRecordV143("朝")?.memo||medicineRecordV143("夜")?.memo||"";
  [["朝","medicineMorningBtn"],["夜","medicineNightBtn"]].forEach(([timing,id])=>{
    const btn=document.getElementById(id);if(!btn)return;
    const rec=medicineRecordV143(timing);
    btn.classList.toggle("takenV143",!!rec);
    const circle=btn.querySelector(".medicineCircleV143");
    const time=btn.querySelector(".medicineTimeV143");
    if(circle)circle.textContent=rec?"🟢":"⚪️";
    if(time)time.textContent=rec?"服薬済み "+rec.time:"未記録";
    btn.setAttribute("aria-pressed",rec?"true":"false");
  });
}
function saveMemo(){if(!v("memoText"))return alert("内容を入力してください");add("memo",{time:v("memoTime"),memo:v("memoText")});clearInputs(["memoText"])}
function totals(){const a=data();return{urineCount:a.filter(x=>x.type=="urine").reduce((s,x)=>s+(x.count||1),0),urineMl:a.filter(x=>x.type=="urine").reduce((s,x)=>s+n(x.ml),0),water:a.filter(x=>x.type=="water").reduce((s,x)=>s+n(x.ml),0),bowel:a.filter(x=>x.type=="bowel").reduce((s,x)=>s+(x.count||1),0),cal:a.filter(x=>x.type=="meal").reduce((s,x)=>s+n(x.cal),0),med:a.filter(x=>x.type=="medicine").length,lastWeight:[...a].reverse().find(x=>x.type=="weight"),lastBp:[...a].reverse().find(x=>x.type=="bp"),lastGlucose:[...a].reverse().find(x=>x.type=="glucose")}}
function render(){let o=order();document.getElementById("categoryArea").innerHTML=o.map(form).join("");setTimes();renderMedicineV143();renderOrder(o);renderQuick();renderRecords();renderAI()}
function renderQuick(){let t=totals();qWeight.textContent=t.lastWeight?t.lastWeight.kg+"kg":"未記録";qBp.textContent=t.lastBp?`${t.lastBp.high}/${t.lastBp.low}`:"未記録";qGlucose.innerHTML=t.lastGlucose?`${t.lastGlucose.value}mg/dL<br><span class="quickSubV139">${t.lastGlucose.mmol??glucoseMgToMmolV139(t.lastGlucose.value)}mmol/L</span>`:"未記録";qUrineCount.textContent=t.urineCount+"回";qUrineMl.textContent=t.urineMl+"mL";qWaterMl.textContent=t.water+"mL";qBowel.textContent=t.bowel+"回";qCal.textContent=t.cal+"kcal";const a=data();qMed.textContent=`朝${a.some(x=>x.type==="medicine"&&x.timing==="朝")?"🟢":"⚪️"} 夜${a.some(x=>x.type==="medicine"&&x.timing==="夜")?"🟢":"⚪️"}`}
function renderOrder(o){orderList.innerHTML=o.map((x,i)=>`<div class="orderRow"><div class="orderName">${cats[x]}</div><button class="moveBtn" onclick="move(${i},-1)">↑</button><button class="moveBtn" onclick="move(${i},1)">↓</button></div>`).join("")}
function move(i,d){let o=order(),j=i+d;if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];setOrder(o);toast("並び替えました")}
function renderRecords(){let a=data();records.innerHTML=a.length?a.map((x,i)=>`<div class="record">${line(x)}<div class="actions"><button class="small del" onclick="del(${i})">削除</button></div></div>`).join(""):"記録なし"}
function line(x){if(x.type=="urine")return `${x.time} 排尿 約${x.ml}mL / ${x.count||1}回 ${x.memo||""}`;if(x.type=="water")return `${x.time} 飲水 ${x.ml}mL / ${x.drink||"飲み物未記録"} ${x.memo||""}`;if(x.type=="weight")return `${x.time} 体重 ${x.kg}kg`;if(x.type=="glucose"){let mmol=x.mmol??glucoseMgToMmolV139(x.value);return `${x.time} 血糖値 ${x.value}mg/dL（${mmol}mmol/L） / ${x.timing} ${x.memo||""}`};if(x.type=="bp")return `${x.time} 血圧 ${x.high}/${x.low}${x.pulse?"/脈拍"+x.pulse:""} ${x.memo||""}`;if(x.type=="meal")return `${x.time} 食事 約${x.cal||0}kcal\n${x.memo}`;if(x.type=="bowel")return `${x.time} 排便 ${x.count||1}回 / ${x.state} ${x.memo||""}`;if(x.type=="medicine")return `${x.time} 服薬 ${x.timing}\n${x.memo||""}`;if(x.type=="memo")return `${x.time} 体調メモ\n${x.memo}`}
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
function clearSelectedDay(){if(confirm("選択中の日付の記録をすべて削除しますか？")){createAutoBackupV142("削除前");localStorage.removeItem(STORE+"_"+selectedDate());createAutoBackupV142("削除後");render();updateBackupStatusV142();result.textContent="集計ボタンを押すと表示されます。"}}
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

function compareArrowV14(diff,unit){const a=Math.abs(Math.round(diff*10)/10);if(diff>0)return `<span class="trendUpV14">▲ ${a}${unit}</span>`;if(diff<0)return `<span class="trendDownV14">▼ ${a}${unit}</span>`;return `<span class="trendSameV14">－ 0${unit}</span>`}
function simpleCompareValueV14(value,unit){return value==null||value===""?"－":`${value}${unit||""}`}
function renderCompareV13(){const el=document.getElementById("compareBox");if(!el)return;const cur=selectedDate(),prev=previousDateWithDataV13(cur);if(!prev){el.innerHTML='<div class="hint">比較できる過去データがまだありません。</div>';return}const t=totalsForDateV13(cur),p=totalsForDateV13(prev);function row(name,oldVal,newVal,unit){const ok=oldVal!=null&&newVal!=null;return `<tr><th>${name}</th><td>${simpleCompareValueV14(oldVal,unit)}</td><td>${simpleCompareValueV14(newVal,unit)}</td><td>${ok?compareArrowV14(newVal-oldVal,unit):'<span class="trendSameV14">－</span>'}</td></tr>`}const oldBp=p.lastBp?`${p.lastBp.high}/${p.lastBp.low}`:null,newBp=t.lastBp?`${t.lastBp.high}/${t.lastBp.low}`:null;el.innerHTML=`<div class="compareDatesV14">${jpDateV13(prev)} → ${jpDateV13(cur)}</div><div class="compareTableWrapV14"><table class="compareTableV14"><thead><tr><th>項目</th><th>前回</th><th>今回</th><th>変化</th></tr></thead><tbody>${row("🏋️ 体重",p.lastWeight?.kg,t.lastWeight?.kg,"kg")}${row("🩸 血糖",p.lastGlucose?.value,t.lastGlucose?.value,"")}<tr><th>❤️ 血圧</th><td>${oldBp||"－"}</td><td>${newBp||"－"}</td><td><span class="trendSameV14">－</span></td></tr>${row("🥤 飲水",p.water,t.water,"mL")}${row("🚽 尿量",p.urineMl,t.urineMl,"mL")}${row("🔥 カロリー",p.cal,t.cal,"kcal")}</tbody></table></div>`}

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
  const weightStatus=t.lastWeight?["記録済み","stateGoodV131"]:["未記録","stateNoneV131"];
  const waterStatus=statusV13("water", t.water);
  const detail=makeSummaryTextV13();

  function stateClass(st){
    if(!st) return "stateNoneV131";
    if(st[1]==="statusGood") return "stateGoodV131";
    if(st[1]==="statusBad") return "stateBadV131";
    if(st[1]==="statusWarn") return "stateWarnV131";
    return st[1] || "stateNoneV131";
  }

  function row(name,value,unit,status){
    const cls=stateClass(status);
    const label=status ? status[0] : "";
    return `<div class="summaryRowV131">
      <div class="summaryNameV131">${name}</div>
      <div class="summaryValueV131">${value}<span class="summaryUnitV131">${unit||""}</span><span class="summaryStateV131 ${cls}">${label}</span></div>
    </div>`;
  }

  const html = `
  <div class="summaryListV131">
    ${row("体重", t.lastWeight ? t.lastWeight.kg : "未記録", t.lastWeight ? "kg" : "", weightStatus)}
    ${row("血圧", t.lastBp ? `${t.lastBp.high}/${t.lastBp.low}` : "未記録", t.lastBp ? "" : "", bpStatus)}
    ${row("血糖値", t.lastGlucose ? `${t.lastGlucose.value}mg/dL` : "未記録", t.lastGlucose ? `<br><span class="summaryMmolV139">${t.lastGlucose.mmol??glucoseMgToMmolV139(t.lastGlucose.value)}mmol/L</span>` : "", gStatus)}
    ${row("排尿回数", t.urineCount, "回", t.urineCount?["記録あり","stateGoodV131"]:["未記録","stateNoneV131"])}
    ${row("総尿量", t.urineMl, "mL", t.urineMl?["記録あり","stateGoodV131"]:["未記録","stateNoneV131"])}
    ${row("飲水量", t.water, "mL", waterStatus)}
    ${row("排便", t.bowel, "回", t.bowel?["記録あり","stateGoodV131"]:["未記録","stateNoneV131"])}
    ${row("服薬", t.med, "回", t.med?["記録あり","stateGoodV131"]:["未記録","stateNoneV131"])}
    ${row("カロリー", t.cal, "kcal", t.cal?["記録あり","stateGoodV131"]:["未記録","stateNoneV131"])}
  </div>
  <details class="detailData">
    <summary>ChatGPTへ送る詳細データを開く</summary>
    <pre>${detail.replace(/[&<>]/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))}</pre>
  </details>`;

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


/* Ver.13.7 動的フォーム表示後に入力制御を設定 */
const renderV137Base = render;
render = function(){
  renderV137Base();
  setTimeout(setupWeightInputsV137,30);
};
setTimeout(setupWeightInputsV137,300);


/* =========================================================
   AI健康カルテ Ver.13.8
   集計カードから入力欄へジャンプ
   ========================================================= */
function quickKeyJump(event,type){
  if(event.key==="Enter" || event.key===" "){
    event.preventDefault();
    jumpToCategory(type);
  }
}

function jumpToCategory(type){
  const target=document.getElementById("category-"+type);
  if(!target){
    toast("入力欄が見つかりません");
    return;
  }

  target.scrollIntoView({behavior:"smooth",block:"start"});

  setTimeout(function(){
    window.scrollBy({top:-18,left:0,behavior:"smooth"});
    target.classList.remove("jumpHighlightV138");
    void target.offsetWidth;
    target.classList.add("jumpHighlightV138");

    const firstInput=target.querySelector("input,select,textarea");
    if(firstInput && firstInput.type!=="time"){
      try{firstInput.focus({preventScroll:true})}catch(e){}
    }

    setTimeout(function(){
      target.classList.remove("jumpHighlightV138");
    },1700);
  },450);
}


/* Ver.13.9 動的フォーム表示後に換算処理を設定 */
const renderV139Base=render;
render=function(){
  renderV139Base();
  setTimeout(setupGlucoseDualV139,30);
};
setTimeout(setupGlucoseDualV139,300);

/* Ver.14 動的フォーム後処理 */
const renderV14Base=render;render=function(){renderV14Base();setTimeout(setupDrinkChoicesV14,30)};setTimeout(setupDrinkChoicesV14,300);


/* =========================================================
   AI健康カルテ Ver.14.1
   キーボード表示中は固定操作ボタンを隠す
   ========================================================= */
function isEditableV141(element){
  if(!element) return false;
  return element.matches("input, textarea, select, [contenteditable='true']");
}

function setKeyboardModeV141(open){
  document.body.classList.toggle("keyboardOpenV141",Boolean(open));
}

document.addEventListener("focusin",function(event){
  if(isEditableV141(event.target)){
    setKeyboardModeV141(true);
  }
});

document.addEventListener("focusout",function(){
  setTimeout(function(){
    setKeyboardModeV141(isEditableV141(document.activeElement));
  },180);
});

/* iPhoneでフォーカス判定が遅れる場合の補助 */
if(window.visualViewport){
  let baseHeight=window.visualViewport.height;

  window.addEventListener("orientationchange",function(){
    setTimeout(function(){
      baseHeight=window.visualViewport.height;
    },500);
  });

  window.visualViewport.addEventListener("resize",function(){
    const reduced=baseHeight-window.visualViewport.height;
    const keyboardLikelyOpen=reduced>140;

    if(keyboardLikelyOpen){
      setKeyboardModeV141(true);
    }else if(!isEditableV141(document.activeElement)){
      setKeyboardModeV141(false);
      baseHeight=Math.max(baseHeight,window.visualViewport.height);
    }
  });
}


/* =========================================================
   AI健康カルテ Ver.14.2
   自動バックアップ・復元・書き出し・読み込み
   ========================================================= */

const BACKUP_LIST_V142="kenko_karte_backup_v142";
const BACKUP_LIMIT_V142=8;

function appStorageKeysV142(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(!key) continue;
    if(
      key.startsWith(STORE+"_") ||
      key===ORDER ||
      key==="kenko_karte_last_drink_v14"
    ){
      keys.push(key);
    }
  }
  return keys.sort();
}

function collectAppDataV142(){
  const storage={};
  appStorageKeysV142().forEach(key=>{
    storage[key]=localStorage.getItem(key);
  });
  return {
    app:"AI健康カルテ",
    version:"14.2",
    exportedAt:new Date().toISOString(),
    storage:storage
  };
}

function readBackupsV142(){
  try{
    const value=JSON.parse(localStorage.getItem(BACKUP_LIST_V142)||"[]");
    return Array.isArray(value)?value:[];
  }catch(e){
    return [];
  }
}

function writeBackupsV142(items){
  try{
    localStorage.setItem(BACKUP_LIST_V142,JSON.stringify(items.slice(0,BACKUP_LIMIT_V142)));
    return true;
  }catch(e){
    toast("バックアップ保存に失敗しました");
    return false;
  }
}

function createAutoBackupV142(reason){
  try{
    const payload=collectAppDataV142();
    const hasRecords=Object.keys(payload.storage).some(key=>key.startsWith(STORE+"_"));
    if(!hasRecords) return false;

    const snapshot={
      id:Date.now(),
      reason:reason||"自動",
      createdAt:new Date().toISOString(),
      payload:payload
    };

    const items=readBackupsV142();
    const currentText=JSON.stringify(payload.storage);
    const latestText=items[0]?JSON.stringify(items[0].payload?.storage||{}):"";

    if(currentText===latestText) return true;

    items.unshift(snapshot);
    writeBackupsV142(items);
    updateBackupStatusV142();
    return true;
  }catch(e){
    return false;
  }
}

function restorePayloadV142(payload){
  if(!payload || typeof payload!=="object" || !payload.storage || typeof payload.storage!=="object"){
    throw new Error("形式が正しくありません");
  }

  createAutoBackupV142("復元前");

  const existing=appStorageKeysV142();
  existing.forEach(key=>localStorage.removeItem(key));

  Object.entries(payload.storage).forEach(([key,value])=>{
    if(typeof value==="string") localStorage.setItem(key,value);
  });

  render();
  updateBackupStatusV142();
}

function restoreLatestBackupV142(){
  const items=readBackupsV142();
  if(!items.length){
    alert("復元できるバックアップがありません。");
    return;
  }

  const latest=items[0];
  const date=new Date(latest.createdAt).toLocaleString("ja-JP");
  if(!confirm(`${date} のバックアップに戻しますか？\n現在の状態も復元前バックアップとして残します。`)) return;

  try{
    restorePayloadV142(latest.payload);
    toast("バックアップから復元しました");
  }catch(e){
    alert("復元できませんでした。");
  }
}

function exportBackupV142(){
  try{
    createAutoBackupV142("書き出し前");
    const payload=collectAppDataV142();
    const text=JSON.stringify(payload,null,2);
    const blob=new Blob([text],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=`AI健康カルテ_バックアップ_${today()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast("バックアップを書き出しました");
  }catch(e){
    alert("書き出しに失敗しました。");
  }
}

function openImportV142(){
  const input=document.getElementById("backupFileV142");
  if(input){
    input.value="";
    input.click();
  }
}

function importBackupV142(event){
  const file=event.target.files?.[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=function(){
    try{
      const payload=JSON.parse(String(reader.result||""));
      if(!payload.storage || typeof payload.storage!=="object") throw new Error();

      if(!confirm("選択したバックアップを読み込みますか？\n現在のデータは読み込み前バックアップとして残します。")) return;

      restorePayloadV142(payload);
      createAutoBackupV142("読み込み後");
      toast("バックアップを読み込みました");
    }catch(e){
      alert("このファイルは読み込めません。");
    }
  };
  reader.onerror=function(){
    alert("ファイルを読み込めませんでした。");
  };
  reader.readAsText(file);
}

function updateBackupStatusV142(){
  const element=document.getElementById("backupStatusV142");
  if(!element) return;

  const items=readBackupsV142();
  if(!items.length){
    element.textContent="まだバックアップはありません。最初の記録保存後に作成されます。";
    return;
  }

  const latest=items[0];
  const date=new Date(latest.createdAt);
  const dateText=Number.isNaN(date.getTime())?"日時不明":date.toLocaleString("ja-JP");
  element.textContent=`最新：${dateText}（${items.length}世代保存）`;
}

window.addEventListener("load",function(){
  setTimeout(function(){
    createAutoBackupV142("起動時");
    updateBackupStatusV142();
  },500);
});
