import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Mail, 
  Phone, 
  Smartphone, 
  Tag, 
  ChevronDown, 
  ArrowLeft, 
  Save, 
  Users, 
  Layout as LayoutIcon, 
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Globe,
  GraduationCap,
  Home,
  User,
  Smartphone as SmartphoneIcon,
  Heart,
  X,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  List,
  AlertTriangle
} from 'lucide-react';

export default function StudentCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal'); // Default to Personal for Draft step
  const [currentStep, setCurrentStep] = useState('Draft');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // System Setup Check (Mocking dependency on Setup module)
  const [setupPrerequisites, setSetupPrerequisites] = useState({
    hasAcademicYear: true, // Set to false to test warning
    hasClasses: true
  });
  const isSetupRequired = !setupPrerequisites.hasAcademicYear || !setupPrerequisites.hasClasses;

  const [showParentModal, setShowParentModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  const [isParentSelectOpen, setIsParentSelectOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isClassSelectOpen, setIsClassSelectOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dob: '',
    nationality: 'Rwandan',
    residence: '',
    bloodGroup: 'Unknown',
    allergies: '',
    formerSchool: '',
    leavingReason: '',
    joiningDate: '',
    academicYear: '',
    term: '',
    relation: 'Father',
    emergencyContact: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const CustomSelect = ({ label, placeholder, value, options, onSelect, onSearchMore, isOpen, setIsOpen }) => {
    const containerRef = useRef(null);
    const [dropUp, setDropUp] = useState(false);

    useEffect(() => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setDropUp(spaceBelow < 250);
      }
    }, [isOpen]);

    return (
      <div className="grid grid-cols-3 items-center" ref={containerRef}>
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="col-span-2 relative">
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full text-left text-sm bg-transparent border-b py-1.5 focus:outline-none transition-all flex items-center justify-between group ${isOpen ? 'border-accent' : 'border-slate-200'}`}
            >
              <span className={value ? "text-slate-800 font-bold" : "text-slate-400"}>
                {value ? value : placeholder}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: dropUp ? -8 : 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: dropUp ? -8 : 8, scale: 0.98 }}
                    className={`absolute left-0 right-0 ${dropUp ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'} bg-white border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,4,53,0.15)] rounded-lg z-50 overflow-hidden ring-1 ring-slate-900/5`}
                  >
                    <div className="max-h-64 overflow-auto py-1">
                      {options.slice(0, 3).map((opt, i) => (
                        <button key={i} onClick={() => { onSelect(opt); setIsOpen(false); }}
                          className="w-full px-4 py-2 hover:bg-primary hover:text-white transition-all text-left group/opt"
                        >
                          <span className="text-xs font-bold text-slate-700 group-hover/opt:text-white truncate block">{opt.name}</span>
                        </button>
                      ))}
                      <button onClick={() => { setIsOpen(false); onSearchMore(); }}
                        className="w-full px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 hover:bg-slate-100 transition-all mt-1"
                      >
                        <Search size={12} className="text-accent" />
                        <span className="text-[10px] font-black text-accent uppercase tracking-wider">Search More</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const sampleParents = [
    { name: 'Eric Kayisire', phone: '(+250) 788-111-222', location: 'Gasabo' },
    { name: 'Sarah Uwase', phone: '(+250) 788-333-444', location: 'Kicukiro' },
    { name: 'Jean Bizimana', phone: '(+250) 788-555-666', location: 'Musanze' },
    { name: 'Alice Umutoni', phone: '(+250) 788-777-888', location: 'Gisenyi' },
    { name: 'Pierre Ntaganda', phone: '(+250) 788-999-000', location: 'Nyarugenge' },
  ];

  const sampleLevels = [
    { name: 'Nursery', students: '120 Students', category: 'Pre-Primary' },
    { name: 'Primary', students: '450 Students', category: 'Primary' },
    { name: 'O-Level', students: '320 Students', category: 'Secondary' },
    { name: 'A-Level', students: '180 Students', category: 'Secondary' },
  ];

  const sampleClasses = [
    { name: 'Senior 1 A', students: '45 Students', level: 'O-Level' },
    { name: 'Senior 1 B', students: '42 Students', level: 'O-Level' },
    { name: 'Senior 4 PCM', students: '38 Students', level: 'A-Level' },
    { name: 'Primary 6 Blue', students: '40 Students', level: 'Primary' },
  ];

  const DiscoveryModal = ({ title, type, items, onSelect, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="bg-white shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden relative z-10 rounded-xl border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-primary">Search: {title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Discover existing {type} or register a new one</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder={`Search by ${type} name...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
            <span>1-{items.length} / {items.length}</span>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={16} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-primary text-[11px] font-bold bg-white sticky top-0 z-10">
                <th className="px-6 py-3 uppercase tracking-wider">{title} Name</th>
                <th className="px-6 py-3 uppercase tracking-wider">{type === 'parent' ? 'Phone' : 'Capacity'}</th>
                <th className="px-6 py-3 uppercase tracking-wider">{type === 'parent' ? 'Location' : 'Category'}</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {items.map((item, idx) => (
                <tr key={idx} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 uppercase">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2.5 font-medium text-slate-600">{type === 'parent' ? item.phone : item.students}</td>
                  <td className="px-6 py-2.5 font-medium text-slate-600">{type === 'parent' ? item.location : (item.category || item.level)}</td>
                  <td className="px-6 py-2.5 text-right">
                    <button onClick={() => { onSelect(item); onClose(); }} className="bg-white hover:bg-primary hover:text-white text-primary px-3 py-1 rounded border border-primary/20 text-[10px] font-bold uppercase transition-all shadow-sm">
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <button className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            Create New {title}
          </button>
          <button onClick={onClose} className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );

  const tabs = ['Personal', 'Family', 'Medical'];
  const steps = ['Draft', 'Academic', 'Review'];
  const validateForm = () => {
    const errors = [];
    if (isSetupRequired) {
      errors.push("System setup is incomplete. Please configure Academic Year and Classes first.");
      return errors;
    }
    if (!formData.fullName?.trim()) errors.push("Full Name is required");
    if (!formData.dob) errors.push("Date of Birth is required");
    if (!selectedParent) errors.push("Parent/Guardian selection is required");
    if (currentStep === 'Academic' || currentStep === 'Review') {
      if (!formData.academicYear) errors.push("Academic Year is required");
      if (!formData.term) errors.push("Term is required");
      if (!selectedClass) errors.push("Target Class is required");
    }
    return errors;
  };

  const handleFinish = () => {
    if (currentStep !== 'Review') return;
    
    const errors = validateForm();
    if (errors.length > 0) {
      return; // Validation warnings are shown in UI
    }

    setLoading(true);
    
    const payload = {
      student: {
        fullName: formData.fullName,
        gender: formData.gender,
        dob: formData.dob,
        nationality: formData.nationality,
        residence: formData.residence,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
      },
      parent: {
        ...selectedParent,
        relation: formData.relation,
        emergencyContact: formData.emergencyContact
      },
      academic: {
        level: selectedLevel,
        class: selectedClass,
        academicYear: formData.academicYear,
        term: formData.term,
        joiningDate: formData.joiningDate,
        formerSchool: formData.formerSchool,
        leavingReason: formData.leavingReason
      }
    };

    console.log("Final Enrollment Data (Ready for Backend):", payload);

    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/students');
      }, 1000);
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Identity Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <div className="col-span-2 relative">
                    <select 
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Origin</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Nationality</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rwandan" 
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Residence</label>
                  <input 
                    type="text" 
                    placeholder="Street, Sector, District" 
                    value={formData.residence}
                    onChange={(e) => handleInputChange('residence', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Family':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Parent / Guardian</h3>
              </div>
              <div className="space-y-4">
                <CustomSelect 
                  label="Link Parent/ Guardian" placeholder="Select Parent" value={selectedParent?.name}
                  options={sampleParents} onSelect={(val) => setSelectedParent(val)}
                  onSearchMore={() => setShowParentModal(true)}
                  isOpen={isParentSelectOpen} setIsOpen={setIsParentSelectOpen}
                />
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Relation</label>
                  <div className="col-span-2 relative">
                    <select 
                      value={formData.relation}
                      onChange={(e) => handleInputChange('relation', e.target.value)}
                      className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Legal Guardian</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Emergency Info</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Contact Note</label>
                  <input 
                    type="text" 
                    placeholder="Secondary phone or info" 
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="p-4 bg-primary/5 rounded border border-primary/10">
                   <p className="text-[10px] text-primary/70 font-medium leading-relaxed italic">"Please ensure the parent/guardian details are accurate before proceeding."</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Medical':
        return (
          <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Health & Well-being</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Blood Group</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary"
                  >
                    <option>Unknown</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Allergies</label>
                  <input 
                    type="text" 
                    placeholder="List any allergies" 
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>
              <div className="p-5 bg-accent rounded-xl border border-accent-foreground/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center flex-shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-amber-700/70 mt-0.5 leading-relaxed">This information is strictly confidential and only accessible by authorized medical staff.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAcademicStep = () => {
    const showFee = formData.academicYear && selectedClass;
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Enrollment Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center">
                <label className="text-sm font-semibold text-slate-700">Academic Year</label>
                <div className="col-span-2 relative">
                  <select 
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    <option>2023-2024</option>
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-sm font-semibold text-slate-700">Term</label>
                <div className="col-span-2 relative">
                  <select 
                    value={formData.term}
                    onChange={(e) => handleInputChange('term', e.target.value)}
                    className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select Term</option>
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <CustomSelect 
                label="Enrollment Level" placeholder="Select Level" value={selectedLevel?.name}
                options={sampleLevels} onSelect={(val) => setSelectedLevel(val)}
                onSearchMore={() => setShowLevelModal(true)}
                isOpen={isLevelSelectOpen} setIsOpen={setIsLevelSelectOpen}
              />
              <CustomSelect 
                label="Target Class" placeholder="Select Class" value={selectedClass?.name}
                options={selectedLevel ? sampleClasses.filter(c => c.level === selectedLevel.name) : sampleClasses} 
                onSelect={(val) => setSelectedClass(val)}
                onSearchMore={() => setShowClassModal(true)}
                isOpen={isClassSelectOpen} setIsOpen={setIsClassSelectOpen}
              />
              <div className="grid grid-cols-3 items-center">
                <label className="text-sm font-semibold text-slate-700">Joining Date</label>
                <input 
                  type="date" 
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                />
              </div>
            </div>

            <div className="pt-8 space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Previous Education</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Former School</label>
                  <input 
                    type="text" 
                    placeholder="Last school attended" 
                    value={formData.formerSchool}
                    onChange={(e) => handleInputChange('formerSchool', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <label className="text-sm font-semibold text-slate-700">Leaving Reason</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Relocation" 
                    value={formData.leavingReason}
                    onChange={(e) => handleInputChange('leavingReason', e.target.value)}
                    className="col-span-2 text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Fee Structure Preview</h3>
            {showFee ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated Fees for {formData.academicYear}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Tuition Fee</span>
                    <span className="font-bold text-slate-800">100,000 RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Registration & Other Fees</span>
                    <span className="font-bold text-slate-800">20,000 RWF</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Total Payable</span>
                    <span className="text-lg font-black text-primary">120,000 RWF</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/5 text-[10px] text-primary/70 italic text-center border-t border-primary/10">
                  Final invoice will be generated upon enrollment completion.
                </div>
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                <div className="text-center p-6">
                  <LayoutIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-medium">Select Class & Academic Year to preview fees</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <button 
            onClick={() => setCurrentStep('Draft')}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-all"
          >
            <ChevronLeft size={16} /> Back to Draft
          </button>
          <button 
            onClick={() => setCurrentStep('Review')}
            className="bg-primary text-white px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
          >
            Review Enrollment <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    const summaryItems = [
      { field: 'Full Legal Name', value: formData.fullName },
      { field: 'Parent / Guardian', value: selectedParent?.name },
      { field: 'Enrollment Level', value: selectedLevel?.name },
      { field: 'Target Class', value: selectedClass?.name },
      { field: 'Academic Year', value: formData.academicYear },
      { field: 'Term', value: formData.term },
      { field: 'Joining Date', value: formData.joiningDate || 'Immediate' },
      { field: 'Estimated Fees', value: '120,000 RWF', highlight: true },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Final Enrollment Review</h3>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-800 text-[10px] font-black bg-slate-50 uppercase tracking-widest">
                <th className="px-6 py-3 border-r border-slate-100">Information Field</th>
                <th className="px-6 py-3">Details / Selected Value</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {summaryItems.map((item, idx) => (
                <tr key={idx} className={`border-b border-slate-200 transition-colors hover:bg-primary/5 ${idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
                  <td className="px-6 py-3 font-bold text-slate-500 border-r border-slate-100 uppercase tracking-tighter w-1/3">{item.field}</td>
                  <td className={`px-6 py-3 font-bold ${item.highlight ? 'text-primary text-sm' : 'text-slate-700'}`}>
                    {item.value || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDraftStep = () => (
    <>
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-accent' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {renderTabContent()}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={() => setCurrentStep('Academic')}
          className="bg-primary text-white px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
        >
          Next: Academic Placement <ChevronRight size={16} />
        </button>
      </div>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'Draft':
        return renderDraftStep();
      case 'Academic':
        return renderAcademicStep();
      case 'Review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Action Bar Styles (Breadcrumb logic matching Staff) */}
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
          <Link to="/students" className="text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">Student Enrollment Form</h2>
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
          <button 
            onClick={handleFinish}
            disabled={currentStep !== 'Review' || loading || isSuccess || isSetupRequired}
            className={`px-5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 ${
              (currentStep !== 'Review' || isSetupRequired)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSuccess ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {isSuccess ? 'Enrolled!' : 'Finish & Enroll'}
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="p-8">
          
          {/* Setup Required Warning */}
          {isSetupRequired && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest">Setup Required Before Enrollment</h3>
                <p className="text-xs text-red-700/70 mt-1 leading-relaxed">
                  The system foundation is not yet configured. You must define an <strong>Active Academic Year</strong> and at least one <strong>School Class</strong> in the Setup module before you can register new students.
                </p>
                <Link to="/setup" className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm hover:bg-red-50 transition-all">
                  Go to Setup <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Identity Section */}
          <div className="flex items-start gap-8 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-slate-100 rounded-sm border-2 border-dashed border-slate-300 flex items-center justify-center transition-all group-hover:border-primary group-hover:bg-slate-50">
                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Student Photo</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <input 
                type="text" 
                placeholder="Student's Full Legal Name (e.g. Jean Baptiste Murenzi)"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full text-3xl font-medium border-b border-slate-200 pb-2 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div 
                  onClick={() => setCurrentStep('Academic')}
                  className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all"
                >
                  <Tag className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Level:</span>
                      <span className="font-bold">{selectedLevel?.name || 'N/A'}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                <div 
                  onClick={() => setCurrentStep('Academic')}
                  className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all"
                >
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Class:</span>
                      <span className="font-bold">{selectedClass?.name || 'N/A'}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                <div 
                  onClick={() => { setCurrentStep('Draft'); setActiveTab('Family'); }}
                  className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all"
                >
                  <SmartphoneIcon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Parent:</span>
                      <span className="font-bold">{selectedParent?.name || 'N/A'}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                <div 
                  onClick={() => setCurrentStep('Academic')}
                  className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Joining Date:</span>
                      <span className="font-bold">{formData.joiningDate || 'N/A'}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content Rendering */}
          <div className="mt-4">
            {renderStepContent()}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showParentModal && (
          <DiscoveryModal 
            title="Parent" type="parent" items={sampleParents} 
            onSelect={(val) => setSelectedParent(val)} 
            onClose={() => setShowParentModal(false)} 
          />
        )}
        {showLevelModal && (
          <DiscoveryModal 
            title="Level" type="level" items={sampleLevels} 
            onSelect={(val) => setSelectedLevel(val)} 
            onClose={() => setShowLevelModal(false)} 
          />
        )}
        {showClassModal && (
          <DiscoveryModal 
            title="Class" type="class" items={sampleClasses} 
            onSelect={(val) => setSelectedClass(val)} 
            onClose={() => setShowClassModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
