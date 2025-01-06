import { useTheme } from "@/context/useTheme";
import HomeForm from "../components/forms/HomeForm";
import Logo from "../components/Logo";

const Homepage = () => {
  useTheme();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-12 text-center">
      <Logo />
      <HomeForm />
    </div>
  );
};

export default Homepage;
