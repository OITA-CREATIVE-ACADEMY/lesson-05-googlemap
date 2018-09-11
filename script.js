$(function(){
  setMap();

  $('.nav-link.fovo').click(function(e) {
    // モーダル内容を一旦消す
    $('.modal-body ul li').remove();
    // localStorageに含まれるプロパティを順に取り出す
    for (var id in localStorage) {
      // お気に入りに登録したもの
      var data = findFavo(id);

      if (data) {
        console.log(data);
        // お気に入りにしたものだけをモーダルに表示
        var li = createFavoLi(id, data, 'badge-primary');
        $('.modal-body ul').append(li);
      }
     }
      $('modal-title').html('お気に入り登録一覧');
      $('#exampleModal').modal('show')
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

      // 現在地にスクロールさせる(Mapクラスで指定した座標に移動)
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

        // 座標の中心をずらす →  タップした位置にずらした？
        map.panTo(lat_lng);

        // モーダルの初期化
        $('.modal-body ul li').remove();

        var request = {
          location: lat_lng,
          radius: '500'
          // type: ['restaurant']
        };
        service = new google.maps.places.PlacesService(map);
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

    if (target.hasClass('badge-light')) {
      target.removeClass('badge-light')
      target.addClass('badge-primary')

      addFavo(id, name);
    } else {
      target.removeClass('badge-primary')
      target.addClass('badge-light')

      deleteFavo(id, name);
    }
  });

  // createFavoLiはタップした時のリストを作成
  // favoClassはfavoriteの色
  function createFavoLi(id, name, lat, lng, favoClass) {
    return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center"><span class="name">' + name + '</span> ' + '<a href="#" class="badge ' + favoClass + '">favorite</a></li>')
  }

  // localStorageはWebブラウザにデータを保存する仕組み
  // ディベロッパーツールのApplicationのlocalStorageで確認できる
  // localStorageにデータを保存(お気に入り登録関連)
  function addFavo(id, name) {
    // ↓データが存在しているかを確認している
    if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
      localStorage.setItem(id, name)
    }
  }

  // お気に入り登録の削除
  function deleteFavo(id, name) {
    if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
      localStorage.removeItem(id);
    }
  }

  // localStorageからデータを取得(お気に入り登録関連)
  // setItemがなくても動くが、setItemと連動して動くのでaddFavoが先
  function findFavo(id, name) {
    return localStorage.getItem(id);
  }

  function function2(position){

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

        // createFavoLiで作成したリストをulに追加
        var li = createFavoLi(id, place.name, favoClass);
        $('.modal-body ul').append(li);
      }

      $('modal-title').html('お気に入りに登録');

      // モーダルを表示
      $('#exampleModal').modal('show')
    }
  }

  // 緯度と経度を表示させる関数を作る
  function addMarker(lat, lng){
    console.log(lat);
    console.log(lng);
  }


});
