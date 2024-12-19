import HomeForm from "../components/forms/HomeForm";
import Icon from "../components/Icon";

const Homepage = () => {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center text-center gap-12">
      <Icon />
      <HomeForm />
    </div>
  );
};

export default Homepage;
