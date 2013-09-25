class __Controller.TasksCtrl extends Monocle.Controller

    events:
      "click [data-action=new]"     :   "onNew"
      "click [data-action=logout]"  :   "onLogout"
    elements:
      "#pending"                    :   "pending"
      "#important"                  :   "important"
      "input"                       :   "name"

    constructor: ->
      super
      __Model.Task.bind "create", @bindTaskCreated
      __Model.Task.bind "update", @bindTaskUpdated

    onNew: (event) ->
      __Controller.Task.new()

    onLogout: (event) ->
      Lungo.Notification.confirm
        icon: "user"
        title: "User Logout"
        description: "Do you want to logout?"
        accept:
          icon: "checkmark"
          label: "Accept"
          callback: ->
            @

        cancel:
          icon: "close"
          label: "Cancel"
          callback: ->
            @

    bindTaskUpdated: (task) =>
      Lungo.Router.back()
      Lungo.Notification.hide()
      @updateCounters()

    bindTaskCreated: (task) =>
      context = if task.important is true then "high" else "normal"
      @view = new __View.Task model: task, container: "article##{context} ul"
      Lungo.Router.back()
      Lungo.Notification.hide()
      @updateCounters()

    updateCounters: ->
      Lungo.Element.count "#headImportant", __Model.Task.important().length
      Lungo.Element.count "#important",     __Model.Task.important().length
      Lungo.Element.count "#headPending", __Model.Task.notImportant().length
      Lungo.Element.count "#pending",     __Model.Task.notImportant().length

$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"

  __Model.Task.create name: "Tarea importante", important: true
  __Model.Task.create name: "Tarea no importante", important: false
