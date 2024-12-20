import React from 'react';
import './homePage.css';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to URL Shortener with Analytics</h1>
      <p>
        This website allows you to shorten long URLs, generate QR codes for them, and track the number of visitors. 
        You can also set an expiration date for your shortened URLs.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Shorten long URLs</li>
        <li>Generate QR codes for shortened URLs</li>
        <li>Track the number of visitors</li>
        <li>Set expiration dates for URLs</li>
      </ul>
      <h2>Tech Stack</h2>
      <ul>
        <li>React</li>
        <li>Next.js</li>
        <li>Redux Toolkit</li>
        <li>Prisma</li>
        <li>TypeScript</li>
      </ul>
    </div>
  );
}
