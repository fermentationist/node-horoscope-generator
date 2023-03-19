# node-horoscope-generator

A Node.js app that uses the OpenAI API to create a horoscope and then outputs it as a markdown file.

## Installation

1. Open the terminal, navigate to a suitable install location, and then **clone the repository to your local machine: `git clone https://github.com/fermentationist/node-horoscope-generator.git`**.
2. Navigate to the root folder of the app (`cd node-horoscope-generator`), then **`npm install`**.
3. Next you need to **create a file to store environment variables**. It should be named `.env`. (Starting the filename with a `.` might cause the file to be hidden in your OS's file system, so you might need to enable viewing hidden files.) **You may do this by copying and renaming `example_env` with the command `cp example_env .env`**. 
4. You will need to **set an environment variable in your `.env` file named `OPENAI_API_KEY` to your OpenAI API key**, like `OPENAI_API_KEY = <your key>`. You may also set an output directory in which to save files, using the `NHG_OUTPUT_DIRECTORY` environment variable. If you copied the `example_env` file in the previous step, just add you API key to the existing variable. Also note that `.env` is already included in the `.gitignore` file, so you don't need to worry about accidentally committing your API key to the repository.

## Use (command-line)

- To create a new horoscope for the current date, from the root folder of the app, run **`node createHoroscope.js`**.
- If you would like to generate a horoscope for a specific date other than today, add the date, in YYYY-MM-DD format: **`node createHoroscope.js <date>`**.
- Another parameter may be added to adjust the "temperature" of the response. This temperature parameter is a number between 0 and 2, that controls how "creative" the output is (this is a feature of the OpenAI API). It is set to 1 by default.  A higher number will result in more "creative" (and possibly nonsensical) output. **`node createHoroscope.js <date> <temperature>`**
- Generated horoscopes will be saved to the directory defined in the `NHG_OUTPUT_DIRECTORY` environment variable (or else in `/temp/`) as `<date>.md`.

## Use (module)

```javascript
import { createHoroscope, createHoroscopeAndSaveToFile } from "./createHoroscope.js";

// generate today's horoscope as a text string
const todayHoroscope = await createHoroscope();

// generate a horoscope for a specific date as a text string
const horoscope = await createHoroscope({date: "1999-12-31"});

// -or-

// generate a horoscope and save to disk as markdown file (optional temperature parameter also used here)
await createHoroscopeAndSaveToFile({date: "1999-12-31", temperature: 1.1});

```
---

#### Copyright © 2023 [Dennis Hodges](https://dennis-hodges.com) 

### License

__The MIT License__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
NBPG_AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.