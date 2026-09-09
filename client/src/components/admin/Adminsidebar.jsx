import React from 'react';
import { assets } from '../../assets/assets';
import { LayoutDashboardIcon, PlusSquareIcon, ShoppingBag, Store, ArrowLeft } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Adminsidebar = () => {
  const { user } = useAuth();

  const adminNavlinks = [
    { name: 'My Cart', path: '/admin', Icon: LayoutDashboardIcon, end: true },
    { name: 'Orders Trace', path: '/admin/orders', Icon: ShoppingBag },
    { name: 'Client Sell Requests', path: '/admin/sell-requests', Icon: Store },
    { name: 'Add Product', path: '/admin/add-product', Icon: PlusSquareIcon },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col justify-between items-center pt-8 pb-6 max-w-16 md:max-w-64 w-full border-r border-white/10 text-sm bg-black/20">
      <div className="w-full flex flex-col items-center">
        {user?.image ? (
          <img
            className="h-10 md:h-14 w-10 md:w-14 rounded-full object-cover border border-[#CEC382]/40 mx-auto"
            src={user.image}
            alt="Admin"
          />
        ) : (
          <div className="h-10 md:h-14 w-10 md:w-14 rounded-full bg-[#CEC382] text-black font-bold flex items-center justify-center text-base md:text-lg mx-auto">
            {user?.name?.[0] || 'A'}
          </div>
        )}

        <p className="mt-2.5 text-sm font-semibold text-white max-md:hidden">
          {user?.name || 'Administrator'}
        </p>
        <span className="text-[11px] text-[#CEC382] font-mono tracking-wider max-md:hidden">
          {user?.role?.toUpperCase() || 'ADMIN'}
        </span>

        <div className="w-full mt-6 flex flex-col gap-1">
          {adminNavlinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-3 w-full py-3 px-4 md:px-6 transition ${
                  isActive
                    ? 'bg-[#CEC382]/15 text-[#CEC382] font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.Icon className="w-5 h-5 shrink-0" />
                  <p className="max-md:hidden">{link.name}</p>
                  {isActive && (
                    <span className="w-1 h-8 rounded-l right-0 absolute bg-[#CEC382]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full px-3 md:px-4">
        <Link
          to="/"
          className="flex items-center max-md:justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-white/10 hover:border-[#CEC382] text-gray-400 hover:text-white text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="max-md:hidden">Exit Admin</span>
        </Link>
      </div>
    </div>
  );
};

export default Adminsidebar;
