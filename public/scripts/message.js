let messagesLength;
$(document).ready(() => {
  let listingId = 0;
  let buyerId = 0;
  $("main").on("click", "#message-seller-btn", (event) => {
    event.preventDefault();
    listingId = $("#message-seller-btn").siblings(".big-id").text();
    const receiver_id = $(".seller-id").text();
    const reqData = {
      receiver_id,
    };
    $.get(`/messages/${listingId}`, reqData, (data) => {
      messagesLength = data.messages.length;
      if (data.messages[0] !== undefined) buyerId = data.messages[0].sender_id;
      messageRender(data);
      const checkNewMessage = () => {
        $.get(`/messages/${listingId}`, reqData, (data2) => {
          renderNewMessage(data2);
        });
        if ($(".messages").length === 0) {
          clearTimeout(timeOut);
        }
      };
      const timeOut = setInterval(checkNewMessage, 2000);
    });
  });

  $("main").on("submit", ".messages-form", (event) => {
    event.preventDefault();
    const message = $(".message-input").val();
    if (message.trim()) {
      $(".message-input").val("");
      $.get(`/listings/owner/${listingId}`, (data) => {
        const ownerId = data.owner;
        const userId = data.user_id;
        const send = {
          message,
        };
        send.receiver = ownerId;
        if (ownerId === userId) {
          send.receiver = buyerId;
        }
        $.post(`/messages/${listingId}`, send, (message) => {});
      });
    }
  });

  $("#convo-btn").click((event) => {
    event.preventDefault();
    $.get(`/messages/`, (data) => {
      const conversations = data.messages;
      $(".main-container").empty();
      $(".main-container").append(createConversationContainer());
      for (const item of conversations) {
        let $newConvo = createConversations(item);
        const senderId = item.sender_id;
        const receiverId = item.receiver_id;
        const dataObject = {
          sender_id: senderId,
          receiver_id: receiverId,
        };
        listingId = item.listing_id;
        $.get(`/messages/unread/${listingId}`, dataObject, (data) => {
          //This is the number of new messages in this convo. currently unstyled
          // $newConvo
          //   .children(".conversation-messages")
          //   .append($(`<p class="message-count">${data.count}</p>`));

          if (data.count > 0) {
            $newConvo.css("background-color", "#650000");
          }
          $(".conversations").append($newConvo);
          $(".conversation-listing-id").hide();
          $(".message-count").hide();
          $(".sender-id").hide();
          $(".receiver-id").hide();
        });
      }
    });
  });

  const unreadCheck = setInterval(() => {
    $.get(`/messages/unread`, (data) => {
      $("#convo-btn").html(`Messages: ${data.count}`);
    });
  }, 2000);

  $("main").on("click", ".conversation", (event) => {
    const senderId = $(event.currentTarget).children(".sender-id").html();
    const receiverId = $(event.currentTarget).children(".receiver-id").html();
    const dataObject = {
      sender_id: senderId,
      receiver_id: receiverId,
    };
    listingId = $(event.currentTarget)
      .children(".conversation-listing-id")
      .html();

    $.get(`/messages/${listingId}`, dataObject, (data) => {
      if (data.messages[0] !== undefined) buyerId = data.messages[0].sender_id;
      messageRender(data);
      messagesLength = data.messages.length;

      // Checks to see if there is a new message and renders it
      const checkNewMessage = () => {
        $.get(`/messages/${listingId}`, dataObject, (data) => {
          renderNewMessage(data);
        });
        $.post(`/messages/unread/${listingId}`, dataObject, () => {});
        if ($(".messages").length === 0) {
          clearTimeout(timeOut);
        }
      };

      const timeOut = setInterval(checkNewMessage, 2000);
    });
  });
});
