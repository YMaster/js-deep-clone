module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-angular'],
  ignores: [commit => commit === ''],
  rules: {}
}