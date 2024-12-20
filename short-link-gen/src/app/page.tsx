import React from 'react';
import './homePage.css';

export default function Home() {
  return (
    <div className="container">
      <h1 className="welcome-text">Welcome to URL Shortener with Analytics</h1>
      <p className="description">
        This website allows you to shorten long URLs, generate QR codes for them, and track the number of visitors. 
        You can also set an expiration date for your shortened URLs.
      </p>
      <h2>Features</h2>
      <ul className="features-list">
        <li>Shorten long URLs</li>
        <li>Generate QR codes for shortened URLs</li>
        <li>Track the number of visitors</li>
        <li>Set expiration dates for URLs</li>
      </ul>
      <h2>Tech Stack</h2>
      <div className="tech-stack-div">
        <ul className="tech-stack">
          <li><img className='techimg' src="next.svg" alt="Next.js" /> Next.js</li>
          <li><img className='techimg' src="redux.svg" alt="Redux Toolkit" /> Redux Toolkit</li>
          <li><img className='techimg' src="prisma.svg" alt="Prisma" /> Prisma</li>
          <li><img className='techimg' src="typescript.svg" alt="TypeScript" /> TypeScript</li>
        </ul>
      </div>
    </div>
  );
}
