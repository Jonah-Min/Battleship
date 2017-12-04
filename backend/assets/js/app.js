// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import markdown from "markdown"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

let handlebars = require("handlebars");

$(function () {
  if (!$("#likes-template").length > 0) {
    return;
  }

  let tt = $($("#likes-template")[0]);
  let code = tt.html();
  let tmpl = handlebars.compile(code);

  let dd = $($("#post-likes")[0]);
  let path = dd.data('path');
  let p_id = dd.data('post_id');

  let bb = $($("#like-add-button")[0]);
  let u_id = bb.data('user-id');

  let likesData = []
  let likeMap = {}

  function fetch_likes() {
    function got_likes(data) {
      console.log(data);
      likesData = data;

      likeMap = {}

      for (var i = 0; i < data.data.length; i++) {
        likeMap[data.data[i].user_email] = data.data[i]
      }

      data.data = Object.values(likeMap)

      if (likeMap[window.currUserEmail]) {
        $("#unlike-button").show()
        $("#like-add-button").hide()
      }
      else {
        $("#unlike-button").hide()
        $("#like-add-button").show()
      }

      let html = tmpl(data);
      dd.html(html);
    }

    $.ajax({
      url: path,
      data: {
        liked_post_id: p_id
      },
      contentType: "application/json",
      dataType: "json",
      method: "GET",
      success: got_likes,
    });
  }

  function add_like() {
    let data = {
      like: {
        liked_post_id: p_id,
        user_id: u_id
      }
    };


    $("#like-add-button").hide()
    $("#unlike-button").show()

    $.ajax({
      url: path,
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json",
      method: "POST",
      success: fetch_likes,
    });

  }

  function delete_like() {

    $("#unlike-button").hide()
    $("#like-add-button").show()


    $.ajax({
      url: path + '/' + likeMap[window.currUserEmail].id,
      contentType: "application/json",
      dataType: "json",
      method: "DELETE",
      success: fetch_likes,
    });

  }

  bb.click(add_like);

  $("#unlike-button").click(delete_like)

  fetch_likes();


});









// Update the posts with the hash tag

function parseTags(body) {
  return body.match(/#\w+/gi)
}
function parseMentions(body) {
  return body.match(/@\w+/gi)
}

var element = $('#tagFilter')


function getusernameToId(callback) {
    $.ajax({
      url: '/users',
      success: function(resp) {
        
        console.log(resp)

        let usernamesElements = $('.usernameTD', $(resp)[19])
        let usernames = [];
        for (var i = 0; i < usernamesElements.length; i++) {
          usernames.push(usernamesElements[i].innerText)
        }


        let ids = []
        let idElements = $('.idTD', $(resp)[19])

        for (var i = 0; i < idElements.length; i++) {
          ids.push(idElements[i].innerText)
        }

        console.log(ids, usernames)

        let map = {}
        for (var i = 0; i < ids.length; i++) {
          map[usernames[i]] = ids[i]
        }

        updateHomepageWithTags(map)
      }
    });
}



function updateHomepageWithTags(map) {
  var rows = $('body > div > div > div > table > tbody > tr')

  if (!rows) {
    return;
  }
  element.hide()

  for (var i = 0; i < rows.length; i++) {

    var body = $('.content', rows[i]).html()
    var tags = parseTags(body) || []
    var mentions = parseMentions(body) || []

    // go through and replace every instance of a tag with a link to that tag

    let endings = ''


    for (var j = 0; j < tags.length; j++) {
      var tag = tags[j]

      body = body.replace(tag, '')
      endings += '<a href="#" class="tag" onclick="filter(\''+tag+'\')">' + tag + '</a>   '
    }

    console.log(body)


    for (var j = 0; j < mentions.length; j++) {
      var mention = mentions[j]

      if (!map[mention.slice(1)]) {
        continue;
      }

      body = body.replace(mention, '')
      endings += '<a href="/users/' + map[mention.slice(1)] + '" class="mention">' + mention + '</a>  '
    }

    body = markdown.markdown.toHTML(body) + endings

    $('.content', rows[i]).html(body)
  }
}

var filtering= false

window.filter = function(tag) {

  // hide the filter
  if (filtering) {
    location.reload()
  }
  else {
    element.show()

    $("#filterNameHere").html(tag)

    var rows = $('body > div > div > div > table > tbody > tr')

    if (!rows) {
      return;
    }

    for (var i = 0; i < rows.length; i++) {
        var body = $('.content', rows[i]).html()
        if (!body.includes(tag)) {
          $(rows[i]).hide()
        }
    }
  }

  filtering = !filtering
}


if (location.pathname === '/posts') {
  $(getusernameToId);
}
// // debugger



window.nothing = function () {
  debugger
  return false;
}