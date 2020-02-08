'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MOCKS_FILE = `mocks.json`;
const TITLES_PATH = `./data/titles.txt`;
const CATEGORIES_PATH = `./data/categories.txt`;
const SENTENCES_PATH = `./data/sentences.txt`;

const OfferType = {
  offer: `offer`,
  sale: `sale`,
};

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const PictureRestrict = {
  min: 1,
  max: 16,
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

const readFile = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, `utf8`);

    return text.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readFile(TITLES_PATH);
    const categories = await readFile(CATEGORIES_PATH);
    const sentences = await readFile(SENTENCES_PATH);
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(MOCKS_FILE, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
