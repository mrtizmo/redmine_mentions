// Generated by CoffeeScript 1.4.0
(function() {
  var MentionsBase, MentionsContenteditable, MentionsInput, Selection, entityMap, escapeHtml, namespace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  namespace = "mentionsInput";

  Selection = {
    get: function(input) {
      return {
        start: input[0].selectionStart,
        end: input[0].selectionEnd
      };
    },
    set: function(input, start, end) {
      if (end == null) {
        end = start;
      }
      if (input[0].selectionStart) {
        input[0].selectStart = start;
        return input[0].selectionEnd = end;
      }
    }
  };

  entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };

  escapeHtml = function(text) {
    return text.replace(/[&<>"'\/]/g, function(s) {
      return entityMap[s];
    });
  };

  $.widget("ui.areacomplete", $.ui.autocomplete, {
    options: $.extend({}, $.ui.autocomplete.prototype.options, {
      matcher: "(\\b[^,]*)"
    }),
    _create: function() {
      this.overriden = {
        select: this.options.select,
        focus: this.options.focus
      };
      this.options.select = $.proxy(this.selectCallback, this);
      this.options.focus = $.proxy(this.focusCallback, this);
      $.ui.autocomplete.prototype._create.call(this);
      return this.matcher = new RegExp(this.options.matcher + '$');
    },
    selectCallback: function(event, ui) {
      var after, before, newval, value;
      value = this._value();
      before = value.substring(0, this.start);
      after = value.substring(this.end);
      newval = ui.item.value;
      value = before + newval + after;
      this._value(value);
      Selection.set(this.element, before.length + newval.length);
      if (this.overriden.select) {
        ui.item.pos = this.start;
        this.overriden.select(event, ui);
      }
      return false;
    },
    focusCallback: function() {
      if (this.overriden.focus) {
        return this.overriden.focus(event, ui);
      }
      return false;
    },
    search: function(value, event) {
      var match, pos;
      if (!value) {
        value = this._value();
        pos = Selection.get(this.element).start;
        value = value.substring(0, pos);
        match = this.matcher.exec(value);
        if (!match) {
          return '';
        }
        this.start = match.index;
        this.end = match.index + match[0].length;
        this.searchTerm = match[1];
      }
      return $.ui.autocomplete.prototype.search.call(this, this.searchTerm, event);
    },
    _renderItem: function(ul, item) {
      var anchor, li, value;
      li = $('<li>');
      anchor = $('<a>').appendTo(li);
      if (item.image) {
        anchor.append("<img src=\"" + item.image + "\" />");
      }
      value = item.value.replace(this.searchTerm.substring(), "<strong>$&</strong>");
      anchor.append(value);
      return li.appendTo(ul);
    }
  });

  $.widget("ui.editablecomplete", $.ui.areacomplete, {
    options: $.extend({}, $.ui.areacomplete.prototype.options, {
      showAtCaret: true
    }),
    selectCallback: function(event, ui) {
      var mention, pos;
      pos = {
        start: this.start,
        end: this.end
      };
      if (this.overriden.select) {
        ui.item.pos = pos;
        if (this.overriden.select(event, ui) === false) {
          return false;
        }
      }
      mention = document.createTextNode(ui.item.value);
      insertMention(mention, pos, this.options.suffix);
      this.element.change();
      return false;
    },
    search: function(value, event) {
      var match, node, pos, sel;
      if (!value) {
        sel = window.getSelection();
        node = sel.focusNode;
        value = node.textContent;
        pos = sel.focusOffset;
        value = value.substring(0, pos);
        match = this.matcher.exec(value);
        if (!match) {
          return '';
        }
        this.start = match.index;
        this.end = match.index + match[0].length;
        this._setDropdownPosition(node);
        this.searchTerm = match[1];
      }
      return $.ui.autocomplete.prototype.search.call(this, this.searchTerm, event);
    },
    _setDropdownPosition: function(node) {
      var boundary, posX, posY, rect;
      console.log('this.options.showAtCaret', this.options.showAtCaret)
      if (this.options.showAtCaret) {
        console.log('showAtCaret')
        boundary = document.createRange();
        boundary.setStart(node, this.start);
        boundary.collapse(true);
        rect = boundary.getClientRects()[0];
        posX = rect.left + (window.scrollX || window.pageXOffset);
        posY = rect.top + rect.height + (window.scrollY || window.pageYOffset);
        this.options.position.of = document;
        return this.options.position.at = "left+" + posX + " top+" + posY;
      }
    }
  });

  MentionsBase = (function() {

    MentionsBase.prototype.marker = '\u200B';

    function MentionsBase(input, options) {
      this.input = input;
      this.options = $.extend({}, this.settings, options);
      if (!this.options.source) {
        this.options.source = this.input.data('source') || [];
      }
    }

    MentionsBase.prototype._getMatcher = function() {
      var allowedChars;
      allowedChars = '[^' + this.options.trigger + ']';
      return '\\B[' + this.options.trigger + '](' + allowedChars + '{0,20})';
    };

    MentionsBase.prototype._markupMention = function(mention) {
      return "@[" + mention.name + "](" + mention.uid + ")";
    };

    return MentionsBase;

  })();

  MentionsInput = (function(_super) {
    var mimicProperties;

    __extends(MentionsInput, _super);

    mimicProperties = ['backgroundColor', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderLeftWidth', 'borderBottomWidth', 'borderRightWidth', 'fontSize', 'fontStyle', 'fontFamily', 'fontWeight', 'lineHeight', 'height', 'boxSizing'];

    function MentionsInput(input, options) {
      var container,
        _this = this;
      this.input = input;
      this._updateHScroll = __bind(this._updateHScroll, this);

      this._updateVScroll = __bind(this._updateVScroll, this);

      this._updateValue = __bind(this._updateValue, this);

      this._onSelect = __bind(this._onSelect, this);

      this._addMention = __bind(this._addMention, this);

      this._updateMentions = __bind(this._updateMentions, this);

      this._update = __bind(this._update, this);

      this.settings = {
        delay: 0,
        trigger: '@',
        autoFocus: true,
        widget: 'areacomplete'
      };
      MentionsInput.__super__.constructor.call(this, this.input, options);
      this.mentions = [];
      this.input.addClass('input');
      container = $('<div>', {
        'class': 'mentions-input'
      });
      container.css('display', this.input.css('display'));
      this.container = this.input.wrapAll(container).parent();
      this.hidden = this._createHidden();
      this.highlighter = this._createHighlighter();
      this.highlighterContent = $('div', this.highlighter);
      this.input.focus(function() {
        return _this.highlighter.addClass('focus');
      }).blur(function() {
        return _this.highlighter.removeClass('focus');
      });
      this.autocomplete = this.input[this.options.widget]({
        matcher: this._getMatcher(),
        select: this._onSelect,
        source: this.options.source,
        delay: this.options.delay,
        appendTo: this.input.parent(),
        autoFocus: this.options.autoFocus
      });
      this._setValue(this.input.val());
      this._initEvents();
    }

    MentionsInput.prototype._initEvents = function() {
      var tagName,
        _this = this;
      this.input.on("input." + namespace + " change." + namespace, this._update);
      tagName = this.input.prop("tagName");
      if (tagName === "INPUT") {
        this.input.on("focus." + namespace, function() {
          return _this.interval = setInterval(_this._updateHScroll, 10);
        });
        return this.input.on("blur." + namespace, function() {
          setTimeout(_this._updateHScroll, 10);
          return clearInterval(_this.interval);
        });
      } else if (tagName === "TEXTAREA") {
        this.input.on("scroll." + namespace, (function() {
          return setTimeout(_this._updateVScroll, 10);
        }));
        return this.input.on("resize." + namespace, (function() {
          return setTimeout(_this._updateVScroll, 10);
        }));
      }
    };

    MentionsInput.prototype._setValue = function(value) {
      var match, mentionRE;
      mentionRE = /@\[([^\]]+)\]\(([^ \)]+)\)/g;
      this.value = value.replace(mentionRE, '$1');
      this.input.val(this.value);
      match = mentionRE.exec(value);
      while (match) {
        this._addMention({
          name: match[1],
          uid: match[2],
          pos: this.value.indexOf(match[1])
        });
        match = mentionRE.exec(value);
      }
      return this._updateValue();
    };

    MentionsInput.prototype._createHidden = function() {
      var hidden;
      hidden = $('<input>', {
        type: 'hidden',
        name: this.input.attr('name')
      });
      hidden.appendTo(this.container);
      this.input.removeAttr('name');
      return hidden;
    };

    MentionsInput.prototype._createHighlighter = function() {
      var content, highlighter, property, _i, _len;
      highlighter = $('<div>', {
        'class': 'highlighter'
      });
      if (this.input.prop("tagName") === "INPUT") {
        highlighter.css('whiteSpace', 'pre');
      } else {
        highlighter.css('whiteSpace', 'pre-wrap');
        highlighter.css('wordWrap', 'break-word');
      }
      content = $('<div>', {
        'class': 'highlighter-content'
      });
      highlighter.append(content).prependTo(this.container);
      for (_i = 0, _len = mimicProperties.length; _i < _len; _i++) {
        property = mimicProperties[_i];
        highlighter.css(property, this.input.css(property));
      }
      this.input.css('backgroundColor', 'transparent');
      return highlighter;
    };

    MentionsInput.prototype._update = function() {
      this._updateMentions();
      return this._updateValue();
    };

    MentionsInput.prototype._updateMentions = function() {
      var change, cursor, diff, i, mention, piece, update_pos, value, _i, _j, _len, _len1, _ref,
        _this = this;
      value = this.input.val();
      diff = diffChars(this.value, value);
      update_pos = function(cursor, delta) {
        var mention, _i, _len, _ref, _results;
        _ref = _this.mentions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mention = _ref[_i];
          if (mention.pos >= cursor) {
            _results.push(mention.pos += delta);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      cursor = 0;
      for (_i = 0, _len = diff.length; _i < _len; _i++) {
        change = diff[_i];
        if (change.added) {
          update_pos(cursor, change.count);
        } else if (change.removed) {
          update_pos(cursor, -change.count);
        }
        if (!change.removed) {
          cursor += change.count;
        }
      }
      _ref = this.mentions.slice(0);
      for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
        mention = _ref[i];
        piece = value.substring(mention.pos, mention.pos + mention.name.length);
        if (mention.name !== piece) {
          this.mentions.splice(i, 1);
        }
      }
      return this.value = value;
    };

    MentionsInput.prototype._addMention = function(mention) {
      this.mentions.push(mention);
      return this.mentions.sort(function(a, b) {
        return a.pos - b.pos;
      });
    };

    MentionsInput.prototype._onSelect = function(event, ui) {
      this._updateMentions();
      this._addMention({
        name: ui.item.value,
        pos: ui.item.pos,
        uid: ui.item.uid
      });
      return this._updateValue();
    };

    MentionsInput.prototype._updateValue = function() {
      var cursor, hdContent, hlContent, mention, piece, value, _i, _len, _ref;
      value = this.input.val();
      hlContent = [];
      hdContent = [];
      cursor = 0;
      _ref = this.mentions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mention = _ref[_i];
        piece = value.substring(cursor, mention.pos);
        hlContent.push(escapeHtml(piece));
        hdContent.push(piece);
        hlContent.push("<strong>" + mention.name + "</strong>");
        hdContent.push(this._markupMention(mention));
        cursor = mention.pos + mention.name.length;
      }
      piece = value.substring(cursor);
      this.highlighterContent.html(hlContent.join('') + escapeHtml(piece));
      return this.hidden.val(hdContent.join('') + piece);
    };

    MentionsInput.prototype._updateVScroll = function() {
      var scrollTop;
      scrollTop = this.input.scrollTop();
      this.highlighterContent.css({
        top: "-" + scrollTop + "px"
      });
      return this.highlighter.height(this.input.height());
    };

    MentionsInput.prototype._updateHScroll = function() {
      var scrollLeft;
      scrollLeft = this.input.scrollLeft();
      return this.highlighterContent.css({
        left: "-" + scrollLeft + "px"
      });
    };

    MentionsInput.prototype._replaceWithSpaces = function(value, what) {
      return value.replace(what, Array(what.length).join(' '));
    };

    MentionsInput.prototype._cutChar = function(value, index) {
      return value.substring(0, index) + value.substring(index + 1);
    };

    MentionsInput.prototype.setValue = function() {
      var piece, pieces, value, _i, _len;
      pieces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      value = '';
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
        if (typeof piece === 'string') {
          value += piece;
        } else {
          value += this._markupMention(piece);
        }
      }
      return this._setValue(value);
    };

    MentionsInput.prototype.getValue = function() {
      return this.hidden.val();
    };

    MentionsInput.prototype.getRawValue = function() {
      return this.input.val().replace(this.marker, '');
    };

    MentionsInput.prototype.getMentions = function() {
      return this.mentions;
    };

    MentionsInput.prototype.clear = function() {
      this.input.val('');
      return this._update();
    };

    MentionsInput.prototype.destroy = function() {
      this.input.areacomplete("destroy");
      this.input.off("." + namespace).attr('name', this.hidden.attr('name'));
      return this.container.replaceWith(this.input);
    };

    return MentionsInput;

  })(MentionsBase);

  MentionsContenteditable = (function(_super) {
    var insertMention, mentionTpl;

    __extends(MentionsContenteditable, _super);

    MentionsContenteditable.prototype.selector = '[data-mention]';

    function MentionsContenteditable(input, options) {
      this.input = input;
      this._onSelect = __bind(this._onSelect, this);

      this._addMention = __bind(this._addMention, this);

      this.settings = {
        delay: 0,
        trigger: '@',
        autoFocus: true,
        widget: 'editablecomplete'
      };
      MentionsContenteditable.__super__.constructor.call(this, this.input, options);
      this.autocomplete = this.input[this.options.widget]({
        matcher: this._getMatcher(),
        suffix: this.marker,
        select: this._onSelect,
        source: this.options.source,
        delay: this.options.delay,
        autoFocus: this.options.autoFocus,
        showAtCaret: this.options.showAtCaret
      });
      this._setValue(this.input.html());
      this._initEvents();
    }

    mentionTpl = function(mention) {
      return "<strong data-mention=\"" + mention.uid + "\">" + mention.value + "</strong>";
    };

    insertMention = function(mention, pos, suffix) {
      var node, range, selection;
      selection = window.getSelection();
      node = selection.focusNode;
      range = selection.getRangeAt(0);
      range.setStart(node, pos.start);
      range.setEnd(node, pos.end);
      range.deleteContents();
      range.insertNode(mention);
      if (suffix) {
        suffix = document.createTextNode(suffix);
        $(suffix).insertAfter(mention);
        range.setStartAfter(suffix);
      } else {
        range.setStartAfter(mention);
      }
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return mention;
    };

    MentionsContenteditable.prototype._initEvents = function() {
      var _this = this;
      return this.input.find(this.selector).each(function(i, el) {
        return _this._watch(el);
      });
    };

    MentionsContenteditable.prototype._setValue = function(value) {
      var mentionRE,
        _this = this;
      mentionRE = /@\[([^\]]+)\]\(([^ \)]+)\)/g;
      value = value.replace(mentionRE, function(match, value, uid) {
        return mentionTpl({
          value: value,
          uid: uid
        }) + _this.marker;
      });
      return this.input.html(value);
    };

    MentionsContenteditable.prototype._addMention = function(data) {
      var mention, mentionNode;
      mentionNode = $(mentionTpl(data))[0];
      mention = insertMention(mentionNode, data.pos, this.marker);
      return this._watch(mention);
    };

    MentionsContenteditable.prototype._onSelect = function(event, ui) {
      this._addMention(ui.item);
      this.input.trigger("change." + namespace);
      return false;
    };

    MentionsContenteditable.prototype._watch = function(mention) {
      return mention.addEventListener('DOMCharacterDataModified', function(e) {
        var offset, range, sel, text;
        if (e.newValue !== e.prevValue) {
          text = e.target;
          sel = window.getSelection();
          offset = sel.focusOffset;
          $(text).insertBefore(mention);
          $(mention).remove();
          range = document.createRange();
          range.setStart(text, offset);
          range.collapse(true);
          sel.removeAllRanges();
          return sel.addRange(range);
        }
      });
    };

    MentionsContenteditable.prototype.update = function() {
      this._initValue();
      this._initEvents();
      return this.input.focus();
    };

    MentionsContenteditable.prototype.setValue = function() {
      var piece, pieces, value, _i, _len;
      pieces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      value = '';
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
        if (typeof piece === 'string') {
          value += piece;
        } else {
          value += this._markupMention(piece);
        }
      }
      this._setValue(value);
      this._initEvents();
      return this.input.focus();
    };

    MentionsContenteditable.prototype.getValue = function() {
      var value;
      value = this.input.clone();
      $(this.selector, value).replaceWith(function() {
        var name, uid;
        uid = $(this).data('mention');
        name = $(this).text();
        return this._markupMention({
          name: name,
          uid: uid
        });
      });
      return value.html().replace(this.marker, '');
    };

    MentionsContenteditable.prototype.clear = function() {
      this.input.html('');
      return this._update();
    };

    MentionsContenteditable.prototype.destroy = function() {
      this.input.editablecomplete("destroy");
      this.input.off("." + namespace);
      return this.input.html(this.getValue());
    };

    return MentionsContenteditable;

  })(MentionsBase);

  
