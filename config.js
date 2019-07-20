// Renovate bot configuration
// https://github.com/renovatebot/renovate/blob/master/docs/configuration.md
module.exports = {
  extends: ['config:base'],
  automerge: true,
  major: {
    automerge: false,
  },
  prHourlyLimit: 2,
  updateNotScheduled: false,
  timezone: 'America/New_York',
  schedule: ['every weekend'],
  masterIssue: true,
  // we ignore "debug" dependency because we want to test
  // our utility with older "debug" module versions
  ignoreDeps: ['debug'],
}
