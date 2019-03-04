import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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

Template.images.helpers({images:img_data});

Template.images.events({
  'click .js-image': function(event){
    $(event.target).css("width", "80%");
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
