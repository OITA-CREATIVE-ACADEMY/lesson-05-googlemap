$(function() {
  setMap();

  $('.nav-link.fovo').click(function(e) {
    $('.modal-body ul li').remove();
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
    return;
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    // 緯度
    var latitude  = position.coords.latitude;
    // 経度
    var longitude = position.coords.longitude;

    // 位置情報
    var latlng = new google.maps.LatLng( latitude , longitude ) ;

    map.panTo(latlng);

    // マーカーの新規出力
    new google.maps.Marker( {
        map: map ,
        position: latlng ,
    });
    // クリックイベントを追加
    map.addListener('click', function(e) {
      var lat_lng = e.latLng;

      // 座標の中心をずらす
      map.panTo(lat_lng);


      // クリックしたところにマーカー配置
      var add_marker = new google.maps.Marker({
        map: map,
        position: lat_lng ,
        draggable: true,
        icon: "img/map_icon.png" ,
      });

      // 追加したマーカーだけを一括で消したい
      $('.delete-btn').click(function(){
        if(add_marker != null) {
          add_marker.setMap(null);
        }
        add_marker == null;
      });


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
    // エラー
    console.log('エラー');
  });


}




$(document).on('click', '.modal-body ul a', function (e) {
  var target = $(e.target);

  var li = target.parent();
  var id = li.attr('data-id');
  var name = li.find('.name').html();
  // var favoIcon = li.find('.icon').html();

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


//お気に入り一覧の表示（左上のボタンで開くモーダル　と　新規でクリックで開くモーダルの両方）
function createFavoLi(id, name, favoClass) {
  return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
}

function addFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    localStorage.setItem(id, name);
      console.log(id, name);
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

function function2(position){

}


//参考：https://developers.google.com/maps/documentation/javascript/places
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
