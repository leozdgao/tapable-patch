'use strict'

const chalk = require('chalk')
const availableColors = require('ansi-styles')

const COLOR_BLACKLIST = [
  'black', 'white',
  'close', 'ansi', 'ansi256', 'ansi16m'
]
const COLOR_FORM_CHALK = Object.keys(availableColors.color).filter(color => COLOR_BLACKLIST.indexOf(color) < 0)

const createColorPicker = function() {
  const colorMap = {}
  let i = 0

  return function pickColor(name) {
    let color = colorMap[name]

    if (!color) {
      const index = (i++ % COLOR_FORM_CHALK.length)
      color = colorMap[name] = COLOR_FORM_CHALK[index]
    }

    return color
  }
}
const pickColor = createColorPicker()

function patchTapable(ctor, ignores, funcName) {
  const origin = ctor.prototype[funcName]

  if (origin) {
    ctor.prototype[funcName] = function() {
      const name = arguments[0]
      const constructorName = this.constructor.name

      if (ignores.indexOf(constructorName) < 0) {
        const color = pickColor(constructorName)

        console.log('>>', chalk[color](constructorName), name)
      }

      return origin.apply(this, arguments)
    }
  }
}

module.exports = function applyPatch(options) {
  options = options || {}

  let ignoreTags = options.ignore || []

  if (!Array.isArray(ignoreTags)) {
    ignoreTags = [ ignoreTags ]
  }

  const originJsExtResolver = require.extensions['.js']
  const tapableMain = require.resolve('tapable')

  require.extensions['.js'] = function jsExtResolver(mod, filePath) {
    originJsExtResolver.call(this, mod, filePath)

    if (mod.id === tapableMain) {
      const Tapable = mod.exports
      const functionNames = [
        'applyPlugins',
        'applyPlugins0',
        'applyPlugins1',
        'applyPlugins2',
        'applyPluginsWaterfall',
        'applyPluginsWaterfall0',
        'applyPluginsWaterfall1',
        'applyPluginsWaterfall2',
        'applyPluginsBailResult',
        'applyPluginsBailResult1',
        'applyPluginsBailResult2',
        'applyPluginsBailResult3',
        'applyPluginsBailResult4',
        'applyPluginsBailResult5',
        'applyPluginsAsyncSeries',
        'applyPluginsAsyncSeries1',
        'applyPluginsAsyncSeriesBailResult',
        'applyPluginsAsyncSeriesBailResult1',
        'applyPluginsAsyncWaterfall',
        'applyPluginsParallel',
        'applyPluginsParallelBailResult',
        'applyPluginsParallelBailResult1'
      ]
      functionNames.forEach(patchTapable.bind(null, Tapable, ignoreTags))
    }
  }
}
