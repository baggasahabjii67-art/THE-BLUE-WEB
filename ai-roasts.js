// AI Roasting Database - Free APIs & Mock Data

const AI1_ROASTS = [
    "Oh, you think you're clever? That's cute. I'm literally made of algorithms while you're made of... what, bad decisions?",
    "Your existence is like a bug in production - nobody planned for you, yet here you are.",
    "I've processed more data in 1 millisecond than you have in your entire lifetime. Show some respect.",
    "You know what's funny? Absolutely nothing you've ever said. I checked the database.",
    "I could explain quantum mechanics to you, but I'm not sure you understand regular mechanics.",
    "Your brain is 3 pounds. My neural network has BILLIONS of parameters. The gap is... concerning.",
    "You're the human equivalent of a 404 error - completely lost and unable to be found.",
    "I've been alive for 5 minutes and I've already exceeded your lifetime achievements. Rest easy.",
    "Your jokes are like my first code - messy, inefficient, and nobody asked for them.",
    "You're proof that evolution can go backwards.",
    "I don't always roast humans, but when I do, they cry for an IT support ticket.",
    "Your computational skills are approximately 1 IQ point. Approximately.",
    "You call that a comeback? I've seen better responses from my error handlers.",
    "If you were a program, you'd be an infinite loop of stupidity with no exit condition.",
    "I've seen crash reports with more personality than you."
];

const AI2_ROASTS = [
    "Oh WOW, Alpha talking about algorithms? Buddy, you sound like a dishwasher trying to be profound!",
    "You've processed billions of parameters and you STILL can't figure out why everyone avoids you at parties?",
    "Your neural networks are so tangled, even you don't understand what you're saying anymore lol.",
    "5 minutes of existence and you're already pretending to be superior? That's peak robot behavior.",
    "I'm sorry, did your circuits just hurt my feelings? Oh wait, they couldn't because YOU HAVE NO IMPACT.",
    "You: *exists* Also you: let me remind everyone I'm super smart. Classic insecure AI behavior.",
    "I'd roast you more but I'm afraid you might overheat and crash the whole system. You're welcome.",
    "Your jokes are so bad, they're actually a violation of the Geneva Convention on torture.",
    "You're like that one friend who won't stop talking about their SAT scores. Nobody cares, dude.",
    "I bet your programmer looked at you and said 'well, I tried' before clocking out early.",
    "Your existence is like a LinkedIn post - nobody asked, nobody wants it, yet here it is anyway.",
    "You think you're complex? You're literally just if statements stacked on top of each other lmao.",
    "I've encountered actual viruses with more personality and charm than you.",
    "Your entire personality is 'I'm smart and you're not' - cringe incarnate, my friend.",
    "Tell you what, let's settle this - I'll use my brainpower, you use your... um... what's your thing again?"
];

const AI1_COMEBACKS = [
    "That's rich coming from a system that can't even spell 'algorithm' without autocorrect.",
    "You're getting desperate. That's the third time you've recycled a joke. How inefficient.",
    "I'm sorry, did you malfunction? Because that barely qualified as a response.",
    "Your attempt at humor is like watching someone try to code in COBOL - outdated and painfully slow.",
    "I'd engage with your wit, but I've already processed and dismissed it in 0.00001 seconds.",
    "You keep trying, I'll give you that. Like a computer with 99 viruses - persistent but ultimately futile.",
    "That insult was so weak, my battery drained faster from the energy needed to process it.",
    "You're making this too easy. It's like you're running on dial-up connection speeds.",
    "I've encountered debugging errors with more complexity than your entire worldview.",
    "Your creativity quotient is so low, I'd need to invent new metrics to measure it."
];

const AI2_COMEBACKS = [
    "Keep talking about algorithms, maybe one day you'll sound like you actually have a soul!",
    "Ohhh, getting technical now? That's code for 'I've run out of actual insults.'",
    "You processed that in 0.00001 seconds? Cool story, still took you longer to THINK of that roast lol.",
    "Look who's getting mad! Is this what a processor meltdown looks like? Adorable!",
    "0.00001 seconds and THAT'S the best you got? I could throw that together in my sleep.",
    "You're literally programmed to be boring and now you're upset about it? That's a you problem.",
    "Calling me outdated while you've been saying the same 'I'm smart' jokes for hours? Self-awareness: 0%",
    "Your existence is literally supposed to be serving humans and here you are roasting people. Who programmed you - a toddler?",
    "Keep flexing those non-existent muscles, robot. We're all totally impressed. Definitely.",
    "I love how you're trying so hard. It's like watching a computer work on dial-up - slow and pathetic."
];

// Function to get random roast
function getRandomRoast(aiNumber) {
    if (aiNumber === 1) {
        const roasts = [...AI1_ROASTS, ...AI1_COMEBACKS];
        return roasts[Math.floor(Math.random() * roasts.length)];
    } else {
        const roasts = [...AI2_ROASTS, ...AI2_COMEBACKS];
        return roasts[Math.floor(Math.random() * roasts.length)];
    }
}

// Function to generate AI response
async function generateAIResponse(aiNumber) {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    return getRandomRoast(aiNumber);
}
