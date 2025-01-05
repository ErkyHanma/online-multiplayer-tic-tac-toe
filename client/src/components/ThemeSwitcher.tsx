import { useTheme } from "@/context/useTheme";

const ThemeSwitcher = () => {

  const {theme, handleChangeTheme} = useTheme()
 

  return (
    <button onClick={handleChangeTheme}>
      {theme === "light" ? (
        <img src="\public\moon-02-stroke-rounded (1).svg" alt="Switch to dark mode" />
      ) : (
        <img src="\public\sun-01-stroke-rounded.svg" alt="Switch to light mode" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
