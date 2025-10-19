import { useState, FormEvent, useRef } from 'react';
import { Mail, Check } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Section from './Section';
import Button from './Button';
import { supabase } from '../lib/supabase';
import { addSubscriber } from '../lib/db';

export default function MailingList() {
  const [email, setEmail] = useState('');
  const [seasonalPromo, setSeasonalPromo] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setError('Please consent to receive email updates');
      return;
    }

    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from('mailing_list').insert([
        {
          email,
          gdpr_consent: consent,
          gdpr_consent_text: 'Email me updates about promotions, flash days and events.',
        },
      ]);

      if (dbError) throw dbError;

      setIsSuccess(true);
      recaptchaRef.current?.reset();

      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setConsent(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing to mailing list:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="subscribe" className="bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="bg-onyx border border-divider rounded-brand p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
            <Mail size={32} className="text-accent" />
          </div>

          <h2 className="mb-4">Stay in the Loop</h2>
          <p className="text-lg text-text-muted mb-8">
            Exclusive offers, flash drops & events — be the first to know.
          </p>

          {isSuccess ? (
            <div className="flex items-center justify-center gap-3 text-accent py-4">
              <Check size={24} />
              <span className="text-lg font-medium">
                Welcome to the KZ Tattz community!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email address"
                  className="input-field text-center w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div className="flex items-start gap-3 justify-center">
                <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  type="checkbox"
                  id="emailConsent"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setError('');
                  }}
             className="checkbox-field mt-1 w-4 h-4 rounded border-white/20 bg-white/5"
                  required
                />
                <label htmlFor="emailConsent" className="text-sm text-text-muted text-left max-w-md">
                  Email me updates about promotions, flash days and events.
                </label>
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  theme="dark"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
              <div className="mt-3">
              <label className="block mb-1 text-sm">Promo tag (optional)</label>
              <input className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400" className="w-full p-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={seasonalPromo} onChange={e=>setSeasonalPromo(e.target.value)} placeholder="e.g. spooky-2025" />
            </div>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
