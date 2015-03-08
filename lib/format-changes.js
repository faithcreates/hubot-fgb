
var getField, getValue, table;

table = require('table-b');

getField = function(f) {
  switch (f) {
    case 'milestone':
      return 'マイルストーン';
    case 'status':
      return '状態';
    case 'assigner':
      return '担当者';
    case 'startDate':
      return '開始日';
    case 'limitDate':
      return '期限日';
    case 'resolution':
      return '完了理由';
    case 'estimatedHours':
      return '予定時間';
    case 'actualHours':
      return '実績時間';
    default:
      return f;
  }
};

getValue = function(f, v) {
  if (v == null) {
    return '未設定';
  }
  if (v.length === 0) {
    return '未設定';
  }
  switch (f) {
    case 'milestone':
      return v;
    case 'status':
      switch (v) {
        case '1':
          return '未対応';
        case '2':
          return '処理中';
        case '3':
          return '処理済み';
        case '4':
          return '完了';
        default:
          return v;
      }
      break;
    case 'assigner':
      return v;
    case 'startDate':
      return v.replace(/-/g, '/');
    case 'limitDate':
      return v.replace(/-/g, '/');
    case 'resolution':
      switch (v) {
        case '0':
          return '対応済み';
        case '1':
          return '対応しない';
        case '2':
          return '無効';
        case '3':
          return '重複';
        case '4':
          return '再現しない';
        default:
          return v;
      }
      break;
    case 'estimatedHours':
      return v;
    case 'actualHours':
      return v;
    default:
      return v;
  }
};

module.exports = function(changes) {
  if (changes == null) {
    return '';
  }
  return table(changes.map(function(i) {
    var field, newValue, oldValue;
    field = getField(i.field);
    oldValue = getValue(i.field, i.old_value);
    newValue = getValue(i.field, i.new_value);
    return [field, ':', oldValue, '->', newValue];
  }));
};
