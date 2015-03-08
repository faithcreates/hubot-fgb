assert = require 'power-assert'
formatChanges = require '../src/format-changes'

describe 'formatChanges', ->
  it 'works', ->
    changes = [
      field: 'milestone'
      new_value: ' M1'
      old_value: ' M2'
      type: 'standard'
    ,
      field: 'status'
      new_value: '3'
      old_value: '2'
      type: 'standard'
    ,
      field: 'assigner'
      new_value: 'bouzuya3'
      old_value: ''
      type: 'standard'
    ,
      field: 'startDate'
      new_value: '2015-03-19'
      old_value: '2015-03-18'
      type: 'standard'
    ,
      field: 'limitDate'
      new_value: '2015-03-21'
      old_value: '2015-03-20'
      type: 'standard'
    ,
      field: 'resolution'
      new_value: '0'
      old_value: '1'
      type: 'standard'
    ,
      field: 'estimatedHours'
      new_value: '2'
      old_value: '1'
      type: 'standard'
    ,
      field: 'actualHours'
      new_value: '3'
      old_value: '2'
      type: 'standard'
    ]
    message = formatChanges changes
    assert message is '''
    マイルストーン  :   M2         ->   M1
    状態            :  処理中      ->  処理済み
    担当者          :  未設定      ->  bouzuya3
    開始日          :  2015/03/18  ->  2015/03/19
    期限日          :  2015/03/20  ->  2015/03/21
    完了理由        :  対応しない  ->  対応済み
    予定時間        :  1           ->  2
    実績時間        :  2           ->  3
    '''

    message = formatChanges null
    assert message is ''
