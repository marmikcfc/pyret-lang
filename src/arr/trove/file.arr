#lang pyret

provide {
  input-file : input-file,
  output-file : output-file,
  file-exists: file-exists,
  file-times: file-times,
  file-to-string: file-to-string
} end
provide-types *

import filelib as F

data File:
  | in-fd(inner-file :: Any) with:
    read-line(self): F.read-line(self.inner-file) end,
    read-file(self): F.read-file(self.inner-file) end,
    close-file(self): F.close-input-file(self.inner-file) end
  | out-fd(inner-file :: Any) with:
    display(self, val): F.display(self.inner-file, val) end,
    close-file(self): F.close-output-file(self.inner-file) end,
    flush(self): F.flush-output-file(self.inner-file) end
end

fun input-file(path :: String):
  in-fd(F.open-input-file(path))
end

fun file-exists(path :: String):
  F.exists(path)
end

fun file-times(path :: String):
  f = input-file(path)
  ts = F.file-times(f.inner-file)
  f.close-file()
  ts
end

fun file-to-string(path):
  f = input-file(path)
  s = f.read-file()
  f.close-file()
  s
end
  

fun output-file(path :: String, append :: Boolean):
  out-fd(F.open-output-file(path, append))
end

