import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Bus, 
  MapPin, 
  Edit, 
  Trash2, 
  Search, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Link as LinkIcon,
  ArrowLeft,
  Save,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Grid,
  List,
  Layout as LayoutIcon,
  Settings,
  Users,
  BarChart2
} from 'lucide-react';
import { 
  ModalShell, 
  ModalBackdrop, 
  FieldRow, 
  TextInput, 
  SelectInput, 
  BtnGhost, 
  BtnPrimary 
} from './shared';

// ==================== MOCK DATA ====================

const MOCK_STAFF = [
  { id: 1, name: 'Jean Pierre Habimana', role: 'Driver' },
  { id: 2, name: 'Samuel Bizimana', role: 'Driver' },
  { id: 3, name: 'Marie Claire Uwase', role: 'Conductor' },
  { id: 4, name: 'Diane Umutoni', role: 'Conductor' },
  { id: 5, name: 'Robert Ntaganda', role: 'Driver' },
  { id: 6, name: 'Alice Mukana', role: 'Conductor' },
];

const INITIAL_BUSES = [
  { id: 1, name: 'Bus Alpha', plateNumber: 'RAA 123 A', capacity: 30, driverId: 1, conductorId: 3, status: 'active' },
  { id: 2, name: 'Bus Beta', plateNumber: 'RAB 456 B', capacity: 25, driverId: 2, conductorId: 4, status: 'active' },
  { id: 3, name: 'Bus Gamma', plateNumber: 'RAC 789 C', capacity: 45, driverId: 5, conductorId: 6, status: 'maintenance' },
];

const INITIAL_ROUTES = [
  { id: 1, name: 'Route 101 - Nyabugogo Express' },
  { id: 2, name: 'Route 102 - Kimironko Loop' },
  { id: 3, name: 'Route 103 - Kicukiro - Gikondo' },
  { id: 4, name: 'Route 104 - Remera - Kanombe' },
];

// ==================== MAIN COMPONENT ====================

