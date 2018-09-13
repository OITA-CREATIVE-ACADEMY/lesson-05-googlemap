$(function() {
  setMap();
  $('.modal-body ul li').addClass("list-group-item, d-flex justify-content-between, align-items-center");

  // お気に入り一覧をクリック
  $('.nav-link.fovo').click(function(e) {
    console.log("テスト");
    $('.modal-body ul li').remove();
    // モーダルに現在のお気に入り一覧を表示する
    for (var id in localStorage) {
      var data = findFavo(id);
      if (data) {
        console.log(data);
        var li = createFavoLi(id, data, 'badge-primary');
        $('.modal-body ul').append(li);
      }
    }
    $('modal-title').html('お気に入り登録一覧');
    $('#exampleModal').modal('show');
  });
});

function setMap() {
  if (!navigator.geolocation) {
    // Geolocation apiがサポートされていない場合
    console.log('Geolocation apiがサポートされていない場合');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      // 緯度
      var latitude = position.coords.latitude;
      // 経度
      var longitude = position.coords.longitude;

      // 位置情報→現在地の座標
      var mapLatLng = new google.maps.LatLng(latitude, longitude);
      console.log("緯度：" + latitude + " 経度：" + longitude + " 座標：" + mapLatLng);

      // マップを現在地座標まで動かす
      map.panTo(mapLatLng);

      // マーカーを出す
      new google.maps.Marker({
        map: map,
        position: mapLatLng,
      });

      // タップしたらモーダルにプレイスの検索結果を表示させる
      // クリックイベントを追加
      map.addListener('click', function(e) {
        console.log(e);
        var lat_lng = e.latLng
        console.log(lat_lng);

        // モーダル内にプレイスを取得

        $('.modal-body ul li').remove(); /* リストをクリア */
        var request = {
          location: lat_lng,
          radius: "500",
          /* 指定した座標から半径500m以内 */
          types: ["cafe"]
        };
        console.log(request);

        service = new google.maps.places.PlacesService(map);
        service.search(request, searchedAction);

        // サーチした後に実行するアクション
        var landmarkName = "hoge";
        function searchedAction (results, status){
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              // console.log(place);
              var id = place.id;
              var name = place.name;
              console.log(name);
              console.log(id);

              var placeList = '<span class="name">' + name + '</span>';
              var favoButton = '<a href="#" class="badge badge-light ' + favoClass + '">favorite</a>';

              $('.modal-body ul').append('<li data-id="' + id + '" class="list-group-item d-flex justify-content-between align-items-center">' + placeList + favoButton + '</li>');

              var favoClass = '';
              if (findFavo(id)) {
                // お気に入りに登録済み
                favoClass = 'badge-primary';
              } else {
                favoClass = 'badge-light';
              }
            }
            $('modal-title').html('お気に入りに登録');
            $('#exampleModal').modal('show')
          }
        }

        // 座標の中心をずらす
        map.panTo(lat_lng);
      });

    },
    function() {
      // エラー
      console.log('エラー');
    });

    // 「Favorite」ボタンを押すとアクション
    $(document).on('click', '.modal-body ul a', function (e) {
      var target = $(e.target);

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
}

// お気に入りアクションの定義
function createFavoLi(id, name, favoClass) {
  var placeList = '<span class="name">' + name + '</span>';
  var favoButton = '<a href="#" class="badge ' + favoClass + '">favorite</a>';

  return $('.modal-body ul').append('<li data-id="' + id + '" class="list-group-item d-flex justify-content-between align-items-center">' + placeList + favoButton + '</li>');
}

function addFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.setItem(id, name)
  }
}

function deleteFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.removeItem(id);
  }
}

function findFavo(id, name) {
  return localStorage.getItem(id);
}
