import { useState } from "react";

export default function RegisterForm() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState([]);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState([]);

    const [terms, setTerms] = useState(false);
    const [termsError, setTermsError] = useState("");

    const [serverError, setServerError] = useState("");

    function validateEmail() {
        let emailErrors = [];
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!Boolean(regex.test(email))) {
            emailErrors.push("It must be a correct email");
        }
        if (!email) {
            emailErrors.push("Email is required");
        }
        setEmailError(emailErrors);
    }

    function validatePassword() {
        let passwordErrors = [];
        const regex = /[^a-zA-Z0-9]/;
        if (password.length <= 8) {
            passwordErrors.push("Password length must be greater than 8");
        }
        if (!Boolean(regex.test(password))) {
            passwordErrors.push("Your password must contain a unique character");
        }
        if (!password) {
            passwordErrors.push("Password is required");
        }
        setPasswordError(passwordErrors);
    }

    function validateTerms() {
        if (!terms) {
            setTermsError("You must accept our terms, OR ELSE!");
        } else {
            setTermsError("");
        }
    }

    async function submitRegister(e) {
        e.preventDefault();
        validateEmail();
        validatePassword();
        validateTerms();

        if (passwordError.length === 0 && !termsError && emailError.length === 0) {
            try {
                const response = await fetch(`${apiUrl}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        terms,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Error from the server");
                }
                console.log("Success");
                setServerError(""); // Clear any previous server error
            } catch (error) {
                console.log(error);
                setServerError("Something went wrong. Please try again.");
            }
        } else {
            console.log(passwordError);
            console.log(emailError);
            console.log(termsError);
            console.log("Error in form");
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-10 text-5xl font-bold tracking-tight text-center text-gray-900">
                        Register an account
                    </h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={submitRegister} className="space-y-6" noValidate>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                * Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={validateEmail}
                                />
                                {emailError.map((error) => (
                                    <p key={error} className="text-red-500">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    * Password
                                </label>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={validatePassword}
                                />
                                {passwordError.map((error) => (
                                    <p key={error} className="text-red-500">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="items-center justify-between mr-4">
                                <label
                                    htmlFor="terms"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Terms of agreement
                                </label>
                            </div>
                            <div>
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={terms}
                                    onChange={(e) => setTerms(e.target.checked)}
                                />
                            </div>
                        </div>
                        {termsError && <p className="italic text-red-500">{termsError}</p>}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                        {serverError && (
                            <p className="mt-4 text-center text-red-500">{serverError}</p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
