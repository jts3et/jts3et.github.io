/* Shared config, auth, and helpers for the Morphing Intelligence reading-group site. */
const SUPABASE_URL = 'https://tnasxupoydyoxibccovm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYXN4dXBveWR5b3hpYmNjb3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDM5NjksImV4cCI6MjA4NDc3OTk2OX0.JTXSnyDDl5Ta3s7fDtnGfWcuicuchwP5A5WhRZ_exIg';
const GROUP = 'malabou-2026';
const BUCKET = 'malabou-readings';
const ORGANIZERS = ['jtstec@iu.edu','stecj2700@gmail.com'];

const WEEKS = [
  {n:1, date:'Nov 6', title:'Translator’s Foreword, Preface, Introduction',
   files:[{id:'w1-malabou', label:'Malabou · 35 pp', path:'week1-malabou-foreword-preface-introduction.pdf', title:'Malabou, Foreword, Preface, Introduction'},
          {id:'w1-james', label:'James · 12 pp', path:'week1-james-introduction-plasticity.pdf', title:'James, Introduction to Plasticity: The Promise of Explosion'}],
   opt:null},
  {n:2, date:'Nov 13', title:'Ch. 1, “g: Intelligence and Genetic Fate”',
   files:[{id:'w2', label:'Ch. 1 · 38 pp', path:'week2-ch1-g.pdf', title:'Ch. 1, g: Intelligence and Genetic Fate'}],
   opt:'Optional: Gould, <i>The Mismeasure of Man</i> (rev. ed. 1996), ch. 6'},
  {n:3, date:'Nov 20', title:'Ch. 2, “The ‘Blue Brain’”',
   files:[{id:'w3', label:'Ch. 2 · 42 pp', path:'week3-ch2-blue-brain.pdf', title:'Ch. 2, The “Blue Brain”'}],
   opt:'Optional: Markram, “The Blue Brain Project,” <i>Nature Reviews Neuroscience</i> 7 (2006)'},
  {break:true, text:'Nov 27 · no meeting (Thanksgiving)'},
  {n:4, date:'Dec 4', title:'Ch. 3, “Like a Pollock Painting”',
   files:[{id:'w4', label:'Ch. 3 · 42 pp', path:'week4-ch3-pollock.pdf', title:'Ch. 3, Like a Pollock Painting'}],
   opt:'Optional: Malabou, <i>Before Tomorrow: Epigenesis and Rationality</i> (2016), excerpt'},
  {n:5, date:'Dec 11', title:'Conclusion and Postscript, “Artificial Intelligence: The Fourth Blow to Our Narcissism”',
   files:[{id:'w5', label:'Conclusion + Postscript · 26 pp', path:'week5-conclusion-postscript.pdf', title:'Conclusion and Postscript'}],
   opt:'Optional: Freud, “A Difficulty in the Path of Psycho-Analysis” (1917)'},
  {n:0, date:'Notes', title:'Endnotes for all chapters',
   files:[{id:'notes', label:'Endnotes · 22 pp', path:'endnotes.pdf', title:'Endnotes, Morphing Intelligence'}], opt:null}
];
const FILES = {}; WEEKS.forEach(w => (w.files||[]).forEach(f => { f.week = w; FILES[f.id] = f; }));

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let user = null, displayName = '', authBusy = false;
const $ = id => document.getElementById(id);

function gateMsg(t, cls){ const m=$('gateMsg'); if(m){ m.textContent=t||''; m.className='gate-msg '+(cls||''); } }
function toast(t){ const e=$('toast'); if(!e) return; e.textContent=t; e.classList.add('on'); setTimeout(()=>e.classList.remove('on'),2200); }
function esc(t){ const d=document.createElement('div'); d.textContent=t||''; return d.innerHTML; }
function seen(){ try { return JSON.parse(localStorage.getItem('mi_seen')||'{}'); } catch(e){ return {}; } }
function markSeen(id){ try { const s=seen(); s[id]=1; localStorage.setItem('mi_seen', JSON.stringify(s)); } catch(e){} }

async function signIn(){
  const email = $('gateEmail').value.trim().toLowerCase(), password = $('gatePw').value;
  if (!email || !password) return gateMsg('Enter your email address and password.', 'err');
  gateMsg('Signing in…');
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) gateMsg(/invalid/i.test(error.message) ? 'Wrong email or password. Use the address and password from the invitation email.' : error.message, 'err');
}
async function signOut(){ await db.auth.signOut(); location.href = 'index.html'; }

async function isMember(email){
  const { data, error } = await db.from('group_members').select('email, display_name').eq('group_slug', GROUP).ilike('email', email).maybeSingle();
  if (error) { console.warn(error); return null; }
  return data;
}
async function signedUrl(path, secs){
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, secs||3600);
  if (error) throw error; return data.signedUrl;
}

/* Each page defines onSignedIn(); this wires the gate to it. */
db.auth.onAuthStateChange(async (event, session) => {
  if (!session?.user) { $('gate').hidden=false; document.body.classList.remove('in'); return; }
  if (authBusy) return; authBusy = true;
  try {
    const m = await isMember(session.user.email);
    if (!m) {
      gateMsg('This address (' + session.user.email + ') is not on the invite list. Sign in with the address the invitation reached you at, or write to jtstec@iu.edu.', 'err');
      await db.auth.signOut(); return;
    }
    user = session.user; displayName = m.display_name || session.user.email;
    $('gate').hidden = true; document.body.classList.add('in');
    const who=$('whoName'); if (who) who.textContent = displayName;
    if (typeof onSignedIn === 'function') onSignedIn();
  } finally { authBusy = false; }
});
