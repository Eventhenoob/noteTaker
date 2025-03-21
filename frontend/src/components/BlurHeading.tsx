import { useEffect, useRef, useState } from "react";

const text1 = ["write", "capture", "organize", "create"];
const text2 = ["shape", "refine", "expand", "elevate"];
const BlurHeading = () => {
  const [currentText1, setCurrentText1] = useState(0);
  const [currentText2, setCurrentText2] = useState(0);

  const spanRef1 = useRef<HTMLSpanElement>(null);
  const spanRef2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (spanRef1.current && spanRef2.current) {
        spanRef1.current.classList.add("blur");
        spanRef2.current.classList.add("blur");
      }
      setTimeout(() => {
        setCurrentText1(Math.floor(Math.random() * 4));
        setCurrentText2(Math.floor(Math.random() * 4));
      }, 400);

      setTimeout(() => {
        if (spanRef1.current && spanRef2.current) {
          spanRef1.current.classList.remove("blur");
          spanRef2.current.classList.remove("blur");
        }
      }, 800);
    }, 6 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <h2 className="text-white font-boldonse text-center text-2xl mt-10 capitalize ">
      We can{" "}
      <span
        ref={spanRef1}
        className=" text-blue-600 transition-all duration-300 "
      >
        {text1[currentText1]}
      </span>{" "}
      notes, We can{" "}
      <span
        ref={spanRef2}
        className="text-pink-600 transition-all duration-300 "
      >
        {text2[currentText2]}
      </span>{" "}
      ideas!.
    </h2>
  );
};

export default BlurHeading;