/*
    Copyright (c) 2009-2011, Kevin Decker <kpdecker@gmail.com>
*/
function diffChars(oldString, newString) {
  // Handle the identity case (this is due to unrolling editLength == 0
  if (newString === oldString) {
    return [{ value: newString }];
  }
  if (!newString) {
    return [{ value: oldString, removed: true }];
  }
  if (!oldString) {
    return [{ value: newString, added: true }];
  }

  var newLen = newString.length, oldLen = oldString.length;
  var maxEditLength = newLen + oldLen;
  var bestPath = [{ newPos: -1, components: [] }];

  // Seed editLength = 0, i.e. the content starts with the same values
  var oldPos = extractCommon(bestPath[0], newString, oldString, 0);
  if (bestPath[0].newPos+1 >= newLen && oldPos+1 >= oldLen) {
    // Identity per the equality and tokenizer
    return [{value: newString}];
  }

  // Main worker method. checks all permutations of a given edit length for acceptance.
  function execEditLength() {
    for (var diagonalPath = -1*editLength; diagonalPath <= editLength; diagonalPath+=2) {
      var basePath;
      var addPath = bestPath[diagonalPath-1],
          removePath = bestPath[diagonalPath+1];
      oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
      if (addPath) {
        // No one else is going to attempt to use this value, clear it
        bestPath[diagonalPath-1] = undefined;
      }

      var canAdd = addPath && addPath.newPos+1 < newLen;
      var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
      if (!canAdd && !canRemove) {
        // If this path is a terminal then prune
        bestPath[diagonalPath] = undefined;
        continue;
      }

      // Select the diagonal that we want to branch from. We select the prior
      // path whose position in the new string is the farthest from the origin
      // and does not pass the bounds of the diff graph
      if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
        basePath = clonePath(removePath);
        pushComponent(basePath.components, undefined, true);
      } else {
        basePath = addPath;   // No need to clone, we've pulled it from the list
        basePath.newPos++;
        pushComponent(basePath.components, true, undefined);
      }

      var oldPos = extractCommon(basePath, newString, oldString, diagonalPath);

      // If we have hit the end of both strings, then we are done
      if (basePath.newPos+1 >= newLen && oldPos+1 >= oldLen) {
        return buildValues(basePath.components, newString, oldString);
      } else {
        // Otherwise track this path as a potential candidate and continue.
        bestPath[diagonalPath] = basePath;
      }
    }

    editLength++;
  }

  // Performs the length of edit iteration. Is a bit fugly as this has to support the
  // sync and async mode which is never fun. Loops over execEditLength until a value
  // is produced.
  var editLength = 1;
  while(editLength <= maxEditLength) {
    var ret = execEditLength();
    if (ret) {
      return ret;
    }
  }
}

