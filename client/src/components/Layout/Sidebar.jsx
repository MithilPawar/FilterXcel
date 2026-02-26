import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/sidebarSlice";
import { Link } from "react-router-dom";
import { Menu, Filter, BarChart, Settings, FileText, Table, Brush} from "lucide-react";

const iconsMap = {
  "filter": Filter,
  "bar-chart": BarChart,
  "settings": Settings,
  "summary": FileText,
  "table": Table,
  "cleaning": Brush,
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen, menuItems } = useSelector((state) => state.sidebar);
  const theme = useSelector((state) => state.theme.theme);

  const themeClasses = useMemo(() => {
    return theme === "dark"
      ? {
          sidebar: "bg-gray-800 text-white border-gray-700",
          hoverEffect: "hover:bg-gray-700",
        }
      : {
          sidebar: "bg-gray-100 text-gray-900 border-gray-300",
          hoverEffect: "hover:bg-gray-200",
        };
  }, [theme]);

  return (
    <aside
      className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? "w-64" : "w-16"
      } ${themeClasses.sidebar}`}
      aria-expanded={isSidebarOpen}
    >
      <nav className="mt-2 flex flex-col">
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle Sidebar"
          className={`flex items-center px-4 py-3 w-full text-left rounded-md transition-all duration-300 ${themeClasses.hoverEffect}`}
        >
          <Menu className="h-6 w-6 flex-shrink-0" />
          <span className={`ml-3 transition-all duration-300 ${isSidebarOpen ? "opacity-100" : "hidden"}`}>Menu</span>
        </button>

        {menuItems
          .filter((item) => item.enabled)
          .map(({ id, icon, label, feature }) => {
            const IconComponent = iconsMap[icon];

            return (
              <Link
                key={id}
                to={`/${feature}`}
                className={`flex items-center px-4 py-3 w-full text-left transition-all duration-300 rounded-md ${themeClasses.hoverEffect}`}
              >
                {IconComponent && <IconComponent className="h-6 w-6 flex-shrink-0" />}
                <span className={`ml-3 transition-all duration-300 ${isSidebarOpen ? "opacity-100" : "hidden"}`}>{label}</span>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
};

export default Sidebar;
