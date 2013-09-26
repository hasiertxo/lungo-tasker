(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.Task = (function(_super) {
    __extends(Task, _super);

    function Task() {
      _ref = Task.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Task.fields("name", "description", "list", "when", "important", "done");

    Task.pending = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.completed = function() {
      return this.select(function(task) {
        return !!task.done;
      });
    };

    Task.important = function() {
      return this.select(function(task) {
        return task.important === true;
      });
    };

    Task.notImportant = function() {
      return this.select(function(task) {
        return task.important === false;
      });
    };

    Task.prototype.validate = function() {
      if (!this.name) {
        return "name is required";
      }
    };

    return Task;

  })(Monocle.Model);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.Task = (function(_super) {
    __extends(Task, _super);

    Task.prototype.template = "<li class=\"selectable {{#done}}accept{{/done}}{{^done}}cancel{{/done}}\">\n    <span class=\"icon {{#done}}ok{{/done}}\"></span>\n  <div class=\"on-right\">{{list}}</div>\n  <strong>{{name}}</strong>\n  <small>{{description}}</small>\n</li>";

    function Task() {
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      Task.__super__.constructor.apply(this, arguments);
      this.append(this.model);
    }

    Task.prototype.events = {
      "swipeLeft li": "onDelete",
      "hold li": "onDone",
      "singleTap li": "onView"
    };

    Task.prototype.elements = {
      "input.toggle": "toggle"
    };

    Task.prototype.onDone = function(event) {
      this.model.updateAttributes({
        done: !this.model.done
      });
      return this.refresh();
    };

    Task.prototype.onDelete = function(event) {
      this.model.destroy();
      return this.remove();
    };

    Task.prototype.onView = function(event) {
      return __Controller.Task.show(this.model);
    };

    Task.prototype.bindTaskUpdated = function(task) {
      if (task.uid === this.model.uid) {
        this.model = task;
        return this.refresh();
      }
    };

    return Task;

  })(Monocle.View);

}).call(this);

(function() {
  var TaskCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCtrl = (function(_super) {
    __extends(TaskCtrl, _super);

    TaskCtrl.prototype.elements = {
      "input[name=name]": "name",
      "textarea[name=description]": "description",
      "select[name=list]": "list",
      "input[name=when]": "when",
      "input[name=important]": "important"
    };

    TaskCtrl.prototype.events = {
      "click [data-action=save]": "onSave"
    };

    function TaskCtrl() {
      TaskCtrl.__super__.constructor.apply(this, arguments);
      this["new"] = this._new;
      this.show = this._show;
    }

    TaskCtrl.prototype.onSave = function(event) {
      if (this.current) {
        return this.current.updateAttributes({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      } else {
        if (this.name.val() !== "") {
          Lungo.Notification.show();
          return __Model.Task.create({
            name: this.name.val(),
            description: this.description.val(),
            list: this.list.val(),
            when: this.when.val(),
            important: this.important[0].checked
          });
        }
      }
    };

    TaskCtrl.prototype._new = function(current) {
      this.current = current != null ? current : null;
      return this._initializeFields();
    };

    TaskCtrl.prototype._show = function(current) {
      this.current = current;
      this.name.val(this.current.name);
      this.description.val(this.current.description);
      return Lungo.Router.section("task");
    };

    TaskCtrl.prototype._initializeFields = function() {
      this.name.val("");
      this.description.val("");
      this.list.val("Office");
      this.when.val("");
      return Lungo.Router.section("task");
    };

    return TaskCtrl;

  })(Monocle.Controller);

  $$(function() {
    return __Controller.Task = new TaskCtrl("section#task");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.TasksCtrl = (function(_super) {
    __extends(TasksCtrl, _super);

    TasksCtrl.prototype.events = {
      "click [data-action=new]": "onNew",
      "click [data-action=logout]": "onLogout"
    };

    TasksCtrl.prototype.elements = {
      "#pending": "pending",
      "#important": "important",
      "input": "name"
    };

    function TasksCtrl() {
      this.bindTaskCreated = __bind(this.bindTaskCreated, this);
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      TasksCtrl.__super__.constructor.apply(this, arguments);
      __Model.Task.bind("create", this.bindTaskCreated);
      __Model.Task.bind("update", this.bindTaskUpdated);
    }

    TasksCtrl.prototype.onNew = function(event) {
      return __Controller.Task["new"]();
    };

    TasksCtrl.prototype.onLogout = function(event) {
      return Lungo.Notification.confirm({
        icon: "user",
        title: "User Logout",
        description: "Do you want to logout?",
        accept: {
          icon: "checkmark",
          label: "Accept",
          callback: function() {
            return this;
          }
        },
        cancel: {
          icon: "close",
          label: "Cancel",
          callback: function() {
            return this;
          }
        }
      });
    };

    TasksCtrl.prototype.bindTaskUpdated = function(task) {
      Lungo.Router.back();
      Lungo.Notification.hide();
      return this.updateCounters();
    };

    TasksCtrl.prototype.bindTaskCreated = function(task) {
      var context;
      context = task.important === true ? "high" : "normal";
      this.view = new __View.Task({
        model: task,
        container: "article#" + context + " ul"
      });
      Lungo.Router.back();
      Lungo.Notification.hide();
      return this.updateCounters();
    };

    TasksCtrl.prototype.updateCounters = function() {
      Lungo.Element.count("#headImportant", __Model.Task.important().length);
      Lungo.Element.count("#important", __Model.Task.important().length);
      Lungo.Element.count("#headPending", __Model.Task.notImportant().length);
      return Lungo.Element.count("#pending", __Model.Task.notImportant().length);
    };

    return TasksCtrl;

  })(Monocle.Controller);

  $$(function() {
    var Tasks;
    Lungo.init({});
    Tasks = new __Controller.TasksCtrl("section#tasks");
    __Model.Task.create({
      name: "Tarea importante",
      important: true
    });
    return __Model.Task.create({
      name: "Tarea no importante",
      important: false
    });
  });

}).call(this);
