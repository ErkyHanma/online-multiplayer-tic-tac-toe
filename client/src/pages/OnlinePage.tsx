import OnlinePageForm from "@/components/forms/OnlinePageForm";
import PageLogo from "@/components/PageLogo";

const OnlinePage = () => {
  return (
    <div className="flex gap-8 flex-col h-screen w-full items-center justify-center">
      <PageLogo />
      <OnlinePageForm />
    </div>
  );
};

export default OnlinePage;
