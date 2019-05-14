$(".answer-write button[type=submit]").click(addAnswer);
$(document).on('click', '.link-delete-article-answer', deleteAnswer); // 위와 달리 동적으로 생성된 html도 바인딩 가능

function addAnswer(e) {
    e.preventDefault(); // form의 action로 전송하려던 것을 막는다
    console.log("click!!");

    var queryString = $(".answer-write").serialize(); // 원래 전송하려던 녀석을 변수에 담는다.
    console.log("query : " + queryString);

    var url = $(".answer-write").attr("action");
    console.log("url : " + url);

    $.ajax({
        type: 'post',
        url: url,
        data: queryString,
        dataType: 'json',
        error: onError,
        success: onSuccess
    });

    function onError(xhr, status) {
        console.log(status);
    }

    // 이곳의 data는 ApiController(RestController)의 메서드가 반환한 answer를 변환한 json 데이터를 의미함.
    function onSuccess(data, status) {
        console.log(status);
        console.log(data);

        if (data.valid) {
            var answerTemplate = $("#answerTemplate").html();
            var template = answerTemplate.format(data.data.writer.userId, data.data.formattedCreateDate, data.data.formattedModifiedDate, data.data.contents, data.data.id, data.data.question.id);
            $(".qna-comment-slipp-articles").append(template);
            $(".answer-write textarea").val("");
        } else {
            alert(data.errorMessage)

        }
    }
}

function deleteAnswer(e) {
    e.preventDefault();
    console.log("click!!");

    var deleteBtn = $(this); // scope마다 this가 다를 수 있으니 변수처리
    var url = $(this).attr("href");

    $.ajax({
        type: 'delete',
        url: url,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(status);
        },
        success: function (data, status) {
            console.log(status);

            if (data.valid) {
                deleteBtn.closest("article").remove();
            } else {
                alert(data.errorMessage)
            }
        }
    });

}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

var pageSize = $("span[id^='pages']").length; // pages (List<Integer>) 의 길이를 구한다
for (var i = 0; i < pageSize; i++) { // 그 길이만큼 포문 돌림
    var cur = parseInt($("span[id^='pages']:eq(" + i + ")").html()); // 해당 span의 요소를 .html()로 가져온 뒤, 정수로 변경
    $("span[id^='pages']:eq(" + i + ")").html(cur + 1); // 해당 span의 요소 값을 .html(param)의 인자로 변경한다.
}