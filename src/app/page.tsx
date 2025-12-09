"use client";
import { useState } from "react";
import { StateOne } from "./features/stateOn";
import { StateTwo } from "./features/stateTwo";
import { StateThree } from "./features/stateThree";
import { MessengerIcon } from "@/icon/mess";
import { CloseIcon } from "@/icon/close";
import { PlaneIcon } from "@/icon/plane";
import { ResultRenderer } from "./features/resultrender";

type MessageRole = {
  role: "user" | "ai";
  content: string;
};
export default function Home() {
  const [state, setState] = useState(1);
  const [openchat, setOpenchat] = useState(false);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<MessageRole[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!input.trim()) return;

    const userMessage: MessageRole = { role: "user", content: input };
    setMessage((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await (
        await fetch("/api/chat-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat: input }),
        })
      ).json();

      if (data.err) {
        setMessage((prev) => [
          ...prev,
          { role: "ai", content: `Error: ${data.err}` },
        ]);
      } else if (data.result) {
        setMessage((prev) => [...prev, { role: "ai", content: data.result }]);
      }
      console.log(data.result);
    } catch (err) {
      const errorMessage: MessageRole = {
        role: "ai",
        content: `Error: ${err}`,
      };
      setMessage((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-screen justify-end items-end flex-col h-screen">
        <div>
          {state === 1 && <StateOne setState={setState} />}
          {state === 2 && <StateTwo setState={setState} />}
          {state === 3 && <StateThree setState={setState} />}
        </div>
        {openchat ? (
          <div className="hidden">
            <button
              className="w-11 h-11 bg-black rounded-full absolute bottom-15 right-18 flex justify-center items-center"
              onClick={() => {
                setOpenchat(true);
              }}
            >
              <MessengerIcon />
            </button>
          </div>
        ) : (
          <button
            className="w-11 h-11 bg-black rounded-full absolute bottom-15 right-18 flex justify-center items-center"
            onClick={() => {
              setOpenchat(true);
            }}
          >
            <MessengerIcon />
          </button>
        )}

        {openchat && (
          <div className="w-100 h-130 bg-white fixed bottom-16 right-18 border rounded-lg flex flex-col">
            <div className="h-14  flex justify-between items-center px-3 border-b  ">
              <div className="h-full flex items-center text-[17px] font-medium">
                Chat assistant
              </div>
              <button
                className="w-9.5 h-9.5 border border-gray-300 rounded-lg flex justify-center items-center"
                onClick={() => setOpenchat(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="w-full h-100 overflow-scroll px-5 py-3">
              {message.map((msg, index) => (
                <div
                  key={index}
                  className={`overflow-scroll ${
                    msg.role === "user" ? "flex flex-col items-end" : ""
                  } max-h-fit`}
                >
                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-[#f4f4f5]/80 py-1 px-2 max-w-60 min-h-8 max-h-fit wrap-break-word rounded-md mb-3 mt-3"
                        : "bg-[#18181b]/90 text-white w-70 min-h-10 max-h-fit rounded-md px-3 py-1 flex items-center"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ResultRenderer result={msg.content} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full h-15 border-t flex items-center justify-center gap-3">
              <input
                className="h-10 w-75 border px-2 rounded-md"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="h-10 w-10 rounded-full bg-black flex justify-center items-center"
                onClick={handleGenerate}
              >
                <PlaneIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
