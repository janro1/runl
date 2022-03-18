const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance' },
    { type: 'revert', section: 'Reverts' },
    { type: 'build', section: 'Misc' },
    { type: 'ci', section: 'Misc' },
    { type: 'refactor', section: 'Misc' },
    { type: 'docs', section: 'Documentation', hidden: true },
    { type: 'chore', section: 'Miscellaneous Chores', hidden: true },
    { type: 'test', section: 'Tests', hidden: true }
  ]
});