export default function SetupTransport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Buses');
  
  // States for Buses
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [showBusModal, setShowBusModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [busSearchQuery, setBusSearchQuery] = useState('');
  const [busForm, setBusForm] = useState({
    name: '', plateNumber: '', capacity: '', driverId: '', conductorId: '', status: 'active'
  });
  const [showBusSettings, setShowBusSettings] = useState(false);

  // States for Assignments
  const [assignments, setAssignments] = useState([
    { id: 1, routeId: 1, busId: 1 },
    { id: 2, routeId: 1, busId: 2 },
    { id: 3, routeId: 2, busId: 3 },
  ]);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBusesInModal, setSelectedBusesInModal] = useState([]);

  // Route modal state
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showAssignmentSettings, setShowAssignmentSettings] = useState(false);
  const [routeForm, setRouteForm] = useState({ name: '' });

  const handleSaveRoute = () => {
    if (!routeForm.name.trim()) return;
    const newRoute = { id: Date.now(), name: routeForm.name.trim() };
    setRoutes([...routes, newRoute]);
    setRouteForm({ name: '' });
    setShowRouteModal(false);
  };

  const tabs = [
    { id: 'Buses', label: 'Buses & Fleet', icon: Bus },
    { id: 'Assignments', label: 'Route Assignments', icon: LinkIcon }
  ];

  // ==================== BUS LOGIC ====================

  const openBusModal = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setBusForm({
        name: bus.name,
        plateNumber: bus.plateNumber,
        capacity: bus.capacity.toString(),
        driverId: bus.driverId.toString(),
        conductorId: bus.conductorId.toString(),
        status: bus.status
      });
    } else {
      setEditingBus(null);
      setBusForm({ name: '', plateNumber: '', capacity: '', driverId: '', conductorId: '', status: 'active' });
    }
    setShowBusModal(true);
  };

  const handleSaveBus = () => {
    if (!busForm.name || !busForm.plateNumber || !busForm.capacity) return alert('Fill required fields');
    const busData = {
      ...busForm,
      id: editingBus ? editingBus.id : Date.now(),
      capacity: parseInt(busForm.capacity),
      driverId: parseInt(busForm.driverId),
      conductorId: parseInt(busForm.conductorId),
    };
    if (editingBus) setBuses(buses.map(b => b.id === editingBus.id ? busData : b));
    else setBuses([...buses, busData]);
    setShowBusModal(false);
  };

  const filteredBuses = buses.filter(b => 
    b.name.toLowerCase().includes(busSearchQuery.toLowerCase()) ||
    b.plateNumber.toLowerCase().includes(busSearchQuery.toLowerCase())
  );

  // ==================== ASSIGNMENT LOGIC ====================

  const openAssignModal = (route) => {
    setSelectedRoute(route);
    setSelectedBusesInModal(assignments.filter(a => a.routeId === route.id).map(a => a.busId));
    setShowAssignModal(true);
  };

  const handleSaveAssignments = () => {
    const otherAssignments = assignments.filter(a => a.routeId !== selectedRoute.id);
    const newAssignments = selectedBusesInModal.map(busId => ({
      id: Date.now() + Math.random(), routeId: selectedRoute.id, busId: busId
    }));
    setAssignments([...otherAssignments, ...newAssignments]);
    setShowAssignModal(false);
  };

  // ==================== RENDERING ====================

  const renderBusesView = () => (
    <div className="space-y-0 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-5 py-2 border border-slate-200 border-b-0 rounded-t-lg bg-white">
        {/* Left: Add Bus + Title */}
        <div className="flex items-center gap-3">
          <button onClick={() => openBusModal()} className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition no-underline flex items-center gap-1.5">
            <Plus size={14} /> Add Bus
          </button>
          <div className="flex items-center gap-2 relative">
            <h1 className="text-base font-semibold text-slate-800">Buses</h1>
            <Settings 
              className={`w-4 h-4 cursor-pointer transition-colors ${showBusSettings ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`} 
              onClick={() => setShowBusSettings(!showBusSettings)} 
            />
            
            <AnimatePresence>
                {showBusSettings && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowBusSettings(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30 overflow-hidden"
                      style={{ top: '100%' }}
                    >
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <Users size={14} className="text-slate-400" />
                        Import Buses
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <BarChart2 size={14} className="text-slate-400" />
                        Export to Excel
                      </button>
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <BarChart2 size={14} className="text-slate-400" />
                        Export to PDF
                      </button>
                    </motion.div>
                  </>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Search + Pagination + View Options */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden focus-within:border-primary/60">
            <div className="flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search fleet..."
                value={busSearchQuery}
                onChange={(e) => setBusSearchQuery(e.target.value)}
                className="w-52 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="px-2 py-2 border-l border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>1-{filteredBuses.length} / {buses.length}</span>
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
          </div>

          {/* View Switch */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm">
            <button className="p-2 hover:bg-slate-50 text-slate-400"><Grid size={16} /></button>
            <button className="p-2 bg-slate-50 text-primary border-x border-slate-300"><List size={16} /></button>
            <button className="p-2 hover:bg-slate-50 text-slate-400"><LayoutIcon size={16} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white sticky top-0 z-10">
              <th className="px-4 py-2 w-10 border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Bus Name</th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Plate Number</th>
              <th className="px-6 py-2 border-r border-slate-100 uppercase tracking-wider text-center">Capacity</th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {filteredBuses.map((bus, index) => (
              <tr key={bus.id} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${index % 2 !== 0 ? 'bg-slate-200' : 'bg-white'}`}>
                <td className="px-4 py-1.5 w-10 border-r border-slate-100/50"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></td>
                <td className="px-4 py-1.5 border-r border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shadow-sm border border-primary/20">
                      <Bus size={12} />
                    </div>
                    <span className="font-medium text-slate-700">{bus.name}</span>
                  </div>
                </td>
                <td className="px-4 py-1.5 text-slate-600 font-medium border-r border-slate-100/50">{bus.plateNumber}</td>
                <td className="px-6 py-1.5 text-slate-600 font-bold text-center border-r border-slate-100/50">{bus.capacity}</td>
                <td className="px-4 py-1.5 border-r border-slate-100/50">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    bus.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {bus.status}
                  </span>
                </td>
                <td className="px-4 py-1.5 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openBusModal(bus)} className="p-1 text-slate-400 hover:text-primary transition-all"><Edit size={14} /></button>
                    <button onClick={() => setBuses(buses.filter(b => b.id !== bus.id))} className="p-1 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssignmentsView = () => (
    <div className="flex gap-0 h-[600px] animate-in fade-in duration-500">
      <div className="w-80 bg-white rounded-l-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden border-r-0">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Available Routes</span>
          <button
            onClick={() => { setRouteForm({ name: '' }); setShowRouteModal(true); }}
            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded transition-all"
          >
            <Plus size={12} /> Add Route
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {routes.map(route => {
            const count = assignments.filter(a => a.routeId === route.id).length;
            return (
              <button 
                key={route.id} onClick={() => setSelectedRoute(route)}
                className={`w-full text-left p-4 rounded-lg transition-all flex items-center justify-between group ${selectedRoute?.id === route.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} className={selectedRoute?.id === route.id ? 'text-white' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-bold">{route.name}</div>
                    <div className={`text-[10px] ${selectedRoute?.id === route.id ? 'text-white/70' : 'text-slate-400'}`}>{count} Buses linked</div>
                  </div>
                </div>
                <ChevronRight size={14} className={selectedRoute?.id === route.id ? 'text-white' : 'text-slate-300'} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedRoute ? (
          <div className="flex-1 bg-white rounded-r-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3 relative">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedRoute.name}</h3>
                    <Settings 
                      className={`w-4 h-4 cursor-pointer transition-colors ${showAssignmentSettings ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`} 
                      onClick={() => setShowAssignmentSettings(!showAssignmentSettings)} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Fleet Assignment</p>
                </div>

                <AnimatePresence>
                  {showAssignmentSettings && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowAssignmentSettings(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30 overflow-hidden"
                        style={{ top: '100%' }}
                      >
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <Users size={14} className="text-slate-400" />
                          Import Assignments
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <BarChart2 size={14} className="text-slate-400" />
                          Export Assignments (Excel)
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <BarChart2 size={14} className="text-slate-400" />
                          Export to PDF
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => openAssignModal(selectedRoute)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2">
                <LinkIcon size={14} /> Link Buses
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-white border-t border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white sticky top-0 z-10">
                    <th className="px-4 py-2 w-10 border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></th>
                    <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Linked Bus</th>
                    <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Plate</th>
                    <th className="px-4 py-2 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {assignments.filter(a => a.routeId === selectedRoute.id).map((a, index) => {
                    const bus = buses.find(b => b.id === a.busId);
                    return (
                      <tr key={a.id} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${index % 2 !== 0 ? 'bg-slate-200' : 'bg-white'}`}>
                        <td className="px-4 py-1.5 w-10 border-r border-slate-100/50"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></td>
                        <td className="px-4 py-1.5 border-r border-slate-100/50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                              <Bus size={12} />
                            </div>
                            <span className="font-medium text-slate-700">{bus?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-1.5 text-slate-500 font-mono border-r border-slate-100/50">{bus?.plateNumber}</td>
                        <td className="px-4 py-1.5 text-right">
                          <button onClick={() => setAssignments(assignments.filter(as => as.id !== a.id))} className="p-1 text-slate-300 hover:text-red-500 transition-all group-hover:opacity-100"><X size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {assignments.filter(a => a.routeId === selectedRoute.id).length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-slate-300">
                        <LinkIcon size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-bold opacity-40">No buses assigned to this route</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-r-xl shadow  border-1  border-slate-100 text-slate-300">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <MapPin size={40} className="opacity-10" />
            </div>
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-tight">Select a Route</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Choose a route from the sidebar to manage its fleet</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Top Action Bar - Matches Foundation */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">Transport & Fleet Setup</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-6 w-[1px] bg-slate-200" />
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Save size={14} /> Save & Exit
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="p-8">
          {/* Header Section - Matches Foundation */}
          <div className="flex items-start gap-8 mb-10">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                  <Bus className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Transport</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Green Hills Academy</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Bus className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Active Fleet:</span>
                      <span className="font-bold">{buses.filter(b => b.status === 'active').length} Buses</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Total Routes:</span>
                      <span className="font-bold">{routes.length}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Safety Checks:</span>
                      <span className="font-bold text-emerald-600">All Passed</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">System Status:</span>
                      <span className="font-bold text-primary">Live</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Matches Foundation Styling */}
          <div className="flex border-b border-slate-200 mb-8">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 text-sm transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-[500px]">
            {activeTab === 'Buses' ? renderBusesView() : renderAssignmentsView()}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showBusModal && (
          <ModalBackdrop onClose={() => setShowBusModal(false)}>
            <ModalShell 
              title={editingBus ? "Edit Bus" : "Add New Bus"} subtitle="Transport Fleet Management" onClose={() => setShowBusModal(false)}
              footer={<><BtnGhost onClick={() => setShowBusModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={handleSaveBus}>Save Bus</BtnPrimary></>}
            >
              <div className="space-y-5">
                <FieldRow label="Name" required><TextInput value={busForm.name} onChange={e => setBusForm({...busForm, name: e.target.value})} placeholder="e.g. Bus Alpha" /></FieldRow>
                <FieldRow label="Plate" required><TextInput value={busForm.plateNumber} onChange={e => setBusForm({...busForm, plateNumber: e.target.value})} placeholder="e.g. RAA 123 A" /></FieldRow>
                <FieldRow label="Capacity" required><TextInput type="number" value={busForm.capacity} onChange={e => setBusForm({...busForm, capacity: e.target.value})} placeholder="Seats" /></FieldRow>
                <FieldRow label="Driver">
                  <SelectInput value={busForm.driverId} onChange={e => setBusForm({...busForm, driverId: e.target.value})}>
                    <option value="">Select Driver...</option>
                    {MOCK_STAFF.filter(s => s.role === 'Driver').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </SelectInput>
                </FieldRow>
                <FieldRow label="Status">
                  <SelectInput value={busForm.status} onChange={e => setBusForm({...busForm, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                  </SelectInput>
                </FieldRow>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}

        {showAssignModal && (
          <ModalBackdrop onClose={() => setShowAssignModal(false)}>
            <ModalShell 
              title="Assign Fleet" subtitle={selectedRoute?.name} onClose={() => setShowAssignModal(false)}
              footer={<><BtnGhost onClick={() => setShowAssignModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={handleSaveAssignments}>Save Assignment</BtnPrimary></>}
            >
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 mb-4">
                  <Info size={16} className="text-blue-500 mt-0.5" />
                  <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">Select the buses that will operate on this route. You can assign multiple buses to a single route for higher capacity.</p>
                </div>
                <div className="space-y-2 max-h-[350px] overflow-auto pr-2">
                  {buses.map(bus => {
                    const isSelected = selectedBusesInModal.includes(bus.id);
                    return (
                      <div 
                        key={bus.id} onClick={() => setSelectedBusesInModal(isSelected ? selectedBusesInModal.filter(id => id !== bus.id) : [...selectedBusesInModal, bus.id])}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                            <Bus size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-700">{bus.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono uppercase">{bus.plateNumber}</div>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}>
                          {isSelected && <Plus size={12} className="text-white rotate-45" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}

        {showRouteModal && (
          <ModalBackdrop onClose={() => setShowRouteModal(false)}>
            <ModalShell
              title="Add New Route" subtitle="Route Assignments" onClose={() => setShowRouteModal(false)}
              footer={<><BtnGhost onClick={() => setShowRouteModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={handleSaveRoute}>Save Route</BtnPrimary></>}
            >
              <div className="space-y-4">
                <FieldRow label="Route Name" required>
                  <TextInput
                    value={routeForm.name}
                    onChange={e => setRouteForm({ name: e.target.value })}
                    placeholder="e.g. Route 105 - Kiyovu Express"
                    onKeyDown={e => e.key === 'Enter' && handleSaveRoute()}
                  />
                </FieldRow>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}
