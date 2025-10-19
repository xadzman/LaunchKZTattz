// src/components/Booking.tsx
import { useRef, useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Check } from 'lucide-react';

import Section from './Section';
import Button from './Button';
import ImageUploader from './ImageUploader';

import { supabase } from '../lib/supabase';
import { addBookingRequest } from '../lib/db';
import { verifyRecaptcha } from '../lib/recaptcha';

export default function Booking() {
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tattooIdea: '',
    placement: '',
    budget: '',
    preferredDate: '',
    gdprConsent: false,
  });
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.tattooIdea.trim()) {
      newErrors.tattooIdea = 'Please describe your tattoo idea';
    } else if (formData.tattooIdea.trim().length < 20) {
      newErrors.tattooIdea = 'Please provide at least 20 characters';
    }

    if (!formData.placement.trim()) newErrors.placement = 'Placement is required';

    if (!formData.gdprConsent) newErrors.gdprConsent = 'You must consent to be contacted';

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!recaptchaToken) {
      setErrors({ recaptcha: 'Please complete the reCAPTCHA' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1) Verify reCAPTCHA server-side (Edge Function)
      const vr = await verifyRecaptcha(recaptchaToken);
      if (!vr?.success || (vr.score ?? 0) < 0.5) {
        throw new Error('reCAPTCHA failed, please retry');
      }

      // 2) Insert booking via helper into `booking_requests`
      const inserted = await addBookingRequest({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        tattoo_idea: formData.tattooIdea,
        placement: formData.placement,
        budget: formData.budget || undefined,
        preferred_date: formData.preferredDate || undefined,
        reference_image_urls: referenceUrls,
        consent_marketing: formData.gdprConsent,
      });

      // 3) Fire-and-forget email notification
      supabase.functions
        .invoke('send-booking-email', { body: { booking: inserted } })
        .catch(() => {});

      setIsSuccess(true);
      recaptchaRef.current?.reset();
      setRecaptchaToken('');
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: error?.message || 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Section id="booking" className="bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6">
            <Check size={48} className="text-accent" />
          </div>
          <h2 className="mb-4">Booking Request Received</h2>
          <p className="text-lg text-text-muted mb-8">
            Thank you for your enquiry! We&apos;ll review your request and get back to
            you within 24–48 hours to discuss your tattoo and schedule a consultation.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                tattooIdea: '',
                placement: '',
                budget: '',
                preferredDate: '',
                gdprConsent: false,
              });
              setReferenceUrls([]);
            }}
          >
            Submit Another Booking
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section id="booking" className="bg-surface">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="mb-4">Book Your Session</h2>
          <p className="text-lg text-text-muted mb-8">
            Ready to start your next piece? Let&apos;s make it unforgettable.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
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
                required
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="tattooIdea" className="block text-sm font-medium mb-2">
                Tattoo Idea * (min 20 characters)
              </label>
              <textarea
                id="tattooIdea"
                name="tattooIdea"
                value={formData.tattooIdea}
                onChange={handleChange}
                rows={4}
                required
                className="textarea-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {errors.tattooIdea && (
                <p className="text-red-400 text-sm mt-1">{errors.tattooIdea}</p>
              )}
            </div>

            <div>
              <label htmlFor="placement" className="block text-sm font-medium mb-2">
                Placement *
              </label>
              <input
                type="text"
                id="placement"
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                placeholder="e.g., Upper arm, Back, Chest"
                required
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {errors.placement && (
                <p className="text-red-400 text-sm mt-1">{errors.placement}</p>
              )}
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium mb-2">
                Budget
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select a budget range</option>
                <option value="50-150">£50 - £150</option>
                <option value="150-300">£150 - £300</option>
                <option value="300-500">£300 - £500</option>
                <option value="500+">£500+</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="input-field w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdprConsent"
                name="gdprConsent"
                checked={formData.gdprConsent}
                onChange={handleChange}
                required
                className="checkbox-field mt-1 w-4 h-4 rounded border-white/20 bg-white/5"
              />
              <label htmlFor="gdprConsent" className="text-sm text-text-muted">
                I agree to be contacted regarding my enquiry. *
              </label>
            </div>
            {errors.gdprConsent && (
              <p className="text-red-400 text-sm">{errors.gdprConsent}</p>
            )}

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token || '')}
                theme="dark"
              />
            </div>
            {errors.recaptcha && (
              <p className="text-red-400 text-sm text-center">{errors.recaptcha}</p>
            )}
            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            <div className="mt-4">
              <label className="block mb-2 font-semibold">Reference images (optional)</label>
              <ImageUploader onUploaded={setReferenceUrls} />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </form>
        </div>

        <div className="hidden lg:block">
          <img
            src="https://images.pexels.com/photos/4124116/pexels-photo-4124116.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Tattoo studio environment"
            className="w-full h-full object-cover rounded-brand shadow-2xl"
          />
        </div>
      </div>
    </Section>
  );
}
