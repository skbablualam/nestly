const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Simple health check for Kubernetes probes
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Sample listings data (swap for a real DB later)
app.get('/api/listings', (req, res) => {
  res.json([
    { id: 1, title: 'Lakeside Cabin', location: 'Coorg, Karnataka', price: 3200, rating: 4.9, img: 'https://picsum.photos/seed/cabin/480/320' },
    { id: 2, title: 'Rooftop Loft', location: 'Indiranagar, Bengaluru', price: 4500, rating: 4.7, img: 'https://picsum.photos/seed/loft/480/320' },
    { id: 3, title: 'Beach House', location: 'Gokarna, Karnataka', price: 5600, rating: 4.8, img: 'https://picsum.photos/seed/beach/480/320' },
    { id: 4, title: 'Hillside Cottage', location: 'Chikmagalur, Karnataka', price: 2800, rating: 4.6, img: 'https://picsum.photos/seed/hill/480/320' },
    { id: 5, title: 'Heritage Bungalow', location: 'Mysuru, Karnataka', price: 3900, rating: 4.9, img: 'https://picsum.photos/seed/bungalow/480/320' },
    { id: 6, title: 'City Studio', location: 'Koramangala, Bengaluru', price: 2200, rating: 4.5, img: 'https://picsum.photos/seed/studio/480/320' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Nestly server running on port ${PORT}`);
});
