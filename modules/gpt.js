export async function extractIntent(transcript, OPENAI_API_KEY) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful voice assistant. Given a user’s sentence, extract their intent, task text, and time in structured JSON. Respond ONLY with valid JSON and no explanation."
        },
        {
          role: "user",
          content: `Sentence: "${transcript}". Respond with ONLY valid JSON using one of the following intent values: "add_task", "list_tasks", "clear_all"...`
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  console.log("GPT Response:", content);

  return JSON.parse(content);
}
