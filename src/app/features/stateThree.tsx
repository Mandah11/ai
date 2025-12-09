"use client";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "@/icon/image";
import { RestartIcon } from "@/icon/restart";
import { StarIcon } from "@/icon/star";
import { WhiteIconRefresh } from "@/icon/whiterefresh";
import { useState } from "react";

type StateThreeProps = {
  setState: React.Dispatch<React.SetStateAction<number>>;
};
export const StateThree = ({ setState }: StateThreeProps) => {
  const [textarea, setTextarea] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!textarea.trim()) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const data = await (
        await fetch("/api/text-to-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ textarea }),
        })
      ).json();

      if (data.error) {
        console.error(data.error);
      } else if (data.image) {
        setImageUrl(data.image);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center ">
      <div className="h-[6%] w-full flex items-center border-b border-gray-300">
        <div className="w-[9%] h-[50%]  text-[22px] font-semibold flex justify-center items-center">
          AI tools
        </div>
      </div>
      <div className="w-[40%] h-full  ">
        <div className="w-full h-[9%]  flex items-center">
          <div className="w-[60%] rounded-lg bg-[#f4f4f5] flex h-[42%] items-center justify-around">
            <div
              className="w-[26%] rounded-lg text-[#71717A] text-[16px] h-[70%] flex justify-center items-center"
              onClick={() => {
                setState(1);
              }}
            >
              Image analysis
            </div>
            <div
              className="w-[40%] rounded-lg text-[#71717A] text-[16px] h-[70%] flex justify-center items-center"
              onClick={() => setState(2)}
            >
              Ingredient recognition
            </div>
            <div className="w-[26%] rounded-lg bg-white text-[16px] h-[70%] flex justify-center items-center">
              Image creator
            </div>
          </div>
        </div>
        <div className="w-[95%] h-[30%] ">
          <div className=" flex  h-[14%] w-full justify-between ">
            <div className="h-full flex gap-3">
              <div className="h-[78%] flex items-center">
                <StarIcon />
              </div>
              <div className="text-[25px] font-medium ">Food Image Creator</div>
            </div>
            <button
              className={`h-full w-[7%] rounded-md border border-gray-300 flex justify-center ${
                !imageUrl ? "bg-gray-50" : "bg-black "
              }  items-center`}
              onClick={() => {
                setTextarea("");
                setLoading(false);
                setImageUrl(null);
              }}
            >
              {!imageUrl ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>
          <div className="h-[20%] flex items-center text-[18px] ">
            What food image do you want? Describe it briefly.
          </div>
          <div className="h-[61%] flex w-full flex-col justify-between =">
            <div className=" h-[70%]">
              <Textarea
                placeholder="Хоолны тайлбар"
                className="h-full"
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
              />
            </div>
            <div className="w-full h-[21%] flex justify-end">
              <button
                className={`h-full text-white  w-[13%] rounded-md ${
                  !textarea || imageUrl || loading ? "bg-[#8f8f92]" : "bg-black"
                }`}
                onClick={handleGenerate}
                disabled={loading || Boolean(imageUrl)}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-19 max-h-fit w-[95%] mt-3 flex justify-around flex-col ">
          <div className="w-full h-11 flex gap-3 items-center mb-3">
            <div className="h-[75%] flex items-center">
              <ImageIcon />
            </div>
            <div className="text-[25px] flex font-medium ">
              Identified Ingredients
            </div>
          </div>
          {imageUrl ? (
            <div className="h-100 w-120 px-3 py-2 border border-gray-300 rounded-md">
              <img className="w-full h-full" src={imageUrl} alt="Generated" />
            </div>
          ) : (
            <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
              {loading
                ? "Analyzing text, please wait..."
                : "  First, enter your text to generate an image."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
