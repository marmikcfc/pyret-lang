define([], function() {
  var gs = Math.floor(Math.random() * 10000);
  function gensym(name) {
    return name + String(gs++);
  }
  function isBrowser() {
    return requirejs.isBrowser || typeof importScripts !== "undefined";
  }
  function memoModule(modname, moduleFun) {
    return function(RUNTIME, NAMESPACE) {

      if(RUNTIME.modules[modname]) {
        return RUNTIME.modules[modname];
      }
      else {
        RUNTIME.modules[modname] = moduleFun(RUNTIME, NAMESPACE);
        return RUNTIME.modules[modname];
        // TODO(joe): We are *not* safe for deep calls on module loads.
        // If running the module blows the stack, then we fail to load
        // the module.
        /*
        return RUNTIME.safeCall(function() {
            return moduleFun(RUNTIME, NAMESPACE);
          }, function(moduleFunVal) {
            RUNTIME.modules[modname] = moduleFunVal;
            return moduleFunVal;
          });
        */
      }
    };
  }

  function definePyretModule(name, deps, provides, func) {
    var modname = gensym(name);
    return {
      dependencies: deps,
      provides: provides,
      theModule: function(/* varargs */) {
        var pyretDependencies = arguments;
        return memoModule(modname, function(runtime, namespace) {
          return func.apply(null, [runtime, namespace].concat(pyretDependencies));
        });
      }
    };
  }

  return {
      memoModule: memoModule,
      definePyretModule: definePyretModule,
      isBrowser: isBrowser
    };
});
