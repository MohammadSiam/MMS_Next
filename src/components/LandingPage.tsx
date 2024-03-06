import Image from "next/image";
import Meeting from "../images/meeting.png";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Book Your Meeting Room
          </h2>
          <Image
            src={Meeting}
            alt="Meeting"
            className="mx-auto rounded-lg"
            layout="responsive"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
