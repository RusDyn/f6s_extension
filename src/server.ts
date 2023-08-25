const llm = require("./core/call-llm");

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const pinecone = require('./core/pinecone.ts');
const cors = require('cors');
const app = express();
const PORT = 3000;



// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors());

// Route to handle saving answers
app.post('/save', async (req, res) => {
    try {
        const { question, answer, openAIApiKey } = req.body;
        await pinecone.saveAnswer(question, answer, openAIApiKey)
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

// Route to handle getting answers
app.get('/get', async (req, res) => {
    try {
        const { question, openAIApiKey } = req.query;
        const data = await pinecone.getAnswersFromDB(question as string, openAIApiKey as string)
        const context = data.map((d: any) => d.pageContent);

        const answer = await llm.answerQuestion(undefined, question, context.join("\n"));
        res.json({ success: true, answer });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

// Start the server
console.log('Starting server...');
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});