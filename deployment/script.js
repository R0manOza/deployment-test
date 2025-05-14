document.addEventListener('DOMContentLoaded', () => {
    const answerSpan = document.getElementById('answer');
    const refreshButton = document.getElementById('refresh-button');

    // IMPORTANT: 
    // For local testing, usrl was localhost will be different when deployed.:
    const backendGetDataUrl = 'http://51.21.182.138:3001/api/get-answer';


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

    // Fetch data when the page loads
    fetchAndDisplayAnswer();

    // Add event listener to the refresh button
    refreshButton.addEventListener('click', fetchAndDisplayAnswer);
});