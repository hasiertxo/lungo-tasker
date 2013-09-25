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

  onDelete: (event) ->
    @model.destroy()
    @remove()

  onView: (event) ->
    __Controller.Task.show @model

  bindTaskUpdated: (task) =>
    if task.uid is @model.uid
      @model = task
      @refresh()
