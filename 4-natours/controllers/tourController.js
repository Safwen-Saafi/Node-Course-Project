const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(`Requested id is: ${val}`);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Id not found',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
// pp.get("/api/v1/tours/:id/:x/;y?", (req, res) => ..... with the ? you make that param optional

exports.updateTour = (req, res) => {
  // console.log(req.params);
  res.status(200).json({
    status: 'success',
    message: '<Updated>',
  });
};

exports.deleteTour = (req, res) => {
  // console.log(req.params);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// res.status(204) 204 stands for null content because when deleting we return nothing
// // res.status((500) 500 stands for internal server error

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  console.log(req.body);
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name or Price missing',
    });
  }
  next();
};

//The condition !req.body.price) is used to check if the price field is missing or falsy (i.e., undefined, null, 0, an empty string, etc.) in the request body. 
// If req.body.price is falsy, the condition will evaluate to true, triggering the associated block of code.
