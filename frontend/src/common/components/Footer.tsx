import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <ul>
        <li>
          <Link href="/learn-more">Learn More about RePan</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy</Link>
        </li>
        <li>
          <Link href="/terms-of-service">Terms of Service</Link>
        </li>
        <li>
          <Link href="/business-agreement">Business Agreement</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
