import { useTheme } from "@/context/useTheme";
import HomeForm from "../components/forms/HomeForm";
import Logo from "../components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Homepage = () => {
  useTheme();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-12 text-center">
      <div className="absolute top-5 right-8">
        <ThemeSwitcher />
      </div>
      <Logo />
      <HomeForm />
    </div>
  );
};

export default Homepage;
