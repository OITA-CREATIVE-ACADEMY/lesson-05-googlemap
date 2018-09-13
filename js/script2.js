$(function() {
  setMap();

  $('.nav-link.fovo').click(function(e) {
    $('.modal-body ul li').remove();
    for (var id in localStorage) {
      var data = findFavo(id);
      if (data) {
        console.log(data);
        var li = createFavoLi(id, data.name, 'badge-primary',data.lat,data.lng);
        $('.modal-body ul').append(li);
      }
    }
    $('modal-title').html('お気に入り登録一覧');
    $('#exampleModal').modal('show');
  });

});

function setMap() {
  if (!navigator.geolocation) {
    //Geolocation apiがサポートされていない場合
    console.log('Geolocation apiがサポートされていない場合');
    return;
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    //　緯度
    var latitude = position.coords.latitude;
    //　経度
    var longitude = position.coords.longitude;

    //位置情報
    var latlng = new google.maps.LatLng( latitude , longitude);
    map.panTo(latlng);

    //マーカーの新規出力
    new google.maps.Marker( {
      map: map,
      position: latlng ,
    });

    //クリックイベントを追加
    map.addListener('click' , function(e) {
      var lat_lng = e.latLng;

      //座標の中心をずらす
      map.panTo(lat_lng);
      $('.modal-body ul li').remove();


      var request = {
        location: lat_lng,
        radius: '500'
        // type: ['restaurant']
      };

      service = new google.maps.places.PlacesService(map);
      //現在地の情報を検索
      　service.nearbySearch(request, nearbySearch);
    });
  }, function(){
    //エラー
    console.log('エラー');
  });
}

$(document).on('click', '.modal-body ul a', function (e) {
  var target = $(e.target);

  var li = target.parent();
  var id = li.attr('data-id');
  var name = li.find('.name').html();

  //お気に入りに追加した場所の緯度経度取得
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


// ---------------------------

function createFavoLi(id, name, favoClass, lat, lng) {
  return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center" data-lat="' + lat + '" data-lng="' + lng + '"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
  // return $('<li data-id=' + id + 'class="list-group-item d-flex justify-content-between align-items-center" data-lat="' + lat +'" data-lng="' + lng +'"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
}

function addFavo(id, name, lat, lng) {

  if ( (id && 0 < id.length) && (name && 0 < name.length ) ) {
    //地図情報をjson形式でまとめる
    var item = {
      'name' :name,
      'lat' : lat,
      'lng' : lng,
    }
    //json文字列作成
    var itemJson = JSON.stringify(item);
    //ローカルストレージに保存
    localStorage.setItem(id, itemJson);

    //位置情報
    var latlng = new google.maps.LatLng(lat, lng);
    //お気に入りに追加した場所にマーカーを出力
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: "img/map_icon.png" ,

    });
    //表示させたマーカーを保存
    marker_array[id]= marker;

    //マーカーを削除するボタン
      $('.delete-btn').click(function(){
        if(marker != null) {
          marker.setMap(null);
        }
        marker == null;
      });

      $('.delete-btn').click(function(){
        if(localStorage  != null) {
          localStorage.removeItem(id);
        }
      });

//setItemは追加。　deleteFavoをループで回せば消える
  }
}

function deleteFavo(id, name) {
  if (( id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.removeItem(id);

    var marker = marker_array[id];
    marker.setMap(null);
  }
}

function findFavo(id, name) {
  var jsonItem = localStorage.getItem(id);
  return JSON.parse(jsonItem);
}

/**
 *　クリックした１の検索結果をモーダルに表示する
 */
 function nearbySearch(results, status) {
   if (status == google.maps.places.PlacesServiceStatus.OK) {
     for (var i = 0; i < results.length; i++) {
       var place = results[i];

       var location = place.geometry.location;
       var id = place.id;

       var favoClass = '';
       if (findFavo(id)) {
         //お気に入りに登録済み
         favoClass = 'badge-primary';
       } else {
         favoClass = 'badge-light';
       }

       //locationから緯度取得
       var lat = location.lat();
       //locationから経度取得
       var lng = location.lng();
       var li = createFavoLi(id, place.name, favoClass, lat, lng);

       $('.modal-body ul').append(li);
     }
     $('modal-title').html('お気に入りに登録');
     $('#exampleModal').modal('show')
   }
 }
