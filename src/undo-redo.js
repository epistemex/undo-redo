/*!
	undo-redo 1.3.0
	(c) Epistemex 2015-2018, 2024
	MIT License
*/

/**
 * Creates a new undo-redo stack.
 *
 * Note: data pushed to the stack is stored AS-IS. If you need to store dereferenced objects the object
 * need to be deep-cloned beforehand, then store the clone instead.
 *
 * @property {function} [onundo] - Set a function to call back when an undo is performed. The argument given is the data for the state.
 * If undo is not possible it will be called with null as argument, so it can be used to update button states etc.
 * @property {function} [onredo] - Set a function to call back when a redo is performed. The argument given is the data for the state.
 * If redo is not possible, the function will be called with null, so that it can be used to update button states etc.
 * @param {object} [options] - Optional option object (JSON)
 * @param {number} [options.limit=-1] max number of entries. Stack will remove first (oldest) entry when limit is reached. Use -1 for "unlimited" number of entries.
 * @param {*} [options.onUndo] optional callback function for [undo()]{@linkcode UndoRedo#undo}. Can also be set directly with the `onundo` property.
 * @param {*} [options.onRedo] optional callback function for [redo()]{@linkcode UndoRedo#redo}. Can also be set directly with the `onredo` property.
 * @constructor
 */
function UndoRedo(options) {
  options = Object.assign({}, options);

  this.lm = +(options.limit || -1);   // limit
  this.st = [];                       // stack array
  this.sp = this.cn = 0;                // stack pointer / current index
  this.fs = null;                     // first out

  this.onundo = options.onUndo;
  this.onredo = options.onRedo;
}

UndoRedo.prototype = {

  /**
   * Add data to the stack (push). Add the data you want to store as a state.
   * You can store any kind of data - the object passed will be stored
   * as-is. It returns the new stack pointer position.
   *
   * A call to add() will delete redo stack entries if any and reset
   * stack pointer to current state.
   *
   * @param {*} data - data object, number, array, ..., to store
   * @returns {number} - new stack pointer position
   */
  add: function(data) {

    const stack = this.st;
    const pos = this.sp;
    const len = stack.length;
    const limit = this.lm;

    if ( pos < len )
      stack.splice(pos, len - pos);

    if ( limit > -1 && pos === limit )
      this.fs = stack.shift();

    this.cn++;
    stack.push(data);

    return this.sp = stack.length;
  },

  /**
   * Call this when you want to retrieve last state (pop). The data returned
   * can be used to replace current. If there are no undo states null
   * will be returned.
   *
   * You can call [canUndo()]{@linkcode UndoRedo#canUndo} in advance to check if undo is possible.
   *
   * @returns {*|null} Previous state object, or null if none
   */
  undo: function() {

    let res = null;

    if ( this.sp ) {
      this.cn--;
      res = this.st[ --this.sp - 1 ] || this.fs;
    }

    if ( this.onundo ) this.onundo(res);
    return res;
  },

  /**
   * Redo can only be performed if you want to "cancel" a previous undo.
   * It will move the pointer forward and return the data representing
   * current state.
   *
   * If you call add() after a undo() call, redo is not possible.
   * You can use [canRedo()]{@linkcode UndoRedo#canRedo} to check if redo() is possible.
   *
   * @returns {*|null} current state to use, or null if redo is not possible.
   */
  redo: function() {

    const stack = this.st;
    let res = null;

    if ( this.sp < stack.length ) {
      this.cn++;
      res = stack[ this.sp++ ];
    }

    if ( this.onredo ) this.onredo(res);
    return res;
  },

  /**
   * This call will return true if [undo()]{@linkcode UndoRedo#undo} is possible. It can be used
   * to set status of a undo button for example.
   *
   * @returns {boolean}
   */
  canUndo: function() {
    return this.sp > 0;
  },

  /**
   * This call will return true if [redo()]{@linkcode UndoRedo#redo} is possible. It can be used
   * to set status of a redo button for example.
   *
   * @returns {boolean}
   */
  canRedo: function() {
    const len = this.st.length;
    return len && this.sp < len;
  },

  /**
   * Get current stack pointer/position in stack. Pointer is affected
   * by limit and will never exceed limit if limit is set. A pointer of
   * value 0 does not mean there hasn't been previous states, they can
   * simply have been purged due to the limit. Use [count()]{@linkcode UndoRedo#count} to find
   * out if the stack would be in its initial state or not.
   * @returns {number}
   */
  pointer: function() {
    return this.sp;
  },

  /**
   * Get total count track. Use this to find out if the stack is in its
   * original initial state, in which case 0 will be returned. If > 0
   * at first undo (no data returned using [undo()]{@linkcode UndoRedo#undo}), indicates that the
   * first entries has been purged and therefor not available. This can
   * happen if a [limit()]{@linkcode UndoRedo#limit} (or via options) has been set.
   * @returns {number}
   */
  count: function() {
    return this.cn;
  },

  /**
   * Set or get current limit. If no argument is given then current
   * limit is returned. Provide a limit >= 1. If the new limit is lower
   * than existing entries, entries exceeding the limit will be purged.
   *
   * @param {number} [limit] - new limit
   * @returns {*|number} - if no argument is given current limit is returned.
   */
  limit: function(limit) {

    const len = this.st.length;

    if ( !limit ) return this.lm;

    this.lm = limit;

    if ( len > limit ) {
      this.st.splice(limit, len);
    }
  },

  /**
   * Get or set current stack. If no argument is given a stack object
   * is returned representing current stack. This object can for example
   * be stored (be sure data stored can be serialized if you intend to
   * use localStorage and similar mechanisms).
   *
   * Note that it references the entries internally.
   * The container object structure is to be considered private.
   *
   * @param {*} [stack] - a previously obtained stack object.
   * @returns {*} If no argument is given, a stack object is returned
   */
  stack: function(stack) {
    if ( !stack ) return {
      st: this.st.concat(),
      sp: this.sp
    };

    this.st = stack.st;
    this.sp = +stack.sp;
  }
};

// node support
if ( typeof exports !== 'undefined' ) exports.UndoRedo = UndoRedo;
