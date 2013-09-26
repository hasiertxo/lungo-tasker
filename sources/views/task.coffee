class __View.Task extends Monocle.View

  template  : """
    <li class="selectable {{#done}}accept{{/done}}{{^done}}cancel{{/done}}">
        <span class="icon {{#done}}ok{{/done}}"></span>
      <div class="on-right">{{list}}</div>
      <strong>{{name}}</strong>
      <small>{{description}}</small>
    </li>
  """

  constructor: ->
    super
    __Model.Task.bind "update", @bindTaskUpdated
    @append @model

  events:
    "swipeLeft li"  :  "onDelete"
    "hold li"       :  "onDone"
    "singleTap li"  :  "onView"

  elements:
    "input.toggle"             : "toggle"

  onDone: (event) ->
    @model.updateAttributes done: !@model.done
    @refresh()

  onDelete: (event) =>
    Lungo.Notification.confirm
      icon: "user"
      title: "Delete"
      description: "Confirm delete?"
      accept:
        icon: "checkmark"
        label: "Accept"
        callback: =>
          @model.destroy()
          @remove()

      cancel:
        icon: "close"
        label: "Cancel"
        callback: =>
          @

  onView: (event) ->
    __Controller.Task.show @model

  bindTaskUpdated: (task) =>
    if task.uid is @model.uid
      @model = task
      destiny = null
      if @container.selector is "article#normal ul" and @model.important is true
        destiny = "high"
      else if @container.selector is "article#high ul" and @model.important is false
        destiny = "normal"

      if destiny?
        @remove()
        @container = Monocle.Dom("article#" + destiny + " ul")
        Monocle.Dom("article#" + destiny + " ul").append(@el)
        @refresh()
