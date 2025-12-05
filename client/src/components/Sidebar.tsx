import { LayoutDashboard, KanbanSquare, Settings, Users } from 'lucide-react';
import { Screen } from '../App';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'kanban' as Screen, label: 'Board', icon: KanbanSquare },
    { id: 'admin' as Screen, label: 'Admin', icon: LayoutDashboard },
  ];

  return (
    <div className="w-64 bg-[#0052cc] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 border-3 border-[#0052cc] border-t-transparent rounded"></div>
          </div>
          <span className="text-white">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#0747a6] text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mt-8">
          <div className="px-4 py-2 text-blue-200">Teams</div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors">
              <Users className="w-5 h-5" />
              <span>Engineering</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors">
              <Users className="w-5 h-5" />
              <span>Design</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors">
              <Users className="w-5 h-5" />
              <span>Marketing</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-blue-600">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
