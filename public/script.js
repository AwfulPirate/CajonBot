$(function () {
  var scores = [];

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  var position = 0;
  var scores = [];
  $.getJSON(
    "./discord/scores",
    function (data) {
      data = data.sort(dynamicSort("-points"))
      console.log(data);
      data.forEach(function (thing, index) {

        /*
    <li>
<mark>Jerry Wood</mark>
<small>315</small>
</li>

*/
        var html = [
          '<li>',
          '<mark>' + thing.display + '</mark>',
          '<small>' + thing.points + '</small>',
          '</li>'
        ];
        var obj = {};
        obj.name = thing.display;
        obj.points = thing.points;
        scores.push(obj);
        //$("#list").append(html.join('\n'));
      });
    }
  );

  function getNext5(arr) {
    var returnArr = arr.slice(position, position + 5);
    position = position + 5;
    return returnArr;
  }
  (function () {
    var html = [];
    var shownArr = getNext5(scores);
    shownArr.forEach(function (row) {
      html.push('<li>');
      html.push('<mark>' + thing.display + '</mark>');
      html.push('<small>' + thing.points + '</small>');
      html.push('</li>');
    })
    $("#list").html(html.join('\n'));
  });
  var backgrounds = [
    'https://media.giphy.com/media/vvbGMpbhZMcHSsD50w/giphy.gif', //napoleon dynomite
    'https://media.giphy.com/media/mp1JYId8n0t3y/giphy.gif', //the office
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif', //happy jonah hill
    'https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif', //the office raise the roof
    'https://media.giphy.com/media/t3Mzdx0SA3Eis/giphy.gif', //the office yes w/pen
  ]; $('body').css({
    'background-image': 'url(' + backgrounds[Math.floor(Math.random() * backgrounds.length)] + ')'
  });
});
