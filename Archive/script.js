// script.js

// Global variables to handle recording
let mediaRecorder; // Used to start or stop media recording
let audioChunks = []; // Will store the audio data as it's being recorded

// Grab UI elements
// These connect the code to buttons and sections on your HTML page
const recordBtn = document.getElementById("recordBtn"); // The mic button
const statusText = document.getElementById("status"); // The status text
const transcriptDiv = document.getElementById("transcript"); // The transcript text
const taskList = document.getElementById("taskList"); // The list of tasks

// When record button is clicked, start or stop recording based on current state of mediaRecorder
recordBtn.onclick = async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    startRecording(); // Start recording if not already started
  } else {
    stopRecording(); // Stop recording if already started
  }
};

// Start recording audio using MediaRecorder API
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream); //setup mediaRecorder with the audio stream
    audioChunks = []; //reset the audiostorage array

    // When data is available, push it to the audioChunks array
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // When recording stops, create a Blob from the audioChunks and send it to Whisper for transcription
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" }); // Create a Blob from the audio data
      transcribeAudio(audioBlob); // Send audio to Whisper for transcription
    };

    mediaRecorder.start(); // Start recording
    statusText.textContent = "🎤 Listening..."; // Update status text
    recordBtn.textContent = "⏹ Stop Recording"; // Update button text
  });
}

// Stop recording
function stopRecording() {
  mediaRecorder.stop(); //Trigger the onstop event
  statusText.textContent = "Processing..."; // Update status text
  recordBtn.textContent = "🎙️ Start Recording"; // Reset button text
}

// Send recorded audio to OpenAI Whisper API for transcription
async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer INSERT YOUR API KEY HERE` // Your OpenAI key (or hardcoded for test)
    },
    body: formData
  });

  const result = await response.json(); // Get Whisper response
  const transcript = result.text; // Extract the transcribed text
  transcriptDiv.textContent = `📝 You said: ${transcript}`; // Show it on screen

  // Send the transcription to GPT to extract intent and task
  try {
    const structured = await extractIntent(transcript); // Get structured data from GPT
    
    if (structured.intent === "add_task") { // Handle adding a task
      addTask(structured);
      speak(`Task added: ${structured.task}`); // Speak confirmation
    } else if (structured.intent === "list_tasks") { // Handle listing tasks
      listTasks();
      speak("Here are your tasks."); // Speak confirmation
    } else if (structured.intent === "clear_all") { // Handle clearing all tasks
      clearTasks();
      speak("All tasks cleared."); // Speak confirmation
    } else {
      speak("Sorry, I didn’t understand that."); // Handle unknown intent
    }
  } catch (err) {
    speak("Sorry, I had trouble understanding that.");
    console.error(err);
  }
}

// GPT Function to send transcription to GPT and extract intent, task, and time
async function extractIntent(transcript) {
  const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", { 
    method: "POST",
    headers: {
      "Authorization": `Bearer INSERT YOUR API KEY HERE`,
      "Content-Type": "application/json" // Your OpenAI key (or hardcoded for test)
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Use the GPT 3.5 model
      messages: [
        {
          role: "system",
          content: "You are a helpful voice assistant. Given a user’s sentence, extract their intent, task text, and time in structured JSON. Respond ONLY with valid JSON and no explanation." // Provide context to GPT
        },
        {
          role: "user",
          content: `Sentence: "${transcript}". Respond with ONLY valid JSON using one of the following intent values: 
          - "add_task"
          - "list_tasks"
          - "clear_all"

          Respond in the format:
          {
            "intent": "...",
            "task": "...",
            "time": "..."
          }`// Provide the format and Intent examples to GPT to reply
        }
      ],
      temperature: 0.3 // Set temperature to 0.3 for more deterministic responses
    })
  });

  const data = await gptResponse.json(); // Get GPT response
  const content = data.choices[0].message.content;

  // 👇 Add this line to inspect what GPT returned to check in case of errors
  console.log("GPT Response:", content);

  try {
    const parsed = JSON.parse(content); // Parse the JSON response from GPT
    return parsed;
  } catch (err) {
    console.error("Failed to parse GPT response:", err);
    throw new Error("Invalid GPT response");
  }
}

// Add a task to the UI and localStorage
function addTask(taskObj) {
  const li = document.createElement("li"); // Create a new list item
  li.textContent = `${taskObj.task} ${taskObj.time ? " @ " + taskObj.time : ""}`;
  taskList.appendChild(li);

  const saved = JSON.parse(localStorage.getItem("tasks") || "[]"); // Get existing tasks from localStorage
  saved.push(taskObj); // Add new task to the array
  localStorage.setItem("tasks", JSON.stringify(saved)); // Save updated tasks back to localStorage
}

// Read and list all saved tasks from localStorage
function listTasks() {
  taskList.innerHTML = ""; // Clear existing tasks from UI
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]"); // Get tasks from localStorage
  saved.forEach(t => addTask(t)); // Display each task in the UI
}

// Clear all tasks from UI and storage
function clearTasks() {
  localStorage.removeItem("tasks"); // Remove tasks from localStorage
  taskList.innerHTML = ""; // Clear tasks from UI
}

// Speak a message aloud using Web Speech API
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text); // Create speech object
  speechSynthesis.speak(msg); // Speak the text
}
