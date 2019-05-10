//创建和初始化地图函数：
address = localStorage.getItem("address")

function initMap() {
  createMap(); //创建地图
  setMapEvent(); //设置地图事件
  addMapControl(); //向地图添加控件
  addMapOverlay(); //向地图添加覆盖物
}

function createMap() {
  map = new BMap.Map("map");
  point = new BMap.Point(116.331398, 39.897445)
  map.centerAndZoom(point, 13);
  // 经纬度
  if (address != "") {
    map.centerAndZoom(address, 13); // 用城市名设置地图中心点
  }

}

function setMapEvent() {
  map.enableScrollWheelZoom();
  map.enableKeyboard();
  map.enableDragging();
  map.enableDoubleClickZoom()
}

// 获取地址的具体经纬度
function addMapOverlay() {
  map.clearOverlays(); //清空原来的标注
  var localSearch = new BMap.LocalSearch(map);
  localSearch.setSearchCompleteCallback(function (searchResult) {
    var poi = searchResult.getPoi(0);
    address = poi.point.lng + "," + poi.point.lat; //获取经度和纬度，将结果显示在文本框中
    map.centerAndZoom(poi.point, 13);
    var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));// 创建标注，为要查询的地方对应的经纬度
    map.addOverlay(marker);
  });
  localSearch.search(address);
}
//向地图添加控件
function addMapControl(){
  var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
  scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
  map.addControl(scaleControl);
  var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
  map.addControl(navControl);
  var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true});
  map.addControl(overviewControl);
}
var map;
initMap();