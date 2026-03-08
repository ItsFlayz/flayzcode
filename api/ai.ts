export default async function handler(req, res) {

const apiKey = process.env.GOOGLE_API_KEY;
const { prompt, code, language } = req.body;

const input = prompt || code;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
contents: [{ parts: [{ text: input }] }]
})
}
);

const data = await response.json();

const text =
data?.candidates?.[0]?.content?.parts?.[0]?.text ||
"No explanation was provided";

res.status(200).json({
code: text,
explanation: text,
suggestions: []
});

}
