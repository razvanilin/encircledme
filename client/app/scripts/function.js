$(document).ready(function() {
	$("#avatar").click(function() {
		$("#avatar").toggleClass("unfocused");
		$(".social-img").toggleClass("active");
	});
	/*$("body:not(#avatar)").click(function() {
		$("#avatar").removeClass("unfocused");
		$(".social-img").removeClass("active");
	});
	$("#avatar").click(function() {
		$("#avatar").toggleClass("unfocused");
		$(".social-img").toggleClass("active");
	});*/

	$(".message-window form").submit(function(event) {
		event.preventDefault();

		var formData = {'email': $(this).find("#email").val(), 'message': $(this).find("#message").val()};

		$("#message-feedback").html("<strong>Hang on,</strong> the owl is sending the message");
		$("#message-feedback").attr("class", "alert alert-info");

		$.ajax({
			url: "landing/message.php",
			type: "POST",
			data: formData,
			success: function(data) {
				data = JSON.parse(data);
				$("#message-feedback").html(data['message']);
				if (data['type'] == "success") {
					$("#message-feedback").attr("class", "alert alert-success");
				} else {
					$("#message-feedback").attr("class", "alert alert-danger");
				}
			},
			error: function(data) {
				console.log(data);
			}
		});
	});

	$(".message-window #close-message").click(function() {
		$(".message-window").removeClass("active");
	});

	$("img.email").click(function() {
		$(".message-window").toggleClass('active');
	});
});