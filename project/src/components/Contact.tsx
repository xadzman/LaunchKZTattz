import { useState, FormEvent, useRef } from 'react';
import { MapPin, Mail, Phone, Check } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Section from './Section';
import Button from './Button';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setErrors({ recaptcha: 'Please complete the reCAPTCHA' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      recaptchaRef.current?.reset();

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ submit: 'Failed to submit message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Section id="contact">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="mb-4">Get in Touch</h2>
          <p className="text-lg text-text-muted mb-8">
            Drop us a line or stop by the studio. Let's talk ink.
          </p>

          {isSuccess ? (
            <div className="bg-accent/20 border border-accent rounded-brand p-6 mb-8">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Check size={24} />
                <h3 className="text-lg font-semibold">Message Sent!</h3>
              </div>
              <p className="text-text-muted">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message * (min 10 characters)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="textarea-field"
                  required
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  theme="dark"
                />
              </div>
              {errors.recaptcha && (
                <p className="text-red-400 text-sm text-center">{errors.recaptcha}</p>
              )}
              {errors.submit && (
                <p className="text-red-400 text-sm text-center">{errors.submit}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-brand flex items-center justify-center">
                <MapPin size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Studio Address</h3>
                <p className="text-text-muted leading-relaxed">
                  Beyond Ink Studio<br />
                  149 Cutler Heights Lane<br />
                  BD4 9JB, West Yorkshire
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-brand flex items-center justify-center">
                <Mail size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <a
                  href="mailto:kztattz@gmail.com"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  kztattz@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-brand flex items-center justify-center">
                <Phone size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Phone</h3>
                <a
                  href="tel:+447541511489"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  +44 (0)7541 511 489
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-brand overflow-hidden h-[400px] lg:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2357.234567890123!2d-1.7345678901234567!3d53.78901234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDQ3JzIwLjQiTiAxwrA0NCcwNC40Ilc!5e0!3m2!1sen!2suk!4v1234567890123!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
          />
        </div>
      </div>
    </Section>
  );
}
