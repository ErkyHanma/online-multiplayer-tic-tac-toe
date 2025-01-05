import { useTheme } from "@/context/useTheme";
import HomeForm from "../components/forms/HomeForm";
import PageLogo from "../components/PageLogo";

const Homepage = () => {
  useTheme();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-12 text-center">
      <PageLogo />
      <HomeForm />
    </div>
  );
};

export default Homepage;
