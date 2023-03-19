import { createHoroscope } from "./createHoroscope.js";

const horoscope = await createHoroscope({
  date: "2021-01-01",
  temperature: 1.05,
});

console.log(horoscope);