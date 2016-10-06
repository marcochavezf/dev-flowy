/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Service from '../api/service/service.model';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import _ from 'lodash';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });

Service.find({})
  .then((res) => {
    if(!_.isEmpty(res)){
      return res;
    }
    //Create a service if doesn't exist
    Service.create({
        name: 'test',
        info: 'test',
        active: true,
        endpoint: 'api/test',
        draw2dContent: [
          {
            "type": "draw2d.shape.node.Start",
            "id": "5f8f5e21-2ba0-f984-7ea0-80555f12777a",
            "x": 50,
            "y": 50,
            "width": 50,
            "height": 50,
            "alpha": 1,
            "angle": 0,
            "userData": {
              "isSystem" : true
            },
            "cssClass": "draw2d_shape_node_Start",
            "ports": [
              {
                "type": "draw2d.OutputPort",
                "id": "27ae5c1f-6e35-6d54-95b5-96eae9a98a49",
                "width": 10,
                "height": 10,
                "alpha": 1,
                "angle": 0,
                "userData": {},
                "cssClass": "draw2d_OutputPort",
                "bgColor": "#4F6870",
                "color": "#1B1B1B",
                "stroke": 1,
                "dasharray": null,
                "maxFanOut": 9007199254740991,
                "name": "output0",
                "port": "draw2d.OutputPort",
                "locator": "draw2d.layout.locator.OutputPortLocator"
              }
            ],
            "bgColor": "#4D90FE",
            "color": "#000000",
            "stroke": 1,
            "radius": 0,
            "dasharray": null
          },
          {
            "type": "draw2d.shape.node.End",
            "id": "b3575253-ae23-3409-2358-333bd6abf4ed",
            "x": 419,
            "y": 167,
            "width": 50,
            "height": 50,
            "alpha": 1,
            "angle": 0,
            "userData": {
              "isSystem" : true
            },
            "cssClass": "draw2d_shape_node_End",
            "ports": [
              {
                "type": "draw2d.InputPort",
                "id": "b0ae83ad-1c3a-bcde-f444-28c44c14ec2a",
                "width": 10,
                "height": 10,
                "alpha": 1,
                "angle": 0,
                "userData": {},
                "cssClass": "draw2d_InputPort",
                "bgColor": "#4F6870",
                "color": "#1B1B1B",
                "stroke": 1,
                "dasharray": null,
                "maxFanOut": 9007199254740991,
                "name": "input0",
                "port": "draw2d.InputPort",
                "locator": "draw2d.layout.locator.InputPortLocator"
              }
            ],
            "bgColor": "#4D90FE",
            "color": "#000000",
            "stroke": 1,
            "radius": 0,
            "dasharray": null
          }
        ]
      })
      .then(() => {
        console.log('finished populating service(test)');
      });
  });
