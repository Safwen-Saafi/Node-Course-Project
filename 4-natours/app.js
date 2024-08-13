const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});



app.get("/api/v1/tours/:id", (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find( el => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: "fail",
      message: "Id not found"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    })
  }
});

// pp.get("/api/v1/tours/:id/:x/;y?", (req, res) => ..... with the ? you make that param optional




app.patch("/api/v1/tours/:id", (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  if (id > tours.length){
    res.status(404).json({
      status: "fail",
      message: "Id not found"
    });
  } else {
    res.status(200).json({
      status: "success",
      message: '<Updated>'
    })
  }
});


app.delete("/api/v1/tours/:id", (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  if (id > tours.length){
    res.status(404).json({
      status: "fail",
      message: "Id not found"
    });
  } else {
    res.status(204).json({
      status: "success",
      data: null
    })
  }
});

// res.status(204) 204 stands for null content because when deleting we return nothing

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tours: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
