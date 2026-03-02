"use client";
import { DeleteIcon } from "@/icon/delete";
import { FolderIcon } from "@/icon/folder";
import { RestartIcon } from "@/icon/restart";
import { StarIcon } from "@/icon/star";
import { WhiteIconRefresh } from "@/icon/whiterefresh";
import { Label } from "@radix-ui/react-label";
import { ChangeEvent, useState } from "react";

type StateOneProps = {
  setState: React.Dispatch<React.SetStateAction<number>>;
};

type DetectedObject = {
  label: string;
  score: number;
};

export const StateOne = ({ setState }: StateOneProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectedObject[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    setResult([]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await fetch("/api/object-detection", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.objects ?? []);
    } catch (err) {
      console.error(err);
      setResult([]);
    } finally {
      setIsGenerating(false);
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
            <div className="flex-1 rounded-lg bg-white text-[16px] h-9 flex justify-center items-center whitespace-nowrap">
              Image analysis
            </div>
            <div
              className="flex-1 rounded-lg text-[#71717A] text-[16px] h-9 flex justify-center items-center whitespace-nowrap cursor-pointer"
              onClick={() => setState(2)}
            >
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
              <div className="text-[25px] font-medium">Image analysis</div>
            </div>

            <button
              className={`h-10 w-12 rounded-md border border-gray-300 flex justify-center items-center ${
                result.length === 0 ? "bg-gray-50" : "bg-black text-white"
              }`}
              onClick={() => {
                setSelectedFile(null);
                setIsGenerating(false);
                setResult([]);
              }}
            >
              {result.length === 0 ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>

          <div className="text-[18px]">
            Upload a food photo, and AI will detect the ingredients.
          </div>

          <div className="w-full flex flex-col gap-3">
            {selectedFile ? (
              <div className="relative w-80 h-50 flex justify-center items-center rounded-lg border">
                <button
                  className="h-8 w-8 bg-white absolute top-3 right-3 flex justify-center items-center rounded-md"
                  onClick={() => setSelectedFile(null)}
                >
                  <DeleteIcon />
                </button>
                <img
                  className="w-[96%] h-[94%] object-cover rounded-lg"
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                />
              </div>
            ) : (
              <div className="w-full max-w-[360px]">
                <Label htmlFor="file-input">
                  <div className="border border-gray-200 rounded-md h-10 flex items-center cursor-pointer">
                    <p className="text-[18px] ml-1">
                      <strong className="px-3">Choose File</strong>
                      JPG, PNG
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      id="file-input"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </Label>
              </div>
            )}

            <div className="w-full flex justify-end">
              <button
                className={`h-10 text-white px-4 rounded-md ${
                  !selectedFile || isGenerating ? "bg-[#8f8f92]" : "bg-black"
                }`}
                disabled={!selectedFile || isGenerating}
                onClick={handleGenerate}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 pt-2">
          <div className="w-full h-11 flex gap-3 items-center">
            <FolderIcon />
            <div className="text-[25px] flex font-medium">Here is the summary</div>
          </div>

          {result.length > 0 ? (
            <div className="border border-gray-300 rounded-md">
              {result.map((obj, index) => (
                <div
                  key={index}
                  className="text-[18px] px-3 text-gray-500 h-10 rounded-md flex items-center gap-2.5"
                >
                  <strong>{index + 1}.</strong>
                  {obj.label} - {(obj.score * 100).toFixed(2)}%
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
              {isGenerating
                ? "Analyzing image, please wait..."
                : "First, enter your image to recognize ingredients."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
