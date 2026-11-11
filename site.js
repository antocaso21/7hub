// Progressive enhancement only; no cookies, tracking or external APIs.
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    const close = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); };
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    document.addEventListener('click', event => { if (!nav.contains(event.target) && !menuButton.contains(event.target)) close(); });
  }
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const projects = Array.from(document.querySelectorAll('[data-category]'));
  const search = document.getElementById('project-search');
  const noResults = document.getElementById('no-results');
  const count = document.getElementById('project-count');
  if (filters.length && projects.length) {
    let active='tutti';
    const apply = () => {
      const query=(search?.value || '').trim().toLocaleLowerCase('it');
      let shown = 0;
      projects.forEach(card => {
        const category = active==='tutti'||card.dataset.category.split(' ').includes(active);
        const textual = !query || card.textContent.toLocaleLowerCase('it').includes(query);
        const visible=category && textual;
        card.hidden = !visible;
        if(visible) shown++;
      });
      if(noResults) noResults.hidden = shown>0;
      if(count) count.textContent=`${shown} ${shown===1?'risultato':'risultati'}`;
    };
    filters.forEach(filter => filter.addEventListener('click', () => {
      active = filter.dataset.filter;
      filters.forEach(el => el.setAttribute('aria-pressed', String(el === filter)));
      apply();
    }));
    if(search) search.addEventListener('input',apply);
    apply();
  }
  const contact=document.getElementById('contact-composer-form');
  if (contact) contact.addEventListener('submit',event=>{
    event.preventDefault();
    if(!contact.reportValidity()) return;
    const data=new FormData(contact);
    const sender=String(data.get('sender')||'').trim().slice(0,100);
    const topic=String(data.get('topic')||'').trim().slice(0,100);
    const message=String(data.get('message')||'').trim().slice(0,2000);
    const subject=`7Hub | ${topic} | ${sender}`;
    const body=`Nome / organizzazione: ${sender}\nAmbito: ${topic}\n\nProposta:\n${message}`;
    window.location.href='mailto:associazione7hub@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const status=document.getElementById('contact-feedback');
    if(status) status.textContent='La bozza è stata preparata nel programma di posta, se configurato. Controlla destinatario e testo, quindi invia il messaggio.';
  });
})();
