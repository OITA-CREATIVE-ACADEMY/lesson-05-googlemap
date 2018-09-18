$(function() 　{
  //←document radyの略でhtmlが読み込まれた時に作動する
 setMap();

 // お気に入り一覧をクリック
  $('.nav-link.fovo').click(function(e)　{//eは任意に作ってOK //
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
    $('#exampleModal').modal('show')
  });
})
function setMap() {
  if (!navigator.geolocation) {
    // Geolocation apiがサポートされていない場合
    console.log('Geolocation apiがサポートされていない場合');
    return;       /// 値を返す
  }
//
/////  if( navigator.geolocation )
/////  {
/////       現在位置を取得できる場合の処理
///// 	alert( "あなたの端末では、現在位置を取得することができます。" ) ;
/////   }
/////   Geolocation APIに対応していない
/////   else
/////  {
/////  現在位置を取得できない場合の処理
///// 	alert( "あなたの端末では、現在位置を取得できません。" ) ;
/////  }
//


  navigator.geolocation.getCurrentPosition(function(position) {
      // 緯度
      var latitude  = position.coords.latitude;
      // 経度
      var longitude = position.coords.longitude;

      // 位置情報
      var latlng = new google.maps.LatLng( latitude , longitude ) ;

      map.panTo(latlng);

      // マーカーの新規出力
      new google.maps.Marker(　{
          map: map ,
          position: latlng ,
      });
      // クリックイベントを追加
      map.addListener('click', function(e) {
        var lat_lng = e.latLng;

        // 座標の中心をずらす
        map.panTo(lat_lng);

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
      // エラー
      console.log('エラー');
    });
  }

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


  // -----------------------

  function createFavoLi(id, name, favoClass) {
    return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
  }


         //localStorage.setItemーブラウザに保存されたお気に入りをモーダルにセット
  function addFavo(id, name) {
    if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
      localStorage.setItem(id, name)
    }
  }


         //removeItemーlocalStorage（ブラウザに保存したものを削除）
  function deleteFavo(id, name) {
    if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
      localStorage.removeItem(id);
    }
  }


　　　　　//getItemーlocalStorageからデータを取り出す
  function findFavo(id, name) {
    return localStorage.getItem(id);
  }

  function nearbySearch(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(place);
        var id = place.id;

        var favoClass = '';
        if (findFavo(id)) {
          // お気に入りに登録済み
          favoClass = 'badge-primary';
        } else {
          favoClass = 'badge-light';
        }
        var li = createFavoLi(id, place.name, favoClass);
        $('.modal-body ul').append(li);
      }
      $('modal-title').html('お気に入りに登録');
      $('#exampleModal').modal('show')
    }
  }

  function initMap() {
          var latlng = new google.maps.LatLng( 34.808502, 135.639683 );
          var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 14,
              center: latlng
          });

  var marker = new google.maps.Marker({
             position: latlng,
             map: map,
             icon: new google.maps.MarkerImage(
                'マーカー画像のURL',//マーカー画像URL
                 new google.maps.Size(60, 80),//マーカー画像のサイズ
                 new google.maps.Point(0, 0),//マーカー画像表示の起点（変更しない）
                 new google.maps.Point(30, 80)//マーカー位置の調整
             ),
         });
       }
