'use strict';
const C=window.CalendarPOC,$=id=>document.getElementById(id);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let state=C.read(),screen='home',selectedId=null,conversationId=null,lastApp='schedule',pendingTimer=null;
function syncSize(){document.querySelector('.phone').style.setProperty('--u',`${$('phone').clientWidth/1080}px`);}
new ResizeObserver(syncSize).observe($('phone'));syncSize();
function setScreen(next){screen=next;for(const el of document.querySelectorAll('.screen')){const visible=el.id===`${next}Screen`;el.hidden=!visible;el.classList.toggle('current',visible);}$('phone').classList.toggle('locked',next==='lock');$('phone').classList.toggle('messages',next==='messages');if(['home','schedule','detail'].includes(next))lastApp=next;}
function visibleMessages(){return state.messages.filter(m=>state.bookings.some(b=>b.id===m.bookingId&&b.consent&&b.status==='active'));}
function render(){
 const list=C.bookings(state),active=list.filter(b=>b.status==='active');
 $('entryCount').textContent=`${active.length}건`;$('entryNext').textContent=active.length?C.shortDate(active[0].when):'신청한 일정 없음';$('listCount').textContent=active.length;
 $('scheduleList').innerHTML=list.length?list.map(b=>{const s=C.services[b.serviceId];return `<button class="appointment${b.status==='cancelled'?' cancelled':''}" data-booking="${escapeHtml(b.id)}" type="button"><span class="appointment-top"><span class="appointment-institution">${escapeHtml(s.institution)}</span><span class="appointment-chevron" aria-hidden="true">›</span></span><strong>${escapeHtml(s.title)}</strong><span class="appointment-date">${escapeHtml(C.shortDate(b.when))}</span><span class="badge ${b.status==='active'?s.verdict:''}">${b.status==='active'?escapeHtml(s.label):'예약 취소'}</span></button>`;}).join(''):'<p class="empty-message">신청한 일정이 없습니다.</p>';
 $('unreadDot').hidden=!visibleMessages().some(m=>!m.read);
 $('lockDate').textContent=C.day(new Date().toISOString());
 const latest=visibleMessages().find(m=>!m.read);
 $('lockNotifications').innerHTML=latest?`<button id="incomingSms" class="sms-notification" type="button"><span class="notification-caption"><span class="chat-icon"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3h14v10H8l-5 4z"/></svg></span>메시지<span class="notification-time">지금</span></span><strong>${escapeHtml(latest.sender)}</strong><p>${escapeHtml(latest.text.replace(/\n+/g,' '))}</p></button>`:'';
 if(screen==='detail'&&selectedId){const b=list.find(b=>b.id===selectedId);if(b)renderDetail(b);else setScreen('schedule');}
 if(screen==='messages')renderMessages();
}
function renderDetail(b){
 const s=C.services[b.serviceId],cancelled=b.status==='cancelled';
 $('detailContent').innerHTML=`<p class="detail-institution">${escapeHtml(s.institution)}</p><h2>${escapeHtml(s.title)}</h2><dl class="detail-rows"><div><dt>방문일시</dt><dd>${escapeHtml(C.shortDate(b.when))}</dd></div><div><dt>방문장소</dt><dd>${escapeHtml(s.place)}</dd></div></dl><div class="guidance"><strong>${cancelled?'취소된 일정입니다.':escapeHtml(s.heading)}</strong>${cancelled?'':`<p>${escapeHtml(s.description)}</p>`}</div>${cancelled?'':`<h3 class="preparation-title">준비물</h3>${s.items.map((item,i)=>`<label class="item"><input type="checkbox" data-check="${escapeHtml(b.id)}:${i}"${state.checks[`${b.id}:${i}`]?' checked':''}><span>${escapeHtml(item)}</span></label>`).join('')}<button id="detailReceive" class="detail-button" type="button">방문 전 알림 받기</button>`}`;
}
function openBooking(id){const b=C.bookings(state).find(b=>b.id===id);if(!b)return;selectedId=id;setScreen('detail');renderDetail(b);$('detailContent').scrollTop=0;}
function renderMessages(){
 const all=visibleMessages(),latest=all.find(m=>m.id===conversationId)||all[0];
 if(!latest){$('messageSender').textContent='메시지';$('messagesContent').innerHTML='<p class="empty-message">받은 메시지가 없습니다.</p>';return;}
 $('messageSender').textContent=latest.sender;
 const messages=all.filter(m=>m.sender===latest.sender).slice().reverse();
 $('messagesContent').innerHTML=`<p class="message-day">${escapeHtml(C.day(latest.at))}</p>`+messages.map(m=>`<div class="sms-bubble">${escapeHtml(m.text)}\n<a href="#booking=${encodeURIComponent(m.bookingId)}" data-message-booking="${escapeHtml(m.bookingId)}">일정 및 준비물 확인</a></div><p class="sms-time">${escapeHtml(C.time(m.at))}</p>`).join('');
 const unreadIds=new Set(messages.filter(m=>!m.read).map(m=>m.id));if(unreadIds.size)state=C.update(next=>{let changed=false;for(const m of next.messages)if(unreadIds.has(m.id)&&!m.read){m.read=true;changed=true;}return changed;});$('unreadDot').hidden=!visibleMessages().some(m=>!m.read);
}
function openMessages(id){conversationId=id||visibleMessages()[0]?.id;setScreen('messages');renderMessages();$('messagesContent').scrollTop=$('messagesContent').scrollHeight;render();}
function deliver(id){
 state=C.update(next=>{const b=next.bookings.find(b=>b.id===id&&b.consent&&b.status==='active');if(!b)return false;const s=C.services[b.serviceId];next.messages.unshift({id:`sms-${Date.now()}-${Math.random().toString(16).slice(2)}`,bookingId:b.id,sender:s.institution,text:C.messageFor(b),at:new Date().toISOString(),read:false});next.messages=next.messages.slice(0,30);});pendingTimer=null;$('demoReceive').disabled=false;render();
}
function receive(id){
 if(pendingTimer!==null)return;
 state=C.read();
 const active=C.bookings(state).filter(b=>b.status==='active');
 const b=id?active.find(b=>b.id===id):active.find(b=>C.services[b.serviceId].verdict==='physical')||active[0];
 if(!b)return;
 setScreen('lock');render();$('demoReceive').disabled=true;
 pendingTimer=setTimeout(()=>deliver(b.id),1400);
}
$('entryOpen').addEventListener('click',()=>{setScreen('schedule');render();});
$('scheduleList').addEventListener('click',e=>{const target=e.target.closest('[data-booking]');if(target)openBooking(target.dataset.booking);});
$('detailContent').addEventListener('change',e=>{if(e.target.dataset.check){const key=e.target.dataset.check,value=e.target.checked;state=C.update(next=>{next.checks[key]=value;});}});
$('detailContent').addEventListener('click',e=>{if(e.target.closest('#detailReceive'))receive(selectedId);});
$('lockNotifications').addEventListener('click',e=>{if(e.target.closest('#incomingSms'))openMessages(visibleMessages().find(m=>!m.read)?.id);});
$('messagesContent').addEventListener('click',e=>{const link=e.target.closest('[data-message-booking]');if(link){e.preventDefault();openBooking(link.dataset.messageBooking);}});
document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>{setScreen(button.dataset.go);render();}));
$('demoHome').addEventListener('click',()=>setScreen('home'));
$('demoSchedule').addEventListener('click',()=>{setScreen('schedule');render();});
$('demoReceive').addEventListener('click',()=>receive());
$('inboxOpen').addEventListener('click',()=>openMessages());
$('unlock').addEventListener('click',()=>{setScreen(lastApp);render();});
$('homeButton').addEventListener('click',()=>setScreen('home'));
$('recentButton').addEventListener('click',()=>{setScreen('schedule');render();});
$('backButton').addEventListener('click',()=>{setScreen(screen==='detail'||screen==='messages'?'schedule':screen==='lock'?lastApp:'home');render();});
window.addEventListener('storage',e=>{if(e.key===C.KEY){state=C.read();render();}});
window.addEventListener('pagehide',()=>{if(pendingTimer!==null)clearTimeout(pendingTimer);});
state=C.update(()=>true);render();
const match=location.hash.match(/^#booking=(.+)$/);if(match)try{openBooking(decodeURIComponent(match[1]));}catch{}
if(location.hash==='#schedule')setScreen('schedule');
