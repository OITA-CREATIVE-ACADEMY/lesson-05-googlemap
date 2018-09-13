$(function(){
  setMap();

  // お気に入り一覧をクリック
  $('.nav-link.fovo').click(function(e) {
    // モーダル内容を一旦消す
    $('.modal-body ul li').remove();
    // モーダルに現在のお気に入り一覧を表示する
    // localStorageに含まれるプロパティを順に取り出す
    for (var id in localStorage) {
      // お気に入りに登録したもの
      var data = findFavo(id);
      if (data) {
        // お気に入りにしたものだけをモーダルに表示
        var li = createFavoLi(id, data.name, 'badge-primary', data.lat, data.lng);
        $('.modal-body ul').append(li);
      }
     }
      $('modal-title').html('お気に入り登録一覧');
      $('#exampleModal').modal('show')
  });
});

function setMap() {
  // 以下、非対応ブラウザ向けの処理
  if (!navigator.geolocation) {
    // Geolocation apiがサポートされていない場合
    console.log('Geolocation apiがサポートされていない場合');
    return;
  }

  // 以下、位置情報取得に必要なコード（マップの表示には緯度・経度・位置情報まで必要）
  navigator.geolocation.getCurrentPosition(function(position) {
    // 緯度
    var latitude  = position.coords.latitude;
    // 経度
    var longitude = position.coords.longitude;

    // 位置情報
    var latlng = new google.maps.LatLng( latitude , longitude ) ;

    // 現在地にスクロールさせる(指定した座標に移動)
    map.panTo(latlng);

    // マーカーの新規出力
    new google.maps.Marker( {
        map: map ,
        position: latlng ,
    });

  // 以下、タップした時にモーダルを表示させるイベント
    // クリックイベントを追加
    map.addListener('click', function(e) {
      var lat_lng = e.latLng;

      // 座標の中心をずらす
      map.panTo(lat_lng);

      // モーダルの初期化
      $('.modal-body ul li').remove();

      var request = {
        location: lat_lng,
        radius: '500'
        // type: ['restaurant']
      };
      service = new google.maps.places.PlacesService(map);
      // 現在地の情報を検索
      service.nearbySearch(request, nearbySearch);
    });
  }, function() {
      // エラー GPS取得失敗
      console.log('エラー');
    });
}

  // お気に入りに登録の登録追加と削除
$(document).on('click', '.modal-body ul a', function (e) {
  // sourceのブレイクポイントで確認できる
  var target = $(e.target);

  // ターゲットがa（リンク）を指しているので、その親（li）という意味
  var li = target.parent();
  var id = li.attr('data-id');
  var name = li.find('.name').html();

  // お気に入りに追加した場所の緯度経度取得
  var lat = $(li).data('lat');
  var lng = $(li).data('lng');

  if (target.hasClass('badge-light')) {
    target.removeClass('badge-light')
    target.addClass('badge-primary')

    addFavo(id, name, lat, lng);
  } else {
    target.removeClass('badge-primary')
    target.addClass('badge-light')

    deleteFavo(id, name);
  }
});

  // createFavoLiはタップした時のリストを作成
  // favoClassはfavoriteの色
function createFavoLi(id, name, favoClass, lat, lng) {
  return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center" data-lat="' + lat +'" data-lng="' + lng + '"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
}

  // localStorageはWebブラウザにデータを保存する仕組み
  // ディベロッパーツールのApplicationのlocalStorageで確認できる
  // localStorageにデータを保存(お気に入り登録関連)
function addFavo(id, name, lat, lng) {
  // ↓データが存在しているかを確認している
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    // 地図情報をjson形式でまとめる
    var item = {
      'name': name,
      'lat': lat,
      'lng': lng,
    }

    // json文字列作成
    var itemJson = JSON.stringify(item);
    // ローカルストレージに保存
    localStorage.setItem(id, itemJson)

    // 位置情報
    var latlng = new google.maps.LatLng(lat, lng);
    // お気に入りに追加した場所にマーカーを出力
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
    });
    // 表示させたマーカーを保存
    marker_array[id] = marker;
  }
}

  // お気に入り登録の削除
function deleteFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.removeItem(id);

    var marker = marker_array[id];
    marker.setMap(null);
  }
}

  // localStorageからデータを取得(お気に入り登録関連)
  // setItemがなくても動くが、setItemと連動して動くのでaddFavoが先
function findFavo(id, name) {
  var jsonItem = localStorage.getItem(id);
  return JSON.parse(jsonItem);
}


  // 以下、タップのイベントからの関数呼び出し
  // nearbySearchは指定した位置の周辺にあるスポットを検索
function nearbySearch(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      // オブジェクトの情報
      // console.log(place);
      // 指定した位置の周辺にあるスポット検索はここまで

      var location = place.geometry.location;
      var id = place.id;

      var favoClass = '';
      // もしfindFavoがidを持っていたらfavoriteの色のクラスを作る
      // (addFavoの次にする手順)
      if (findFavo(id)) {
        // お気に入りに登録済み
        favoClass = 'badge-primary';
      } else {
        favoClass = 'badge-light';
      }

      // locationから緯度取得
      var lat = location.lat();
      // locationから経度取得
      var lng = location.lng();
      // createFavoLiで作成したリストをulに追加
      var li = createFavoLi(id, place.name, favoClass, lat, lng);
      $('.modal-body ul').append(li);
    }

    $('modal-title').html('お気に入りに登録');
    // モーダルを表示
    $('#exampleModal').modal('show')
  }
}
