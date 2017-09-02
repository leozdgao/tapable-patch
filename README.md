# tapable-patch

patch `tapable` for output debug info for webpack runtime.

## How to use

require `tapable-patch` at the top of your script entry:

```js
require('tapable-patch')

const webpack = require('webpack')
const config = {
  // ...
}
webpack(config, function() {
  // ...
})
```

## Notice

If you build your source with webpack cli directly, the patch won't work.
