const STORE_KEY="kenkoKarteStableV14";
const DEFAULT_ORDER=["weight","bp","glucose","meal","drink","urine","stool","med"];
const CATS={
  weight:{icon:"⚖️",name:"体重"},
  bp:{icon:"🩸",name:"血圧"},
  glucose:{icon:"🩸",name:"血糖値"},
  meal:{icon:"🍽️",name:"食事"},
  drink:{icon:"💧",name:"飲水"},
  urine:{icon:"🚻",name:"排尿"},
  stool:{icon:"💩",name:"排便"},
  med:{icon:"💊",name:"服薬"}
};
let db=load();

function load(){
  try{
    const d=JSON.parse(localStorage.getItem(STORE_KEY));
    if(d && Array.isArray(d.records)) return {...d, order:d.order||DEFAULT_ORDER};
  }catch(e){}
  return {records:[],order:[...DEFAULT_ORDER]};
}
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(db));render();}
function today(){return new Date().toISOString().slice(0,10)}
function now(){
  const d=new Date(),z=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
}
function add(type,obj){db.records.push({type,date:today(),time:now(),...obj});save();}
function latest(type){return [...db.records].reverse().find(r=>r.type===type)}
function todayRecords(){return db.records.filter(r=>r.date===today())}
function yen(n){return Number(n||0).toLocaleString("ja-JP")}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

