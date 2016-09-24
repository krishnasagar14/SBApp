/**
 * Created by krishnasagar on 24/9/16.
 */
var tagsList = [];
var totalHrs = 0;
var learners = 0;
$(document).ready(function(){
    $("#searchDiv1").hide();
    $("#tagsCon").hide();
    if(!window.localStorage.getItem('results')) {
        $.ajax({
            url: "https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths",
            type: "GET",
            cache: true,
            success: function (result, textStatus, request) {
                console.log(request.getAllResponseHeaders());
                window.localStorage.setItem('results', JSON.stringify(result));
                f1();
            },
        });
    }
    else {
        f1();
    }
    if(!window.localStorage.getItem('upvotes')) {
        window.localStorage.setItem('upvotes', JSON.stringify(0));
        $("#msgBox").empty().append("<b>Total up votes: 0</b>");
    }
    else {
        $("#msgBox").empty().append("<b>Total up votes: "+JSON.parse(window.localStorage.getItem('upvotes'))+"</b>");
    }
});
function f1() {
    if(window.localStorage.getItem('results')) {
        if(!window.localStorage.getItem("tags")) {
            $.each(JSON.parse(window.localStorage.getItem('results'))['paths'], function(i,obj) {
                $.each(obj['tags'].split(","), function(i,item) {
                    if($.inArray(item, tagsList) && item != "") {
                        tagsList.push(item);
                    }
                });
            });
            window.localStorage.setItem('tags', JSON.stringify(tagsList));
        }
        else {
            tagsList = JSON.parse(window.localStorage.getItem("tags"));
        }
    }
    f2('');
    var tagsDiv = $("#tagsMenu");
    $.each(tagsList, function(i,item) {
        var li = $("<li>"), a = $("<a>", {id:'dropList'}).append(item).click(
            function(){
                f2($(this).text());
        });
        li.append(a);
        tagsDiv.append(li);
    });
    $("#searchbox").autocomplete({
        source : tagsList,
        delay : 0,
        minLength: 0,
        autoFocus : true
    });
}

