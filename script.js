const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : '';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsEl = document.getElementById('results');
const analysisSection = document.getElementById('analysis');
const reviewsList = document.getElementById('reviews-list');
let chart;

async function searchProducts(q){
  resultsEl.innerHTML = '<div class="card">Searching…</div>';
  try{
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
    if(!res.ok){
      let msg = 'Search failed.';
      try { const err = await res.json(); if(err && err.error) msg = `Search failed: ${err.error}`; }
      catch{ /* ignore */ }
      resultsEl.innerHTML = `<div class="card">${escapeHtml(msg)}</div>`;
      return;
    }
    const data = await res.json();
    renderResults(data);
  }catch(e){
    resultsEl.innerHTML = `<div class="card">Search failed: ${escapeHtml(String(e))}</div>`;
  }
}

function renderResults(items){
  resultsEl.innerHTML = '';
  if(!items || !items.length){ resultsEl.innerHTML = '<div class="card">No results</div>'; return; }
  for(const item of items){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image || ''}" alt="${item.title || ''}" />
      <div class="title">${item.title || ''}</div>
      <div class="meta">
        <span class="price">${item.price || ''}</span>
        <span>⭐ ${item.rating ?? '—'}</span>
      </div>
      <div class="actions">
        <a class="btn" href="${item.url}" target="_blank" rel="noopener">Open</a>
        <button class="btn primary" data-asin="${item.asin}">Analyze Reviews</button>
      </div>
    `;
    card.querySelector('button[data-asin]').addEventListener('click', () => analyze(item.asin, item.title));
    resultsEl.appendChild(card);
  }
}

async function analyze(asin, title){
  analysisSection.classList.remove('hidden');
  reviewsList.innerHTML = '<li class="review">Loading reviews…</li>';
  if(chart){ chart.destroy(); chart = null; }
  const res = await fetch(`${API_BASE}/api/reviews/${encodeURIComponent(asin)}`);
  if(!res.ok){ reviewsList.innerHTML = '<li class="review">Failed to load reviews.</li>'; return; }
  const data = await res.json();
  renderChart(data.counts, title);
  renderReviews(data.reviews);
}

function renderChart(counts, title){
  const ctx = document.getElementById('sentimentChart');
  const values = [counts.Positive||0, counts.Neutral||0, counts.Negative||0];
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{ data: values, backgroundColor: ['#34d399','#a6b0cf','#f87171'] }]
    },
    options: {
      plugins: { legend: { labels: { color: '#e2e8f0' } }, title: { display: true, text: `Sentiment for: ${title}`, color: '#e2e8f0' } }
    }
  });
}

function renderReviews(reviews){
  reviewsList.innerHTML = '';
  for(const r of reviews){
    const li = document.createElement('li');
    li.className = 'review';
    li.innerHTML = `
      <div class="head">${r.date || ''} · ⭐ ${r.rating ?? '—'} · ${r.sentiment}</div>
      <div class="body">${escapeHtml((r.title? r.title + '. ' : '') + (r.body||''))}</div>
    `;
    reviewsList.appendChild(li);
  }
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if(!q) return;
  searchProducts(q);
});


