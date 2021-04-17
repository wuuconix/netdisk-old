module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    "no-multi-spaces": 'off',
    "eqeqeq": 'off',
    "spaced-comment": 'off',
    "brace-style": 'off',
    'curly': 'off',
    'func-call-spacing': 'off',
    'eol-last': 'off',
    'vue/no-deprecated-slot-attribute': 'off'
  }
}
