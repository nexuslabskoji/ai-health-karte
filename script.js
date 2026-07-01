
const PRIMARY_PREFIX='karte_universal_';
const LEGACY_PREFIXES=['karte_universal_','karte_v83_','karte_v82_','karte_v81_','karte_v80_','karte_v8_','karte_v73_','karte_v72_'];
const days=['日','月','火','水','木','金','土'];
function pad(n){return String(n).padStart(2,'0')}
function ymd(){const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function ymdSlash(){return ymd().replaceAll('-','/')}
function nowTime(){const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())}
function fullDate(){const d=new Date();return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日（'+days[d.getDay()]+'）'}
function key(){return PRIMARY_PREFIX+ymd()}
function emptyData(){return {urine:[],water:[],meal:[],bowel:[]}}
function safeParse(raw){try{const x=JSON.parse(raw||''); if(x&&typeof x==='object') return {urine:Array.isArray(x.urine)?x.urine:[],water:Array.isArray(x.water)?x.water:[],meal:Array.isArray(x.meal)?x.meal:[],bowel:Array.isArray(x.bowel)?x.bowel:[]};}catch(e){} return emptyData()}
function mergeData(a,b){return {urine:[...a.urine,...b.urine],water:[...a.water,...b.water],meal:[...a.meal,...b.meal],bowel:[...a.bowel,...b.bowel]}}
function uniqueArr(arr){
  const seen=new Set();
  return (arr||[]).filter(x=>{const s=JSON.stringify(x); if(seen.has(s)) return false; seen.add(s); return true;});
}
function normalizeData(x){
  return {
    urine:uniqueArr(Array.isArray(x&&x.urine)?x.urine:[]),
    water:uniqueArr(Array.isArray(x&&x.water)?x.water:[]),
    meal:uniqueArr(Array.isArray(x&&x.meal)?x.meal:[]),
    bowel:uniqueArr(Array.isArray(x&&x.bowel)?x.bowel:[])
  };
}
function getData(){
  const primary=safeParse(localStorage.getItem(key()));
  const migrationKey='karte_migrated_'+ymd();
  if(localStorage.getItem(migrationKey)==='1') return normalizeData(primary);
  let data=primary;
  const today=ymd();
  const seen=new Set([key()]);
  LEGACY_PREFIXES.forEach(pre=>{
    const k=pre+today;
    if(!seen.has(k)){
      seen.add(k);
      data=mergeData(data,safeParse(localStorage.getItem(k)));
    }
  });
  data=normalizeData(data);
  localStorage.setItem(key(),JSON.stringify(data));
  localStorage.setItem(migrationKey,'1');
  return data;
}
function setData(d){localStorage.setItem(key(),JSON.stringify(d));renderAll()}
function showToast(t){const el=document.getElementById('toast'); if(!el) return; el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400)}
function num(v){return parseFloat(String(v||'').replace(',','.'))||0}
function val(id){const el=document.getElementById(id); return el?el.value.trim():''}
function clearVal(id){const el=document.getElementById(id); if(el) el.value=''}
function setTimeDefaults(){['urineTime','waterTime','mealTime','bowelTime'].forEach(id=>{const el=document.getElementById(id); if(el && !el.value) el.value=nowTime()})}
function updateClock(){const d=new Date(); const c=document.getElementById('liveClock'), da=document.getElementById('liveDate'); if(c)c.textContent=pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()); if(da)da.textContent=fullDate()}
function urineAmount(){const before=num(val('beforeKg')), after=num(val('afterKg')), est=num(val('urineMl')); const measured=(before&&after&&before>=after)?Math.round((before-after)*1000):0; return measured||est}
function saveUrine(){const ml=urineAmount(); const count=num(val('urineCount'))||1; const d=getData();d.urine.push({time:val('urineTime')||nowTime(),ml,count,before:val('beforeKg'),after:val('afterKg'),memo:val('urineMemo'),type:(num(val('beforeKg'))&&num(val('afterKg'))?'実測':'推定')});setData(d);['beforeKg','afterKg','urineMl','urineCount','urineMemo'].forEach(clearVal);document.getElementById('urineTime').value=nowTime();showToast('排尿を保存しました')}
function saveWater(){const ml=num(val('waterMl')); if(!ml && !val('waterMemo')){showToast('飲水量を入力してください');return} const d=getData();d.water.push({time:val('waterTime')||nowTime(),ml,memo:val('waterMemo')});setData(d);['waterMl','waterMemo'].forEach(clearVal);document.getElementById('waterTime').value=nowTime();showToast('飲水を保存しました')}
function saveMeal(){const cal=num(val('calorie')); if(!cal && !val('mealMemo')){showToast('食事内容を入力してください');return} const d=getData();d.meal.push({time:val('mealTime')||nowTime(),cal,memo:val('mealMemo')});setData(d);['calorie','mealMemo'].forEach(clearVal);document.getElementById('mealTime').value=nowTime();showToast('食事を保存しました')}
function saveBowel(){const count=num(val('bowelCount'))||1; const d=getData();d.bowel.push({time:val('bowelTime')||nowTime(),count,memo:val('bowelMemo')});setData(d);['bowelCount','bowelMemo'].forEach(clearVal);document.getElementById('bowelTime').value=nowTime();showToast('排便を保存しました')}
function totals(){const d=getData();return {urineCount:d.urine.reduce((a,x)=>a+(num(x.count)||1),0),urineMl:d.urine.reduce((a,x)=>a+num(x.ml),0),waterMl:d.water.reduce((a,x)=>a+num(x.ml),0),bowelCount:d.bowel.reduce((a,x)=>a+(num(x.count)||1),0),cal:d.meal.reduce((a,x)=>a+num(x.cal),0)}}
function renderQuick(){const t=totals(); const items=[['💧','排尿回数',t.urineCount+'回'],['🚽','総尿量',t.urineMl+'mL'],['🥤','飲水量',t.waterMl+'mL'],['⚖️','尿量−飲水',(t.urineMl-t.waterMl)+'mL'],['💩','排便回数',t.bowelCount+'回'],['🔥','カロリー',t.cal+'kcal']]; const q=document.getElementById('quick'); if(q)q.innerHTML=items.map(i=>`<div class="metric"><div>${i[0]}</div><div class="k">${i[1]}</div><div class="v">${i[2]}</div></div>`).join('')}
function escapeHtml(s){return String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function recordButtons(type,i){return `<div class="recordActions"><button type="button" class="editBtn" onclick="editRecord('${type}',${i})">修正</button><button type="button" class="oneDelBtn" onclick="deleteRecord('${type}',${i})">削除</button></div>`}
function renderRecords(){const d=getData(); let html=''; const row=(icon,title,arr,type,fmt)=>{html+=`<div class="sectionTitle">${icon} ${title}</div>`; html+= arr.length? arr.map((x,i)=>fmt(x)+recordButtons(type,i)+'</div>').join(''):'<div class="record"><small>記録なし</small></div>'}; row('💧','排尿の記録',d.urine,'urine',x=>`<div class="record">${ymd()} ${x.time}　約 ${x.ml||0} mL / ${x.type||'記録'} / ${x.count||1}回${x.memo?'\nメモ：'+escapeHtml(x.memo):''}`); row('🥤','飲水の記録',d.water,'water',x=>`<div class="record">${ymd()} ${x.time}　${x.ml||0} mL${x.memo?' / '+escapeHtml(x.memo):''}`); row('🍽️','食事の記録',d.meal,'meal',x=>`<div class="record">${ymd()} ${x.time}　約 ${x.cal||0} kcal${x.memo?'\n'+escapeHtml(x.memo):''}`); row('💩','排便の記録',d.bowel,'bowel',x=>`<div class="record">${ymd()} ${x.time}　${x.count||1}回${x.memo?' / '+escapeHtml(x.memo):''}`); const r=document.getElementById('records'); if(r)r.innerHTML=html}
function deleteRecord(type,i){const names={urine:'排尿',water:'飲水',meal:'食事',bowel:'排便'}; const d=getData(); if(!d[type]||!d[type][i]){showToast('記録が見つかりません');return} if(confirm(names[type]+'のこの記録を削除しますか？')){d[type].splice(i,1);setData(d);showRecords();showToast('1件削除しました')}}
function editRecord(type,i){const d=getData(); const x=d[type]&&d[type][i]; if(!x){showToast('記録が見つかりません');return} const t=prompt('時刻を修正してください',x.time||nowTime()); if(t===null)return; if(type==='urine'){const ml=prompt('尿量 mL を修正してください',x.ml||0); if(ml===null)return; const count=prompt('排尿回数を修正してください',x.count||1); if(count===null)return; const memo=prompt('メモを修正してください',x.memo||''); if(memo===null)return; d.urine[i]={...x,time:t,ml:num(ml),count:num(count)||1,memo:memo,type:x.type||'修正'};}
 else if(type==='water'){const ml=prompt('飲水量 mL を修正してください',x.ml||0); if(ml===null)return; const memo=prompt('メモを修正してください',x.memo||''); if(memo===null)return; d.water[i]={...x,time:t,ml:num(ml),memo:memo};}
 else if(type==='meal'){const memo=prompt('食事内容を修正してください',x.memo||''); if(memo===null)return; const cal=prompt('カロリー kcal を修正してください',x.cal||0); if(cal===null)return; d.meal[i]={...x,time:t,memo:memo,cal:num(cal)};}
 else if(type==='bowel'){const count=prompt('排便回数を修正してください',x.count||1); if(count===null)return; const memo=prompt('メモを修正してください',x.memo||''); if(memo===null)return; d.bowel[i]={...x,time:t,count:num(count)||1,memo:memo};}
 setData(d);showRecords();showToast('修正しました')}
function renderAll(){renderQuick();renderRecords()}
function showRecords(){document.getElementById('recordsArea').classList.remove('hidden');document.getElementById('summaryArea').classList.add('hidden')}
function makeSummary(){const d=getData(),t=totals(); const lines=[]; lines.push('健康カルテ記録','',ymdSlash(),'','【今日の集計】'); lines.push('排尿回数：'+t.urineCount+'回'); lines.push('総尿量：約'+t.urineMl+'mL'); lines.push('飲水量：約'+t.waterMl+'mL'); lines.push('尿量−飲水：約'+(t.urineMl-t.waterMl)+'mL'); lines.push('排便：'+t.bowelCount+'回'); lines.push('推定カロリー：約'+t.cal+'kcal',''); lines.push('【排尿】'); lines.push(...(d.urine.length?d.urine.map(x=>`${ymd()} ${x.time} / 約${x.ml||0}mL / ${x.type||'記録'} / ${x.count||1}回${x.memo?' / '+x.memo:''}`):['記録なし'])); lines.push('','【飲水】'); lines.push(...(d.water.length?d.water.map(x=>`${ymd()} ${x.time} / ${x.ml||0}mL${x.memo?' / '+x.memo:''}`):['記録なし'])); lines.push('','【食事】'); lines.push(...(d.meal.length?d.meal.map(x=>`${ymd()} ${x.time} / ${x.memo||'食事'} / 約${x.cal||0}kcal`):['記録なし'])); lines.push('','【排便】'); lines.push(...(d.bowel.length?d.bowel.map(x=>`${ymd()} ${x.time} / ${x.count||1}回${x.memo?' / '+x.memo:''}`):['記録なし'])); const text=lines.join('\n'); document.getElementById('result').textContent=text; document.getElementById('recordsArea').classList.add('hidden');document.getElementById('summaryArea').classList.remove('hidden'); return text}
function goToSummary(){makeSummary(); setTimeout(()=>{const el=document.getElementById('summaryArea'); if(el){const y=el.getBoundingClientRect().top + (window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0) - 8; window.scrollTo(0,y); document.documentElement.scrollTop=y; document.body.scrollTop=y;}},120); showToast('集計しました')}
async function copySummary(){const text=makeSummary(); try{await navigator.clipboard.writeText(text);showToast('コピーしました')}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast('コピーしました')}}
function scrollToTop(){try{document.activeElement.blur()}catch(e){} window.scrollTo(0,0); document.documentElement.scrollTop=0; document.body.scrollTop=0; const top=document.getElementById('top'); if(top)top.scrollIntoView({block:'start'}); setTimeout(()=>{window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0},120); showToast('上へ戻りました')}
function clearToday(){if(confirm('今日の記録をすべて削除しますか？')){localStorage.removeItem(key());renderAll();document.getElementById('result').textContent='ここに集計が表示されます。';showRecords();showToast('削除しました')}}
function bind(id,fn){const el=document.getElementById(id); if(!el) return; el.addEventListener('click',function(e){e.preventDefault();fn();},{passive:false});}
function boot(){updateClock();setTimeDefaults();renderAll();bind('sumBtn',goToSummary);bind('summaryTab',goToSummary);bind('topBtn',scrollToTop);bind('copyBtn',copySummary);bind('delBtn',clearToday);bind('recordsTab',showRecords);setInterval(updateClock,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){updateClock();setTimeDefaults();renderAll()}});window.addEventListener('pageshow',()=>{updateClock();setTimeDefaults();renderAll()});window.addEventListener('focus',()=>{updateClock();setTimeDefaults();renderAll()});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
