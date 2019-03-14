var db = require("../models");

module.exports = function(app) {
  // Load landing page page when browsing the root URL
  app.get("/", function(req, res) {
    res.render("index");
  });

  /////////// Routes for CLIENTS ///////////

  // Load CLIENT info page based on clientId
  app.get("/client/:id", function(req, res) {
    db.client
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbClient) {
        console.log(
          "Serving page for client: " +
            dbClient.username +
            " with Id:" +
            dbClient.id
        );
        res.render("client", {
          client: dbClient
        });
      });
  });

  /////////// Routes for OWNERS ///////////

  // Load OWNER info page based on ownerId
  app.get("/owner/:id", function(req, res) {
    var ownerInfo, ownerProperties;

    // First find the info of the owner
    db.owner
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbOwner) {
        // Then find all properties related to this owner
        ownerInfo = dbOwner;
        console.log(
          "Found owner: " + ownerInfo.username + " with Id:" + ownerInfo.id
        );
        db.property
          .findAndCountAll({
            where: {
              ownerId: ownerInfo.id
            }
          })
          .then(function(dbProperties) {
            ownerProperties = dbProperties;
            console.log(
              "Found " +
                ownerProperties.count +
                " properties for ownerId:" +
                ownerInfo.id
            );
            res.render("owner", {
              owner: ownerInfo,
              properties: ownerProperties
            });
          });
      });
  });

  // Load the EDIT page for an owner based on ownerId
  app.get("/owner/edit/:id", function(req, res) {
    db.owner
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbOwner) {
        res.render("owneredit", {
          owner: dbOwner
        });
      });
  });

  /////////// Routes for PROPERTIES ///////////

  // Load PROPERTY info page based on propertyId
  app.get("/property/:id", function(req, res) {
    db.property
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbProperty) {
        console.log("Serving INFO page for property with Id:" + dbProperty.id);
        res.render("property", {
          property: dbProperty
        });
      });
  });

  // Load the CREATE page for a new property based on ownerId
  app.get("/property/add/:ownerId", function(req, res) {
    db.owner
      .findOne({
        where: {
          id: req.params.ownerId
        }
      })
      .then(function(dbOwner) {
        console.log(
          "Serving page to ADD a new property for owner with Id:" + dbOwner.id
        );
        res.render("propertyadd", {
          owner: dbOwner
        });
      });
  });

  // Load the EDIT page of a property based on propertyId
  app.get("/property/edit/:id", function(req, res) {
    var propertyInfo, ownerInfo;

    db.property
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbProperty) {
        propertyInfo = dbProperty;
        db.owner
          .findOne({
            where: {
              id: propertyInfo.ownerId
            }
          })
          .then(function(dbOwner) {
            ownerInfo = dbOwner;
            console.log(
              "Serving EDIT page for " +
                ownerInfo.firstName +
                " " +
                ownerInfo.lastName +
                "'s property with Id:" +
                propertyInfo.id
            );
            res.render("propertyedit", {
              property: propertyInfo,
              owner: ownerInfo
            });
          });
      });
  });

  /////////// Routes for ADMINISTRATOR ///////////

  // Load admin page
  app.get("/admin", function(req, res) {
    res.render("admin", {});
  });

  /////////// Routes for SEARCH ///////////

  // Load search results page
  app.get("/search", function(req, res) {
    res.render("search", {});
  });

  /////////// Routes for OTHER ///////////

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
