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
        return RUNTIME.safeCall(function() {
            return moduleFun(RUNTIME, NAMESPACE);
          }, function(moduleFunVal) {
            RUNTIME.modules[modname] = moduleFunVal;
            return moduleFunVal;
          });
      }
    };
  }

  function modBuiltin(name) {
    return { "import-type": "builtin", name: name };
  }

  function definePyretModule(name, deps, provides, func) {
    var modname = gensym(name);
    return {
      name: name,
      dependencies: deps,
      provides: provides,
      theModule: function(/* varargs */) {
        var pyretDependencies = Array.prototype.slice.call(arguments);
        return memoModule(modname, function(runtime, namespace) {
          return runtime.loadModulesNew(namespace, pyretDependencies, function(/* instantiated modules */) {
            var deps = Array.prototype.slice.call(arguments);
            return func.apply(null, [runtime, namespace].concat(deps));
          });
        });
      }
    };
  }

  return {
      modBuiltin: modBuiltin,

      memoModule: memoModule,
      definePyretModule: definePyretModule,
      isBrowser: isBrowser
    };
});
