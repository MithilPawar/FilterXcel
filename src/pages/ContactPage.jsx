import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useSelector, useDispatch } from "react-redux";
import { updateForm, resetForm, setStatus } from "../store/contactSlice";
import InteractiveMap from "./InteractiveMap";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { formData, status } = useSelector((state) => state.contactForm);
  const { theme } = useSelector((state) => state.theme);
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const validInputs = () => {
    let valid = true;
    const newError = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newError.name = "Name is required";
      valid = false;
    }
    if (!formData.email.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
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
      .then(() => {
        dispatch(setStatus("Message sent successfully!"));
        setLoading(false);
        setTimeout(() => {
          dispatch(resetForm());
        }, 2000);
      })
      .catch(() => {
        dispatch(setStatus("Failed to send message. Please try again later."));
        setLoading(false);
      });
  };

  return (
    <section className={`container mx-auto px-6 py-10 ${theme === "dark" ? "bg-[#121212] text-gray-300" : "bg-white text-gray-800"}`}>
      <motion.h2 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Get in Touch with Us
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="w-full p-6 rounded-xl shadow-lg border border-gray-600 bg-opacity-10 backdrop-blur-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Name Input */}
          <div className="relative mb-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`peer w-full p-3 rounded-md border bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? "border-red-500" : "border-gray-500"}`} required />
            <label className="absolute left-3 top-3 text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 transition-all">Name</label>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="relative mb-4">
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`peer w-full p-3 rounded-md border bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? "border-red-500" : "border-gray-500"}`} required />
            <label className="absolute left-3 top-3 text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 transition-all">Email</label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Message Input */}
          <div className="relative mb-4">
            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className={`peer w-full p-3 rounded-md border bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.message ? "border-red-500" : "border-gray-500"}`} required></textarea>
            <label className="absolute left-3 top-3 text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 transition-all">Message</label>
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:scale-105 transition duration-300 flex items-center justify-center" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin" /> : "Send"}
          </button>

          {/* Status Message */}
          {status && <p className={`mt-4 text-center ${status.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{status}</p>}
        </motion.form>

        {/* Contact Information */}
        <motion.div 
          className="w-full p-6 rounded-xl shadow-lg border border-gray-600 bg-opacity-10 backdrop-blur-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <p className="flex items-center gap-2 mb-2"><FaPhoneAlt /> <a href="tel:1234567890" className="hover:underline">123 456 7890</a></p>
          <p className="flex items-center gap-2 mb-2"><FaEnvelope /> <a href="mailto:contact@yourwebsite.com" className="hover:underline">contact@yourwebsite.com</a></p>
          <p className="flex items-center gap-2 mb-2"><FaMapMarkerAlt /> 123 Street, City, Country</p>

          <div className="mt-6 opacity-0 animate-fadeIn">
            <InteractiveMap />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
