'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [visits, setVisits] = useState('');
  const [shortSlug, setShortSlug] = useState('');

  const handleShorten = async () => {
    try {
      const response = await axios.post('/api/shorten', { longUrl });
      setShortUrl(response.data.shortUrl);
      setShortSlug(response.data.shortUrl.split('/').pop());
      setVisits(response.data.visits);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshVisits = async () => {
    try {
      const response = await axios.get(`/api/visitors/${shortSlug}`);
      setVisits(response.data.visits);
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
      {shortUrl && (
        <div style={{ textAlign: 'center' }}>
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <p>Long URL: {longUrl}</p>
          <p>Visitors: {visits}</p>
          <button onClick={refreshVisits} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Refresh Visitors Count</button>
        </div>
      )}
    </div>
  );
}
