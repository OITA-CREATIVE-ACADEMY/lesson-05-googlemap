$(function(){
  setMap();

  $('.nav-link.fovo').click(function(e){
    $('.modal-body ul li').remove();

    for(var id in localStorage) {
      var data = findFavo(id);
      if(data){
        console.log(data);
        var li = createFavoLi(id, data,'badge-primary');
        $('.modal-body ul').append(li);
      }
    }
    $('modal-title').html('お気に入り登録一覧')
    $('#exampleModal').modal('show')
  });
})

function setMap(){
  if(!navigator.geolocation ){
    console.log('Geolocation apiがサポートされていない場合');
    return;
  }

navigator.geolocation.getCurrentPosition(function(position){
  // 緯度を取得
  var latitude = position.coords.latitude;
  // 軽度を取得
  var longitude = position.coords.longitude;
  // 緯度軽度
  var latlng = new google.maps.LatLng( latitude , longitude) ;

  map.panTo(latlng);

  new google.maps.Marker({
    map: map ,
    position:latlng,
  });
    console.log(map);


  map.addListener('click',function(e){
    var lat_lng = e.latLng;


  map.panTo(lat_lng);

  $('.modal-body ul li').remove();

  var request = {
    location: lat_lng,
    radius:'500'
  };

  service = new google.maps.places.PlacesService(map);


  service.nearbySearch(request, nearbySearch);

  });

},function() {

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




function createFavoLi(id, name, favoClass) {
  return $('<li data-id=' + id + ' class="list-group-item d-flex justify-content-between align-items-center"><span class="name">' + name + '</span><a href="#" class="badge ' + favoClass + '">favorite</a></li>')
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

function nearbySearch(results, status) {
  console.log("ここまで来れたーーーーーーーーーーーーーーーーーーー");
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place);
      var id = place.id;

      var favoClass = '';
      if (findFavo(id)) {

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
