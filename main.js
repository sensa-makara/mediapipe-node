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

import vocabulator from "vocabulator";

const synthesizer = vocabulator({
  language: "id-ID",
  voiceName: "Google Bahasa Indonesia",
  pitch: 1,
});

const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const indicator = document.querySelector(".indicator");
const canvasCtx = canvasElement.getContext("2d");
const board = document.querySelector(".board");
const chars = "\\ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const selected = document.querySelector(".text-selection");
let l = chars;
const input = document.querySelector("input");
import Fuse from "fuse.js";
import $ from "jquery";

const fuse = (async () => {
  const res = await fetch("/words.json");
  const data = await res.json();
  return new Fuse(data, { keys: ["word"] });
})();

for (let i = 0; i < l.length; i++) {
  const letter = document.createElement("div");
  letter.innerText = l[i];
  letter.id = l[i];
  letter.className = "char";
  board.appendChild(letter);
}

let count = 0;
let letterList = [];
let EAR_LEFT = 1000;
let EAR_RIGHT = 1000;
let EAR_LEFT_PREV = 0;
let EAR_RIGHT_PREV = 0;

var inputEvent = new Event("text-modified", {
  view: window,
  bubbles: true,
  cancelable: true,
});
let s_res;
input.addEventListener("text-modified", (e) => {
  let q = e.target.value;
  fuse.then((f) => {
    s_res = f.search(q).slice(0, 10);
    $(".suggestions").empty();
    s_res.forEach((s, i) => {
      $(".suggestions").append(`
            <li class="suggestion-item" id="${i}">
                ${s.item.word.toUpperCase()}
            </li>
        `);
    });
  });
});

let k = 0;
window.addEventListener("wheel", () => {
  try {
    Array.from(document.querySelectorAll(".suggestion-item")).map((e) => {
      e.className = "suggestion-item";
    });
    document.getElementById(k.toString()).className =
      "suggestion-item highlight";
    k = (k + 1) % s_res.length;
  } catch (e) {
    console.log(e);
    // input.value = input.value.slice(0, input.value.length - 1);
  }
});

window.addEventListener("click", (event) => {
  console.log(event.button);
  try {
    if (event.button === 0) {
      const res = document
        .getElementById(((k - 1) % s_res.length).toString())
        .innerText.trim();
      if (res === "\\D") {
        const l = selected.innerHTML.split(" ");
        selected.innerHTML = l.slice(0, l.length - 1).join(" ");
      } else if (res === "\\L") {
        selected.innerHTML = "";
      } else {
        selected.innerHTML += " " + res;
      }
      input.value = "";
      input.dispatchEvent(inputEvent);
    }
  } catch (e) {
    synthesizer.say({ text: selected.innerHTML.trim() });
    selected.innerHTML = "";
  }
  k = 0;
});

let letters = document.querySelectorAll(".char");
setInterval(() => {
  count = (count + 1) % 2;
  letterList = Array.from(letters);
  letterList.forEach((e) => {
    e.className = "default";
  });
  // console.log(letterList[0]);
  if (count === 0) {
    for (let i = 0; i < Math.floor(l.length / 2); i++) {
      letterList[i].className = "highlight";
    }
    for (let j = Math.floor(l.length / 2); j < Math.floor(l.length); j++) {
      letterList[j].className = "not-highlight";
    }
  } else {
    for (let i = 0; i < Math.floor(l.length / 2); i++) {
      letterList[i].className = "not-highlight";
    }
    for (let j = Math.floor(l.length / 2); j < Math.floor(l.length); j++) {
      letterList[j].className = "highlight";
    }
  }
}, 1500);

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
      if (EAR_LEFT_PREV * 0.7 > EAR_LEFT && EAR_RIGHT_PREV * 0.7 > EAR_RIGHT) {
        indicator.innerHTML = "blinked";
        board.textContent = "";
        if (count === 0) {
          l = l.slice(0, Math.floor(l.length / 2));
        } else {
          l = l.slice(Math.floor(l.length / 2), l.length);
        }
        if (l.length === 1) {
          input.value += l;
          input.dispatchEvent(inputEvent);
          l = chars;
        }
        for (let i = 0; i < l.length; i++) {
          const letter = document.createElement("div");
          letter.innerText = l[i];
          letter.id = l[i];
          letter.className = "char";
          board.appendChild(letter);
        }
        letters = document.querySelectorAll(".char");
      } else {
        indicator.innerHTML = "not blinked";
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
