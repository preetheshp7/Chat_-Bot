function showSuggestedQuestions() {
    const wasteType = document.getElementById('waste-type').value;
    const questionsListDiv = document.getElementById('questions-list');
    const suggestedQuestionsDiv = document.getElementById('suggested-questions');
    questionsListDiv.innerHTML = '';  // Clear previous questions

    if (wasteType && wasteTypes[wasteType]) {
        const questions = wasteTypes[wasteType];
        questions.forEach((question) => {
            const button = document.createElement('button');
            button.textContent = question;
            button.className = 'question-button';
            button.onclick = () => askQuestion(wasteType, question);
            questionsListDiv.appendChild(button);

            // Add a line break after each question for better readability
            const lineBreak = document.createElement('br');
            questionsListDiv.appendChild(lineBreak);
        });

        suggestedQuestionsDiv.style.display = 'block';
    } else {
        suggestedQuestionsDiv.style.display = 'none';
    }
}

async function askQuestion(wasteType, question) {
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                waste_type: wasteType,
                question: question
            })
        });

        const data = await response.json();
        const formattedAnswer = formatBotResponse(data.answer); // Format the bot's response
        addMessage(question, 'user');  // Display user question
        addMessage(formattedAnswer, 'bot');  // Display formatted bot answer
    } catch (error) {
        console.error('Error fetching answer:', error);
        addMessage('An error occurred while fetching the answer.', 'bot');
    }
}

function askCustomQuestion() {
    const customQuestion = document.getElementById('customQuestion').value.trim();
    const wasteType = document.getElementById('waste-type').value;

    if (customQuestion && wasteType) {
        askQuestion(wasteType, customQuestion);
    } else {
        alert("Please select a waste type and enter a question.");
    }
}

function addMessage(text, sender = "bot") {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = sender === "bot" ? "bot-message" : "user-message";

    if (sender === "bot") {
        msg.innerHTML = text; // Use innerHTML for bot responses (to render HTML)
    } else {
        msg.textContent = text; // Use textContent for user messages (plain text)
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

// Function to format the bot's response
function formatBotResponse(responseText) {
    // Step 1: Remove all occurrences of '**' from the response
    responseText = responseText.replace(/\*\*/g, '');

    // Step 2: Split the response into lines based on newline characters
    const lines = responseText.split('\n');

    // Step 3: Add bullet points to each line
    const bulletedLines = lines.map((line) => {
        if (line.trim() !== '') { // Ignore empty lines
            return `- ${line}`;
        }
        return ''; // Return an empty string for empty lines
    }).filter(line => line.trim() !== ''); // Filter out any remaining empty lines

    // Step 4: Join all bulleted lines with line breaks for proper rendering
    return bulletedLines.join('<br>');
}