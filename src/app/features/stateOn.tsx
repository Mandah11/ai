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
  const [result, setResult] = useState([]);
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

    const formData = new FormData();
    formData.append("image", selectedFile);
    const result = await fetch("/api/object-detection", {
      method: "POST",
      body: formData,
    });
    const data = await result.json();
    setResult(data.objects);
    console.log(data);
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
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
            <div className="w-[26%] rounded-lg bg-white text-[16px] h-[70%] flex justify-center items-center">
              Image analysis
            </div>
            <div
              className="w-[40%] rounded-lg text-[#71717A] text-[16px] h-[70%] flex justify-center items-center"
              onClick={() => {
                setState(2);
              }}
            >
              Ingredient recognition
            </div>
            <div
              className="w-[26%] rounded-lg text-[#71717A] text-[16px] h-[70%] flex justify-center items-center"
              onClick={() => setState(3)}
            >
              Image creator
            </div>
          </div>
        </div>
        <div className="w-[95%] min-h-55 max-h-fit">
          <div className=" flex  h-11  w-full justify-between ">
            <div className="h-full flex gap-3">
              <div className="h-9  flex items-center">
                <StarIcon />
              </div>
              <div className="text-[25px] flex font-medium ">
                Image analysis
              </div>
            </div>

            <button
              className={`h-full w-[7%] rounded-md border border-gray-300 flex justify-center items-center ${
                result.length === 0 ? "bg-gray-50" : "bg-black text-white "
              } `}
              onClick={() => {
                setSelectedFile(null);
                setIsGenerating(false);
                setResult([]);
              }}
            >
              {result.length === 0 ? <RestartIcon /> : <WhiteIconRefresh />}
            </button>
          </div>
          <div className="h-17 flex items-center text-[18px] ">
            Upload a food photo, and AI will detect the ingredients.
          </div>
          <div className="min-h-27 max-h-fit  flex w-full flex-col justify-between">
            {selectedFile ? (
              <div className="w-80 h-50 flex justify-center items-center rounded-lg border">
                <div className=" h-50 w-80 flex justify-end items-end mb-8 mr-8  absolute">
                  <button
                    className="h-8 w-8 bg-white absolute flex justify-center items-center rounded-md"
                    onClick={handleDeleteFile}
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <img
                  className="w-[96%] h-[94%] object-cover rounded-lg"
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                />
              </div>
            ) : (
              <div className="h-13">
                <Label htmlFor="file-input">
                  <div className="border border-gray-200 rounded-md h-[80%] flex items-center">
                    <p className="text-[18px] ml-1">
                      <strong className="px-3">Choose File</strong>
                      JNG, PNG
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      id="file-input"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </Label>{" "}
              </div>
            )}{" "}
            <div className="w-full h-11 flex justify-end ">
              <button
                className={`h-full text-white ] w-[13%] rounded-md ${
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
        <div className="min-h-19 w-[95%] max-h-fit mt-3 flex justify-around flex-col ">
          <div className="w-full h-15 flex gap-3 items-center mb-1 ">
            <div className="h-[75%] flex items-center">
              <FolderIcon />
            </div>
            <div className="text-[25px] flex font-medium ">
              Here is the summary
            </div>
          </div>

          <div>
            {result.length > 0 ? (
              <div className="h-fit border border-gray-300 rounded-md">
                {result.map((obj: DetectedObject, index: number) => (
                  <div
                    key={index}
                    className="text-[18px] px-3 text-gray-500 h-10 rounded-md flex items-center gap-2.5"
                  >
                    <strong>{index + 1}. </strong>
                    {obj.label} - {(obj.score * 100).toFixed(2)}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[18px] text-gray-500 h-10 rounded-md border px-3 flex items-center">
                {isGenerating
                  ? "Analyzing image, please wait..."
                  : "First, enter your image to recognize an ingredients."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
