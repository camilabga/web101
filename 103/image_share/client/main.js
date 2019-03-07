import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Images = new Mongo.Collection("images");

var img_data = [
  {
    img_src: "IMG_01.JPG",
    img_alt: "Paris",
    img_description: "Me, mom and dad in the top of the Eiffel Tower"
  },

  {
    img_src: "IMG_02.JPG",
    img_alt: "Vienna",
    img_description: "Fist day in Vienna"
  },

  {
    img_src: "IMG_03.JPG",
    img_alt: "Budapest",
    img_description: "Top of the hill in Budapest"
  },

  {
    img_src: "IMG_04.JPG",
    img_alt: "London",
    img_description: "In front of the Parlament, Big Ben"
  }

];

//Template.images.helpers({images:img_data});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.images.helpers({images:Images.find({}, {sort:{createdOn:-1, rating:-1}})});

Template.body.helpers({username:function(){
  if (Meteor.user()) {
    return Meteor.user().username;
  } else {
    return "anonymous internet user";
  }
}});

Template.images.events({
  'click .js-image': function(event){
    $(event.target).css("width", "80%");
  },

  'click .js-del-image': function(event){
    var image_id = this._id;
    console.log(image_id);
    //Images.remove({"_id":image_id});
    $("#"+image_id).hide('slow', function(){
      Images.remove({"_id":image_id});
    });
  },

  'click .js-rate-image': function(event){
    var rating = $(event.currentTarget).data("userrating");
    var image_id = this.id;

    Images.update({_id:image_id}, 
                  {$set: {rating:rating}});

    console.log("image "+image_id+" has "+rating+" stars");
  },

  'click .js-show-image-form': function(event){
    $("#image_add_form").modal('show');
  }
});

Template.image_add_form.events({
  'submit .js-add-image': function(event){
    var img_src, img_alt
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log("src: "+img_src+" alt: "+img_alt);
    Images.insert(
      {
          img_src: img_src,
          img_alt: img_alt,
          img_description: "teste lala",
          createdOn: new Date()
      }
      );
      $("#image_add_form").modal('hide');
    return false;
  }
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
