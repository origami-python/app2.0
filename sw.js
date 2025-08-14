async function wikiSummaryThumb(lang, title){
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` + encodeURIComponent(title);
  try{
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if(!res.ok) return null;
    const data = await res.json();
    return data?.thumbnail?.source || null;
  }catch{ return null; }
}

async function fetchImageURL(query){
  if(!query) return null;
  let src = await wikiSummaryThumb('ja', query);
  if(!src) src = await wikiSummaryThumb('en', query);
  return src || null;
}

function guessQueryFromQuestion(text){
  const t = text.replace(/[「」『』【】（）()［］\[\]、。・：:;!?！？…\.,"'`]/g,'').trim();
  return t.slice(0, 18);
}

async function renderQuestionImage(q){
  const box = document.getElementById('qimage');
  if(!box) return;
  box.style.display = 'none';
  box.innerHTML = '';

  const query = q.mediaQuery?.trim() || guessQueryFromQuestion(q.question);
  const src = await fetchImageURL(query);
  if(!src) return;

  const img = document.createElement('img');
  img.src = src;
  img.alt = q.question || query;
  box.appendChild(img);
  box.style.display = 'block';
}
