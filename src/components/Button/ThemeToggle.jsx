import { useDispatch, useSelector } from "react-redux";
import { themeToggle } from "../../store/themeSlice";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => dispatch(themeToggle())}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 
                        peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 
                        after:left-1 after:bg-white after:border-gray-300 after:border 
                        after:rounded-full after:h-5 after:w-5 
                        after:peer-checked:translate-x-5 dark:border-gray-600 
                        peer-checked:after:border-white">
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
