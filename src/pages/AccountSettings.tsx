
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AccountSettings = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-ura-black flex flex-col items-center justify-start pt-24 px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-ura-green">Account Settings</h1>
      <p className="text-lg text-ura-white mb-8">
        {user
          ? <>Your email: <span className="font-mono text-ura-green">{user.emailAddresses[0]?.emailAddress}</span></>
          : <>Please log in to view or modify your account settings.</>}
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
