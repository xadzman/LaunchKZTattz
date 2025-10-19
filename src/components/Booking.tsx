import { useState, FormEvent, useRef } from 'react';
import { Check } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Section from './Section';
import Button from './Button';
import { supabase } from '../lib/supabase';
import ImageUploader from './ImageUploader';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const recaptchaRef = useRef<ReCAPTCHA
  ref={recaptchaRef}
  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
  onChange={(token) => setRecaptchaToken(token || '')}
/>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!formData.placement.trim()) {
      newErrors.placement = 'Placement is required';
    }

    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'You must consent to be contacted';
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
      const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.from('bookings').insert([
        {
          booking_reference: bookingRef,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          tattoo_idea: formData.tattooIdea,
          placement: formData.placement,
          budget: formData.budget || null,
          preferred_date: formData.preferredDate || null,
          gdpr_consent: formData.gdprConsent,
          gdpr_consent_text: 'I agree to be contacted regarding my enquiry.',
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
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
            Thank you for your enquiry! We'll review your request and get back to
            you within 24-48 hours to discuss your tattoo and schedule a
            consultation.
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
            Ready to start your next piece? Let's make it unforgettable.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                required
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="tattooIdea" className="block text-sm font-medium mb-2">
                Tattoo Idea * (min 20 characters)
              </label>
              <textarea className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                id="tattooIdea"
                name="tattooIdea"
                value={formData.tattooIdea}
                onChange={handleChange}
                rows={4}
                className="textarea-field"
                required
              />
              {errors.tattooIdea && (
                <p className="text-red-400 text-sm mt-1">{errors.tattooIdea}</p>
              )}
            </div>

            <div>
              <label htmlFor="placement" className="block text-sm font-medium mb-2">
                Placement *
              </label>
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type="text"
                id="placement"
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Upper arm, Back, Chest"
                required
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
                className="input-field"
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
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex items-start gap-3">
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                type="checkbox"
                id="gdprConsent"
                name="gdprConsent"
                checked={formData.gdprConsent}
                onChange={handleChange}
                className="checkbox-field mt-1"
                required
              />
              <label htmlFor="gdprConsent" className="text-sm text-text-muted">
                I agree to be contacted regarding my enquiry. *
              </label>
            </div>
            {errors.gdprConsent && (
              <p className="text-red-400 text-sm">{errors.gdprConsent}</p>
            )}

            <div className="flex justify-center">
              <ReCAPTCHA onChange={(token)=> setRecaptchaToken(token || '')}
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
              className="w-full text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
            <div className="mt-4">
            <label className="block mb-2 font-semibold">Reference images (optional)</label>
            <ImageUploader onUploaded={setReferenceUrls} />
          </div>
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
