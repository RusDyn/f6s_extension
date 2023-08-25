const { LLMChain, PromptTemplate } = require("langchain");
const { ChatOpenAI } = require("langchain/chat_models/openai");
//import type { ChainValues } from "langchain/dist/schema";
const { LangChainTracer } = require("langchain/callbacks");
const { Client } = require("langsmith");

const templates = {

    "answer": `
    {context}

    We're filling out an application for a startup accelerator program. 
    Please answer in English to the following question from the perspective of our company:
    {question}

    Instructions:
    1. Be sure to answer the question only. Skip comments where it is possible.
    For example:
    - If the question is about Location, answer with location. 
    - If the question is about the address, answer with the exact address. 
    2. Use bullet points where it is possible.
    3. Don't use full sentences.
    4. Don't use adjective words like "great", "amazing", "awesome", etc.
    5. Don't use words like "we", "our", "us", etc.
    6. Don't use words like "I", "me", "my", etc.
    7. Don't use words like "you", "your", etc.
    
    Answer:
    `
}

const answerQuestion = async (openAIApiKey: string, question: string, answers: string) => {

    try {
        let context = `Tale Together is an innovative AI-driven storytelling platform designed to empower modern parents in their parenting journey. Our platform crafts personalized stories that resonate with each child's unique needs and preferences, fostering emotional connections and instilling positive habits. As a mobile app available for both iOS and Android, Tale Together offers a user-friendly and accessible solution for parents seeking to create meaningful moments with their children.

    Our stories are more than just entertainment; they are tools for holistic child development. By incorporating evidence-based practices and collaborating with experts in parenting and child psychology, we ensure that our narratives are both engaging and beneficial. Our real-time feedback mechanism allows parents to share insights, helping us refine the story content to better suit their child's needs.
    
    In an era of digital distractions, Tale Together offers a tech-friendly tool that aligns with modern lifestyles. Our platform simplifies bedtime routines, reduces power struggles, and helps parents proactively address common parenting challenges. By joining our waitlist, parents can enjoy early access, exclusive discounts, and the opportunity to shape the future of Tale Together. We are committed to creating a supportive community where parents can connect, share experiences, and celebrate the joys of storytelling.
    `


        context = context + answers;
        return callLLM(openAIApiKey, "answer", {
            context, question
        })
    }
    catch (e) {
        console.log(e);
        return "Sorry, I don't know the answer to that question."
    }
}

const callLLM = async (openAIApiKey: string, templateName: string, params: any) => {

    console.log(params);
    if (!(templateName in templates)) {
        console.log(templates)
        throw new Error(`Template ${templateName} not found`)

    }

    const template = templates[templateName]
    const prompt = PromptTemplate.fromTemplate(template);
    const callbacks = [];
    // langsmith callback
    if (process.env.PLASMO_PUBLIC_LANGCHAIN_API_KEY) {
        callbacks.push(
            new LangChainTracer({
                projectName: "f6s",
                client: new Client({
                    apiUrl: "https://api.smith.langchain.com",
                    apiKey: process.env.PLASMO_PUBLIC_LANGCHAIN_API_KEY,
                }),
            }),
        )
    }
    const llm = new ChatOpenAI({
        openAIApiKey: openAIApiKey || process.env.PLASMO_PUBLIC_OPENAI_API_KEY,
        //modelName: "gpt-4",
        temperature: 0.1,
        callbacks,
    })

    const chain = new LLMChain({
        llm,
        prompt
    });
    const result = await chain.call(params);
    return result.text;
}

module.exports = {
    answerQuestion
}