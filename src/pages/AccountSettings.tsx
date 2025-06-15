
import React from "react";
import { Link } from "react-router-dom";

const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-ura-black flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-ura-green">Account Settings</h1>
      <p className="text-lg text-ura-white mb-8">
        Manage your account details and preferences here.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded bg-ura-green text-ura-black font-semibold text-lg hover:bg-ura-green/80 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default AccountSettings;
