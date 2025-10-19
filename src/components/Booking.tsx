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

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState('');

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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      const vr = await verifyRecaptcha(recaptchaToken);
      if (!vr?.success || (vr.score ?? 0) < 0.5) {
        throw new Error('reCAPTCHA failed, please retry');
      }

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
            you within 24–48 hours.
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
            Ready to start your next piece?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-field w-full p-3 rounded-lg bg-white/5 border border-white/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field w-full p-3 rounded-lg bg-white/5 border border-white/10"
              />
            </div>

            {/* Tattoo Idea */}
            <div>
              <label className="block text-sm font-medium mb-2">Tattoo Idea *</label>
              <textarea
                name="tattooIdea"
                value={formData.tattooIdea}
                onChange={handleChange}
                required
                rows={4}
                className="textarea-field w-full p-3 rounded-lg bg-white/5 border border-white/10"
              />
            </div>

            {/* Placement */}
            <div>
              <label className="block text-sm font-medium mb-2">Placement *</label>
              <input
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                required
                className="input-field w-full p-3 rounded-lg bg-white/5 border border-white/10"
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="gdprConsent"
                checked={formData.gdprConsent}
                onChange={handleChange}
                required
                className="checkbox-field mt-1 w-4 h-4"
              />
              <label className="text-sm text-text-muted">
                I agree to be contacted regarding my enquiry. *
              </label>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(t) => setRecaptchaToken(t || '')}
              />
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
}
