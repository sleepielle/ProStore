import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="p-5 flex-center text-gray-600">
        <span className="font-bold ">
          {currentYear} {APP_NAME}
        </span>{" "}
        | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
