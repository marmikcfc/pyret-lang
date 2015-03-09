provide *
import namespace-lib as N
import runtime-lib as R
#import builtin-modules as B
import "compiler/compile-lib.arr" as CL
import "compiler/compile-structs.arr" as CS
import "compiler/locators/file.arr" as FL

fun module-finder(ctxt, dep :: CS.Dependency):
  cases(CS.Dependency) dep:
    | dependency(protocol, args) =>
      if protocol == "file":
        FL.file-locator(dep.arguments.get(0), CS.standard-builtins)
      else:
        raise("Unknown import type: " + protocol)
      end
    | builtin(modname) =>
      raise("can't handle builtin modules yet")
  end
end

fun get-compiler():
  CL.make-compile-lib(module-finder)
end

fun compile(path):
  base-module = CS.dependency("file", [list: path])
  cl = get-compiler()
  base = module-finder({}, base-module)
  wl = cl.compile-worklist(base, {})
  compiled = cl.compile-program(wl)
  compiled
end

fun run(path):
  base-module = CS.dependency("file", [list: path])
  cl = get-compiler()
  base = module-finder({}, base-module)
  wl = cl.compile-worklist(base, {})
  r = R.make-runtime()
  result = CL.compile-and-run-worklist(cl, wl, r)
  print("Result: " + torepr(result))
end

