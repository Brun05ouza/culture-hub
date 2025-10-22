(function(){
  const onReady = (fn)=> document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded', fn)
    : fn();

  onReady(function(){
    const bar  = document.getElementById('filtersBar');
    const grid = document.getElementById('featuredEvents');
    if (!bar || !grid) return;

    const cards = [...grid.querySelectorAll('.event-card')];
    const slug = (s='') => s.toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,'');

    cards.forEach(c=>{
      if (c.dataset.category) c.dataset.category = slug(c.dataset.category);
      if (c.dataset.status)   c.dataset.status   = slug(c.dataset.status);
    });

    const cats = ['musica','teatro','cinema','arte','comedia','literatura','danca','gastronomia'];
    const count = {
      'status:*'      : cards.length,
      'status:ongoing': cards.filter(c=>c.dataset.status==='ongoing').length,
      'status:upcoming':cards.filter(c=>c.dataset.status==='upcoming').length,
      'status:ended'  : cards.filter(c=>c.dataset.status==='ended').length,
    };
    cats.forEach(cat => count['cat:'+cat] = cards.filter(c=>c.dataset.category===cat).length);

    bar.querySelectorAll('.chip').forEach(ch=>{
      const key = ch.dataset.filter, n = count[key];
      if (typeof n === 'number') {
        let b = ch.querySelector('.count');
        if (!b) { b = document.createElement('span'); b.className='count'; ch.appendChild(b); }
        b.textContent = n;
      }
    });

    bar.addEventListener('click', (e)=>{
      const btn = e.target.closest('.chip'); if (!btn) return;
      bar.querySelectorAll('.chip').forEach(c=> c.classList.remove('is-active'));
      btn.classList.add('is-active');

      const [type, raw] = (btn.dataset.filter || 'status:*').split(':');
      const val = raw === '*' ? '*' : slug(raw);

      cards.forEach(card=>{
        const st = card.dataset.status || '';
        const cat= card.dataset.category || '';
        let show = true;
        if (type==='status' && val!=='*') show = (st===val);
        if (type==='cat')                 show = (cat===val);
        card.style.display = show ? '' : 'none';
      });
    });

    console.log('[home-filters] ok');
  });
})();
