document.addEventListener('DOMContentLoaded', () => {
    const answerSpan = document.getElementById('answer');
    const refreshButton = document.getElementById('refresh-button');
     const dataInput = document.getElementById('data-input');
    const sendButton = document.getElementById('send-button');
    const sendStatusDiv = document.getElementById('send-status');
    const backendBaseUrl = 'http://localhost:3001';
     const backendGetDataUrl = `${backendBaseUrl}/api/get-answer`;
    const backendPostDataUrl = `${backendBaseUrl}/api/create-answer`;

    async function fetchAndDisplayAnswer() {
        answerSpan.textContent = 'Loading...';
        try {
            const response = await fetch(backendGetDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result && typeof result.data !== 'undefined') {
                answerSpan.textContent = result.data;
            } else {
                answerSpan.textContent = 'No data found or invalid format.';
            }
        } catch (error) {
            console.error("Could not fetch answer:", error);
            answerSpan.textContent = 'Error fetching data.';
        }
    }
     async function sendDataToBackend() {
        const dataToSend = dataInput.value.trim();
        sendStatusDiv.textContent = ''; // Clear previous status

        if (!dataToSend) {
            sendStatusDiv.textContent = 'Error: Please enter some data to send.';
            sendStatusDiv.style.color = 'red';
            return;
        }

        sendStatusDiv.textContent = 'Sending...';
        sendStatusDiv.style.color = 'blue';

        try {
            const response = await fetch(backendPostDataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: dataToSend }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Unknown server error" }));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message}`);
            }

            const result = await response.json();
            console.log("Backend response to POST:", result);
            sendStatusDiv.textContent = `Success: "${result.currentData}" sent and stored!`;
            sendStatusDiv.style.color = 'green';
            dataInput.value = ''; // Clear the input field

            // Automatically refresh the displayed answer
            fetchAndDisplayAnswer();

        } catch (error) {
            console.error("Could not send data:", error);
            sendStatusDiv.textContent = `Error sending data: ${error.message}`;
            sendStatusDiv.style.color = 'red';
        }
    }

    // Fetch data when the page loads
    fetchAndDisplayAnswer();
   

    // Add event listener to the send button
    sendButton.addEventListener('click', sendDataToBackend);

    // Add event listener to the refresh button
    refreshButton.addEventListener('click', fetchAndDisplayAnswer);
});