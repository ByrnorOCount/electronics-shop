import React from "react";
import Icon from "../../../components/ui/Icon";

const GoogleLoginButton = () => {
  // This URL points DIRECTLY to the backend (port 3001)
  const googleLoginUrl = "http://localhost:3001/api/auth/google";

  return (
    <a
      href={googleLoginUrl}
      className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <Icon name="google" className="w-5 h-5 mr-3" />
      Sign in with Google
    </a>
  );
};

export default GoogleLoginButton;
