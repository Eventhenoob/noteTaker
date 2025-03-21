import Spline from "@splinetool/react-spline";
import BlurHeading from "../components/BlurHeading";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

const Home = () => {
  return (
    <div className="w-screen relative overflow-hidden h-screen bg-black ">
      <Link
        to={"/"}
        className="font-winky flex gap-1 justify-center items-center hover:text-white !hover:opacity-100 float text-xl animate-pulse  cursor-pointer capitalize underline absolute text-slate-200 top-3/5 left-1/6"
      >
        <CiLogin />
        Enter the Workspace
      </Link>
      <Link
        to="/"
        className="font-winky capitalize flex gap-1 justify-center items-center hover:text-white hover:opacity-100 float text-xl cursor-pointer underline absolute text-slate-200 top-3/5 right-1/6"
      >
        <CiLogin />
        Create new Account
      </Link>
      <div className="absolute w-full">
        <BlurHeading />
      </div>
      <Spline scene="https://prod.spline.design/QmrKJz1EzeA0YpGX/scene.splinecode" />
    </div>
  );
};

export default Home;
