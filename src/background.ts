
export { }


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveAnswer') {
        console.log('saving answer');

        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: request.question,
                answer: request.answer,
                openAIApiKey: request.openAIApiKey
            })
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ success: true, data });
            })
            .catch((e) => {
                sendResponse({ success: false, error: e });
            });
    }
    else if (request.action === 'getAnswer') {
        console.log('get answer');

        // Use fetch to call your local server
        fetch(`http://localhost:3000/get?question=${encodeURIComponent(request.question)}`)
            .then(response => response.json())
            .then(data => {
                console.log('results', data);
                sendResponse({ success: true, results: data, s: JSON.stringify(data) });
            })
            .catch((e) => {
                console.log('error', e);
                sendResponse({ success: false, error: e, errorString: e.toString() });
            });


    }
    // Indicate that the response will be sent asynchronously
    return true;
});