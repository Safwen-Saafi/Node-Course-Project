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

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  .catch((err) => {
    if (err.message === 'File not found 😢' || err.message === 'Could not write to file 😢') {
      console.error(err.message);
    } else if (err.response && err.response.status === 404) {
      console.error('Motherf****r, Invalid dog breed 😢');
    } else {
      console.error('An unexpected error occurred:', err.message || err);
    }
  });