function render(){
  renderDashboard();
  renderCategories();
  renderSummary();
  renderSendText();
  renderOrderList();
}
function renderDashboard(){
  const w=latest("weight");
  latestWeight.textContent=w?Number(w.value).toFixed(1):"未記録";
  latestWeightUnit.textContent=w?"kg":"";
  latestWeightTime.textContent=w?`${w.time}${w.memo?" / "+w.memo:""}`:"体重を記録すると表示されます";
  const count=todayRecords().length;
  aiScore.textContent=count?score()+"点":"--";
  aiComment.textContent=count?diagnosis():"今日の記録を入力すると表示されます。";
}
function score(){
  const t=todayRecords();
  let s=70;
  const bp=[...t].reverse().find(r=>r.type==="bp");
  const g=[...t].reverse().find(r=>r.type==="glucose");
  if(t.some(r=>r.type==="weight"))s+=5;
  if(bp){
    if(bp.high<130&&bp.low<85)s+=10;
    else if(bp.high>=160||bp.low>=100)s-=15;
    else s+=3;
  }
  if(g){
    if(g.value<70)s-=20;
    else if(g.value<=140)s+=10;
    else if(g.value>=200)s-=15;
    else s+=2;
  }
  if(t.some(r=>r.type==="meal"))s+=5;
  if(t.some(r=>r.type==="med"))s+=5;
  const drink=t.filter(r=>r.type==="drink").reduce((a,r)=>a+Number(r.amount||0),0);
  if(drink>=1200&&drink<=3000)s+=5;
  if(drink>4000)s-=8;
  return Math.max(0,Math.min(100,s));
}
function diagnosis(){
  const t=todayRecords();
  const bp=[...t].reverse().find(r=>r.type==="bp");
  const g=[...t].reverse().find(r=>r.type==="glucose");
  const drink=t.filter(r=>r.type==="drink").reduce((a,r)=>a+Number(r.amount||0),0);
  let a=[];
  if(bp){
    if(bp.high<130&&bp.low<85)a.push("血圧は良好です。");
    else if(bp.high>=160||bp.low>=100)a.push("血圧が高めです。安静時に再測定してください。");
    else a.push("血圧はやや注意です。塩分を控えめに。");
  }else a.push("血圧は未記録です。");
  if(g){
    if(g.value<70)a.push("血糖値が低めです。低血糖症状に注意。");
    else if(g.value<=140)a.push("血糖値は比較的安定しています。");
    else if(g.value>=200)a.push("血糖値が高めです。食事内容と服薬を確認。");
    else a.push("血糖値は少し高めです。食後の推移を確認。");
  }else a.push("血糖値は未記録です。");
  if(drink===0)a.push("飲水量は未記録です。");
  else if(drink<1200)a.push("飲水量が少なめです。");
  else if(drink>3500)a.push("飲水量が多めです。口渇や血糖も確認。");
  return a.join(" ");
}
function renderCategories(){
  categoryList.innerHTML=db.order.map(type=>categoryHtml(type)).join("");
  bindForms();
}
function categoryHtml(type){
  const title=`${CATS[type].icon} ${CATS[type].name}`;
  let form="";
  if(type==="weight") form=`<form data-form="weight" class="formGrid"><input name="value" type="number" step="0.1" placeholder="体重 kg 例：97.6" required><input name="memo" placeholder="メモ 例：朝イチ"><button class="mainBtn">保存</button></form>`;
  if(type==="bp") form=`<form data-form="bp" class="formGrid"><div class="two"><input name="high" type="number" placeholder="上 例：128" required><input name="low" type="number" placeholder="下 例：78" required></div><input name="pulse" type="number" placeholder="脈拍 例：72"><input name="memo" placeholder="メモ"><button class="mainBtn">保存</button></form>`;
  if(type==="glucose") form=`<form data-form="glucose" class="formGrid"><input name="value" type="number" placeholder="血糖値 mg/dL 例：112" required><select name="timing"><option>起床時</option><option>食前</option><option>食後30分</option><option>食後1時間</option><option>食後2時間</option><option>就寝前</option><option>その他</option></select><input name="memo" placeholder="メモ 例：夕食前"><button class="mainBtn">保存</button></form>`;
  if(type==="meal") form=`<form data-form="meal" class="formGrid"><select name="mealType"><option>朝食</option><option>昼食</option><option>夕食</option><option>間食</option></select><textarea name="text" placeholder="食べたもの"></textarea><input name="cal" type="number" placeholder="推定カロリー kcal"><button class="mainBtn">保存</button></form>`;
  if(type==="drink") form=`<form data-form="drink" class="formGrid"><input name="amount" type="number" placeholder="飲水量 mL 例：300"><input name="memo" placeholder="メモ 例：水、コーヒー"><button class="mainBtn">保存</button></form>`;
  if(type==="urine") form=`<form data-form="urine" class="formGrid"><input name="amount" type="number" placeholder="尿量 mL 例：400"><input name="memo" placeholder="メモ"><button class="mainBtn">保存</button></form>`;
  if(type==="stool") form=`<form data-form="stool" class="formGrid"><select name="state"><option>普通</option><option>コロコロ</option><option>硬い</option><option>柔らかい</option><option>下痢</option></select><input name="memo" placeholder="メモ"><button class="mainBtn">保存</button></form>`;
  if(type==="med") form=`<form data-form="med" class="formGrid"><select name="timing"><option>朝</option><option>昼</option><option>夜</option><option>寝る前</option><option>その他</option></select><input name="name" placeholder="薬名"><button class="mainBtn">服薬済みで保存</button></form>`;
  return `<section class="category card"><div class="categoryHead"><div class="categoryTitle"><span>${CATS[type].icon}</span><span>${CATS[type].name}</span></div></div>${form}</section>`;
}
function bindForms(){
  document.querySelectorAll("form[data-form]").forEach(f=>{
    f.onsubmit=e=>{
      e.preventDefault();
      const fd=new FormData(f), type=f.dataset.form;
      const obj=Object.fromEntries(fd.entries());
      ["value","high","low","pulse","amount","cal"].forEach(k=>{if(obj[k]!==undefined&&obj[k]!=="")obj[k]=Number(obj[k])});
      add(type,obj);
      f.reset();
    };
  });
}
function renderSummary(){
  const t=todayRecords();
  const drink=t.filter(r=>r.type==="drink").reduce((a,r)=>a+Number(r.amount||0),0);
  const urine=t.filter(r=>r.type==="urine");
  const urineMl=urine.reduce((a,r)=>a+Number(r.amount||0),0);
  const stool=t.filter(r=>r.type==="stool").length;
  const cal=t.filter(r=>r.type==="meal").reduce((a,r)=>a+Number(r.cal||0),0);
  summaryPills.innerHTML=`<span class="pill">飲水 ${yen(drink)}mL</span><span class="pill">排尿 ${urine.length}回 / ${yen(urineMl)}mL</span><span class="pill">排便 ${stool}回</span><span class="pill">推定 ${yen(cal)}kcal</span>`;
  recordList.innerHTML=t.length?t.slice().reverse().map(r=>`<div class="record">${recordHtml(r)}</div>`).join(""):`<div class="hint">今日の記録はまだありません。</div>`;
}
function recordHtml(r){
  const small=`<small>${esc(r.time)}</small>`;
  if(r.type==="weight")return `<b>体重 ${esc(r.value)}kg</b> ${esc(r.memo||"")}${small}`;
  if(r.type==="bp")return `<b>血圧 ${esc(r.high)}/${esc(r.low)}</b> ${r.pulse?`脈拍${esc(r.pulse)}`:""} ${esc(r.memo||"")}${small}`;
  if(r.type==="glucose")return `<b>血糖値 ${esc(r.value)}mg/dL</b> ${esc(r.timing||"")} ${esc(r.memo||"")}${small}`;
  if(r.type==="meal")return `<b>${esc(r.mealType||"食事")}</b> ${esc(r.text||"")} ${r.cal?`約${esc(r.cal)}kcal`:""}${small}`;
  if(r.type==="drink")return `<b>飲水 ${esc(r.amount||0)}mL</b> ${esc(r.memo||"")}${small}`;
  if(r.type==="urine")return `<b>排尿 ${esc(r.amount||0)}mL</b> ${esc(r.memo||"")}${small}`;
  if(r.type==="stool")return `<b>排便 ${esc(r.state||"")}</b> ${esc(r.memo||"")}${small}`;
  if(r.type==="med")return `<b>服薬 ${esc(r.timing||"")}</b> ${esc(r.name||"")}${small}`;
}
function recordPlain(r){
  if(r.type==="weight")return `${r.time} / 体重 ${r.value}kg / ${r.memo||""}`;
  if(r.type==="bp")return `${r.time} / 血圧 ${r.high}/${r.low}${r.pulse?" 脈拍"+r.pulse:""} / ${r.memo||""}`;
  if(r.type==="glucose")return `${r.time} / 血糖値 ${r.value}mg/dL / ${r.timing||""} / ${r.memo||""}`;
  if(r.type==="meal")return `${r.time} / ${r.mealType||"食事"} / ${r.text||""} / 約${r.cal||0}kcal`;
  if(r.type==="drink")return `${r.time} / 飲水 ${r.amount||0}mL / ${r.memo||""}`;
  if(r.type==="urine")return `${r.time} / 排尿 ${r.amount||0}mL / ${r.memo||""}`;
  if(r.type==="stool")return `${r.time} / 排便 ${r.state||""} / ${r.memo||""}`;
  if(r.type==="med")return `${r.time} / 服薬 ${r.timing||""} / ${r.name||""}`;
}
function renderSendText(){
  const t=todayRecords();
  const drink=t.filter(r=>r.type==="drink").reduce((a,r)=>a+Number(r.amount||0),0);
  const urine=t.filter(r=>r.type==="urine");
  const urineMl=urine.reduce((a,r)=>a+Number(r.amount||0),0);
  const stool=t.filter(r=>r.type==="stool").length;
  const cal=t.filter(r=>r.type==="meal").reduce((a,r)=>a+Number(r.cal||0),0);
  sendText.value=`健康カルテ記録

${today()}

【AI健康診断】
スコア：${t.length?score()+"点":"未判定"}
コメント：${t.length?diagnosis():"未記録"}

【今日の集計】
飲水量：約${drink}mL
排尿回数：${urine.length}回
総尿量：約${urineMl}mL
尿量−飲水：約${urineMl-drink}mL
排便：${stool}回
推定カロリー：約${cal}kcal

【記録一覧】
${t.map(recordPlain).join("\n")||"記録なし"}

糖尿病・高血圧・体重管理の観点から、今日の評価と明日の改善点を教えてください。`;
}
function renderOrderList(){
  if(!document.getElementById("orderList"))return;
  orderList.innerHTML=db.order.map((type,i)=>`<div class="orderItem"><div class="orderName">${CATS[type].icon} ${CATS[type].name}</div><button class="moveBtn" data-move="${i},-1">↑</button><button class="moveBtn" data-move="${i},1">↓</button></div>`).join("");
  document.querySelectorAll("[data-move]").forEach(b=>{
    b.onclick=()=>{
      const [i,d]=b.dataset.move.split(",").map(Number), j=i+d;
      if(j<0||j>=db.order.length)return;
      [db.order[i],db.order[j]]=[db.order[j],db.order[i]];
      save();
    };
  });
}
settingsBtn.onclick=()=>modal.classList.remove("hidden");
closeModal.onclick=()=>modal.classList.add("hidden");
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};
resetOrderBtn.onclick=()=>{db.order=[...DEFAULT_ORDER];save()};
copyBtn.onclick=async()=>{try{await navigator.clipboard.writeText(sendText.value);alert("コピーしました")}catch(e){sendText.select();document.execCommand("copy");alert("コピーしました")}};
exportBtn.onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="kenko_karte_data.json";
  a.click();
};
clearTodayBtn.onclick=()=>{if(confirm("今日の記録だけ削除しますか？")){db.records=db.records.filter(r=>r.date!==today());save()}};
document.addEventListener("gesturestart",e=>e.preventDefault());
render();
