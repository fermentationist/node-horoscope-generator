import * as url from "node:url";
import fs from "fs";
import "dotenv/config";
import { Configuration, OpenAIApi } from "openai";
import CLISpinner from "./cliSpinner.js";

const OUTPUT_DIRECTORY = process.env.NHG_OUTPUT_DIRECTORY || "temp";
const GPT_MODEL = process.env.OPENAI_GPT_MODEL || "text-davinci-003";
let tempDirExists = null;

// instantiate a new CLISpinner
const spinner = new CLISpinner();

// initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// getOpenAiCompletion returns a promise that resolves to the response from the OpenAI API createCompletion endpoint
export const getOpenAiCompletion = (prompt, temperature = 1) => {
  return openai.createCompletion({
    model: GPT_MODEL,
    prompt,
    max_tokens: 1792,
    temperature,
  });
};

// getHoroscopeCompletion returns a string containing a horoscope generated by the OpenAI API
async function getHoroscopeCompletion(prompt) {
  performance.mark("start");
  console.log("Generating horoscope. This may take a minute...");
  spinner.start();
  const response = await getOpenAiCompletion(prompt);
  spinner.stop();
  performance.mark("end");
  console.log("GPT model used:", response?.data?.model);
  console.log("Total tokens:", response?.data?.usage?.total_tokens);
  const measurement = performance.measure("getOpenAiCompletion", "start", "end");
  console.log("Time to run: ", (parseFloat((measurement.duration / 1000).toFixed(2))), "s");
  console.log("Memory usage:", parseFloat((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)), "MB");
  return response?.data?.choices && response.data.choices[0].text;
}

// getFullDateString returns a string representation of a date, in the format Day, Month Date, Year
function getFullDateString(date = new Date(), timeZone = "America/Chicago") {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone,
  }).format(date);
}

// getDateString returns a string representation of a date, in the format YYYY-MM-DD
function getDateString(dateObj = new Date(), timeZone = "America/Chicago") {
  if (typeof dateObj === "string") {  
    return dateObj;
  }
  const intlString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone,
  }).format(dateObj);
  const [month, date, year] = intlString.split("/");
  return `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`;
}

// given a string in the format "YYYY-MM-DD" (or a Date object), returns the equivalent Date object, or a Date object for the current date if no argument is provided
function getDateFromDateString(dateString) {
  if (dateString instanceof Date) {
    return dateString;
  }
  if (!dateString) {
    return new Date();
  }
  const [year, month, date] = dateString.split("-");
  return new Date(year, month - 1, date);
}

// given a date object or a date string, returns a string that can be used as a title for the horoscope
const getTitle = (dateOrDateString) => {
  const date = getDateFromDateString(dateOrDateString);
  return `Horoscope for ${getFullDateString(date)}`;
};

// given a date object or a date string, returns a string that can be used as a prompt for the OpenAI API
function getHoroscopePrompt(dateOrDateString) {
  return `Write a horoscope for all 12 zodiac signs (with the emoji for each sign after its name), that is ocassionally funny, cryptic, or ominous, in the form a markdown file (using formatting where appropriate), with the main heading "${getTitle(dateOrDateString)}". Write at least 4 sentences for each sign, followed by 6 "Lucky Numbers" (5 random integers {1 through 69, inclusive}, and a sixth integer {1 through 26, inclusive (displayed in bold)}.`;
}

// writeToFile writes the blog post to a markdown file
function writeToFile(dirName, slug, data) {
  if (tempDirExists === null) {
    // have not yet checked if directory exists
    tempDirExists = fs.existsSync(dirName);
  }
  if (!tempDirExists) {
    fs.mkdirSync(dirName);
  }
  return fs.writeFileSync(`${dirName}/${slug}.md`, data, "utf8");
}

const addFrontMatterAndTitle = (content, dateOrDateString) => {
  return `---\ntitle: ${getTitle(dateOrDateString)}\ndate: "${getDateString(dateOrDateString)}"\n---\n\n${content}`;
};

// createHoroscope returns a string representation of a markdown file, which contains a horoscope generated by the OpenAI API
export async function createHoroscope({ 
    date: dateOrDateString, // "YYYY-MM-DD" or Date object
    temperature // Number between 0 and 2, defaults to 1.0. Higher values result in more "creative" results, but also more mistakes.
  } = {}) {
  const dateObj = getDateFromDateString(dateOrDateString);
  const prompt = getHoroscopePrompt(dateObj);
  const content = await getHoroscopeCompletion(prompt, temperature);
  const fullContent = addFrontMatterAndTitle(content, dateObj);
  return fullContent;
}

// createHoroscopeAndSaveToFile calls createHoroscope and then saves the result to a file
export async function createHoroscopeAndSaveToFile({
  date: dateOrDateString, // "YYYY-MM-DD" or Date object
  temperature, // Number between 0 and 2, defaults to 1.0. Higher values result in more "creative" results, but also more mistakes.
  outputDirectory = OUTPUT_DIRECTORY,
} = {}) {
  const dateObj = getDateFromDateString(dateOrDateString);
  const content = await createHoroscope({ date: dateObj, temperature });
  const dateString = getDateString(dateObj);
  writeToFile(outputDirectory, dateString, content);
  console.log(`Wrote horoscope to ${outputDirectory}/${dateString}.md`);
}

// run createHoroscopeAndSaveToFile if run from the command line (not imported as a module)
if (import.meta.url.startsWith("file:")) {
  const path = url.fileURLToPath(import.meta.url);
  const [_, modulePath, date, temperature] = process.argv;
  if (modulePath === path) {
    await createHoroscopeAndSaveToFile({ date, temperature });
  }
}
