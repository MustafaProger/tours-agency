import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, Calendar, User, Mail, Phone, Users, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, type Guide, type Tour } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuideId?: number;
}

export function BookingModal({ isOpen, onClose, selectedGuideId }: BookingModalProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    guide_id: selectedGuideId || '',
    tour_id: '',
    preferred_start_date: '',
    preferred_end_date: '',
    participants_count: 1,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadGuidesAndTours();
      if (selectedGuideId) {
        setFormData(prev => ({ ...prev, guide_id: selectedGuideId }));
      }
      const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onEsc);
      return () => window.removeEventListener('keydown', onEsc);
    }
  }, [isOpen, selectedGuideId]);

  const loadGuidesAndTours = async () => {
    try {
      const [guidesData, toursData] = await Promise.all([
        apiClient.getGuides(),
        apiClient.getTours()
      ]);

      setGuides(guidesData);
      setTours(toursData);
    } catch (error) {
      console.error('Error loading guides and tours:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');

    try {
      await apiClient.createBooking({
        ...formData,
        guide_id: formData.guide_id || null,
        tour_id: formData.tour_id || null,
        status: 'pending'
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          guide_id: selectedGuideId || '',
          tour_id: '',
          preferred_start_date: '',
          preferred_end_date: '',
          participants_count: 1,
          notes: '',
        });
        setSubmitStatus('idle');
      }, 1800);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const fieldBase =
    'w-full rounded-xl border border-transparent bg-white/70 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm ring-1 ring-neutral-300/80 dark:ring-neutral-700 px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-sky-400/70 dark:focus:ring-sky-800/70 placeholder:text-neutral-500 text-neutral-500';

  const groupLabel = 'block text-sm font-medium text-neutral-500 dark:text-neutral-200 mb-2';

  const Section = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-00">{title}</div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );

  const Field = ({
    id,
    label,
    icon: Icon,
    children,
  }: {
    id: string;
    label: string;
    icon?: any;
    children: React.ReactNode;
  }) => (
    <label htmlFor={id} className="block">
      <span className={groupLabel}>{label}</span>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-100 color-white
         pointer-events-none" />}
        {children}
      </div>
    </label>
  );

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm"
        onMouseDown={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          onMouseDown={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl sm:mx-auto"
        >
          <div className="rounded-2xl bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-500/20 p-[1px] shadow-2xl">
            <div className="rounded-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/40 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl px-6 py-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Забронируйте приключение</h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Займёт меньше минуты</p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-neutral-200/70 dark:ring-neutral-800/60 bg-white/70 dark:bg-neutral-900/70 hover:bg-white dark:hover:bg-neutral-900 transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <Section title="Контакты">
                  <Field id="client_name" label="Ваше имя *" icon={User}>
                    <input
                      id="client_name"
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className={`${fieldBase} pl-9`}
                      placeholder="Иван Иванов"
                    />
                  </Field>

                  <Field id="client_email" label="Эл. почта *" icon={Mail}>
                    <input
                      id="client_email"
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className={`${fieldBase} pl-9`}
                      placeholder="ivan@example.com"
                    />
                  </Field>

                  <Field id="client_phone" label="Телефон *" icon={Phone}>
                    <input
                      id="client_phone"
                      type="tel"
                      required
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className={`${fieldBase} pl-9`}
                      placeholder="+7 999 123‑45‑67"
                    />
                  </Field>

                  <Field id="participants_count" label="Участников" icon={Users}>
                    <input
                      id="participants_count"
                      type="number"
                      min={1}
                      max={20}
                      value={formData.participants_count}
                      onChange={(e) => setFormData({ ...formData, participants_count: parseInt(e.target.value || '1', 10) })}
                      className={`${fieldBase} pl-9`}
                    />
                  </Field>
                </Section>

                <Section title="План">
                  <Field id="guide_id" label="Выберите гида">
                    <select
                      id="guide_id"
                      value={formData.guide_id as any}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFormData({ ...formData, guide_id: v === '' ? '' : Number(v) });
                      }}
                      className={`${fieldBase}`}
                    >
                      <option value="">Любой доступный гид</option>
                      {guides.map((guide) => (
                        <option key={guide.id} value={guide.id}>
                          {guide.full_name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="tour_id" label="Выберите тур">
                    <select
                      id="tour_id"
                      value={formData.tour_id as any}
                      onChange={(e) => setFormData({ ...formData, tour_id: e.target.value })}
                      className={`${fieldBase}`}
                    >
                      <option value="">Общее приключение</option>
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="preferred_start_date" label="Дата начала *" icon={Calendar}>
                    <input
                      id="preferred_start_date"
                      type="date"
                      required
                      value={formData.preferred_start_date}
                      onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
                      min={today}
                      className={`${fieldBase} pl-9`}
                    />
                  </Field>

                  <Field id="preferred_end_date" label="Дата окончания *" icon={Calendar}>
                    <input
                      id="preferred_end_date"
                      type="date"
                      required
                      value={formData.preferred_end_date}
                      onChange={(e) => setFormData({ ...formData, preferred_end_date: e.target.value })}
                      min={formData.preferred_start_date || today}
                      className={`${fieldBase} pl-9`}
                    />
                  </Field>
                </Section>

                <div>
                  <label htmlFor="notes" className={groupLabel}>Дополнительные пожелания</label>
                  <div className="relative">
                    <StickyNote className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <textarea
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className={`${fieldBase} pl-9 min-h-[120px]`}
                      placeholder="Any specific requirements or preferences..."
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-3 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-100"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Заявка успешно отправлена! Мы скоро свяжемся с вами.</span>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-red-800 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-100"
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>Не удалось отправить заявку. Попробуйте ещё раз.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex w-full sm:w-1/3 items-center justify-center gap-2 rounded-xl border border-neutral-200/70 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/70 px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-900 transition ring-1 ring-inset ring-white/60 dark:ring-black/20"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative inline-flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-blue-600 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-sky-600/10 hover:brightness-[1.05] active:brightness-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} 
                    {loading ? 'Отправка…' : 'Отправить заявку'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
