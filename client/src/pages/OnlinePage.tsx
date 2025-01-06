import OnlinePageForm from "@/components/forms/OnlinePageForm";
import Logo from "@/components/Logo";

const OnlinePage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <Logo />
      <OnlinePageForm />
    </div>
  );
};

export default OnlinePage;
