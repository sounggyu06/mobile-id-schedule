(function(root){
'use strict';
const KEY='mobileid-schedule-pages-v1';
const services={
  consult:{institution:'다온구청',title:'민원 상담',place:'1층 민원실',verdict:'allowed',label:'모바일신분증 사용 가능',heading:'모바일신분증을 사용할 수 있어요',description:'방문 시 모바일 주민등록증을 제시해주세요.',items:['모바일 주민등록증','예약 확인 내용']},
  documents:{institution:'다온구청',title:'원본 서류 접수',place:'2층 접수창구',verdict:'physical',label:'실물 신분증 지참',heading:'실물 신분증을 챙겨주세요',description:'이 업무는 원본 대조를 위해 실물 신분증이 필요해요.',items:['실물 주민등록증 또는 운전면허증','제출할 서류 원본']},
  facility:{institution:'다온문화센터',title:'시설 이용 등록',place:'1층 안내데스크',verdict:'unknown',label:'신분증 인정 기준 확인 필요',heading:'방문 전에 확인해주세요',description:'모바일신분증 인정 여부를 기관에 확인해주세요.',items:['기관에 신분증 인정 여부 확인','예약 확인 내용']}
};
function futureDate(days,hour){const d=new Date();d.setDate(d.getDate()+days);d.setHours(hour,0,0,0);return d.toISOString();}
function initial(){return{version:1,bookings:[{id:'demo-consult',serviceId:'consult',when:futureDate(1,10),consent:true,status:'active'},{id:'demo-documents',serviceId:'documents',when:futureDate(1,14),consent:true,status:'active'},{id:'demo-facility',serviceId:'facility',when:futureDate(3,11),consent:true,status:'active'}],messages:[],checks:{}};}
let memory;
function valid(s){return s&&Number.isFinite(s.version)&&Array.isArray(s.bookings)&&Array.isArray(s.messages)&&s.checks&&typeof s.checks==='object'&&s.bookings.every(b=>typeof b.id==='string'&&services[b.serviceId]&&Number.isFinite(Date.parse(b.when))&&typeof b.consent==='boolean'&&['active','cancelled'].includes(b.status))&&s.messages.every(m=>typeof m.id==='string'&&typeof m.bookingId==='string'&&typeof m.text==='string'&&typeof m.sender==='string'&&Number.isFinite(Date.parse(m.at)));}
function read(){try{const s=JSON.parse(localStorage.getItem(KEY));if(valid(s)){memory=s;return s;}}catch{}if(!memory)memory=initial();return JSON.parse(JSON.stringify(memory));}
function write(s){s.version=(s.version||0)+1;memory=JSON.parse(JSON.stringify(s));try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}return s;}
function update(change){const current=read();if(change(current)===false)return current;return write(current);}
function bookings(s){return s.bookings.filter(b=>b.consent).sort((a,b)=>(a.status==='cancelled')-(b.status==='cancelled')||Date.parse(a.when)-Date.parse(b.when));}
function day(value){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(new Date(value));}
function shortDate(value){return new Intl.DateTimeFormat('ko-KR',{month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));}
function time(value){return new Intl.DateTimeFormat('ko-KR',{hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(value));}
function messageFor(b){const s=services[b.serviceId];return `[${s.institution} 방문 안내]\n\n김하늘님, ${shortDate(b.when)} ${s.title} 예약이 있어요.\n\n${s.verdict==='physical'?'해당 업무는 모바일신분증을 사용할 수 없습니다. 실물 신분증을 지참해주세요.':s.verdict==='allowed'?'모바일 주민등록증으로 본인확인이 가능합니다. 방문 전 앱 실행을 확인해주세요.':'모바일신분증 인정 여부를 기관에 확인한 후 방문해주세요.'}\n\n준비물: ${s.items.join(', ')}`;}
const api={KEY,services,initial,read,write,update,bookings,day,shortDate,time,messageFor};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CalendarPOC=api;
})(typeof window==='undefined'?globalThis:window);
