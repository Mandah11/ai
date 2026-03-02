"use client";
import { Textarea } from "@/components/ui/textarea";
import { FolderIcon } from "@/icon/folder";
import { RestartIcon } from "@/icon/restart";
import { StarIcon } from "@/icon/star";
import { WhiteIconRefresh } from "@/icon/whiterefresh";
import { useState } from "react";

type StateTwoProps = {
  setState: React.Dispatch<React.SetStateAction<number>>;
};

export const StateTwo = ({ setState }: StateTwoProps) => {
  const [textarea, setTextarea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!textarea) return;

    setLoading(true);
    setResult("");

    try {
      const data = await (
        await fetch("/api/text-generation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ textarea }),
        })
      ).json();

      setResult(data.result || "");
    } catch (err) {
      console.error(err);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  const cleanResult = (text: string) => {
    return text.replace(/^\*\s*/gm, "").replace(/\*\*/g, "");
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
            <div className="flex-1 rounded-lg text-[16px] bg-white h-9 flex justify-center items-center whitespace-nowrap">
              Ingredient recognition
            </div>
            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center whitespace-nowrap cursor-pointer"
              onClick={() => setState(3)}
            >
              Image creator
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex justify-between items-start gap-3">
            <div className="flex gap-3 items-center">
              <StarIcon />
              <div className="text-[25px] font-medium">Ingredient recognition</div>
            </div>
            <button
              className={`h-10 w-12 rounded-md border border-gray-300 ${
                result.length === 0 ? "bg-gray-50" : "bg-black"
              } flex justify-center items-center shrink-0`}
              onClick={() => {
                setTextarea("");
                setLoading(false);
                setResult("");
              }}
            >
              {result.length === 0 ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>

          <div className="text-[18px]">Describe the food, and AI will detect the ingredients.</div>

          <div className="w-full flex flex-col gap-3">
            <Textarea
              placeholder="Orts todorhoiloh"
              className="min-h-[140px]"
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
            />
            <div className="w-full flex justify-end">
              <button
                className={`h-10 text-white px-4 rounded-md ${
                  !textarea || loading ? "bg-[#8f8f92]" : "bg-black"
                }`}
                onClick={handleGenerate}
                disabled={Boolean(result) || loading}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 pt-2">
          <div className="w-full h-11 flex gap-3 items-center">
            <FolderIcon />
            <div className="text-[25px] flex font-medium">Identified Ingredients</div>
          </div>

          {result.length > 0 ? (
            <div className="max-h-64 min-h-10 overflow-auto px-3 py-2 border border-gray-300 rounded-md flex flex-col gap-2">
              {cleanResult(result)}
            </div>
          ) : (
            <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
              {loading
                ? "Analyzing text, please wait..."
                : " First, enter your text to recognize an ingredients."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
