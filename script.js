$(function() {

  setMap();

  $('.nav-link.fovo').click(function(e) {
    $('.modal-body ul li').remove();
    for (var id in localStorage) {    //localStrageの中のお気に入りidを取得、forで繰り返し処理
      var data = findFavo(id);　//id をキーにして得られた　findFavo関数からの戻り値　を"data"に入れる
      if (data) {
        console.log(data); //jsonオブジェクト
        var li = createFavoLi(id, data.name,'badge-primary', data.lat, data.lng);
        $('.modal-body ul').append(li);
      }
    }
    $('modal-title').html('お気に入り登録一覧');
    $('#exampleModal').modal('show')
  });


  //mapを表示し、現在地にピンを立てる
  function setMap() {
    console.log('setmap');
    if (!navigator.geolocation) {
      console.log("Geolocation apiがサポートされていない場合");
      return;
    };

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      //緯度
      var latitude = position.coords.latitude;

      //経度
      var longitude = position.coords.longitude;
      //位置情報
      var latlng = new google.maps.LatLng( latitude, longitude );
      console.log("緯度 経度----------------------");
      console.log(latlng);

      map.panTo(latlng);  //指定の座標に移動する

      //マーカーの新規出力
      new google.maps.Marker( {
        map: map ,
        position: latlng ,
        icon: 'lib/map_icon.png'  //現在地のアイコン画像指定
      });

      FavoShow();

      // クリックイベントを追加
      map.addListener('click', function(e) {
        // console.log("緯度が出ます？"+ e.latitude);　//緯度・経度って別々に出せるのかな？
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
        service.nearbySearch(request, nearbySearch);
      });
    }, function() {
      // エラー
      console.log('エラー');
    });
  };
});


$(document).on('click', '.modal-body ul a', function (e) {
  var target = $(e.target); //$マークをつけて定義することで、Jqueryオブジェクトとして使うことができる

  var li = target.parent();
  var id = li.attr('data-id');  //liの中の"data-id"という属性を取ってきてidに入れる
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

//お気に入りに追加した場所のリストを作成する
function createFavoLi(id, name, favoClass, lat, lng) {
  //緯度・経度の情報をli（リスト）に追加
  return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center" data-lat="' + lat + '" data-lng="' + lng + '"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
}

//お気に入り追加
function addFavo(id, name, lat, lng) {
  // id,nameが存在するかどうかを判定（データが空だった場合などに、不正なデータを作らないようにする）
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    //地図情報をjson形式でまとめる
    var item = {
      'name': name,
      'lat': lat,
      'lng': lng
    }

    //jsonをlocalstorageに保存するため、文字列に変換する（jsonオブジェクトのままではlocalStorageに保存できない）
    var itemJson = JSON.stringify(item);
    //localstrageに、idとitemJsonを保存する
    localStorage.setItem(id, itemJson);

    //位置情報
    var latlng = new google.maps.LatLng(lat, lng); //このlatとlngは、引数で取ってきた生のデータ
    //お気に入りに追加（addfavo）した場所にマーカーを出す
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
    });
  }
}


//お気に入り削除
function deleteFavo(id, name) {
  if ( (id && 0 < id.length) && (name && 0 < name.length) ) {
    //localstrageからidを取り除く
    localStorage.removeItem(id);
  }
}


function findFavo(id, name) {
  //localStrageから情報を持ってくる
  var jsonItem = localStorage.getItem(id);
  return JSON.parse(jsonItem); //Jsonオブジェクトに変える
}


//周辺情報を検索
function nearbySearch(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i]; //周辺スポットの情報をplaceに入れる
      console.log(place); //placeを出力してみる
      var id = place.id; //placeの中のidをidに入れる
      var name = place.name //placeの中のnameをnameに入れる
      console.log(name);

      var location = place.geometry.location

      var favoClass = '';
      if (findFavo(id)) {
        // お気に入りに登録済み
        favoClass = 'badge-primary'; //登録済みだったら"favorite"ボタンをOFF（初期表示）
      } else {
        favoClass = 'badge-light'; //登録していなかったら"favorite"ボタンをON
      }

      var lat = location.lat(); //locationから緯度を取得
      var lng = location.lng(); //locationから経度を取得

      var li = createFavoLi(id, name, favoClass, lat, lng); //id, name, favoClass, lat, lng 要素を、お気に入り一覧に持たせる

      $('.modal-body ul').append(li);
    }
    $('modal-title').html('お気に入りに登録');
    $('#exampleModal').modal('show')
  }
}

function FavoShow(){
  console.log("FavoShow---------------");
  for (var id in localStorage) {    //localStrageの中のお気に入りidを取得、forで繰り返し処理
    var data = findFavo(id);　//id をキーにして得られた　findFavo関数からの戻り値（jsonオブジェクト）を"data"に入れる

    if (data) { //dataの値 がある場合
      console.log(data); //ここでは data はjsonオブジェクトです
      var favo_lat = data.lat; //data の lat　をfavo_latに入れる
      var favo_lng = data.lng; //data の lng　をfavo_lngに入れる
      console.log(favo_lat);
      console.log(favo_lng);

      //位置情報
      var latlng = new google.maps.LatLng(favo_lat, favo_lng); //favo_lat と favo_lng を元に位置情報を定義
      //お気に入りに追加されている場所にマーカーを出す
      var marker = new google.maps.Marker({
        map: map,
        position: latlng,
      })
    }
  }
};
