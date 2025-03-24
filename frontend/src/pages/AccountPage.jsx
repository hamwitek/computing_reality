import React from "react";
import Account from "../components/account";

function LoginPage() {
  return (
    <div className="min-w-xl">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            account
          </h2>
          <Account></Account>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
