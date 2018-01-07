undo-redo
=========

A simple to use, powerful all-purpose undo-redo stack for JavaScript.


Features
--------

- Lightweight (< 1 kb), efficient and easy to use!
- Add any kind of data to the stack (text, images, canvas data, objects, arrays etc.).
- Single undo() call, returns object for new state
- Single redo() call, returns object for new state (if possible)
- Can use callback functions on undo/redo
- Set optional limit (with FIFO)
- Get undo/redo status, count and pointer
- Get or set stack content for storage.
- HTML documentation included in addition to source documentation

See the `demos` directory for example usage.


Install
-------

**undo-redo** can be installed in various ways:

- Bower: `bower install undo-redo`
- Git using HTTPS: `git clone https://github.com/epistemex/undo-redo.git`
- Git using SSH: `git clone git@github.com:epistemex/undo-redo.git`
- Download [zip archive](https://github.com/epistemex/undo-redo/archive/master.zip) and extract.
- [undo-redo.js](https://raw.githubusercontent.com/epistemex/undo-redo/master/src/undo-redo.js)
- [undo-redo.min.js](https://raw.githubusercontent.com/epistemex/undo-redo/master/dist/undo-redo.min.js)


Usage
-----

Include script, create an instance:
```javascript
var stack = new UndoRedo();
```

Add some states to the stack:
```javascript
stack.add(myCurrentData);   // push data to stack, each add is one undo state
```

To undo call the `undo()` method. Data from the previous state is returned.
If at beginning of stack `null` will be returned:
```javascript
var data = stack.undo();    // return previous state data
if (data) { /* set data */ }
```

If no `add()` was called since last undo, `redo()` can be called. The data for
new current state is returned, or `null` if a redo wasn't possible:
```javascript
var data = stack.redo();    // redo and return data for next state if any
if (data) { /* set data */ }
```

For more advanced usage callbacks can be used:
```javascript
var stack = new UndoRedo();
stack.onundo = function(data) { /* data or null */ }
stack.onredo = function(data) { /* data or null */ }
//...
stack.undo();               // invokes callback
```

Callbacks can be set via options:
```javascript
var stack = new UndoRedo({
      limit: 100,             // defaults to -1 = unlimited
      onUndo: undoCallback,
      onRedo: redoCallback
    });
```

License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial
projects provided that full header (minified and developer versions) is included.

*&copy; 2015-2018 Epistemex*

![Epistemex](http://i.imgur.com/wZSsyt8.png)