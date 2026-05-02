import React from 'react';
import { Link } from 'react-router-dom';

const AppTile = ({ iconUrl, label, path = '#' ,width}) => (
  <Link to={path} className="group flex flex-col items-center gap-2 cursor-pointer w-28 no-underline">
    <div className="w-16 h-16 rounded-lg bg-gray-200/70 flex items-center justify-center shadow-sm  transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/10 group-hover:-translate-y-1.5 group-hover:border-accent/20">
      <img src={iconUrl} alt={label} className={`w-${width|| 10} h-${width|| 10} object-contain transition-transform duration-300 group-hover:scale-110`} />
    </div>
    <span className="text-primary  text-sm text-center   transition-colors duration-200 text-nowrap">
      {label}
    </span>
  </Link>
);

export default function Home() {
  const apps = [
    { width: 12,iconUrl: '/icons/dashboards.png',                               label: 'Dashboards' },
    { width: 12,iconUrl: '/icons/students.png',                                                                 label: 'Students',      path: '/students' },
    { width: 12.5,iconUrl: '/icons/staff.png',                                                                    label: 'Staff',         path: '/staff' },
    { width: 12,iconUrl: '/icons/attendance.png',                                                               label: 'Attendance',    path: '/attendance/students' },
    { width: 12,iconUrl: '/icons/timetable.png',                                    label: 'Timetable',     path: '/academic/timetable' },
    { width: 13,iconUrl: '/icons/fees.png',                                                                     label: 'Fees' },
    { width: 12.5,iconUrl: '/icons/payroll.png', label: 'Payroll', path: '/payroll' },
    { width: 12.5,iconUrl: '/icons/parents.png',                                                                  label: 'Parents',       path: '/students/parents' },
    { width: 12,iconUrl: '/icons/assessment.png',                                                               label: 'Babyeyi' },
    { width: 12.5,iconUrl: '/icons/displine.png',                                                                 label: 'Discipline' },
    { width: 12.5,iconUrl: '/icons/shuleavance.png',                                              label: 'ShuleAdvance' },
    { width: 12.5,iconUrl: '/icons/icard.png',                                              label: 'iCard' },
  ];

  return (
    <div className="flex flex-col justify-between overflow-y-auto">
      <div className="py-20 pb-15 flex justify-center flex-grow">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-5 gap-y-12 max-w-6xl px-6 h-fit">
          {apps.map((app, index) => (
            <AppTile key={index} {...app} />
          ))}
        </div>
      </div>
      
      <footer className="w-full py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-primary/40 text-[10px] uppercase tracking-[0.2em] font-bold">Managed by</span>
              <span className="text-primary font-black tracking-tighter text-lg flex items-center">
                EDU<span className="text-accent">POTO</span>
              </span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/20"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-primary/60 text-[11px] font-medium tracking-wide uppercase">
              Elevating Education through Technology
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1 h-1 rounded-full bg-accent/40"></span>
              <p className="text-primary/30 text-[9px] font-medium tracking-widest uppercase">
                © {new Date().getFullYear()} Edupoto Global. All rights reserved.
              </p>
              <span className="w-1 h-1 rounded-full bg-accent/40"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
