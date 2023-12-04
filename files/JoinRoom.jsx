"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const JoinRoom = () => {
  const router = useRouter();
  const [room, setRoom] = useState("");

  return (
    <>
      <div className="flex-1 mt-28">
        <form
          className="border-5 border-solid border-gray-300"
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem("room", room);
            room && router.push("/room");
          }}
        >
          <h1 className="text-center ml-8 text-3xl font-semibold"> Enter Room</h1>
          <div className="text-left mx-6 my-3">
            <hr />
            <div className="text-left pt-16 pb-16">
              <label htmlFor="Room">
                <strong>Room ID</strong>
              </label>
              <input
                type="text"
                placeholder="Enter The ID Of the Room"
                name="Room"
                required
                className="w-full p-4 md:p-2 my-2 md:my-4 inline-block border border-gray-300"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-3 mt-4 border-none cursor-pointer w-full hover:opacity-80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JoinRoom;
