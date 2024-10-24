document.addEventListener('DOMContentLoaded', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const languageSelect = document.getElementById("language");
  const resultContainer = document.querySelector('.result p.resultText');
  const startListeningButton = document.querySelector('.btn.record');
  const recordButtonText = document.querySelector('.btn.record p');
  const clearButton = document.querySelector('.btn.clear');
  const downloadButton = document.querySelector('.btn.download');

  let recognizing = false;

  // Populate language options
  languages.forEach((language) => {
    const option = document.createElement('option');
    option.value = language.code;
    option.text = language.name;
    languageSelect.add(option);
  });

  // Set initial recognition settings
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageSelect.value;

  // Update recognition language when selection changes
  languageSelect.addEventListener("change", () => {
    recognition.lang = languageSelect.value;
  });

  // Toggle speech recognition start/stop
  startListeningButton.addEventListener('click', toggleSpeechRecognition);

  // Clear button handler
  clearButton.addEventListener('click', clearResult);

  // Initially disable download button
  downloadButton.disabled = true;

  // Handle result event
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    resultContainer.textContent = result;
    downloadButton.disabled = false; // Enable download when result is available
  };

  // Handle end of recognition
  recognition.onend = () => {
    recognizing = false; // Update recognizing flag
    startListeningButton.classList.remove('recording');
    recordButtonText.textContent = 'Start Listening';
  };

  // Download button handler
  downloadButton.addEventListener('click', downloadResult);

  // Toggle speech recognition function
  function toggleSpeechRecognition() {
    if (recognizing) {
      recognition.stop(); // Stop if already recognizing
    } else {
      recognition.start(); // Start if not recognizing
    }

    recognizing = !recognizing; // Toggle recognizing state
    startListeningButton.classList.toggle('recording', recognizing);
    recordButtonText.textContent = recognizing ? 'Stop Listening' : 'Start Listening';
  }

  // Clear result text function
  function clearResult() {
    resultContainer.textContent = '';
    downloadButton.disabled = true; // Disable download button if result is cleared
  }

  // Download result text function
  function downloadResult() {
    const resultText = resultContainer.textContent;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = 'Your-Text.txt';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  }
});
