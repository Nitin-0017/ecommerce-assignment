import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Your query has been submitted. We will get back to you soon!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        { }
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">SwiftKart</h2>
          <p className="text-slate-400 leading-relaxed">
            Your one-stop destination for quality products at affordable prices. Shop with ease, shop with confidence.
          </p>
          <div className="space-y-4">
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-sky-400" />
              <span>123 Commerce St, Shopping District</span>
            </p>
            <p className="flex items-center gap-3">
              <FaPhone className="text-sky-400" />
              <span>(123) 456-7890</span>
            </p>
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-sky-400" />
              <span>support@swiftkart.com</span>
            </p>
          </div>
        </div>

        { }
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <ul className="space-y-4">
            <li><a href="/home" className="hover:text-sky-400 transition-colors">Home</a></li>
            <li><a href="/products" className="hover:text-sky-400 transition-colors">Products</a></li>
            <li><a href="/profile" className="hover:text-sky-400 transition-colors">My Account</a></li>
            <li><a href="/wishlist" className="hover:text-sky-400 transition-colors">Wishlist</a></li>
          </ul>
        </div>

        { }
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Customer Support</h3>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-sky-400 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        { }
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Submit a Query</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border-none rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 border-none rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <textarea
              name="message"
              placeholder="How can we help?"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-slate-800 border-none rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 transition-all resize-none"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
            >
              <FaPaperPlane size={14} />
              Send Message
            </motion.button>
          </form>
        </div>
      </div>

      <div className="container-custom mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>&copy; 2026 SwiftKart. Crafted for elegance.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;