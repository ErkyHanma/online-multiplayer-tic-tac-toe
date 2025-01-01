import HomeForm from "../components/forms/HomeForm";
import PageLogo from "../components/PageLogo";

const Homepage = () => {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center text-center gap-12">
      <PageLogo />
      <HomeForm />
    </div>
  );
};

export default Homepage;
