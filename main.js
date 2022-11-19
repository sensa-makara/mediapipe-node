import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import {
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
  FaceMesh,
} from "@mediapipe/face_mesh";

const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const indicator = document.querySelector(".indicator");
const canvasCtx = canvasElement.getContext("2d");
const board = document.querySelector(".board");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const input = document.querySelector("input");
import Fuse from "fuse.js";
import $ from "jquery";

const fuse = (async () => {
  const res = await fetch("/words.json");
  const data = await res.json();
  return new Fuse(data, { keys: ["word"] });
})();

for (let i = 0; i < 26; i++) {
  const letter = document.createElement("div");
  letter.innerText = chars[i];
  letter.id = chars[i];
  letter.className = "char";
  board.appendChild(letter);
}

const letters = document.querySelectorAll(".char");

let num = 26;
let count = 0;

let EAR_LEFT = 1000;
let EAR_RIGHT = 1000;
let EAR_LEFT_PREV = 0;
let EAR_RIGHT_PREV = 0;

let blink = false;
let left = true;

input.addEventListener("input", async (e) => {
  let q = e.target.value;
  fuse.then((f) => {
    let s_res = f.search(q).slice(0, 10);
    $(".suggestions").empty();
    s_res.forEach((s, i) => {
      $(".suggestions").append(`
            <li class="suggestion-item" id="${i}">
                ${s.item.word}
            </li>
        `);
    });
  });
  console.log(s_res);
});

setInterval(() => {
  count = (count + 1) % 2;
  console.log(count);
  let letterList = Array.from(letters);
  letterList.forEach((e) => {
    e.className = "default";
  });
  // console.log(letterList[0]);
  if (count === 0) {
    if (left) {
      for (let i = 0; i < Math.floor(num / 2); i++) {
        letterList[i].className = "highlight";
      }
      for (let j = Math.floor(num / 2); j < Math.floor(num); j++) {
        console.log(j);
        letterList[j].className = "not-highlight";
      }
    } else {
      for (let i = 26 - Math.floor(num / 2); i < 26; i++) {
        letterList[i].className = "not-highlight";
      }
      for (let j = Math.floor(num / 2); j < Math.floor(num); j++) {
        letterList[j].className = "highlight";
      }
    }
  } else {
    if (left) {
      for (let i = 0; i < Math.floor(num / 2); i++) {
        letterList[i].className = "not-highlight";
      }
      for (let j = Math.floor(num / 2); j < Math.floor(num); j++) {
        letterList[j].className = "highlight";
      }
    } else {
      for (let i = 26 - Math.floor(num / 2); i < 26; i++) {
        letterList[i].className = "not-highlight";
      }
      for (let j = Math.floor(num / 2); j < Math.floor(num); j++) {
        letterList[j].className = "highlight";
      }
    }
  }
  if (Math.floor(num) === 1) {
    input.innerHTML = letterList[Math.floor()];
  }
  console.log(num);
}, 1000);

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
        color: "#E0E0E0",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
      EAR_LEFT =
        Math.abs(
          (landmarks[160].x - landmarks[144].x) ** 2 -
            (landmarks[160].y - landmarks[144].y) ** 2
        ) +
        Math.abs(
          (landmarks[158].x - landmarks[153].x) ** 2 -
            (landmarks[158].y - landmarks[153].y) ** 2
        ) /
          Math.abs(
            (landmarks[33].x - landmarks[133].x) ** 2 -
              (landmarks[33].y - landmarks[133].y) ** 2
          );

      EAR_RIGHT =
        Math.abs(
          (landmarks[385].x - landmarks[380].x) ** 2 -
            (landmarks[385].y - landmarks[380].y) ** 2
        ) +
        Math.abs(
          (landmarks[387].x - landmarks[373].x) ** 2 -
            (landmarks[387].y - landmarks[373].y) ** 2
        ) /
          Math.abs(
            (landmarks[362].x - landmarks[263].x) ** 2 -
              (landmarks[362].y - landmarks[263].y) ** 2
          );
      if (EAR_LEFT_PREV * 0.65 > EAR_LEFT && EAR_RIGHT_PREV * 0.7 > EAR_RIGHT) {
        indicator.innerHTML = "blinked";
        num = num / 2;
        if (Math.floor(num) === 0) {
          num = 26;
        }
        if (count === 1) {
          left = true;
        } else {
          left = false;
        }
      } else {
        indicator.innerHTML = "not blinked";
        blink = false;
      }
      EAR_LEFT_PREV = EAR_LEFT;
      EAR_RIGHT_PREV = EAR_RIGHT;
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();
