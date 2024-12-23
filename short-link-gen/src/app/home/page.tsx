'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addUrl, updateVisits, removeUrl  } from '../../store/urlsSlice';
import axios from 'axios';
import { Url } from '../../types/types';

export default function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const urls = useSelector((state: RootState) => state.urls.urls);
  const [expiration, setExpiration] = useState('300');
  const [qrCode, setqrCode] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('urls') || '[]');
    storedUrls.forEach((url: Url) => dispatch(addUrl(url)));
  }, [dispatch]);

  const handleShorten = async () => {
    try {
      const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?$/;
      if (regex.test(longUrl) === false) {
        alert('Please enter a valid URL');
        return;
      }
      const response = await axios.post('/api/shorten', { longUrl, time: expiration, qrCode });
      const expirationDate = new Date(Date.now() + parseInt(expiration) * 60000).toISOString();
      const newUrl = {
        longUrl,
        shortUrl: response.data.shortUrl,
        visits: response.data.visits,
        expiration: expirationDate,
        qrCode: response.data.qrCode,
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

  const deleteLink = async (shortUrl: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortUrl }),
      });
  
      if (response.ok) {
        dispatch(removeUrl(shortUrl));
        const storedUrls = JSON.parse(localStorage.getItem('urls') || '[]');
        const updatedUrls = storedUrls.filter((url: Url) => url.shortUrl !== shortUrl);
        localStorage.setItem('urls', JSON.stringify(updatedUrls));
      } else {
        const errorMessage = await response.text();
        console.error(`Failed to delete: ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Error deleting: ${error}`);
    }
  };

  const handleQrCodeCheckBox = () => {
    setqrCode(!qrCode);
  }

  return (
    <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <input
        type="text"
        placeholder="Enter URL"
        value={longUrl}
        name='url'
        onChange={(e) => setLongUrl(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <select
        name="expiration"
        onChange={(e) => setExpiration(e.target.value)}
      >
        {[
          { value: 5, label: '5 minutes' },
          { value: 10, label: '10 minutes' },
          { value: 30, label: '30 minutes' },
          { value: 60, label: '1 hour' },
          { value: 120, label: '2 hours' },
          { value: 300, label: '5 hours' },
          { value: 720, label: '12 hours' },
          { value: 1440, label: '1 day' },
          { value: 2880, label: '2 days' },
          { value: 10080, label: '7 days' },
        ].map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label style={{marginTop: '8px', marginBottom: '8px'}}>
        <input type="checkbox" onClick={handleQrCodeCheckBox}/>
        Generate QR code
      </label>
      <button 
        onClick={handleShorten} 
        style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}
        className='shorten'
        id='shorten'
        >Shorten URL
      </button>
      <div>
        <hr></hr>
        {urls.map((url, index) => (
          <div key={index} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p>Short URL: <a href={url.shortUrl} id='shortUrl' target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></p>
            <p>Long URL: {url.longUrl}</p>
            <span>Visitors: <p id='visitorCount'>{url.visits}</p></span>
            <p>Expiration Date: {url.expiration.toString()}</p>
            {url.qrCode && (
              <div>
                <p>QR Code:</p>
                <img src={url.qrCode} alt="QR Code" style={{ maxWidth: '150px', maxHeight: '150px' }} />
              </div>
            )}
            <button
              onClick={() => refreshVisits(url.shortUrl.split('/').pop()!, url.shortUrl)}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
              id='updateVisitsCount'
              className='updateVisitsCount'
            >Refresh Visitors Count</button>
            <button 
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', marginLeft: '0.5rem' }}
              onClick={() => deleteLink(url.shortUrl)}
            >Delete</button>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}
