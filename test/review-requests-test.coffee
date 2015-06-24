assert = require 'power-assert'
{ReviewRequests} = require '../src/review-requests'

describe 'ReviewRequests', ->
  it 'works', ->
    requests = new ReviewRequests()

    # ignore invalid key
    requests.add 'room', 'user', { issueKey: 'issueKey' }
    assert requests.remove(null, 'user') is null
    assert requests.remove('room', null) is null
    assert requests.remove('room', 'user1') is null
    assert requests.remove('room1', 'user') is null
    assert requests.remove('room', 'user').issueKey is 'issueKey'

    # key is removed
    requests.add 'room', 'user', { issueKey: 'issueKey' }
    assert requests.remove('room', 'user').issueKey is 'issueKey'
    assert requests.remove('room', 'user') is null

    # overwrite value
    requests.add 'room', 'user', { issueKey: 'issueKey1' }
    requests.add 'room', 'user', { issueKey: 'issueKey2' }
    assert requests.remove('room', 'user').issueKey is 'issueKey2'
    assert requests.remove('room', 'user') is null
