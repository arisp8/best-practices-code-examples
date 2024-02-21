import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "your-api-key-here", // In a production environment, you'd get this from an environment variable
});

const reviews = [
  {
    reviewText:
      "Absolutely loved the Margherita pizza here! The crust was just perfect.",
  },
  {
    reviewText:
      "The spaghetti carbonara was a bit too salty for my taste. Might try something else next time. The garlic bread was really good though.",
  },
  { reviewText: "Best pepperoni pizza in town! A must-try for pizza lovers." },
  {
    reviewText:
      "Wasn't a fan of the four cheese pasta. It was too heavy and lacked seasoning.",
  },
  {
    reviewText:
      "The mushroom pizza had an amazing blend of flavors. Definitely coming back for more. The margarita didn't leave me completely happy.",
  },
  {
    reviewText:
      "What a marvelous mushroom pizza! Can't suggest it enough!",
  },
];

const systemPrompt = `I am doing a large scale analysis of pizzeria reviews.
I want you to extract the dishes that customers mention in their reviews
and give them a score that is "negative", "neutral", or "positive"
depending on whether customers liked the dish or not. Dishes must be
things that you expect to see in a menu (Pizza, Pasta) but not things
like "water", "napkins", "crust" or specific attributes of the dishes (flavour, sauce, etc.).

Use this format for the resulting JSON object:
{
  "dishes": [
      {
          "name": "[dish name]",
          "sentiment": "[sentiment]"
      }
  ]
}
`;

const analyseReview = async (reviewText) => {
  const chatCompletion = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Review Text: ${reviewText}`,
      },
    ],
  });
  return JSON.parse(chatCompletion.choices[0].message.content);
};

async function main() {
  const result = {};
  for (const review of reviews) {
    const analysis = await analyseReview(review.reviewText);
    analysis.dishes.forEach((dish) => {
      const key = dish.name.toLowerCase();
      if (!result[key]) {
        result[key] = { positive: 0, neutral: 0, negative: 0 };
      }
      result[key][dish.sentiment]++;
    });
  }
  console.log(result);
}

main();
