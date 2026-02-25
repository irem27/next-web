"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ContactData {
  id: string;
  badgeText: string;
  title: string;
  description: string | null;
  locationTitle: string;
  locationText: string;
  emailTitle: string;
  email1: string;
  email2: string | null;
  phoneTitle: string;
  phone1: string;
  phone2: string | null;
  formTitle: string;
  formDescription: string | null;
  contactImage: string | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  supportType: string;
  message: string;
}

export default function ContactPageContent() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    supportType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          supportType: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Bir hata oluştu. Lütfen tekrar deneyin.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f4f4f4] flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a214f]"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#f4f4f4]">
      {/* Contact Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12 md:mb-16">
            <div className="flex-1">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#1a214f] text-lg">❯❯❯❯❯</span>
                <span className="text-[#1a214f] font-medium text-sm tracking-wider uppercase">
                  {contactData?.badgeText || "Contact Us"}
                </span>
                <span className="text-[#1a214f] text-lg">❮❮❮❮❮</span>
              </div>
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a214f] leading-tight">
                {contactData?.title || "Talk To The Team Behind The Grains"}
              </h1>
            </div>
            {/* Description */}
            <div className="lg:max-w-md lg:text-right">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {contactData?.description ||
                  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed Lorem ipsum dolor sit amet, consectetuer adipiscing elit."}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Contact Info & Image */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a214f] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a214f] text-lg">
                        {contactData?.locationTitle || "Location"}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {contactData?.locationText ||
                          "Lorem ipsum dolor sit amet, consectetuer"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a214f] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a214f] text-lg">
                        {contactData?.emailTitle || "Email Us"}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        <a
                          href={`mailto:${contactData?.email1 || "info@mail.com"}`}
                          className="hover:text-[#1a214f] transition-colors"
                        >
                          {contactData?.email1 || "info@mail.com"}
                        </a>
                      </p>
                      {contactData?.email2 && (
                        <p className="text-gray-600 text-sm">
                          <a
                            href={`mailto:${contactData.email2}`}
                            className="hover:text-[#1a214f] transition-colors"
                          >
                            {contactData.email2}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a214f] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a214f] text-lg">
                        {contactData?.phoneTitle || "Phone"}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        <a
                          href={`tel:${contactData?.phone1?.replace(/[^0-9+]/g, "") || "0000000000"}`}
                          className="hover:text-[#1a214f] transition-colors"
                        >
                          {contactData?.phone1 || "(000)-000-0000"}
                        </a>
                      </p>
                      {contactData?.phone2 && (
                        <p className="text-gray-600 text-sm">
                          <a
                            href={`tel:${contactData.phone2.replace(/[^0-9+]/g, "")}`}
                            className="hover:text-[#1a214f] transition-colors"
                          >
                            {contactData.phone2}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white">
                <Image
                  src={contactData?.contactImage || "/images/contact-image.jpg"}
                  alt="Alamira Rice - İletişim"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-[#1a214f] rounded-2xl p-6 sm:p-8 lg:p-10">
              {/* Form Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">
                  {contactData?.formTitle || "Get In Touch With Rice Crops"}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {contactData?.formDescription ||
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed Lorem ipsum dolor sit amet, consectetuer adipiscing elit, consectetuer adipiscing elit."}
                </p>
              </div>

              {/* Submit Status Message */}
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-500/20 text-green-200 border border-green-500/30"
                      : "bg-red-500/20 text-red-200 border border-red-500/30"
                  }`}
                  role="alert"
                >
                  {submitStatus.message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      İsim
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                      className="w-full px-4 py-3.5 bg-[#2a3470] border border-[#3d4a8f] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f06721] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3.5 bg-[#2a3470] border border-[#3d4a8f] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f06721] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Phone & Support Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className="w-full px-4 py-3.5 bg-[#2a3470] border border-[#3d4a8f] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f06721] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="supportType" className="sr-only">
                      Destek Türü
                    </label>
                    <select
                      id="supportType"
                      name="supportType"
                      value={formData.supportType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-[#2a3470] border border-[#3d4a8f] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f06721] focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.75rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="" className="bg-[#1a214f]">
                        Your Need Support?
                      </option>
                      <option value="general" className="bg-[#1a214f]">
                        General Inquiry
                      </option>
                      <option value="products" className="bg-[#1a214f]">
                        Products
                      </option>
                      <option value="wholesale" className="bg-[#1a214f]">
                        Wholesale
                      </option>
                      <option value="partnership" className="bg-[#1a214f]">
                        Partnership
                      </option>
                      <option value="other" className="bg-[#1a214f]">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="sr-only">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Text"
                    required
                    rows={5}
                    className="w-full px-4 py-3.5 bg-[#2a3470] border border-[#3d4a8f] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f06721] focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#f06721] hover:bg-[#d95a1b] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>{submitting ? "Gönderiliyor..." : "Send A Message"}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
