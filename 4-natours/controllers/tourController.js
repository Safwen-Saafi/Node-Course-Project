const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalide data set !',
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestTime: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  try {
    const tour = await Tour.findById(req.params.id);
    console.log(tour);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Id not found',
    });
  }
};
// // pp.get("/api/v1/tours/:id/:x/:y?", (req, res) => ..... with the ? you make that param optional

exports.updateTour = async (req, res) => {
  // console.log(req.params);
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      dat: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to Update',
    });
  }
};

exports.deleteTour = async (req, res) => {
  // console.log(req.params);
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to Delete',
    });
  }
};
// // res.status(204) 204 stands for null content because when deleting we return nothing
// // res.status((500) 500 stands for internal server error





// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   console.log(req.body);
//   // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   const newTour = { id: newId, ...req.body };
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/starter/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     () => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };
// res.status((201) 201 stands for successfully created item

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Name or Price missing',
//     });
//   }
//   next();
// };

//The condition !req.body.price) is used to check if the price field is missing or falsy (i.e., undefined, null, 0, an empty string, etc.) in the request body
// If req.body.price is falsy, the condition will evaluate to true, triggering the associated block of code.

//In case we use json file locally
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkId = (req, res, next, val) => {
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
//   console.log(`Requested id is: ${val}`);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Id not found',
//     });
//   }
//   next();
// };
