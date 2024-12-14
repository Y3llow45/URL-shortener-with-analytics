'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addUrl, updateVisits } from '../../store/urlsSlice';
import axios from 'axios';
import { Url } from '../../types/types';

export default function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const urls = useSelector((state: RootState) => state.urls.urls);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('urls') || '[]');
    storedUrls.forEach((url: Url) => dispatch(addUrl(url)));
  }, [dispatch]);

  const handleShorten = async () => {
    try {
      const response = await axios.post('/api/shorten', { longUrl });
      const newUrl = {
        longUrl,
        shortUrl: response.data.shortUrl,
        visits: response.data.visits,
      };
      dispatch(addUrl(newUrl));
      setLongUrl('');
    } catch (error) {
      console.error(error);
    }
  };

  const refreshVisits = async (shortSlug: string, shortUrl: string) => {
    try {
      const response = await axios.get(`/api/visitors/${shortSlug}`);
      dispatch(updateVisits({ shortUrl, visits: response.data.visits }));
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
        name='url'
        onChange={(e) => setLongUrl(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <button 
        onClick={handleShorten} 
        style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}
        id='shorten'
        >Shorten URL
      </button>
      <div>
        {urls.map((url, index) => (
          <div key={index} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p>Short URL: <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></p>
            <p>Long URL: {url.longUrl}</p>
            <p>Visitors: {url.visits}</p>
            <button
              onClick={() => refreshVisits(url.shortUrl.split('/').pop()!, url.shortUrl)}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
            >
              Refresh Visitors Count
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
