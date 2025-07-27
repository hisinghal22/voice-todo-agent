# 📝 Voice To-Do Agent

A modular, voice-command-based to-do list agent built with vanilla JavaScript.  
Speak naturally, and this agent understands, saves, reads, and manages your tasks — powered by OpenAI Whisper + GPT-3.5.

---

## 🎯 What It Does

With a single click, you can:

- 🎙️ Record a voice command like:  
  “Remind me to pick up groceries at 6pm”
- 🧠 Convert your voice to text using **OpenAI Whisper**
- 🤖 Use **GPT-3.5** to extract intent, task, and time
- 📋 Save and display tasks using browser `localStorage`
- 🔊 Speak back confirmation using the **SpeechSynthesis API**

---

## 💡 Example Voice Commands

| You Say                            | The Agent Does                         |
|------------------------------------|----------------------------------------|
| “Buy milk at 5pm”                  | Adds 🍼 Buy milk @ 5pm                 |
| “List all tasks”                   | Speaks and shows the current task list |
| “Clear everything”                 | Empties your task list                 |

---

## 🧱 Tech Stack

| Layer           | Technology                |
|----------------|---------------------------|
| 🎙️ Voice Input  | Web MediaRecorder API     |
| ✍️ Transcription | OpenAI Whisper API        |
| 🧠 NLP Engine    | OpenAI GPT-3.5-turbo      |
| 📦 Task Storage  | Browser `localStorage`    |
| 🔊 TTS Output    | Web SpeechSynthesis API   |
| 🧩 Structure     | Vanilla JavaScript (modularized)  |

---

## 🗂️ Project Structure

```
index.html
main.js
/modules
  ├── recorder.js     # Handles audio recording
  ├── whisper.js      # Sends audio to Whisper API
  ├── gpt.js          # Sends text to GPT for intent extraction
  ├── tasks.js        # Adds, lists, clears tasks
  └── tts.js          # Speaks responses aloud
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/voice-todo-agent.git
cd voice-todo-agent
```

### 2. Add Your OpenAI API Key

Create a `.env` file in the root directory and add:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Never commit your API key to GitHub.** `.env` is already listed in `.gitignore`.

### 3. Run the App

Simply open `index.html` in your browser and click the 🎙️ "Start Recording" button.

---

## 🔐 Security Best Practices

- API keys are stored securely in a `.env` file
- `.env` is ignored from version control via `.gitignore`
- No sensitive keys are hardcoded in the project

---

## 🧠 Why This Project Matters

This is a foundational building block for **voice-native software agents** — tools that understand and respond through speech with no need for typing or clicking.

It demonstrates:

- Real-time voice input → transcription → intent extraction → voice output
- Seamless integration of AI and browser-native tech
- Clean modular architecture for reusability and scaling

---

## 🏗️ Future Improvements

- 🗓️ Add calendar integration (e.g., Google Calendar)
- 🧠 Add natural language date parsing
- 🧹 Support deleting or editing tasks
- 🌐 Deploy to GitHub Pages or Replit for easy access

---

## 👋 Author

Built with care by [Himanshu Singhal](https://www.linkedin.com/in/himanshusinghal1) —  
exploring how voice-first interfaces can redefine human-computer interaction.

---