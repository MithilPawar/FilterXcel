import { useDispatch, useSelector } from "react-redux";
import { themeToggle } from "../../redux/slices/themeSlice";
import { Sun, Moon } from "lucide-react"; 

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(themeToggle())}
      className="cursor-pointer transition-transform duration-300 hover:scale-110"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-300" />}
    </button>
  );
};

export default ThemeToggle;
