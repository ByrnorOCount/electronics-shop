import React from "react";
import Icon from "../../../components/ui/Icon";

const FacebookLoginButton = () => {
  const facebookLoginUrl = "http://localhost:3001/api/auth/facebook";

  return (
    <a
      href={facebookLoginUrl}
      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 mt-2"
    >
      <Icon
        name="facebook"
        className="w-5 h-5 mr-3"
        fill="currentColor"
        strokeWidth={0}
      />
      Sign in with Facebook
    </a>
  );
};

export default FacebookLoginButton;
