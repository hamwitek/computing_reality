import React, { useState } from "react";

export default function ContactPage() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [country, setCountry] = useState("");
    const [gender, setGender] = useState("");
    const [termsOfAgreement, setTermsOfAgreement] = useState(false);
    const [cities, setCities] = useState([]);

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [citiesError, setCitiesError] = useState("");
    const [messageError, setMessageError] = useState("");
    const [termsOfAgreementError, setTermsOfAgreementError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isGenderValid = validateGender();
        const isCountryValid = validateCountry();
        const isCitiesValid = validateCities();
        const isMessageValid = validateMessage();
        const isTermsOfAgreementValid = validateTermsOfAgreement();

        if (
            isFirstNameValid &&
            isLastNameValid &&
            isEmailValid &&
            isGenderValid &&
            isCountryValid &&
            isCitiesValid &&
            isMessageValid &&
            isTermsOfAgreementValid
        ) {
            const contactData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                gender: gender,
                country: country,
                multi_country: cities,
                description: message,
                terms_of_agreement: termsOfAgreement,
            };

            try {
                const response = await fetch(`${apiUrl}/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(contactData),
                });

                const data = await response.json();
                console.log("Success:", data);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email, should be in format example@email.com");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    }

    function validateFirstName() {
        if (!firstName.trim()) {
            setFirstNameError("No first name provided");
            return false;
        } else if (firstName.length > 100) {
            setFirstNameError("No first name provided");
        } else {
            setFirstNameError("");
            return true;
        }
    }

    function validateLastName() {
        if (!lastName.trim()) {
            setLastNameError("No last name provided");
            return false;
        } else {
            setLastNameError("");
            return true;
        }
    }

    function validateGender() {
        if (!gender) {
            setGenderError("No gender selected");
            return false;
        } else {
            setGenderError("");
            return true;
        }
    }

    function validateCountry() {
        if (!country) {
            setCountryError("No country selected");
            return false;
        } else {
            setCountryError("");
            return true;
        }
    }

    function validateCities() {
        if (cities.length === 0) {
            setCitiesError("No cities selected");
            return false;
        } else {
            setCitiesError("");
            return true;
        }
    }

    function validateMessage() {
        if (!message.trim()) {
            setMessageError("No message provided");
            return false;
        } else {
            setMessageError("");
            return true;
        }
    }

    function validateTermsOfAgreement() {
        if (!termsOfAgreement) {
            setTermsOfAgreementError("You must agree to the terms");
            return false;
        } else {
            setTermsOfAgreementError("");
            return true;
        }
    }

    function handleCities(e) {
        setCities([...e.target.selectedOptions].map((city) => city.value));
    }

    return (
        <>
            <div className="container min-h-screen py-10 mx-auto">
                <div className="py-10">
                    <h1 className="text-5xl font-bold leading-none text-center ">
                        Contact us
                    </h1>
                    <p className="text-center text-[16px] text-gray-400">
                        Send us a message anytime. We'll get right back to you in 12h.
                    </p>
                </div>
                <div className="max-w-md mx-auto p-4">
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between gap-4 ">
                            <label htmlFor="firstName">
                                <div className="text-xs mb-1 text-gray-400">First name</div>
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onBlur={validateFirstName}
                                />
                                {firstNameError && (
                                    <p className="italic text-red-500">{firstNameError}</p>
                                )}
                            </label>
                            <label htmlFor="lastName">
                                <div className="text-xs mb-1 text-gray-400">Last name</div>
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onBlur={validateLastName}
                                />
                                {lastNameError && (
                                    <p className="italic text-red-500">{lastNameError}</p>
                                )}
                            </label>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="email">
                                <div className="text-xs mb-1 text-gray-400">Email</div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email: e.g example@gmail.com"
                                    className="w-full outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={validateEmail}
                                />
                            </label>
                            {emailError && (
                                <p className="italic text-red-500">{emailError}</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="message">
                                <p>
                                    Word counter:{" "}
                                    {message.length < 2000 ? (
                                        <span>{message.length}</span>
                                    ) : (
                                        <span className="text-red-500">{message.length}</span>
                                    )}
                                    / 2000
                                </p>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="6"
                                    placeholder="Enter your message, max 2000"
                                    className="w-full outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    onBlur={validateMessage}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </label>
                            {messageError && (
                                <p className="italic text-red-500">{messageError}</p>
                            )}
                            <div className="mt-4">
                                <label htmlFor="country">
                                    <div className="text-gray-400 text-xs">Country</div>
                                    <select
                                        name="country"
                                        id="country"
                                        autoComplete="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    >
                                        <option value="">Select a country</option>
                                        <option value="sweden">Sweden</option>
                                        <option value="finland">Finland</option>
                                        <option value="norway">Norway</option>
                                    </select>
                                </label>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="cities">
                                    <div className="text-gray-400 text-xs">cities</div>
                                    <select
                                        name="cities"
                                        id="cities"
                                        multiple
                                        autoComplete="cities"
                                        onChange={handleCities}
                                        className="w-full outline-1 outline-gray-300 rounded-md px-2.5 py-1 focus:outline-indigo-500"
                                    >
                                        <option value="">Select a city</option>
                                        <option value="stockholm">Stockholm</option>
                                        <option value="helsinki">Helsinki</option>
                                        <option value="oslo">Oslo</option>
                                    </select>
                                </label>
                            </div>
                            <div className="flex gap-4">
                                <label htmlFor="gender">
                                    Male
                                    <input
                                        type="radio"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender("male")}
                                    ></input>
                                </label>
                                <label htmlFor="gender">
                                    Female
                                    <input
                                        type="radio"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender("female")}
                                    ></input>
                                </label>
                            </div>
                            <label htmlFor="checkbox">
                                Terms of agreement
                                <input
                                    className="mt-4 ml-2"
                                    type="checkbox"
                                    name="checkbox"
                                    value={termsOfAgreement}
                                    checked={termsOfAgreement === true}
                                    onChange={(e) => setTermsOfAgreement(e.target.checked)}
                                ></input>
                            </label>

                            <button
                                type="submit"
                                className="px-3 py-1 cursor-pointer w-full hover:bg-indigo-400 bg-indigo-500 rounded-lg focus:outline-3 text-white"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
