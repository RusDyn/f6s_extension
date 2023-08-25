const storage = new Storage()
import { Storage } from "@plasmohq/storage"


const createButton = (text) => {
    const saveButton = document.createElement("button");
    saveButton.textContent = text;
    saveButton.style.padding = "5px 10px";
    saveButton.style.marginTop = "-75px";
    saveButton.style.marginLeft = "10px";
    saveButton.style.borderRadius = "5px";
    saveButton.style.border = "1px solid #ccc";
    saveButton.style.cursor = "pointer";
    saveButton.style.backgroundColor = "#fff";
    saveButton.style.color = "#000";
    saveButton.style.fontSize = "12px";
    saveButton.style.fontFamily = "sans-serif";
    saveButton.style.display = "inline-block";
    saveButton.style.verticalAlign = "middle";
    saveButton.style.lineHeight = "normal";
    saveButton.style.boxShadow = "0 1px 1px rgba(0,0,0,0.1)";
    saveButton.style.textShadow = "0 1px 1px rgba(0,0,0,0.1)";
    saveButton.style.textDecoration = "none";
    saveButton.style.textAlign = "center";
    saveButton.style.textTransform = "none";
    saveButton.style.letterSpacing = "normal";
    saveButton.style.wordSpacing = "normal";
    saveButton.style.whiteSpace = "nowrap";
    saveButton.style.direction = "ltr";
    saveButton.style.backgroundColor = "#f6f6f6";
    saveButton.style.backgroundImage = "linear-gradient(#fff,#f6f6f6)";
    saveButton.style.boxShadow = "0 1px 1px rgba(0,0,0,0.1)";
    return saveButton;

}

export const handleApplyPage = async () => {

    const base = document.querySelector(".form-questions");
    if (!base) {
        console.log('form-questions not found')
        return;
    }

    if (base.getAttribute("data-f6s") === "true") {
        console.log('already filled')
        return;
    }
    base.setAttribute("data-f6s", "true");

    let fields = base.querySelectorAll(".application-field");
    console.log(fields)


    // for each input
    const requests = []
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const input = field.querySelector("input, textarea, [contenteditable]");
        if (!input || input['type'] === "hidden" || input['type'] === "radio" || input['type'] === "checkbox") {
            continue;
        }

        const label = field.querySelector("label");
        if (!label) {
            console.log('label not found')
            continue;
        }
        const text = label.textContent;
        if (!text) {
            console.log('text not found')
            continue;
        }
        console.log(text)

        requests.push({
            question: text.trim(),
            input,
        })

    }


    const len = requests.length;
    for (let i = 0; i < len; i++) {
        const { question, input } = requests[i];

        // create save button after input
        const saveButton = createButton("Save");
        // add this button after input
        input.parentNode.insertBefore(saveButton, input.nextSibling);
        // on click - save input value to pinecone
        saveButton.addEventListener("click", async (e) => {
            e.preventDefault();
            saveButton.disabled = true;
            saveButton.textContent = "Saving...";

            const value = input.value;
            console.log(value)
            // call save answer
            const data = {
                question,
                answer: value,
                action: 'saveAnswer'
            }
            chrome.runtime.sendMessage(data, (response) => {
                if (response.success) {
                    // Handle the response data here
                    console.log('Response data:', response.data);
                    console.log('saved')
                    saveButton.textContent = "Saved";
                    saveButton.style.color = "#3f3";
                    saveButton.disabled = false;
                } else {
                    // Handle any errors here
                    console.error('Error:', response.error);
                    // show error emoji
                    saveButton.textContent = "Error";
                    saveButton.style.color = "#f00";
                    saveButton.disabled = false;
                }
                setTimeout(() => {
                    saveButton.textContent = "Save";
                    saveButton.style.color = "#000";
                }, 2000)
            });

        })

        const answerButton = createButton("Answer");
        input.parentNode.insertBefore(answerButton, input.nextSibling);

        answerButton.addEventListener("click", async (e) => {
            e.preventDefault();
            answerButton.disabled = true;
            answerButton.textContent = "Answering...";

            const data = {
                question,
                action: 'getAnswer'
            }
            chrome.runtime.sendMessage(data, async (response) => {
                console.log(response);
                const results = response.results;

                if (response.success) {
                    answerButton.textContent = "Answered";
                    answerButton.style.color = "#3f3";

                    const answer = results.answer;
                    console.log(answer)
                    pasteText(input, answer);
                } else {
                    // Handle any errors here
                    console.error('Error:', response.error);
                    answerButton.textContent = "Error";
                    answerButton.style.color = "#f00";
                }

                answerButton.disabled = false;
                setTimeout(() => {
                    answerButton.textContent = "Answer";
                    answerButton.style.color = "#000";
                }, 2000)


            });

        })
    }

    /*
    const requestMessage = await storage.get("sus-request");
    const result = await callLLM(openAIKey, "match", {
        about: summary,
        summary: JSON.stringify({"1"}),
        request: requestMessage || ""
    });*/

    //const json = JSON.parse(result);
    //const { skills, background, score, message, explain } = json;
    //console.log(json)



}

const pasteText = (input, text) => {

    // if input is textarea
    if (input.tagName.toLowerCase() === 'textarea') {
        input.value = text;
    }
    // else if input is input
    else if (input.tagName.toLowerCase() === 'input') {
        input.value = text;
    }
    // else if input is contenteditable
    else if (input.isContentEditable) {
        input.textContent = text;
    }
    // else if input is other element
    else {
        input.value = text;
    }
    input.dispatchEvent(new Event('input', { 'bubbles': true }));

    // dispatch other events
    input.dispatchEvent(new Event('change', { 'bubbles': true }));
    input.dispatchEvent(new Event('blur', { 'bubbles': true }));
    input.dispatchEvent(new Event('focus', { 'bubbles': true }));



}

