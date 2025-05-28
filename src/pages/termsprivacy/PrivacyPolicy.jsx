import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, and any other data you voluntarily provide when you use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
        <p>
          Your information is used to provide, improve, and personalize our services. We may also use it to communicate with you, respond to inquiries, and send updates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
        <p>
          We do not sell or rent your personal information to third parties. We may share data only when required by law or with your explicit consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
        <p>
          We may use cookies and similar technologies to enhance your experience. You can choose to disable cookies through your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time. Please contact us for assistance with any privacy-related concerns.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Last updated: May 26, 2025</p>
    </div>
  );
};

export default PrivacyPolicyPage;
