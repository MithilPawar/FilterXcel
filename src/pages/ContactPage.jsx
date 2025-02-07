import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useSelector, useDispatch } from "react-redux";
import { updateForm, resetForm, setStatus } from "../store/contactSlice";
import InteractiveMap from "./InteractiveMap";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { formData, status } = useSelector((state) => state.contactForm);
  const { theme } = useSelector((state) => state.theme); // Get current theme from Redux
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const validInputs = () => {
    let valid = true;
    const newError = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newError.name = "Name is required";
      valid = false;
    }
    if (
      !formData.email.trim() ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)
    ) {
      newError.email = "Valid email is required.";
      valid = false;
    }
    if (!formData.message.trim()) {
      newError.message = "Message is required";
      valid = false;
    }

    setErrors(newError);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validInputs()) return;

    setLoading(true);
    dispatch(setStatus("Sending..."));

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to_name: "FilterXcel Team",
        },
        import.meta.env.VITE_EMAILJS_USER_ID
      )
      .then((response) => {
        console.log("Email sent successfully", response);
        dispatch(setStatus("Message sent successfully!"));
        setLoading(false);

        setTimeout(() => {
          dispatch(resetForm());
        }, 2000);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        dispatch(setStatus("Failed to send message. Please try again later."));
        setLoading(false); // Stop animation
      });
  };

  return (
    <section
      className={`container mx-auto p-8 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div className="px-4">
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Contact Us
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2">
          <div className="mb-4">
            <label
              htmlFor="name"
              className={`block text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 mt-2 rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className={`block text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 mt-2 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className={`block text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 mt-2 rounded-md border ${
                errors.message ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              required
            ></textarea>
            {errors.message && (
              <p className="text-red-500 mt-1 text-sm">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={status === "Sending..."}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                <p>Sending...</p>
              </div>
            ) : (
              "Send"
            )}
          </button>

          {status && (
            <p
              className={`mt-4 text-center ${
                status.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}
        </form>

        {/* Contact Details Section */}
        <div className="w-full md:w-1/2">
          <h3
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Contact Information
          </h3>
          <p
            className={`mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Phone: {import.meta.env.VITE_CONTACT_PHONE || "+123 456 7890"}
          </p>
          <p
            className={`mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Email:{" "}
            {import.meta.env.VITE_CONTACT_EMAIL || "contact@yourwebsite.com"}
          </p>
          <p
            className={`mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Address:{" "}
            {import.meta.env.VITE_CONTACT_ADDRESS ||
              "123 Street, City, Country"}
          </p>

          <div className="mt-6">
            <InteractiveMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
