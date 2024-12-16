module.exports = {
  root: true,
  env: {
    node: true, //Node.js全局变量和Node.js范围。
    "es6": true // 启用ES6的功能。
  },
  globals: {
    "UE": true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  // extends: ['@xiaoe/eslint-config-shareable/eslintrc.vue.js'],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6
  },

  rules: {
  
  }

};