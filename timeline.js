/* ─── INIT ─────────────────────────────────────────────────────────── */
const cards = [...document.querySelectorAll('#tlv section.m')];
const totalCards = cards.length;

const dnav = document.getElementById('dnav');
const cdec = document.getElementById('cdec');
const ctr = document.getElementById('ctr');
const prog = document.getElementById('prog');
const eraStrip = document.getElementById('era-strip');
const eraInner = document.getElementById('era-inner');
const ctrBadge = document.getElementById('ctr-badge');

const galleryModal = document.getElementById('galleryModal');
const galleryTrack = document.getElementById('galleryTrack');

const galleryState = {
  slides: [],
  activeLoopIndex: 0,
  lastTrigger: null,
  offset: 0,
  cycleWidth: 0,
  slideWidth: 0
};

const marqueeState = {
  rafId: 0,
  lastTs: 0,
  isHovering: false,
  isDragging: false,
  dragStartX: 0,
  dragStartOffset: 0
};

const MARQUEE_SPEED_PX_PER_SEC = 26;
const MARQUEE_COPY_COUNT = 3;

/* ─── ERA SCRUBBER ─────────────────────────────────────────────────── */
const decadeList = [...new Set(cards.map(card => card.dataset.dec).filter(Boolean))];
const decadeFirstIndex = new Map();
cards.forEach((card, i) => {
  const dec = card.dataset.dec;
  if (dec && !decadeFirstIndex.has(dec)) decadeFirstIndex.set(dec, i);
});

function setPhotoOrientation(img) {
  const frame = img.closest('.mphoto');
  if (!frame) return;

  frame.classList.remove('landscape', 'portrait', 'square');
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return;

  const ratio = w / h;
  if (ratio > 1.05) frame.classList.add('landscape');
  else if (ratio < 0.95) frame.classList.add('portrait');
  else frame.classList.add('square');
}

[...document.querySelectorAll('.mphoto img')].forEach(img => {
  if (img.complete) setPhotoOrientation(img);
  else img.addEventListener('load', () => setPhotoOrientation(img), { once: true });
});

decadeList.forEach(d => {
  const btn = document.createElement('button');
  btn.className = 'era-item';
  btn.dataset.dec = d;
  btn.textContent = d;
  btn.setAttribute('aria-label', `Jump to ${d}`);
  btn.addEventListener('click', () => scrollToMoment(decadeFirstIndex.get(d) ?? 0));
  eraInner?.appendChild(btn);
});

/* ─── DECADE SIDENAV ───────────────────────────────────────────────── */
decadeList.forEach(d => {
  const el = document.createElement('button');
  el.className = 'dni';
  el.dataset.dec = d;
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `Navigate to ${d}`);
  el.innerHTML = `<span class="dnl">${d}</span><div class="dnd"></div>`;
  el.addEventListener('click', () => scrollToMoment(decadeFirstIndex.get(d) ?? 0));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToMoment(decadeFirstIndex.get(d) ?? 0);
    }
  });
  dnav?.appendChild(el);
});

/* show persistent UI after hero */
eraStrip?.classList.add('v');
dnav?.classList.add('v');
ctrBadge?.classList.add('v');

/* ─── SCROLL + INTERSECTION ────────────────────────────────────────── */
let activeIndex = 0;
let renderRaf = 0;

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > .12) {
      entry.target.classList.add('in');
    }
  });
}, { threshold: [.12, .5] });
cards.forEach(card => revealObserver.observe(card));

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

