import OnlinePageForm from "@/components/forms/OnlinePageForm";
import Icon from "@/components/Icon";


const OnlinePage = () => {
  return (
    <div className="flex gap-8 flex-col h-screen w-full items-center justify-center">
      <Icon />
      <OnlinePageForm />
    </div>
  );
};

export default OnlinePage;
