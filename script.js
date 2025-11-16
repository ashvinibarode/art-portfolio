// Basic helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// MENU (mobile)
const menuBtn = $('#menuBtn');
const nav = $('#nav');
menuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
  if(nav.classList.contains('open')) {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.right = '6%';
    nav.style.top = '64px';
    nav.style.background = 'white';
    nav.style.padding = '12px';
    nav.style.borderRadius = '8px';
    nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
  } else {
    nav.style.display = '';
    nav.style.position = '';
    nav.style.right = '';
    nav.style.top = '';
    nav.style.background = '';
    nav.style.padding = '';
    nav.style.borderRadius = '';
    nav.style.boxShadow = '';
  }
});

// FILTER
const filterBtns = $$('.filter-btn');
const cards = $$('.card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if(filter === 'all') card.style.display = '';
      else card.style.display = card.classList.contains(filter) ? '' : 'none';
    });
  });
});

// LIGHTBOX (view)
const lightbox = $('#lightbox');
const lbImage = $('.lb-image');
const lbTitle = $('.lb-title');
const lbDesc = $('.lb-desc');
const lbClose = $('.lb-close');

$$('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const article = document.querySelector(`.card[data-id="${id}"]`);
    if(!article) return;
    const src = article.querySelector('img').src;
    const title = article.dataset.title || '';
    const desc = article.dataset.desc || '';
    lbImage.src = src;
    lbImage.alt = title;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');

    // Mobile-friendly: adjust image height
    if(window.innerWidth <= 720){
      lbImage.style.maxHeight = '70vh';
    } else {
      lbImage.style.maxHeight = '100%';
    }
  });
});
lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) closeLB();
});
function closeLB(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
  lbImage.src = '';
}

// LIKE buttons (persist via localStorage)
$$('.card').forEach(card => {
  const id = card.dataset.id;
  const likeBtn = card.querySelector('.like-btn');
  const likeCountEl = card.querySelector('.like-count');

  // load stored value
  const stored = localStorage.getItem('like_'+id);
  let liked = false;
  let count = 0;
  if(stored) {
    try {
      const data = JSON.parse(stored);
      liked = data.liked || false;
      count = data.count || 0;
    } catch(e){}
  }
  likeCountEl.textContent = count;
  if(liked) likeBtn.classList.add('liked'), likeBtn.innerHTML = `❤ <span class="like-count">${count}</span>`;

  likeBtn.addEventListener('click', () => {
    liked = !liked;
    count = liked ? count + 1 : Math.max(0, count - 1);
    likeCountEl.textContent = count;
    if(liked) likeBtn.classList.add('liked'), likeBtn.innerHTML = `❤ <span class="like-count">${count}</span>`;
    else likeBtn.classList.remove('liked'), likeBtn.innerHTML = `♡ <span class="like-count">${count}</span>`;
    localStorage.setItem('like_'+id, JSON.stringify({ liked, count }));

    // Mobile-friendly: slightly bigger heart animation on small screens
    if(window.innerWidth <= 420){
      likeBtn.style.transform = 'scale(1.2)';
      setTimeout(()=>likeBtn.style.transform='scale(1)',200);
    }
  });
});

// Fade-in on scroll for .section elements
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting) en.target.classList.add('visible');
  });
}, {threshold:0.15});
$$('.section').forEach(s => {
  s.classList.add('fade-in');
  io.observe(s);
});
