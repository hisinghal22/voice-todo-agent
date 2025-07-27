// IMPORTANT: Replace the API key below with your own OpenAI key before running

import { startRecording, stopRecording } from "./modules/recorder.js";
import { transcribeAudio } from "./modules/whisper.js";
import { extractIntent } from "./modules/gpt.js";
import { addTask, listTasks, clearTasks } from "./modules/tasks.js";
import { speak } from "./modules/tts.js";

// ✅ Wait for the DOM to be ready before running the logic
window.addEventListener("DOMContentLoaded", () => {
  const OPENAI_API_KEY = "YOUR OPENAI API KEY HERE"; // Replace with your actual OpenAI API key
  console.log("🔐 OpenAI Key Loaded:", OPENAI_API_KEY);

  const recordBtn = document.getElementById("recordBtn");
  const statusText = document.getElementById("status");
  const transcriptDiv = document.getElementById("transcript");
  const taskList = document.getElementById("taskList");

  // ✅ Check if HTML elements were found
  if (!recordBtn || !statusText || !transcriptDiv || !taskList) {
    console.error("❌ One or more UI elements are missing.");
    return;
  }

  // 🎙️ Button click handler
  recordBtn.onclick = () => {
    if (recordBtn.textContent.includes("Start")) {
      console.log("▶️ Starting Recording...");
      startRecording(handleAudio, updateUI);
    } else {
      console.log("⏹️ Stopping Recording...");
      stopRecording(updateUI);
    }
  };

  // 🔁 Updates UI status and button text
  function updateUI(state) {
    console.log("🔄 UI Update State:", state);
    if (state === "listening") {
      statusText.textContent = "🎤 Listening...";
      recordBtn.textContent = "⏹ Stop Recording";
    } else if (state === "processing") {
      statusText.textContent = "Processing...";
      recordBtn.textContent = "🎙️ Start Recording";
    }
  }

  // 🧠 Handle the audio blob returned from recorder
  async function handleAudio(audioBlob) {
    try {
      const transcript = await transcribeAudio(audioBlob, OPENAI_API_KEY);
      console.log("📝 Transcript Received:", transcript);
      transcriptDiv.textContent = `📝 You said: ${transcript}`;

      const structured = await extractIntent(transcript, OPENAI_API_KEY);
      console.log("🧠 Intent Structured Data:", structured);

      if (structured.intent === "add_task") {
        addTask(structured, taskList);
        speak(`Task added: ${structured.task}`);
      } else if (structured.intent === "list_tasks") {
        listTasks(taskList);
        speak("Here are your tasks.");
      } else if (structured.intent === "clear_all") {
        clearTasks(taskList);
        speak("All tasks cleared.");
      } else {
        speak("Sorry, I didn’t understand that.");
      }
    } catch (err) {
      console.error("❌ Error processing audio:", err);
      speak("Sorry, something went wrong.");
    }
  }
});
