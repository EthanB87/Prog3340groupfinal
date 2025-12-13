import { Search, Bell, HelpCircle, LogOut } from "lucide-react";
import { UserSummary } from "../api/users";

// Define the shape of the user data coming from your API
// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
// }

interface HeaderProps {
  onLogout: () => void;
  user: UserSummary | null;
}

export function Header({ onLogout, user }: HeaderProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.username || "Guest";
  const displayRole = user?.role || "User";
  const initials = getInitials(displayName);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, projects, or people..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-6">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar Section */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-[#0052cc] text-white rounded-full flex items-center justify-center font-bold text-xs tracking-wider">
              {initials}
            </div>
            <div className="hidden md:block">
              <div className="text-gray-900 font-medium text-sm">
                {displayName}
              </div>
              <div className="text-gray-500 text-xs capitalize">
                {displayRole}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
