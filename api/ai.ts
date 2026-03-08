export default async function handler(req, res) {

const apiKey = process.env.GOOGLE_API_KEY;
const { prompt, code } = req.body;

const input = prompt || code || "Write a simple program";

try {

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
contents:[{parts:[{text:input}]}]
})
}
);

const data = await response.json();

let text = "";

if (data.candidates && data.candidates.length > 0) {
text = data.candidates[0].content.parts
.map(p => p.text)
.join("\n");
}

if (!text) {
text = "AI did not return text.";
}

res.status(200).json({
code: text,
explanation: text,
suggestions: []
});

} catch (err) {

res.status(500).json({
error:"AI request failed"
});

}

}
