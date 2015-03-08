table = require 'table-b'

getField = (f) ->
  switch f
    when 'milestone' then 'マイルストーン'
    when 'status' then '状態'
    when 'assigner' then '担当者'
    when 'startDate' then '開始日'
    when 'limitDate' then '期限日'
    when 'resolution' then '完了理由'
    when 'estimatedHours' then '予定時間'
    when 'actualHours' then '実績時間'
    else
      f

getValue = (f, v) ->
  return '未設定' unless v?
  return '未設定' if v.length is 0
  switch f
    when 'milestone' then v
    when 'status'
      switch v
        when '1' then '未対応'
        when '2' then '処理中'
        when '3' then '処理済み'
        when '4' then '完了'
        else v
    when 'assigner' then v
    when 'startDate' then v.replace /-/g, '/'
    when 'limitDate' then v.replace /-/g, '/'
    when 'resolution'
      switch v
        when '0' then '対応済み'
        when '1' then '対応しない'
        when '2' then '無効'
        when '3' then '重複'
        when '4' then '再現しない'
        else v
    when 'estimatedHours' then v
    when 'actualHours' then v
    else
      v

module.exports = (changes) ->
  table changes.map (i) ->
    field = getField i.field
    oldValue = getValue i.field, i.old_value
    newValue = getValue i.field, i.new_value
    [field, ':', oldValue, '->', newValue]
