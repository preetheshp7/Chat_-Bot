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
// function formatBotResponse(responseText) {
//     // Escape HTML characters
//     responseText = responseText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

//     const lines = responseText.split('\n');
//     let html = '';
//     let inUl = false;
//     let inOl = false;

//     lines.forEach((line) => {
//         const trimmed = line.trim();

//         // Headings
//         if (trimmed.startsWith('### ')) {
//             if (inUl) { html += '</ul>'; inUl = false; }
//             if (inOl) { html += '</ol>'; inOl = false; }
//             html += `<h3>${trimmed.slice(4)}</h3>`;
//         }

//         // Numbered list
//         else if (/^\d+\.\s+/.test(trimmed)) {
//             if (!inOl) {
//                 if (inUl) { html += '</ul>'; inUl = false; }
//                 html += '<ol>'; inOl = true;
//             }
//             html += `<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`;
//         }

//         // Bullet list
//         else if (trimmed.startsWith('- ')) {
//             if (!inUl) {
//                 if (inOl) { html += '</ol>'; inOl = false; }
//                 html += '<ul>'; inUl = true;
//             }
//             html += `<li>${trimmed.slice(2)}</li>`;
//         }

//         // Paragraphs
//         else if (trimmed !== '') {
//             if (inUl) { html += '</ul>'; inUl = false; }
//             if (inOl) { html += '</ol>'; inOl = false; }
//             html += `<p>${trimmed}</p>`;
//         }
//     });

//     // Close any unclosed lists
//     if (inUl) html += '</ul>';
//     if (inOl) html += '</ol>';

//     return html;
// }
function formatBotResponse(responseText) {
    // Step 1: Remove markdown-like bold markers
    responseText = responseText.replace(/\*\*/g, '');

    // Step 2: Split by newlines
    const lines = responseText.split('\n');

    // Step 3: Format nicely
    let formatted = '';

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
            // Big Heading
            formatted += `<strong style="font-size: 1.2em;">${trimmed.slice(4)}</strong><br><br>`;
        } else if (/^\d+\.\s+/.test(trimmed)) {
            // Numbered points
            formatted += `&nbsp;&nbsp;${trimmed}<br>`;
        } else if (trimmed.startsWith('- ')) {
            // Bulleted points
            formatted += `&nbsp;&nbsp;• ${trimmed.slice(2)}<br>`;
        } else if (trimmed !== '') {
            // Normal paragraph text
            formatted += `${trimmed}<br><br>`;
        }
    });

    return formatted;
}