function buildValues(components, newString, oldString) {
    var componentPos = 0,
        componentLen = components.length,
        newPos = 0,
        oldPos = 0;

    for (; componentPos < componentLen; componentPos++) {
      var component = components[componentPos];
      if (!component.removed) {
        component.value = newString.slice(newPos, newPos + component.count);
        newPos += component.count;

        // Common case
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = oldString.slice(oldPos, oldPos + component.count);
        oldPos += component.count;
      }
    }

    return components;
  }

function pushComponent(components, added, removed) {
  var last = components[components.length-1];
  if (last && last.added === added && last.removed === removed) {
    // We need to clone here as the component clone operation is just
    // as shallow array clone
    components[components.length-1] = {count: last.count + 1, added: added, removed: removed };
  } else {
    components.push({count: 1, added: added, removed: removed });
  }
}

function extractCommon(basePath, newString, oldString, diagonalPath) {
  var newLen = newString.length,
      oldLen = oldString.length,
      newPos = basePath.newPos,
      oldPos = newPos - diagonalPath,

      commonCount = 0;
  while (newPos+1 < newLen && oldPos+1 < oldLen && newString[newPos+1] == oldString[oldPos+1]) {
    newPos++;
    oldPos++;
    commonCount++;
  }

  if (commonCount) {
    basePath.components.push({count: commonCount});
  }

  basePath.newPos = newPos;
  return oldPos;
}

function clonePath(path) {
    return { newPos: path.newPos, components: path.components.slice(0) };
};


  $.fn[namespace] = function() {
    var args, options, returnValue;
    options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    returnValue = this;
    this.each(function() {
      var instance, _ref;
      if (typeof options === 'string' && options.charAt(0) !== '_') {
        instance = $(this).data('mentionsInput');
        if (options in instance) {
          return returnValue = instance[options].apply(instance, args);
        }
      } else {
        if ((_ref = this.tagName) === 'INPUT' || _ref === 'TEXTAREA') {
          return $(this).data('mentionsInput', new MentionsInput($(this), options));
        } else if (this.contentEditable === "true") {
          return $(this).data('mentionsInput', new MentionsContenteditable($(this), options));
        }
      }
    });
    return returnValue;
  };

}).call(this);
