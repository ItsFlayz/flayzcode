export default async function handler(req, res) {

const apiKey = process.env.GOOGLE_API_KEY;

const prompt = req.body.prompt;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
contents: [{parts: [{text: prompt}]}]
})
}
);

const data = await response.json();

res.status(200).json(data);

}
