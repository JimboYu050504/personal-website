async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok){ console.warn('Failed to load', path); return null; }
  return res.json();
}

function el(tag, attrs={}, children=[]) {
  const node = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function renderGallery(items){
  const grid = document.getElementById('photo-grid');
  if(!grid) return;
  grid.innerHTML = '';
  (items || []).forEach(it => {
    const card = el('div', {class:'photo-card'});
    const img = el('img', {src: it.src, alt: it.alt || 'photo'});
    const cap = el('div', {class:'photo-cap', html: it.caption || ''});
    card.appendChild(img);
    if (it.caption) card.appendChild(cap);
    grid.appendChild(card);
  });
}

function renderBlog(posts){
  const list = document.getElementById('blog-list');
  if(!list) return;
  list.innerHTML = '';
  (posts || []).sort((a,b)=> new Date(b.date) - new Date(a.date)).forEach(p => {
    const card = el('article', {class:'blog-card'});
    const h = el('h3', {html: p.title || 'Untitled'});
    const meta = el('div', {class:'meta', html: new Date(p.date).toLocaleDateString()});
    const body = el('p', {html: p.content || ''});
    card.appendChild(h); card.appendChild(meta); card.appendChild(body);
    list.appendChild(card);
  });
}

function renderVideos(videos){
  const grid = document.getElementById('video-grid');
  if(!grid) return;
  grid.innerHTML = '';
  (videos || []).forEach(v => {
    const wrap = el('div', {class:'video-card'});
    let src = v.embed || v.link || '';
    if (!v.embed && v.link && v.link.includes('youtube.com/watch')){
      const id = new URL(v.link).searchParams.get('v');
      src = `https://www.youtube.com/embed/${id}`;
    }
    if (!src && v.link && v.link.includes('youtu.be/')){
      const id = v.link.split('/').pop();
      src = `https://www.youtube.com/embed/${id}`;
    }
    if (!src && v.link && v.link.includes('vimeo.com/')){
      const id = v.link.split('/').pop();
      src = `https://player.vimeo.com/video/${id}`;
    }
    const iframe = el('iframe', {src, frameborder:'0', allow:'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share', allowfullscreen:'true', loading:'lazy'});
    wrap.appendChild(iframe);
    if (v.title) wrap.appendChild(el('div', {class:'video-cap', html: v.title}));
    grid.appendChild(wrap);
  });
}

(async function init(){
  const gallery = await loadJSON('data/gallery.json');
  const posts = await loadJSON('data/posts.json');
  const videos = await loadJSON('data/videos.json');
  renderGallery(gallery && gallery.items);
  renderBlog(posts && posts.items);
  renderVideos(videos && videos.items);
})();
