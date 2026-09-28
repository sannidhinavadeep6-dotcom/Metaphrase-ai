const API_HOST = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
  const toneSelect = document.getElementById("toneSelect");
  const inputText = document.getElementById("inputText");
  const transformBtn = document.getElementById("transformBtn");
  const humanizeBtn = document.getElementById("humanizeBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");

  transformBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) return;

    transformBtn.innerText = "Transforming...";
    transformBtn.disabled = true;

    try {
      const res = await fetch(`${API_HOST}/api/paraphrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone: toneSelect.value, target_language: "English" })
      });
      const data = await res.json();
      outputBox.innerText = data.paraphrased_text || "No output generated.";
      outputBox.style.display = "block";
      copyBtn.style.display = "block";
    } catch (err) {
      outputBox.innerText = "Error connecting to Metaphrase API.";
      outputBox.style.display = "block";
    } finally {
      transformBtn.innerText = "Transform";
      transformBtn.disabled = false;
    }
  });

  humanizeBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) return;

    humanizeBtn.innerText = "Humanizing...";
    humanizeBtn.disabled = true;

    try {
      const res = await fetch(`${API_HOST}/api/humanize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language: "English" })
      });
      const data = await res.json();
      outputBox.innerText = data.humanized_text || "No output generated.";
      outputBox.style.display = "block";
      copyBtn.style.display = "block";
    } catch (err) {
      outputBox.innerText = "Error connecting to Metaphrase API.";
      outputBox.style.display = "block";
    } finally {
      humanizeBtn.innerText = "Humanize";
      humanizeBtn.disabled = false;
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputBox.innerText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => { copyBtn.innerText = "Copy to Clipboard"; }, 1500);
  });
});
