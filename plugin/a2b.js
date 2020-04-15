// 当 babel 执行 plugin 时，会执行函数中代码，由于在 node运行环境中，所有使用 Common.js 规范
module.exports =  function(babel) {
  const { types:t } = babel
  return {
    visitor: {
      VariableDeclarator(path, state) {
        console.log('path', path.node.id)
        if(path.node.id.name == 'a') {
          path.node.id = t.identifier('b')
        }
      }
    }
  }
}