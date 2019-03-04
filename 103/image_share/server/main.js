import { Meteor } from 'meteor/meteor';

Meteor.startup(function(){
  Images = new Mongo.Collection("images");
  console.log("server main.js says: "+Images.find().count());

  console.log("I am the server!");
    if (Images.find().count() == 0) {
      for (var i=1; i<5; i++) {
        Images.insert(
          {
              img_src: "IMG_0"+i+".JPG",
              img_alt: "Image number "+i,
              img_description: "Description of image number "+i
          }
          );
      }
    }

});