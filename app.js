const $ = (id) => document.getElementById(id);
let running = false;
let stopped = false;
let timer;
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('show'),2600)}
function timeNow(){return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}
function addEvent(event, market, status='INFO'){
  const body=$('historyBody');
  if(body.children.length===1 && body.innerText.includes('Waiting for action')) body.innerHTML='';
  const row=document.createElement('tr');
  const values=[timeNow(),event,market,status];
  values.forEach((v,i)=>{const td=document.createElement('td');td.textContent=v;if(i===3){const tag=document.createElement('span');tag.className='tag '+(status==='BLOCKED'?'red':status==='RUNNING'?'gray':'gray');tag.textContent=status;td.textContent='';td.appendChild(tag)}row.appendChild(td)});
  body.prepend(row);
}
function updateControls(){
  $('robotStatus').textContent=stopped?'Emergency stop active':running?'Demo simulation running':'Robot paused';
  $('robotSub').textContent=stopped?'All simulated orders blocked':running?'Simulation only · no broker orders':'No orders will be sent';
  $('robotTag').textContent=stopped?'STOPPED':running?'SIMULATING':'PAUSED';
  $('robotTag').className='tag '+(stopped?'red':'gray');
  $('ordersState').textContent=stopped?'STOPPED':'BLOCKED';
  $('startDemo').textContent=running?'Pause demo simulation':'Start demo simulation';
  $('startDemo').disabled=stopped;
  $('startDemo').style.opacity=stopped?'.5':'1';
}
$('startDemo').addEventListener('click',()=>{
  if(stopped){toast('Emergency stop is active. Reset requires a deliberate page reload.');return}
  running=!running;updateControls();
  addEvent(running?'Demo simulation started':'Demo simulation paused',$('market').value.split(' ')[0],running?'RUNNING':'INFO');
  toast(running?'Demo simulation started. No real orders are sent.':'Simulation paused.');
});
function emergencyStop(){
  running=false;stopped=true;updateControls();
  addEvent('Emergency stop activated','ALL','BLOCKED');
  toast('Emergency stop active. No orders can be sent.');
}
$('emergency').addEventListener('click',emergencyStop);
$('emergencyTop').addEventListener('click',emergencyStop);
$('clearHistory').addEventListener('click',()=>{$('historyBody').innerHTML='<tr><td>—</td><td>History cleared</td><td>—</td><td><span class="tag gray">INFO</span></td></tr>';toast('Local demo history cleared.')});
$('market').addEventListener('change',()=>{const value=$('market').value;$('symbolName').textContent=value.split(' ')[0];toast('Selected '+value+' · sample data only')});
// Draw deterministic decorative candles, explicitly not market data.
const g=$('candles');let seed=27;const rand=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
for(let i=0;i<30;i++){const x=12+i*21.8;const mid=180-rand()*140;const open=mid+(rand()-.5)*26;const close=mid+(rand()-.5)*28;const top=Math.min(open,close),height=Math.max(4,Math.abs(open-close));const color=close<open?'#ff6f7d':'#4bd4a0';const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',x+5);line.setAttribute('x2',x+5);line.setAttribute('y1',Math.max(4,top-10));line.setAttribute('y2',Math.min(222,top+height+10));line.setAttribute('stroke',color);line.setAttribute('stroke-width','1.3');g.appendChild(line);const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('x',x);rect.setAttribute('y',top);rect.setAttribute('width','10');rect.setAttribute('height',height);rect.setAttribute('fill',color);rect.setAttribute('rx','1');g.appendChild(rect)}
updateControls();