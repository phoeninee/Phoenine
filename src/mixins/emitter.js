const broadcast = function (componentName, eventName, ...params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName

    if (name === componentName) {
      child.$emit(eventName, ...params)
    } else {
      broadcast.apply(child, [componentName, eventName, ...params])
    }
  })
}

export default {
  methods: {
    dispatch(componentName, eventName, ...params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit(eventName, ...params)
      }
    },

    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
