import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Mail, Lock, MapPin, User, Globe, Phone,
  ChevronLeft, ChevronRight, CheckCircle2, Loader2, School
} from 'lucide-react';
import { SuperAdminLayout } from './SuperAdminLayout';
import axios from 'axios';

const STEPS = ['School Info', 'Admin Account', 'Plan & Region', 'Confirm'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              i < current ? 'bg-emerald-500 text-white' :
              i === current ? 'bg-primary text-white shadow-lg shadow-primary/30' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < current ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${i === current ? 'text-primary' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full transition-all ${i < current ? 'bg-emerald-400' : 'bg-gray-100'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FormInput({ label, id, icon: Icon, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          id={id}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50' :
              'border-gray-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/5'}
            bg-white`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({ label, id, icon: Icon, options, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />}
        <select
          id={id}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5 bg-white appearance-none`}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function OnboardSchool() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '', domain: '', address: '',
    admin_name: '', admin_email: '', admin_password: '',
    plan: 'Professional', region: '', phone: ''
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name) e.name = 'School name is required';
      if (!form.domain) e.domain = 'Domain is required';
    }
    if (step === 1) {
      if (!form.admin_name) e.admin_name = 'Admin name is required';
      if (!form.admin_email || !form.admin_email.includes('@')) e.admin_email = 'Valid email required';
      if (!form.admin_password || form.admin_password.length < 8) e.admin_password = 'Min 8 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // When backend is connected:
      // await axios.post('/api/platform/schools/onboard', form);
      await new Promise(r => setTimeout(r, 1500)); // Simulate API call
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuperAdminLayout title="Onboard School" subtitle="New school registration">
        <div className="max-w-lg mx-auto mt-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={36} className="text-emerald-500" />
          </motion.div>
          <h2 className="font-black text-primary text-2xl mb-2">School Onboarded!</h2>
          <p className="text-gray-400 text-sm mb-6">
            <strong className="text-gray-700">{form.name}</strong> is now live on the platform.
            An email has been sent to <strong className="text-gray-700">{form.admin_email}</strong> with their login credentials.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setStep(0); setForm({ name:'',domain:'',address:'',admin_name:'',admin_email:'',admin_password:'',plan:'Professional',region:'',phone:'' }); }}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Onboard Another
            </button>
            <button
              onClick={() => navigate('/superadmin/schools')}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
            >
              View All Schools
            </button>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout title="Onboard New School" subtitle="Register a new institution on the platform">
      <div className="max-w-2xl mx-auto">
        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 0: School Info */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-primary">School Information</h3>
                      <p className="text-xs text-gray-400">Basic details about the institution</p>
                    </div>
                  </div>
                  <FormInput label="School Name" id="name" icon={School} value={form.name} onChange={set('name')} placeholder="e.g. Wisdom International School" error={errors.name} />
                  <FormInput label="Platform Domain" id="domain" icon={Globe} value={form.domain} onChange={set('domain')} placeholder="e.g. wisdom (becomes wisdom.babyeyi.com)" error={errors.domain} />
                  <FormInput label="Physical Address" id="address" icon={MapPin} value={form.address} onChange={set('address')} placeholder="Full address" />
                  <FormInput label="Phone Number" id="phone" icon={Phone} value={form.phone} onChange={set('phone')} placeholder="+250 ..." />
                </div>
              )}

              {/* Step 1: Admin Account */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-primary">School Admin Account</h3>
                      <p className="text-xs text-gray-400">This person will have full control of the school</p>
                    </div>
                  </div>
                  <FormInput label="Full Name" id="admin_name" icon={User} value={form.admin_name} onChange={set('admin_name')} placeholder="e.g. Dr. Patrick Mugisha" error={errors.admin_name} />
                  <FormInput label="Email Address" id="admin_email" icon={Mail} type="email" value={form.admin_email} onChange={set('admin_email')} placeholder="admin@school.com" error={errors.admin_email} />
                  <FormInput label="Temporary Password" id="admin_password" icon={Lock} type="password" value={form.admin_password} onChange={set('admin_password')} placeholder="Min. 8 characters" error={errors.admin_password} />
                </div>
              )}

              {/* Step 2: Plan & Region */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Globe size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-primary">Plan & Region</h3>
                      <p className="text-xs text-gray-400">Subscription tier and geographic location</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Starter', 'Professional', 'Enterprise'].map(plan => (
                      <button
                        key={plan}
                        onClick={() => setForm(f => ({ ...f, plan }))}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          form.plan === plan
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-black text-sm">{plan}</p>
                        <p className={`text-[10px] mt-1 ${form.plan === plan ? 'text-white/60' : 'text-gray-400'}`}>
                          {plan === 'Starter' ? 'Up to 300 students' : plan === 'Professional' ? 'Up to 800 students' : 'Unlimited'}
                        </p>
                      </button>
                    ))}
                  </div>
                  <FormSelect
                    label="Region" id="region" icon={MapPin}
                    value={form.region} onChange={set('region')}
                    options={[
                      { value: '', label: 'Select region...' },
                      { value: 'Kigali', label: 'Kigali City' },
                      { value: 'Eastern', label: 'Eastern Province' },
                      { value: 'Western', label: 'Western Province' },
                      { value: 'Northern', label: 'Northern Province' },
                      { value: 'Southern', label: 'Southern Province' },
                    ]}
                  />
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-primary">Confirm & Launch</h3>
                      <p className="text-xs text-gray-400">Review all details before creating the school</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['School Name', form.name],
                      ['Domain', `${form.domain}.babyeyi.com`],
                      ['Region', form.region],
                      ['Admin Name', form.admin_name],
                      ['Admin Email', form.admin_email],
                      ['Plan', form.plan],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{k}</span>
                        <span className="text-sm font-bold text-gray-800">{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                  {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent text-primary rounded-xl text-sm font-black hover:bg-amber-400 disabled:opacity-70 transition-all"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {loading ? 'Creating...' : 'Launch School'}
              </button>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
