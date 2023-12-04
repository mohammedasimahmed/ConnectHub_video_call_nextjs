"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

// { room, playVideo, handleSubmit, videoRef1, stopVideo }

const Room = () => {
  const [socket, _] = useState(
    io("https://video-calling-app-backend.onrender.com")
    // io("http://localhost:5000")
  );
  const [room, setRoom] = useState(localStorage.getItem("room"));
  const peerInst = useRef(null);
  const videoRef1 = useRef(null);
  const pid = useRef("");
  const ct = useRef(0);
  // const navigate = useNavigate()

  useEffect(() => {
    // console.log(room);
    playVideo();
    // handleSubmit()
    // console.log(socket)

    const socketInitialize = () => {
      socket.on("connect", () => {
        socket.emit("join_room", localStorage.getItem("room"));
        console.log(socket.id);
        pid.current = socket.id;
        const peer = new Peer(socket.id);
        // playVideo();
        // handleSubmit()
        socket.on("new_user", (rmId) => {
          console.log("new user with " + rmId);
          handleNewUserConnection(rmId);
        });

        socket.on("user_left", (data) => {
          console.log(data);
          if (document.getElementById(data))
            document.getElementById(data).remove();
        });

        peer.on("call", function (call) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: { echoCancellation: true } })
            .then(function (mediaStream) {
              call.answer(mediaStream);
            });
          call.on("stream", function (stream) {
            const existingIds = Array.from(
              document.querySelectorAll("#videoContainer>video")
            ).map((video) => video.id);

            if (existingIds.includes(call.peer)) {
              return;
            }
            // if (ct.current % 2 !== 0) {
            const newVideo = document.createElement("video");
            newVideo.width = "300";
            newVideo.heighti = "300";
            newVideo.setAttribute("autoplay", "true");
            newVideo.setAttribute("class", "rmVideo m-8");
            newVideo.setAttribute("id", call.peer);
            newVideo.srcObject = stream;
            console.log(ct);
            document.querySelector("#videoContainer").appendChild(newVideo);
            // }
            // ct.current++;
          });
        });
        peerInst.current = peer;
      });
    };

    socketInitialize();
  }, []);

  // function leaveRoom() {
  //   socket.emit("leave_room", localStorage.getItem("room"));
  // }

  // function handleSubmit() {
  //   // socket.emit("leave_room", localStorage.getItem("room"));
  //   // const videos = document.querySelectorAll(".rmVideo");
  //   // if (videos.length > 0) {
  //   //   Array.from(videos).forEach((video) => {
  //   //     video.remove();
  //   //   });
  //   // }
  //   socket.emit("join_room", localStorage.getItem("room"));
  // }

  // function handleRoomJoin() {
  //   if (!room) return;
  //   socket.emit("leave_room", localStorage.getItem("room"));
  //   const videos = document.querySelectorAll(".rmVideo");
  //   Array.from(videos).forEach((video) => {
  //     video.remove();
  //   });
  //   socket.emit("join_room", room);
  //   console.log("hi");
  //   localStorage.setItem("room", room);
  // }

  function playVideo() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (mediaStream) {
          const video = videoRef1.current;
          video.srcObject = mediaStream;
          // console.log(mediaStream);
        })
        .catch(errorCallback);
    } else {
      console.log("getUserMedia is not supported in this browser.");
    }
  }

  async function handleNewUserConnection(rmId) {
    console.log(rmId);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { echoCancellation: true },
    });
    const call = await peerInst.current.call(rmId, mediaStream, pid.current);
    console.log(call);
    // // if(call){
    call.on("stream", function (stream) {
      // const video2 = videoRef2.current;
      // video2.srcObject = stream;
      const existingIds = Array.from(
        document.querySelectorAll("#videoContainer>video")
      ).map((video) => video.id);

      if (existingIds.includes(call.peer)) {
        return;
      }
      if (ct.current % 2 !== 0) {
        const newVideo = document.createElement("video");
        newVideo.width = "300";
        newVideo.height = "300";
        newVideo.setAttribute("autoplay", "true");
        newVideo.setAttribute("id", rmId);
        newVideo.setAttribute("class", `rmVideo`);
        newVideo.srcObject = stream;
        document.querySelector("#videoContainer").appendChild(newVideo);
      }
      ct.current++;
    });
  }
  // }

  const errorCallback = function (e) {
    console.log("Reeeejected!", e);
  };

  // function stopVideo() {
  //   const video = videoRef1.current;
  //   let stream = video.srcObject;
  //   if (!stream) return;
  //   stream.getTracks().forEach((track) => {
  //     track.stop();
  //   });
  // }

  return (
    <>
      <center>
        <h1 className="text font-bold text-lg">In Room {room}</h1>
      </center>
      <div className="flex flex-wrap p-3" id="videoContainer">
        <video
          autoPlay
          ref={videoRef1}
          className="Myvideo m-8"
          height="300"
          width="300"
        ></video>
      </div>
    </>
  );
};

export default Room;
