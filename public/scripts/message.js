const createMessagesContainer = () => {
  const messagesContainer = $(`
  <section id="messages-container">
    <div class="inner-message-conatiner">
      <div class="messages">
      </div>
      <form class="messages-form" method="POST" action="/messages/:listingid">
        <textarea class="message-input" placeholder="New Message"></textarea>
        <button id="message-submit" class="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  </section>
`);
  return messagesContainer;
};

const createSentMessage = (message) => {
  const sentMessageTemplate = $(`
          <div class="message sent">
            <p class="username">${message.sender_username}</p>
            <p class="message-content">${message.content}</p>
            <p class="timestamp">${message.timestamp}</p>
          </div>
`);
  return sentMessageTemplate;
};

const createRecievedMessage = (message) => {
  const recievedMessageTemplate = $(`
  <div class="message recieved">
    <p class="username">${message.reciever_username}</p>
    <p class="message-content">${message.content}</p>
    <p class="timestamp">${message.timestamp}</p>
  </div>
`);
  return recievedMessageTemplate;
};

$(document).ready(() => {
  $("main").on("click", "#message-seller-btn", (event) => {
    event.preventDefault();
    const listingId = $("#message-seller-btn").siblings(".big-id").text();
    console.log(listingId);
    $.get(`/messages/${listingId}`, (messages) => {
      console.log(messages);
    });
  });

  $("main").on("submit", ".messages-form", (event) => {
    event.preventDefault();
    console.log("new-message-click-working");
    const message = $(".message-input").val();
    const data = {
      message: message,
    };
    console.log(data);
    $.post(`/messages/${listingId}`, data, (message) => {
      console.log(message);
    });
  });
});
