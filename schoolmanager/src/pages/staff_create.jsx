import React, { useState } from 'react';
import { Camera, Mail, Phone, Smartphone, Tag, ChevronDown, ArrowLeft, Save, Users, Settings as SettingsIcon, Trash2, TrendingUp, Upload, FileText, HelpCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StaffCreate() {
  const [activeTab, setActiveTab] = useState('Work');
  const [currentStep, setCurrentStep] = useState('Draft');

  const tabs = ['Work', 'Resume', 'Personal', 'Payroll'];
  const steps = ['Draft', 'Account Created', 'Active'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Work':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Work Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Department</label>
                  <div className="col-span-2 relative">
                    <select className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer">
                      <option value="">Select Department</option>
                      <option value="Admin">Administration</option>
                      <option value="Academic">Academic</option>
                      <option value="Discipline">Discipline</option>
                      <option value="Support">Support Staff</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Job Position</label>
                  <input type="text" placeholder="e.g. Mathematics Teacher" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Job Title</label>
                  <input type="text" placeholder="e.g. Senior Teacher" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Reporting To</label>
                  <div className="col-span-2 relative">
                    <select className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer">
                      <option value="">Select Manager</option>
                      <option value="1">Dr. John Kalisa (HM)</option>
                      <option value="2">Mrs. Sarah Uwase (DOS)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Organization Chart</h3>
              <div className="p-6 bg-slate-50/50 rounded border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 italic">"Set a manager or reports to show in org chart."</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Resume':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in duration-300">
            {/* Left Column: Resume File */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Resume</h3>
              </div>

              <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center border border-slate-100">
                  <FileText className="w-8 h-8 text-primary/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Resume_John_Doe.pdf</p>
                  <p className="text-[10px] text-slate-400 font-medium">Uploaded on 22 April 2026</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:bg-primary/5 px-4 py-2 rounded-full border border-primary/20 transition-all uppercase">
                  <Upload size={14} /> Upload Another
                </button>
              </div>
            </div>

            {/* Right Column: Striped Skills */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Skills & Certifications</h3>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all">Add</button>
              </div>

              <div className="border border-slate-100 rounded-lg overflow-hidden">
                {[
                  { category: 'Languages', name: 'English', level: 'B2', progress: 75 },
                  { category: 'Soft Skills', name: 'Problem-Solving', level: 'Intermediate', progress: 50 },
                  { category: 'IT', name: 'Agile methodologies', level: 'Advanced', progress: 80 },
                  { category: 'Programming', name: 'Python', level: 'Beginner', progress: 15 },
                ].map((skill, idx) => (
                  <div key={skill.name} className={`grid grid-cols-12 items-center gap-4 p-3 group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <div className="col-span-4 flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">{skill.category}</span>
                      <span className="text-xs font-semibold text-slate-700">{skill.name}</span>
                    </div>
                    <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{skill.level}</div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${skill.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-800 w-8">{skill.progress} %</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Private Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <input type="text" placeholder="Street, Sector, District" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Bank Account</label>
                  <input type="text" placeholder="Account Number" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Citizenship</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Nationality</label>
                  <input type="text" placeholder="e.g. Rwandan" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">National ID</label>
                  <input type="text" placeholder="ID / Passport Number" className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Payroll':
        return (
          <div className="max-w-4xl space-y-12 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Side: Salary & Allowances */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Salary & Schedule</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-sm font-semibold text-slate-700">Basic Salary</label>
                      <div className="col-span-2 flex items-center gap-2">
                        <input type="number" placeholder="0" className="flex-1 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent font-bold" />
                        <span className="text-[10px] font-black text-slate-400">RWF</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-sm font-semibold text-slate-700">Payment Freq.</label>
                      <div className="col-span-2 relative">
                        <select className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer">
                          <option>Monthly (Standard)</option>
                          <option>Bi-weekly</option>
                          <option>Weekly</option>
                          <option>Daily / Contractual</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-sm font-semibold text-slate-700">Scheduled Pay Day</label>
                      <div className="col-span-2 relative">
                        <select className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer">
                          <option>Last day of month</option>
                          <option>20th of month</option>
                          <option>24th of month</option>
                          <option>25th of month</option>
                          <option>28th of month</option>
                          <option>1st of month</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Monthly Allowances</h3>
                    <button className="text-[10px] font-black text-primary hover:underline uppercase">Add Custom</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Housing Allowance', placeholder: '0' },
                      { label: 'Transport Allowance', placeholder: '0' },
                      { label: 'Responsibility Allow.', placeholder: '0' },
                    ].map((allowance) => (
                      <div key={allowance.label} className="grid grid-cols-3 items-center">
                        <label className="text-sm font-semibold text-slate-700">{allowance.label}</label>
                        <div className="col-span-2 flex items-center gap-2">
                          <input type="number" placeholder={allowance.placeholder} className="flex-1 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                          <span className="text-[10px] font-bold text-slate-300">RWF</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Deductions & Bank */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Statutory Deductions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">RSSB Contribution</p>
                        <p className="text-[10px] text-slate-400">Automatic calculation enabled (3%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-4 bg-primary/20 rounded-full relative"><div className="absolute right-0 top-0 w-4 h-4 bg-primary rounded-full shadow-sm" /></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">RAMA / Medical</p>
                        <p className="text-[10px] text-slate-400">Standard medical deduction (7.5%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-4 bg-primary/20 rounded-full relative"><div className="absolute right-0 top-0 w-4 h-4 bg-primary rounded-full shadow-sm" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Bank Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-sm font-semibold text-slate-700">Bank Name</label>
                      <div className="col-span-2 relative">
                        <select className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer">
                          <option>BK (Bank of Kigali)</option>
                          <option>Equity Bank</option>
                          <option>Cogebanque</option>
                          <option>Access Bank</option>
                          <option>Urwego Bank</option>
                          <option>Mwalimu SACCO</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <label className="text-sm font-semibold text-slate-700">Account No.</label>
                      <input type="text" placeholder="e.g. 00045-0697..." className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Estimated Net Salary</p>
                <p className="text-2xl font-black text-slate-800">0 <span className="text-sm font-bold text-slate-400">RWF / Month</span></p>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded shadow-lg shadow-primary/20 font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Calculate PAYE</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Action Bar Styles */}
      <style>{`
        .breadcrumb-container { display: flex; align-items: center; }
        .breadcrumb-step {
          position: relative; padding: 6px 20px 6px 30px; background: #f1f5f9; color: #64748b;
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
          margin-right: -10px; transition: all 0.2s; cursor: pointer;
        }
        .breadcrumb-step:first-child { clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%); padding-left: 15px; }
        .breadcrumb-step.active { background: primary; color: white; z-index: 10; }
        .breadcrumb-step.completed { background: #e2e8f0; color: primary; }
      `}</style>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/staff" className="text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">Staff Onboarding Form</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="breadcrumb-container">
            {steps.map((step, idx) => (
              <div key={step} onClick={() => setCurrentStep(step)}
                className={`breadcrumb-step ${currentStep === step ? 'active' : ''} ${steps.indexOf(currentStep) > idx ? 'completed' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-slate-200" />
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2">
            <Save size={14} /> Finish & Save
          </button>
        </div>
      </div>

      <div className=" w-full">
        <div className="p-8">

          {/* Identity Section */}
          <div className="flex items-start gap-8 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-slate-100 rounded-sm border-2 border-dashed border-slate-300 flex items-center justify-center transition-all group-hover:border-primary group-hover:bg-slate-50">
                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Add Photo</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <input type="text" placeholder="Employee's Name (e.g. John Doe, ...)"
                className="w-full text-3xl font-medium border-b border-slate-200 pb-2 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-3 group">
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                  <input type="email" placeholder="e.g. johndoe@example.com" className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-200 focus:outline-none py-0.5" />
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                  <input type="text" placeholder="Work Phone" className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-200 focus:outline-none py-0.5" />
                </div>
                <div className="flex items-center gap-3 group">
                  <Smartphone className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                  <input type="text" placeholder="Work Mobile" className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-200 focus:outline-none py-0.5" />
                </div>
                <div className="flex items-center gap-3 group">
                  <Tag className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                  <input type="text" placeholder="e.g. Teacher, DOS, ..." className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-200 focus:outline-none py-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
              </button>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="min-h-[300px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal CSS for the spin-slow
if (typeof document !== 'undefined') {
  const styleId = 'spin-slow-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin-slow { animation: spin-slow 8s linear infinite; }
    `;
    document.head.appendChild(style);
  }
}
