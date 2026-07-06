async function loadListings() {
  const container = document.getElementById('listings');
  try {
    const res = await fetch('/api/listings');
    const listings = await res.json();
    container.innerHTML = listings.map(l => `
      <div class="card">
        <img src="${l.img}" alt="${l.title}">
        <div class="card-body">
          <p class="card-title">${l.title}</p>
          <p class="card-loc">${l.location}</p>
          <div class="card-meta">
            <span class="price">₹${l.price}/night</span>
            <span class="rating">★ ${l.rating}</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="loading">Could not load listings.</p>';
  }
}

loadListings();