function scrollToMoment(index) {
  const i = clamp(index, 0, totalCards - 1);
  cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cardFromViewport() {
  const center = window.innerHeight * .5;
  let best = 0;
  let dist = Infinity;
  cards.forEach((card, index) => {
    const r = card.getBoundingClientRect();
    const d = Math.abs(r.top + r.height * .5 - center);
    if (d < dist) {
      dist = d;
      best = index;
    }
  });
  return best;
}

function getCardMeta(card, fallbackIndex) {
  const id = Number(card?.dataset.id) || fallbackIndex + 1;
  const dec = card?.dataset.dec || '';
  const bg = card?.dataset.bg || getComputedStyle(card).getPropertyValue('--s-bg').trim();
  const sa = card?.dataset.sa || getComputedStyle(card).getPropertyValue('--sa').trim();
  return { id, dec, bg, sa };
}

function updateHeader(index) {
  const card = cards[index];
  if (!card) return;

  const meta = getCardMeta(card, index);
  const d = document.documentElement;
  const pct = window.scrollY / Math.max(1, d.scrollHeight - window.innerHeight);

  if (meta.bg) document.body.style.backgroundColor = meta.bg;
  cdec.textContent = meta.dec;
  if (meta.sa) cdec.style.color = meta.sa;
  ctr.textContent = `${String(meta.id).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
  prog.style.width = `${clamp(pct, 0, 1) * 100}%`;
  if (meta.sa) prog.style.background = meta.sa;

  document.querySelectorAll('.dni').forEach(item => {
    item.classList.toggle('on', item.dataset.dec === meta.dec);
  });
  document.querySelectorAll('.era-item').forEach(item => {
    item.classList.toggle('on', item.dataset.dec === meta.dec);
  });
}

function renderLinear() {
  if (!cards.length) return;
  const next = cardFromViewport();
  if (next !== activeIndex) activeIndex = next;
  updateHeader(activeIndex);
}

function queueRender() {
  if (renderRaf) return;
  renderRaf = requestAnimationFrame(() => {
    renderRaf = 0;
    renderLinear();
  });
}

/* ─── POPUP GALLERY ────────────────────────────────────────────────── */
function buildSlidesForCard(card) {
  const id = Number(card?.dataset.id) || 1;
  const image = card?.querySelector('.mphoto img');
  const src = image?.getAttribute('src');
  const alt = image?.getAttribute('alt') || `Moment ${id}`;
  if (!src) return [];

  if (id === 1) {
    const sectionOneSources = [
      'assets/image-1.png',
      'assets/image-1.1.jpg',
      'assets/image-1.2.jpg',
      'assets/image-1.3.jpg',
      'assets/image-1.4.jpg',
      'assets/image-1.5.jpg'
    ];

    return sectionOneSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 2) {
    const sectionTwoSources = [
      'assets/image-2.png',
      'assets/image-2.1.jpg',
      'assets/image-2.2.jpg',
      'assets/image-2.3.jpg',
      'assets/image-2.4.jpg',
      'assets/image-2.5.jpg'
    ];

    return sectionTwoSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 3) {
    const sectionThreeSources = [
      'assets/image-3.png',
      'assets/image-3.1.jpg',
      'assets/image-3.2.jpg',
      'assets/image-3.3.jpg',
      'assets/image-3.4.jpg',
      'assets/image-3.5.jpg'
    ];

    return sectionThreeSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 4) {
    const sectionFourSources = [
      'assets/image-4.png',
      'assets/image-4.1.jpg',
      'assets/image-4.2.jpg',
      'assets/image-4.3.jpg',
      'assets/image-4.4.jpg',
      'assets/image-4.5.jpg'
    ];

    return sectionFourSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 5) {
    const sectionFiveSources = [
      'assets/image-5.png',
      'assets/image-5.1.jpg',
      'assets/image-5.2.jpg',
      'assets/image-5.3.jpg',
      'assets/image-5.4.jpg',
      'assets/image-5.5.jpg'
    ];

    return sectionFiveSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 6) {
    const sectionSixSources = [
      'assets/image-6.png',
      'assets/image-6.1.jpg',
      'assets/image-6.2.jpg',
      'assets/image-6.3.jpg',
      'assets/image-6.4.jpg',
      'assets/image-6.5.jpg'
    ];

    return sectionSixSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 7) {
    const sectionSevenSources = [
      'assets/image-7.png',
      'assets/image-7.1.jpg',
      'assets/image-7.2.jpg',
      'assets/image-7.3.jpg',
      'assets/image-7.4.jpg',
      'assets/image-7.5.jpg'
    ];

    return sectionSevenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 8) {
    const sectionEightSources = [
      'assets/image-8.png',
      'assets/image-8.1.jpg',
      'assets/image-8.2.jpg',
      'assets/image-8.3.jpg',
      'assets/image-8.4.jpg',
      'assets/image-8.5.jpg'
    ];

    return sectionEightSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 9) {
    const sectionNineSources = [
      'assets/image-9.png',
      'assets/image-9.1.jpg',
      'assets/image-9.2.jpg',
      'assets/image-9.3.jpg',
      'assets/image-9.4.jpg',
      'assets/image-9.5.jpg'
    ];

    return sectionNineSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 10) {
    const sectionTenSources = [
      'assets/image-10.png',
      'assets/image-10.1.jpg',
      'assets/image-10.2.jpg',
      'assets/image-10.3.jpeg',
      'assets/image-10.4.jpg',
      'assets/image-10.5.jpg'
    ];

    return sectionTenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 11) {
    const sectionElevenSources = [
      'assets/image-11.png',
      'assets/image-11.1.jpg',
      'assets/image-11.2.jpg',
      'assets/image-11.3.jpg',
      'assets/image-11.4.jpg',
      'assets/image-11.5.jpg'
    ];

    return sectionElevenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 12) {
    const sectionTwelveSources = [
      'assets/image-12.png',
      'assets/image-12.1.jpg',
      'assets/image-12.2.jpg',
      'assets/image-12.3.jpg',
      'assets/image-12.4.jpg',
      'assets/image-12.5.jpg'
    ];

    return sectionTwelveSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 13) {
    const sectionThirteenSources = [
      'assets/image-13.png',
      'assets/image-13.1.jpg',
      'assets/image-13.2.jpg',
      'assets/image-13.3.jpg',
      'assets/image-13.4.jpg',
      'assets/image-13.5.jpg'
    ];

    return sectionThirteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 14) {
    const sectionFourteenSources = [
      'assets/image-14.png',
      'assets/image-14.1.jpg',
      'assets/image-14.2.jpg',
      'assets/image-14.3.jpg',
      'assets/image-14.4.jpg',
      'assets/image-14.5.jpg'
    ];

    return sectionFourteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 15) {
    const sectionFifteenSources = [
      'assets/image-15.png',
      'assets/image-15.1.jpg',
      'assets/image-15.2.jpg',
      'assets/image-15.3.jpg',
      'assets/image-15.4.jpg',
      'assets/image-15.5.jpg'
    ];

    return sectionFifteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 16) {
    const sectionSixteenSources = [
      'assets/image-16.png',
      'assets/image-16.1.jpg',
      'assets/image-16.2.jpg',
      'assets/image-16.3.jpg',
      'assets/image-16.4.jpg',
      'assets/image-16.5.jpg'
    ];

    return sectionSixteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 17) {
    const sectionSeventeenSources = [
      'assets/image-17.png',
      'assets/image-17.1.jpg',
      'assets/image-17.2.jpg',
      'assets/image-17.3.jpg',
      'assets/image-17.4.jpg',
      'assets/image-17.5.jpg'
    ];

    return sectionSeventeenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 18) {
    const sectionEighteenSources = [
      'assets/image-18.png',
      'assets/image-18.1.jpg',
      'assets/image-18.2.jpg',
      'assets/image-18.3.jpg',
      'assets/image-18.4.jpg',
      'assets/image-18.5.jpg'
    ];

    return sectionEighteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 19) {
    const sectionNineteenSources = [
      'assets/image-19.png',
      'assets/image-19.1.jpg',
      'assets/image-19.2.jpg',
      'assets/image-19.3.jpg',
      'assets/image-19.4.jpg',
      'assets/image-19.5.jpg'
    ];

    return sectionNineteenSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 20) {
    const sectionTwentySources = [
      'assets/image-20.png',
      'assets/image-20.1.jpg',
      'assets/image-20.2.jpg',
      'assets/image-20.3.jpg',
      'assets/image-20.4.jpg',
      'assets/image-20.5.jpg'
    ];

    return sectionTwentySources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 21) {
    const sectionTwentyOneSources = [
      'assets/image-21.png',
      'assets/image-21.1.jpg',
      'assets/image-21.2.jpg',
      'assets/image-21.3.jpg',
      'assets/image-21.4.jpg',
      'assets/image-21.5.jpg'
    ];

    return sectionTwentyOneSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 22) {
    const sectionTwentyTwoSources = [
      'assets/image-22.png',
      'assets/image-22.1.jpg',
      'assets/image-22.2.jpg',
      'assets/image-22.3.jpg',
      'assets/image-22.4.jpg',
      'assets/image-22.5.jpg'
    ];

    return sectionTwentyTwoSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 23) {
    const sectionTwentyThreeSources = [
      'assets/image-23.png',
      'assets/image-23.1.jpg',
      'assets/image-23.2.jpg',
      'assets/image-23.3.jpg',
      'assets/image-23.4.jpg',
      'assets/image-23.5.jpg'
    ];

    return sectionTwentyThreeSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 24) {
    const sectionTwentyFourSources = [
      'assets/image-24.png',
      'assets/image-24.1.jpg',
      'assets/image-24.2.jpg',
      'assets/image-24.3.jpg',
      'assets/image-24.4.jpg',
      'assets/image-24.5.jpeg'
    ];

    return sectionTwentyFourSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  if (id === 25) {
    const sectionTwentyFiveSources = [
      'assets/image-25.png',
      'assets/image-25.1.jpg',
      'assets/image-25.2.jpg',
      'assets/image-25.3.jpg',
      'assets/image-25.4.jpg',
      'assets/image-25.5.jpg'
    ];

    return sectionTwentyFiveSources.map((slideSrc, idx) => ({
      src: slideSrc,
      alt: `${alt} (${idx + 1})`
    }));
  }

  return [1, 2].map(step => ({
    src,
    alt: `${alt} (${step})`
  }));
}

function getGallerySlideWidth() {
  const slide = galleryTrack?.querySelector('.gallery-slide');
  return slide ? slide.getBoundingClientRect().width : 0;
}

function getRealSlideCount() {
  return galleryState.slides.length;
}

function normalizeOffset(rawOffset) {
  if (!galleryState.cycleWidth) return 0;
  const w = galleryState.cycleWidth;
  return ((rawOffset % w) + w) % w;
}

function refreshGalleryMetrics() {
  const total = getRealSlideCount();
  galleryState.slideWidth = getGallerySlideWidth();
  galleryState.cycleWidth = total && galleryState.slideWidth
    ? total * galleryState.slideWidth
    : 0;
}

function syncGalleryPosition() {
  if (!galleryTrack || !galleryState.cycleWidth) return;
  galleryState.offset = normalizeOffset(galleryState.offset);
  galleryTrack.scrollLeft = galleryState.cycleWidth + galleryState.offset;

  if (galleryState.slideWidth) {
    const total = Math.max(1, getRealSlideCount());
    galleryState.activeLoopIndex =
      Math.round(galleryState.offset / galleryState.slideWidth) % total;
  }
}

function stopMarquee() {
  if (marqueeState.rafId) {
    cancelAnimationFrame(marqueeState.rafId);
    marqueeState.rafId = 0;
  }
  marqueeState.lastTs = 0;
  marqueeState.isHovering = false;
  marqueeState.isDragging = false;
}

function startMarquee() {
  if (!galleryModal?.classList.contains('open') || marqueeState.rafId || !galleryTrack) return;

  marqueeState.lastTs = 0;
  const tick = ts => {
    if (!galleryModal?.classList.contains('open')) {
      marqueeState.rafId = 0;
      return;
    }

    if (!marqueeState.lastTs) marqueeState.lastTs = ts;
    const dt = (ts - marqueeState.lastTs) / 1000;
    marqueeState.lastTs = ts;

    if (marqueeState.isHovering && !marqueeState.isDragging && galleryState.cycleWidth) {
      galleryState.offset += dt * MARQUEE_SPEED_PX_PER_SEC;
      if (galleryState.offset >= galleryState.cycleWidth) {
        galleryState.offset -= galleryState.cycleWidth;
      }
      syncGalleryPosition();
    }

    marqueeState.rafId = requestAnimationFrame(tick);
  };

  marqueeState.rafId = requestAnimationFrame(tick);
}

function renderGallerySlides(slides) {
  if (!galleryTrack) return;
  galleryTrack.innerHTML = '';
  if (!slides.length) return;

  for (let copy = 0; copy < MARQUEE_COPY_COUNT; copy += 1) {
    slides.forEach(slide => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-slide';

      const image = document.createElement('img');
      image.src = slide.src;
      image.alt = slide.alt;
      image.loading = 'lazy';

      figure.appendChild(image);
      galleryTrack.appendChild(figure);
    });
  }
}

function scrollGalleryToLoopIndex(loopIndex, behavior = 'auto') {
  if (!galleryTrack) return;
  const total = getRealSlideCount();
  if (!total) return;

  if (!galleryState.slideWidth || !galleryState.cycleWidth) refreshGalleryMetrics();
  if (!galleryState.slideWidth || !galleryState.cycleWidth) return;

  const normalizedIndex = ((loopIndex % total) + total) % total;
  galleryState.activeLoopIndex = normalizedIndex;
  galleryState.offset = normalizedIndex * galleryState.slideWidth;
  syncGalleryPosition();
}

function openGallery(card, trigger) {
  const slides = buildSlidesForCard(card);
  if (!slides.length || !galleryModal || !galleryTrack) return;

  galleryState.slides = slides;
  galleryState.activeLoopIndex = 0;
  galleryState.offset = 0;
  galleryState.cycleWidth = 0;
  galleryState.slideWidth = 0;
  galleryState.lastTrigger = trigger || null;
  marqueeState.isHovering = false;
  marqueeState.isDragging = false;

  renderGallerySlides(slides);
  galleryModal.classList.add('open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');

  requestAnimationFrame(() => {
    refreshGalleryMetrics();
    syncGalleryPosition();
    galleryTrack.focus({ preventScroll: true });
    startMarquee();
  });
}

function closeGallery() {
  if (!galleryModal?.classList.contains('open')) return;

  galleryModal.classList.remove('open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
  stopMarquee();

  galleryState.slides = [];
  galleryState.activeLoopIndex = 0;
  galleryState.offset = 0;
  galleryState.cycleWidth = 0;
  galleryState.slideWidth = 0;
  if (galleryTrack) galleryTrack.innerHTML = '';

  if (galleryState.lastTrigger) {
    galleryState.lastTrigger.focus({ preventScroll: true });
    galleryState.lastTrigger = null;
  }
}

cards.forEach(card => {
  const trigger = card.querySelector('.mbutton-wrap .mbtn');
  if (!trigger) return;

  const id = Number(card.dataset.id) || 0;
  trigger.type = 'button';
  trigger.classList.add('gallery-trigger');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'galleryModal');
  trigger.setAttribute('aria-label', `Open image gallery for moment ${id}`);
  trigger.addEventListener('click', () => openGallery(card, trigger));
});

galleryModal?.addEventListener('click', e => {
  if (e.target.closest('.gallery-slide img')) return;
  closeGallery();
});

galleryTrack?.addEventListener('mouseenter', () => {
  marqueeState.isHovering = true;
});

galleryTrack?.addEventListener('mouseleave', () => {
  marqueeState.isHovering = false;
});

function beginGalleryDrag(clientX) {
  if (!galleryModal?.classList.contains('open')) return;
  marqueeState.isDragging = true;
  marqueeState.dragStartX = clientX;
  marqueeState.dragStartOffset = galleryState.offset;
  galleryTrack?.classList.add('is-dragging');
}

function moveGalleryDrag(clientX) {
  if (!marqueeState.isDragging) return;
  const deltaX = clientX - marqueeState.dragStartX;
  galleryState.offset = normalizeOffset(marqueeState.dragStartOffset - deltaX);
  syncGalleryPosition();
}

function endGalleryDrag() {
  if (!marqueeState.isDragging) return;
  marqueeState.isDragging = false;
  galleryTrack?.classList.remove('is-dragging');
}

galleryTrack?.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  e.preventDefault();
  beginGalleryDrag(e.clientX);
});

window.addEventListener('mousemove', e => {
  moveGalleryDrag(e.clientX);
});

window.addEventListener('mouseup', () => {
  endGalleryDrag();
});

galleryTrack?.addEventListener('touchstart', e => {
  if (!e.touches.length) return;
  e.preventDefault();
  beginGalleryDrag(e.touches[0].clientX);
}, { passive: false });

window.addEventListener('touchmove', e => {
  if (!e.touches.length) return;
  if (marqueeState.isDragging) e.preventDefault();
  moveGalleryDrag(e.touches[0].clientX);
}, { passive: false });

window.addEventListener('touchend', () => {
  endGalleryDrag();
});

window.addEventListener('touchcancel', () => {
  endGalleryDrag();
});

window.addEventListener('scroll', queueRender, { passive: true });
window.addEventListener('resize', () => {
  queueRender();
  if (galleryModal?.classList.contains('open')) {
    refreshGalleryMetrics();
    scrollGalleryToLoopIndex(galleryState.activeLoopIndex, 'auto');
  }
});

/* ─── KEYBOARD NAVIGATION ──────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (galleryModal?.classList.contains('open')) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      scrollGalleryToLoopIndex(galleryState.activeLoopIndex + 1);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollGalleryToLoopIndex(galleryState.activeLoopIndex - 1);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeGallery();
      return;
    }
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    scrollToMoment(activeIndex + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    scrollToMoment(activeIndex - 1);
  }
});

/* ─── INFO OVERLAY ─────────────────────────────────────────────────── */
const itog = document.getElementById('itog');
const infoPanel = document.getElementById('info');
const infoClose = document.getElementById('infoClose');
const ov = document.getElementById('ov');

function openInfo() {
  infoPanel?.classList.add('open');
  ov?.classList.add('on');
}

function closeInfo() {
  infoPanel?.classList.remove('open');
  ov?.classList.remove('on');
}

itog?.addEventListener('click', openInfo);
infoClose?.addEventListener('click', closeInfo);
ov?.addEventListener('click', closeInfo);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (galleryModal?.classList.contains('open')) {
    closeGallery();
    return;
  }
  closeInfo();
});

/* ─── URL ──────────────────────────────────────────────────────────── */
const url = new URL(window.location.href);
url.searchParams.set('view', 'tl');
history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);

/* ─── INITIAL RENDER ───────────────────────────────────────────────── */
queueRender();
