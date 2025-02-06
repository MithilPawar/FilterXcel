import { useDispatch, useSelector } from "react-redux";
import { themeToggle } from "../../store/themeSlice";
import { Sun, Moon } from "lucide-react"; // Importing sun and moon icons

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      {/* Display Sun icon when theme is light, on click switch to dark */}
      <div
        onClick={() => dispatch(themeToggle())}
        className={`cursor-pointer ${theme === "dark" ? "hidden" : "block"}`}
      >
        <Sun className="text-yellow-500" />
      </div>

      {/* Display Moon icon when theme is dark, on click switch to light */}
      <div
        onClick={() => dispatch(themeToggle())}
        className={`cursor-pointer ${theme === "light" ? "hidden" : "block"}`}
      >
        <Moon className="text-gray-300" />
      </div>
    </div>
  );
};

export default ThemeToggle;