function f2(tag1) {
    var snos = 0;
    var tagsCon = $("#tagsCon").empty();
    $.each(JSON.parse(window.localStorage.getItem('results'))['paths'], function(i,obj) {
        learners += parseInt(obj['learner']);
        totalHrs += parseInt(obj['hours'].slice(0,-1));
        if(obj['tags'].includes(tag1)) {
            var pathCon = $("<div>", {id:"pathCon", class:"well"}), divTop = $("<div>", {id:"divTop"}),
                divBottom = $("<div>", {id:"divBottom"});

            divBottom.append($("<label>", {style:"color:#0099ff;margin-bottom:10px;"})
                .append("<u> Description #</u>"));
            divBottom.append($("<div>", {id:"despCon"}).append(obj['description']));
            var curBttn = $("<button>", {id:"curBttn"}).click(function(){
                    window.open(obj['sign_up'], '_blank');
            }).append($("<img>", {id:"curImg", src:unlink}));
            curBttn.append(" View Curriculum");
            divBottom.append(curBttn);

            var divTop1 = $("<div>", {id:"divTop1", class:'row'});
            divTop1.append($("<div>", {class:"col-md-4"}).append($("<img>", {id:"pathImg", src:obj['image']})));
            var div = $("<div>", {class:"col-md-6"}).append($("<div>", {id:"pathLabel"}).append(obj['name']));
            var otherInfo = $("<div>", {id:"otherInfo"});
            var tagListId = $("<p>", {id:"tagListId"}).append("<img id='tagId' src='"+tag+"'/>").append(obj['tags']);
            otherInfo.append(tagListId);
            var tagDetails = $("<div>", {id:"tagDetails"});
            var oneTag = $("<div>", {id:"oneTag"}), twoTag = $("<div>", {id:"twoTag"});
            var up1, down1;
            if(!window.localStorage.getItem('up'+obj['id'].toString())) {
                up1 = 0;
                window.localStorage.setItem('up'+obj['id'].toString(), JSON.stringify(0));
            }
            else {
                up1 = JSON.parse(window.localStorage.getItem('up'+obj['id'].toString()));
            }
            if(!window.localStorage.getItem('down'+obj['id'].toString())) {
                down1 = 0;
                window.localStorage.setItem('down'+obj['id'].toString(), JSON.stringify(0));
            }
            else {
                down1 = JSON.parse(window.localStorage.getItem('down'+obj['id'].toString()));
            }
            oneTag.append($("<span>", {id:"det", title:obj['id'].toString()}).append('<img src="'+up+'" id="upImg"/>  ').append("<span><b>"+up1+"</b></span>")
                .click(function() {
                    var n = parseInt($(this).last().text()) + 1;
                    $(this).empty().append('<img src="'+up+'" id="upImg"/>  ').append("<span><b>"+n+"</b></span>");
                    window.localStorage.setItem('up'+$(this).attr('title'), JSON.stringify(n));
                    window.localStorage.setItem('upvotes',
                        JSON.stringify(parseInt(JSON.parse(window.localStorage.getItem('upvotes'))) + 1)
                    );
                }));
            oneTag.append($("<span>", {id:"det", title:obj['id'].toString()}).append('<img src="'+down+'" id="downImg"/>  ').append("<span><b>"+down1+"</b></span>")
                .click(function() {
                    var n = parseInt($(this).last().text()) + 1;
                    $(this).empty().append('<img src="'+down+'" id="upImg"/>  ').append("<span><b>"+n+"</b></span>");
                    window.localStorage.setItem('down'+$(this).attr('title'), JSON.stringify(n));
                    window.localStorage.setItem('downvotes',
                        JSON.stringify(parseInt(JSON.parse(window.localStorage.getItem('downvotes'))) + 1)
                    );
                }));
            twoTag.append($("<span>", {id:"det1"}).append('<img src="'+avatar+'" id="uImg"/>').append("<b>" + obj['hours'] + "</b> Hours"));
            twoTag.append($("<span>", {id:"det1"}).append('<img src="'+clock+'" id="clockImg"/>').append("<b>" + obj['learner'] + "</b> Learners"));
            tagDetails.append(oneTag).append(twoTag);
            otherInfo.append(tagDetails);
            div.append(otherInfo);
            divTop1.append(div);
            divTop.append(divTop1);

            pathCon.append(divTop).append(divBottom);
            tagsCon.append(pathCon);
            snos += 1;
        }
    });
    $("#searchDiv1").show().text('').append('<img id="sortImg" src="'+layerImg+'"/>&nbsp;&nbsp;&nbsp;&nbsp;'+"Results: " + snos + " courses found.");
    setTimeout(function() {
        $("#tagsCon").show();
        $("#loader").css("display", "none");
    }, 1800);
}

$("#searchBttn").click(function() {
   f2($("#searchbox").val());
});

$("#tagRadio1").click(function() {
    if(!window.localStorage.getItem('downvotes')) {
        $("#msgBox").empty().append("<b>Total up votes: 0</b>");
    }
    else {
        $("#msgBox").empty().append("<b>Total up votes: "+JSON.parse(window.localStorage.getItem('upvotes'))+"</b>");
    }
});
$("#tagRadio2").click(function() {
    if(!window.localStorage.getItem('downvotes')) {
        $("#msgBox").empty().append("<b>Total down votes: 0</b>");
    }
    else {
        $("#msgBox").empty().append("<b>Total down votes: "+JSON.parse(window.localStorage.getItem('downvotes'))+"</b>");
    }
});
$("#tagRadio3").click(function() {
    $("#msgBox").empty().append("<b>Total learners: "+learners+"</b>");
});
$("#tagRadio4").click(function() {
    $("#msgBox").empty().append("<b>Total duration: "+totalHrs+"</b>");
});