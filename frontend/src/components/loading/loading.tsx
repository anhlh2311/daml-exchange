import { ArrowPathIcon } from "@heroicons/react/20/solid";
import "./loading.css"; // import file CSS riêng

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <ArrowPathIcon className="loading-icon " />
    </div>
  );
};

export default LoadingScreen;
