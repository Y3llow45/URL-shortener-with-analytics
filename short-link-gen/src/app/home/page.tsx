'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const [shortened, setShortened] = useState(null);
  const handleShorten = async () => {
    try {
      const response = await axios.post('/api/shorten', { longUrl });
      setShortened(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <input
        type="text"
        placeholder="Enter URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleShorten} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>Shorten URL</button>
      {shortened && (
        <div style={{ textAlign: 'center' }}>
          <p>Short URL: shortened.shortUrl</p>
          <p>Long URL: shortened.longUrl</p>
          <p>Visitors: shortened.visits</p>
        </div>
      )}
    </div>
  );
}
