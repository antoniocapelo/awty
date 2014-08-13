Are We There Yet? 
====

**awty** is a JS Tool for Adding / Removing CSS Classes when the user is scrolling / loading / resizing the window. 

It's small (~4kB) and pretty configurable.


# Demo

You can find a live demo [here](http://antoniocapelo.github.io/awty)


# Usage

* In your html include the awty script: ``<script src="js/awty/dist/awty.min.js"></script>``

* Create an awty instance and initiate it: ``<script>new Awty().init();</script>``

## Configuration object

The Awty constructor accepts an optional config object as an argument, which by default is:

    config = {
      tidy: true,
      defaultClass: 'awty',
      fn: null
      mobile: true,
      desktop: true
    }	

* **tidy** {boolean} : if true, detaches the 'scroll' event listener when all classes were added / removed;
* **defaultClass** {String} : defines the class used by the awty instance to detect which elements should be processed;
* **fn** {function} : global callback which is called at every element update;
* **mobile** {boolean} : if false, disables the awty behaviour on mobile devices;
* **desktop** {boolean} : if false, disables the awty behaviour on desktop devices;

## Setting up the elements

By default, an awty instance applies the class defined on the **data-awty** attribute (``data-awty="classname"`` for example).
On the other hand, awty will remove the defined class if the **remove mode** is set to true (``data-awty-remove="true"``).

To add/remove more than one class, just separate each classname by a comma (``data-awty="classname1,classname2"`` ).

## Adding/Removing classes temporarily

The class update for a certain element can be reverted as soon as the element position doesn't respect the awty mode applied.

  * Add data-awty="classname" on the html element
  * Define awty mode (if you want to) data-awty-mode="peek"
  * Activate the toggle option ``data-awty-toggle="true"``

## Adding Elements afterwards

Awty has a ``register`` function that lets manually add elements to its instance (for asynchronously added elements for example). 
The awty update options for that element can be defined on the element itself or passed as an argument to the register function.
Also, when registering elements, a callback can be defined, which will be triggered when updating the element's classes.

Example:

    var e = document.querySelector('.classname'),
      cfgs = {
        awty: 'classname1,classname2',
        mode: 'peek',
        space: '0.4'
      },
      fn = function () {...}

    awtyInstance.register(e, cfgs, fn);

## Modes

Awty has 4 modes of operation:

* **default**: adds the class as soon as the element is completely on the window viewport
* **peek**: adds the class when a certain percentage of the element is visible:
  * ``data-awty-mode="peek"`` 
  * ``data-awty-space="0.3"`` (space is indicated as a percentage) Note: a space of 0 will apply the class(es) as soon as the element enters the viewport.
* **margin**: adds the classe after a certain margin from the viewport's edge is reached
  * ``data-awty-mode="margin"`` 
  * ``data-awty-space="50"`` (space is indicated in px's)
* **center**: adds the classe when the middle of the element reaches the middle of the viewport +/- a "room for maneuver"):
  * ``data-awty-mode="center"`` 
  * ``data-awty-space="30"`` (by default is 20px but can be overriden)


# Contributions

This is a small plugin but there's always room for improvement. If you wish to contibute, you should work on the **src/awty.js** file. Currently I'm using ~~*grunt*~~ **gulp** (thanks [@joaoflf](https://github.com/joaoflf)) to minify and jshint the javascript and build the demo files, so you should run ``npm install`` to get the necessary dependencies to build it.

