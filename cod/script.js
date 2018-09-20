$(function() {
  setMap();//マップの表示
  $('.nav-link.fovo').click(function(e) {
    $('.modal-body ul li').remove();//モーダルの内容を削除する
    for (var id in localStorage) {
      var data = findFavo(id);
      if (data) {
        console.log(data);
        var li = createFavoLi(id, data.data2, data.data1, data.data3, data.data4,'badge-primary');
        $('.modal-body ul').append(li);
      }
    }
  $('modal-title').html('登録一覧');
  $('#exampleModal').modal('show')
  });
})
function setMap() {
  if (!navigator.geolocation) {
    // Geolocation apiがサポートされていない場合
    console.log('Geolocation apiがサポートされていない場合');
    return;
  }
  console.log(navigator.geolocation);
  navigator.geolocation.getCurrentPosition(function(position) {//現在の位置情報を取得
    console.log(position);    
    // positionのcoordsの緯度
    var latitude  = position.coords.latitude;
    // positionのcoordsの経度
    var longitude = position.coords.longitude;
    // 位置情報
    var latlng = new google.maps.LatLng( latitude , longitude ) ;//位置座標のインスタンスを作成するためのクラス
    
    map.panTo(latlng);//Mapクラスのメソッド,地図の位置座標を絶対的に移動できます
    
    //現在地にマーカーの新規出力
    new google.maps.Marker( {
        map: map ,
        position: latlng ,
    });
    //クリックイベントを追加する
    map.addListener('click', function(e) {
    console.log(e);
    var lat_lng = e.latLng;//クリックした座標を格納
    // 座標の中心をずらす
    map.panTo(lat_lng);
    $('.modal-body ul li').remove();//モーダルの内容を削除する
    //nearbySearchに投げるリクエストの内容
    var request = {
      location: lat_lng,
      radius: '500'
    };
    service = new google.maps.places.PlacesService(map);//プレイス検索
    service.nearbySearch(request, callback);
  });
}, function() {
  console.log('エラー');
   })
}
//----------------------お気に入りmodalの操作------------------------------//
$(document).on('click', '.modal-body ul a', function (e) {
  var target = $(e.target);
  console.log(target);
  var li = target.parent();
  var id = li.attr('data-id');//idを取得
  var lng = li.attr('data-lng');
  var lat = li.attr('data-lat');
  var icon = li.children('img').attr('src');//placeのアイコンを取得
  var name = li.find('.name').html();//placeの名前を取得
  if (target.hasClass('badge-light')) {
    target.removeClass('badge-light')
    target.addClass('badge-primary')

    addFavo(id, name, icon, lng ,lat);
  } else {
    target.removeClass('badge-primary')
    target.addClass('badge-light')

    deleteFavo(id, name);
  }
});
//----------nearbySearchで使うcallback関数--------------//
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place);
      var id = place.id;
      var name = place.name;
      var icon  = place.icon;
      var longitude = place.geometry.location.lng();
      var latitude = place.geometry.location.lat();

      var favoClass = '';
      if (findFavo(id)) {
        // お気に入りに登録済み
        favoClass = 'badge-primary';
      } else {
        favoClass = 'badge-light';
      }
      var li = createFavoLi(id, icon, name, longitude, latitude, favoClass);
      console.log(li);
      $('.modal-body ul').append(li);//モーダルに施設を追加
    }
    $('modal-title').html('登録');
    $('#exampleModal').modal('show')
  }
}
//-----------------------favo関連---------------------------//
function createFavoLi(id, icon, name, lng, lat, favoClass) {
  return $('<li data-id=' + id + ' data-lng=' + lng + ' data-lat=' + lat + ' class="list-group-item d-flex justify-content-between align-items-center"><img src="'+icon+'"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
}
function addFavo(id, name, icon, lng ,lat) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    var datalist = {
      data1: name,
      data2: icon,
      data3: lng,
      data4: lat
  }
    var jsondata = JSON.stringify(datalist);//JSON形式のデータを文字列に変換
    localStorage.setItem(id,jsondata);//localStorageにセット

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
function deleteFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.removeItem(id);

    var marker = marker_array[id];
    marker.setMap(null);
  }
}
function findFavo(id, name) {
  var data = JSON.parse(localStorage.getItem(id));//文字列データをJSON形式に戻す
  return data
}