const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { VectorDBQAChain } = require("langchain/chains");
const { PineconeClient } = require("@pinecone-database/pinecone");



const client = new PineconeClient();

async function getPineconeIndex() {


    await client.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    return pineconeIndex;
}

async function saveAnswer(question: string, answer: string, openAIApiKey?: string) {


    try {
        const pineconeIndex = await getPineconeIndex();
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings(
                {
                    openAIApiKey: openAIApiKey || process.env.OPENAI_API_KEY
                }
            ),
            { pineconeIndex }
        );
        await vectorStore.addDocuments([
            {
                pageContent: `Question: ${question}
            Answer: ${answer}`,
                metadata: {}
            }
        ])
    } catch (e) {
        console.log(e);
    }
}
async function getAnswersFromDB(question: string, openAIApiKey?: string) {

    const pineconeIndex = await getPineconeIndex();
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(
            {
                openAIApiKey: openAIApiKey || process.env.OPENAI_API_KEY
            }
        ),
        { pineconeIndex }
    );
    const results = await vectorStore.similaritySearch(question, 10);
    return results;
}

module.exports = {
    saveAnswer,
    getAnswersFromDB
    // ... any other functions or variables you want to export
};
