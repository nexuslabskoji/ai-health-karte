const STORE_KEY='ai_health_karte_records_v1';
const $=id=>document.getElementById(id);
let urineTimeTouched=false;

function pad(n){return String(n).padStart(2,'0')}
function nowTime(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}`}
function nowClock(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
function today(){const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function fullDate(){const d=new Date();const w='日月火水木金土'[d.getDay()];return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${w}）`}
function data(){return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}
function saveData(d){localStorage.setItem(STORE_KEY,JSON.stringify(d))}
function empty(){return {urine:[],water:[],meal:[],bowel:[]}}
function dayData(){const all=data();return all[today()]||empty()}
function setDay(x){const all=data();all[today()]=x;saveData(all)}
function toast(t){$('toast').textContent=t;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',1600)}
function num(v){const n=parseFloat(v);return Number.isFinite(n)?n:0}

function syncClock(){
  const c=$('clock'); if(c) c.textContent=nowClock();
  const d=$('dateText'); if(d) d.textContent=fullDate();
}
function syncUrineTime(force=false){
  const el=$('urineTime'); if(!el) return;
  if(force || !urineTimeTouched) el.value=nowTime();
}
function tick(){
  syncClock();
  syncUrineTime(false);
}
function defaults(){
  urineTimeTouched=false;
  syncClock();
  syncUrineTime(true);
}

function addOrUpdate(type,obj){
  const d=dayData(); d[type].push({id:Date.now(),...obj}); setDay(d); renderAll(); toast('保存しました');
}
function urineMl(){
  const before=num($('beforeKg').value), after=num($('afterKg').value), manual=num($('urineMl').value);
  if(before && after && before>after) return Math.round((before-after)*1000);
  if(manual) return Math.round(manual);
  return 0;
}
function saveUrine(){addOrUpdate('urine',{time:$('urineTime').value||nowTime(),ml:urineMl(),before:$('beforeKg').value,after:$('afterKg').value,memo:$('urineMemo').value});$('beforeKg').value='';$('afterKg').value='';$('urineMl').value='';$('urineMemo').value='';urineTimeTouched=false;syncUrineTime(true)}
function saveWater(){if(!num($('waterMl').value)){toast('飲水量を入力');return}addOrUpdate('water',{time:nowTime(),ml:Math.round(num($('waterMl').value)),memo:$('waterMemo').value});$('waterMl').value='';$('waterMemo').value=''}
function saveMeal(){if(!$('mealMemo').value&&!num($('calorie').value)){toast('食事内容を入力');return}addOrUpdate('meal',{time:nowTime(),memo:$('mealMemo').value,kcal:Math.round(num($('calorie').value))});$('mealMemo').value='';$('calorie').value=''}
function saveBowel(){addOrUpdate('bowel',{time:nowTime(),memo:$('bowelMemo').value});$('bowelMemo').value=''}

function totals(){const d=dayData();const u=d.urine.reduce((s,x)=>s+(x.ml||0),0),w=d.water.reduce((s,x)=>s+(x.ml||0),0),c=d.meal.reduce((s,x)=>s+(x.kcal||0),0);return {uc:d.urine.length,u,w,diff:u-w,bc:d.bowel.length,c}}
function renderQuick(){const t=totals();$('quick').innerHTML=[
['💧','排尿回数',`${t.uc}回`],['🚽','総尿量',`${t.u}mL`],['🥤','飲水量',`${t.w}mL`],['⚖️','尿量−飲水',`${t.diff}mL`],['💩','排便回数',`${t.bc}回`],['🔥','カロリー',`${t.c}kcal`]
].map(x=>`<div class="q"><div class="emoji">${x[0]}</div><div class="label">${x[1]}</div><div class="num">${x[2]}</div></div>`).join('')}
function rec(txt,type,id){return `<div class="record">${txt}<div class="actions"><button class="small del" onclick="deleteRecord('${type}',${id})">削除</button></div></div>`}
function renderRecords(){const d=dayData();let html='';d.urine.forEach(x=>html+=rec(`🚽 ${x.time} / ${x.ml||0}mL ${x.memo||''}`,'urine',x.id));d.water.forEach(x=>html+=rec(`💧 ${x.time} / ${x.ml}mL ${x.memo||''}`,'water',x.id));d.meal.forEach(x=>html+=rec(`🍽️ ${x.time} / ${x.kcal||0}kcal<br>${x.memo||''}`,'meal',x.id));d.bowel.forEach(x=>html+=rec(`💩 ${x.time} ${x.memo||''}`,'bowel',x.id));$('recordsArea').innerHTML=html||'<div class="record">まだ記録がありません</div>'}
window.deleteRecord=function(type,id){const d=dayData();d[type]=d[type].filter(x=>x.id!==id);setDay(d);renderAll()}
function makeSummary(){const d=dayData(),t=totals();let lines=[`健康カルテ記録`,``,today(),``,`【今日の集計】`,`排尿回数：${t.uc}回`,`総尿量：約${t.u}mL`,`飲水量：約${t.w}mL`,`尿量−飲水：約${t.diff}mL`,`排便：${t.bc}回`,`推定カロリー：約${t.c}kcal`]; if(d.urine.length){lines.push('','【排尿】');d.urine.forEach(x=>lines.push(`${today()} ${x.time} / 約${x.ml||0}mL / ${x.memo||''}`))} if(d.water.length){lines.push('','【飲水】');d.water.forEach(x=>lines.push(`${today()} ${x.time} / ${x.ml}mL / ${x.memo||''}`))} if(d.meal.length){lines.push('','【食事】');d.meal.forEach(x=>lines.push(`${today()} ${x.time} / ${x.memo||''} / 約${x.kcal||0}kcal`))} if(d.bowel.length){lines.push('','【排便】');d.bowel.forEach(x=>lines.push(`${today()} ${x.time} / ${x.memo||''}`))} return lines.join('\n')}
async function copySummary(){const text=makeSummary();try{await navigator.clipboard.writeText(text);toast('コピーしました')}catch(e){prompt('コピーしてください',text)}}
function showSummary(){alert(makeSummary())}
function clearToday(){if(confirm('今日の記録をすべて削除しますか？')){const all=data();delete all[today()];saveData(all);renderAll();defaults()}}
function renderAll(){renderQuick();renderRecords()}

$('urineTime').addEventListener('input',()=>{urineTimeTouched=true});
$('urineTime').addEventListener('change',()=>{urineTimeTouched=true});
$('saveUrineBtn').addEventListener('click',saveUrine);
$('saveWaterBtn').addEventListener('click',saveWater);
$('saveMealBtn').addEventListener('click',saveMeal);
$('saveBowelBtn').addEventListener('click',saveBowel);
$('summaryBtn').addEventListener('click',showSummary);
$('copyBtn').addEventListener('click',copySummary);
$('clearBtn').addEventListener('click',clearToday);
$('topBtn').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden){urineTimeTouched=false;defaults()}});
window.addEventListener('pageshow',()=>{urineTimeTouched=false;defaults()});
window.addEventListener('focus',()=>{urineTimeTouched=false;defaults()});

defaults(); renderAll();
setInterval(tick,1000);
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
