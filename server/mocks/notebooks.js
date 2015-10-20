module.exports = function(app) {
  var express = require('express');
  var notebooksRouter = express.Router();
  var bodyParser = require('body-parser');
  var nedb = require('nedb');

  app.use(bodyParser.json());

  var notebookDb = new nedb({ filename : 'notebooks', autoload : true });

  notebooksRouter.get('/', function(req, res) {
    notebookDb.find(req.query).exec(function (error, notebooks) {
      res.send({
        'notebooks': notebooks
      });
    });
  });

  notebooksRouter.post('/', function(req, res) {
    notebookDb.find({}).sort({id : -1}).limit(1).exec(
      function (err, notebooks) {
        // TODO DRY This is repeated in the users route as well
        // Create a reusable utility for autoincrementing IDs
        // This has to be available in the database functionality
        // Perhaps ember mirage supports this
        if (notebooks.length != 0) {
          req.body.notebook.id = notebooks[0].id + 1;
        } else {
          req.body.notebook.id = 1;
        }

        notebookDb.insert(req.body.notebook, function (err, newNotebook) {
          res.status(201);
          res.send(JSON.stringify({ notebook : newNotebook }));
        });
      }
    );
  });

  notebooksRouter.get('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.put('/:id', function(req, res) {
    res.send({
      'notebooks': {
        id: req.params.id
      }
    });
  });

  notebooksRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/notebooks', notebooksRouter);
};
