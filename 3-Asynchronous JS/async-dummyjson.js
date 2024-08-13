const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(new Error(`Couldn't read file: ${err.message}`));
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject(new Error(`Could not write file: ${err.message}`));
      resolve('Successfully wrote file');
    });
  });
};

const fetchData = async () => {
  try {
    const data = await readFilePromise('./productid.txt');
    const res = await superagent.get(`https://dummyjson.com/products/${data}`);
    console.log('Id : ', res.body.id);
    console.log('Title : ', res.body.title);
    console.log('Description : ', res.body.description);
    console.log('Price', res.body.price);
    const imagesString = res.body.images.join('\n');
    await writeFilePromise('./imageSaved.txt', imagesString);
    console.log('file has been successfully saved 👌');
  } catch (err) {
    console.log(err.message);
  }
};
fetchData();

//id from 1 to 30
