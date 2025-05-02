import OnlinePageForm from "@/components/forms/OnlinePageForm";
import Logo from "@/components/Logo";
import ReturnHome from "@/components/ReturnHome";

const OnlinePage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <ReturnHome route="/" roomCode="" />
      <Logo />
      <OnlinePageForm />
    </div>
  );
};

export default OnlinePage;
