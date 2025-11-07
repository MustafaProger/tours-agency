import { useState, useEffect } from 'react';
import type { ElementType, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Users,
  StickyNote,
  Timer,
} from 'lucide-react';
import { apiClient, type Driver, type Experience } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDriverId?: number;
}

export function BookingModal({ isOpen, onClose, selectedDriverId }: BookingModalProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    driver_id: selectedDriverId ? String(selectedDriverId) : '',
    experience_id: '',
    preferred_track_date: '',
    preferred_track_time: '',
    participants_count: 1,
    notes: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const [driverData, experienceData] = await Promise.all([
          apiClient.getDrivers(),
          apiClient.getExperiences(),
        ]);
        setDrivers(driverData);
        setExperiences(experienceData);
      } catch (error) {
        console.error('Failed to load dictionary data', error);
      }
    };

    load();

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (selectedDriverId) {
      setFormData((prev) => ({ ...prev, driver_id: String(selectedDriverId) }));
    }
  }, [selectedDriverId]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const fieldBase =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/40';

  const labelStyles = 'mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400';

  const Field = ({
    id,
    label,
    icon: Icon,
    children,
  }: {
    id: string;
    label: string;
    icon?: ElementType;
    children: ReactNode;
  }) => (
    <label htmlFor={id} className="block">
      <span className={labelStyles}>{label}</span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        {children}
      </div>
    </label>
  );

  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');

    try {
      await apiClient.createBooking({
        ...formData,
        driver_id: formData.driver_id ? Number(formData.driver_id) : null,
        experience_id: formData.experience_id ? Number(formData.experience_id) : null,
        participants_count: Number(formData.participants_count) || 1,
        status: 'pending',
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          driver_id: '',
          experience_id: '',
          preferred_track_date: '',
          preferred_track_time: '',
          participants_count: 1,
          notes: '',
        });
        setSubmitStatus('idle');
      }, 1600);
    } catch (error) {
      console.error('Booking failed', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl"
        onMouseDown={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          <div className="rounded-[32px] border border-white/10 bg-[#05050a]/95 p-[1px] shadow-[0_30px_90px_rgba(5,5,10,0.8)]">
            <div className="rounded-[32px] bg-gradient-to-br from-[#11111a] via-[#08070f] to-[#05050a] text-white">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Session booking</p>
                  <h2 className="text-2xl font-black tracking-[0.2em] text-white">Hyperdrive form</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
                  aria-label="Закрыть модальное окно"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                <Section title="Контакты">
                  <Field id="client_name" label="Имя" icon={User}>
                    <input
                      id="client_name"
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className={`${fieldBase} pl-12`}
                      placeholder="Александр Вольт"
                    />
                  </Field>

                  <Field id="client_email" label="Email" icon={Mail}>
                    <input
                      id="client_email"
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className={`${fieldBase} pl-12`}
                      placeholder="volt@studio.io"
                    />
                  </Field>

                  <Field id="client_phone" label="Телефон" icon={Phone}>
                    <input
                      id="client_phone"
                      type="tel"
                      required
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className={`${fieldBase} pl-12`}
                      placeholder="+1 (702) 555-8899"
                    />
                  </Field>

                  <Field id="participants_count" label="Экипаж" icon={Users}>
                    <input
                      id="participants_count"
                      type="number"
                      min={1}
                      max={10}
                      value={formData.participants_count}
                      onChange={(e) => setFormData({ ...formData, participants_count: Number(e.target.value) })}
                      className={`${fieldBase} pl-12`}
                    />
                  </Field>
                </Section>

                <Section title="Параметры трека">
                  <Field id="driver_id" label="Пилот">
                    <select
                      id="driver_id"
                      value={formData.driver_id}
                      onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                      className={fieldBase}
                    >
                      <option value="">Любой пилот</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.full_name} — {driver.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="experience_id" label="Программа">
                    <select
                      id="experience_id"
                      value={formData.experience_id}
                      onChange={(e) => setFormData({ ...formData, experience_id: e.target.value })}
                      className={fieldBase}
                    >
                      <option value="">Я ещё выбираю</option>
                      {experiences.map((experience) => (
                        <option key={experience.id} value={experience.id}>
                          {experience.name} — {experience.location}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="preferred_track_date" label="Дата" icon={Calendar}>
                    <input
                      id="preferred_track_date"
                      type="date"
                      required
                      min={today}
                      value={formData.preferred_track_date}
                      onChange={(e) => setFormData({ ...formData, preferred_track_date: e.target.value })}
                      className={`${fieldBase} pl-12`}
                    />
                  </Field>

                  <Field id="preferred_track_time" label="Старт" icon={Timer}>
                    <input
                      id="preferred_track_time"
                      type="time"
                      required
                      value={formData.preferred_track_time}
                      onChange={(e) => setFormData({ ...formData, preferred_track_time: e.target.value })}
                      className={`${fieldBase} pl-12`}
                    />
                  </Field>
                </Section>

                <div>
                  <label htmlFor="notes" className={labelStyles}>
                    Особые запросы
                  </label>
                  <div className="relative">
                    <StickyNote className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-slate-500" />
                    <textarea
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className={`${fieldBase} pl-12`}
                      placeholder="Необходимо подключить телеметрию, снять дрон и т.д."
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Слот забронирован. Команда свяжется в течение часа.</span>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>Не удалось отправить заявку. Попробуйте ещё раз.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40 sm:w-1/3"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-4 py-3 text-xs font-black uppercase tracking-[0.4em] text-black transition hover:brightness-110 disabled:opacity-60 sm:flex-1"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? 'Отправка...' : 'Запустить слот'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
