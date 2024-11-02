const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(new Error('File not found 😢'));
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(new Error('Could not write to file 😢'));
      resolve('success');
    });
  });
};

const getDogP = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file!');
  } catch (err) {
    if (
      err.message === 'File not found 😢' ||
      err.message === 'Could not write to file 😢'
    ) {
      console.error(err.message);
    } else if (err.response && err.response.status === 404) {
      console.error('Motherf****r, Invalid dog breed 😢');
    } else {
      console.error('An unexpected error occurred:', err.message || err);
    }
  }
};
getDogP();


