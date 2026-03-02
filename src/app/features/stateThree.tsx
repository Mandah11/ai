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
    <div className="w-screen min-h-screen flex flex-col items-center">
      <div className="w-full h-14 flex items-center border-b border-gray-300 px-8">
        <div className="text-[22px] font-semibold">AI tools</div>
      </div>

      <div className="w-full max-w-[900px] flex-1 flex flex-col gap-6 py-6 px-4">
        <div className="w-full flex items-center">
          <div className="w-full max-w-[620px] rounded-lg bg-[#f4f4f5] p-1 flex items-center gap-1">
            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center whitespace-nowrap cursor-pointer"
              onClick={() => setState(1)}
            >
              Image analysis
            </div>
            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center whitespace-nowrap cursor-pointer"
              onClick={() => setState(2)}
            >
              Ingredient recognition
            </div>
            <div className="flex-1 rounded-lg bg-white text-[16px] h-9 flex justify-center items-center whitespace-nowrap">
              Image creator
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex justify-between items-start gap-3">
            <div className="flex gap-3 items-center">
              <StarIcon />
              <div className="text-[25px] font-medium">Food Image Creator</div>
            </div>
            <button
              className={`h-10 w-12 rounded-md border border-gray-300 flex justify-center items-center ${
                !imageUrl ? "bg-gray-50" : "bg-black"
              }`}
              onClick={() => {
                setTextarea("");
                setLoading(false);
                setImageUrl(null);
              }}
            >
              {!imageUrl ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>

          <div className="text-[18px]">
            What food image do you want? Describe it briefly.
          </div>

          <div className="w-full flex flex-col gap-3">
            <Textarea
              placeholder="Describe your food image"
              className="min-h-[140px]"
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
            />
            <div className="w-full flex justify-end">
              <button
                className={`h-10 text-white px-4 rounded-md ${
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

        <div className="w-full flex flex-col gap-3 pt-2">
          <div className="w-full h-11 flex gap-3 items-center">
            <ImageIcon />
            <div className="text-[25px] flex font-medium">Generated Image</div>
          </div>

          {imageUrl ? (
            <div className="w-full max-w-[480px] h-[400px] px-3 py-2 border border-gray-300 rounded-md">
              <img className="w-full h-full object-cover rounded-md" src={imageUrl} alt="Generated" />
            </div>
          ) : (
            <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
              {loading
                ? "Analyzing text, please wait..."
                : "First, enter your text to generate an image."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
