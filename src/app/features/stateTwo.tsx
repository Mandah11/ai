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

  // AI response-ийг цэвэрлээд array болгоно
  const cleanResult = (text: string) => {
    return text
      .replace(/\*\*/g, "")
      .split("\n")
      .map((line) => line.replace(/^\*\s*/, "").trim())
      .filter((line) => line.length > 0);
  };

  const ingredients = cleanResult(result);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center">
      <div className="w-full h-14 flex items-center border-b border-gray-300 px-8">
        <div className="text-[22px] font-semibold">AI tools</div>
      </div>

      <div className="w-full max-w-[900px] flex-1 flex flex-col gap-6 py-6 px-4">
        {/* Tabs */}
        <div className="w-full flex items-center">
          <div className="w-full max-w-[620px] rounded-lg bg-[#f4f4f5] p-1 flex items-center gap-1">
            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center cursor-pointer"
              onClick={() => setState(1)}
            >
              Image analysis
            </div>

            <div className="flex-1 rounded-lg text-[16px] bg-white h-9 flex justify-center items-center">
              Ingredient recognition
            </div>

            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center cursor-pointer"
              onClick={() => setState(3)}
            >
              Image creator
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <StarIcon />
              <div className="text-[25px] font-medium">
                Ingredient recognition
              </div>
            </div>

            <button
              className={`h-10 w-12 rounded-md border border-gray-300 ${
                result.length === 0 ? "bg-gray-50" : "bg-black"
              } flex justify-center items-center`}
              onClick={() => {
                setTextarea("");
                setResult("");
                setLoading(false);
              }}
            >
              {result.length === 0 ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>

          <div className="text-[18px]">
            Describe the food, and AI will detect the ingredients.
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Orts todorhoiloh"
              className="min-h-[140px]"
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
            />

            <div className="flex justify-end">
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

        {/* Result */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex gap-3 items-center h-11">
            <FolderIcon />
            <div className="text-[25px] font-medium">
              Identified Ingredients
            </div>
          </div>

          {result.length > 0 ? (
            <div className="max-h-64 overflow-auto px-4 py-3 border border-gray-300 rounded-md flex flex-col gap-2">
              {ingredients.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="w-2 h-2 bg-black rounded-full mt-[8px] shrink-0"></div>
                  <div className="text-[16px]">{item}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
              {loading
                ? "Analyzing text, please wait..."
                : "First, enter your text to recognize ingredients."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
