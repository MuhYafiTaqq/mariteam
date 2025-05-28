// File: Terms.jsx
import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you agree to be bound by the terms and conditions set forth herein. If you do not agree with these terms, you should not use this website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Use of the Site</h2>
        <p>
          You agree to use the site for lawful purposes only. You must not use this site to distribute any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and images, is the property of the website owner and is protected by applicable copyright and trademark laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the site. Your continued use of the site signifies your acceptance of the updated terms.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Last updated: May 26, 2025</p>
    </div>
  );
};

export default TermsOfServicePage;