import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Images = new Mongo.Collection("images");

Session.set("imageLimit", 8);

lastScrollTop = 0; 
$(window).scroll(function(event){
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    // where are we in the page? 
    var scrollTop = $(this).scrollTop();
    // test if we are going down
    if (scrollTop > lastScrollTop){
      // yes we are heading down...
     Session.set("imageLimit", Session.get("imageLimit") + 4);
    }

    lastScrollTop = scrollTop;
  }
});

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

Template.images.helpers({
  images:function(){
    if (Session.get("userFilter")) {
      //console.log("clicaram ó");
      //return Images.find({}, {sort:{createdOn:-1, rating:-1}});
      return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1, rating:-1}});
    } else {
      //console.log("nao clicaram ó");
      return Images.find({}, {sort:{createdOn:-1, rating:-1}, limit: Session.get("imageLimit")});
    }
  },

  filtering_images:function(){
    if (Session.get("userFilter")) {
      return true;
    } else {
      return false;
    }
  },

  getFilterUser:function(){
    if (Session.get("userFilter")) {
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    } else {
      return false;
    }
  },

  getUser:function(user_id){
    var user = Meteor.users.findOne({_id:user_id})
    if (user) {
      return user.username;
    } else {
      return "anon";
    }
  }
});

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
  },

  'click .js-set-user-filter': function(event){
    Session.set("userFilter", this.createdBy);
  },

  'click .js-remove-user-filter': function(event){
    Session.set("userFilter", undefined);
  }
});

Template.image_add_form.events({
  'submit .js-add-image': function(event){
    var img_src, img_alt
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log("src: "+img_src+" alt: "+img_alt);

    if (Meteor.user()){
      Images.insert(
        {
            img_src: img_src,
            img_alt: img_alt,
            img_description: "teste lala",
            createdOn: new Date(),
            createdBy: Meteor.user()._id
        }
      );
    }
    
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
