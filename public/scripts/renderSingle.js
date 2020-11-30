$(document).ready(() => {
  //Clicking an item brings user to item page
  $("main").on("click", "a.small-listing-button", (event) => {
    const listingID = $(event.target).siblings(".id").html();
    $(".main-container").empty();
    $.get(`/listings/${listingID}`, (data) => {
      $(".main-container").append(createListingBig(data.listing));
      if (data.listing.user_id === data.user_id) {
        $("#message-seller-btn").hide();
      }
      if (data.listing.user_id === data.user_id) {
        $("#delete-button").show();
      }
      $(".big-id").hide();
    });
    $.get(`/listings/favourites/${listingID}`, (data) => {
      console.log(data);
      if(data !== undefined) {
        $("#fave-button").replaceWith(`<btn class="btn btn-primary" id="fave-delete-button">Un-favourite</btn>`)
      }
    });
  });

  //returning to home
  $("main").on("click", "btn.big-back", () => {
    $(".main-container").empty();
    window.location.replace("/");
  });

  $("main").on("click", "#fave-button", (event) => {
    const listing = $(event.target).siblings(".big-id").html();
    $.post("/listings/favourites", { listing: listing }, () => {
      $(event.target).replaceWith(`<btn class="btn btn-primary" id="fave-delete-button">Un-favourite</btn>`);
    });
  });

  $("main").on("click", "#fave-delete-button", (event) => {
    const listing = $(event.target).siblings(".big-id").html();
    $.post(`/listings/favourites/${listing}/delete`, { listing: listing }, () => {
      $(event.target).replaceWith(`<btn class="btn btn-primary" id="fave-button">Favorite</btn>`);
    });
  });

  const createListingBig = function (listing) {
    const local = moment(listing.posted_date)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
    const time = moment(local).fromNow();
    const articleContainer = $(`
      <article class="big-listing">
        <btn class="btn btn-primary big-back">HOME</btn>
        <h2 class="big-title">${listing.title}</h5>
        <img class="big-img" src="${listing.picture_url}">
        <h5 class="big-price">$${listing.price}</h5>
        <p class="big-description">${listing.description}</p>
        <p class="big-date">Posted: ${time}</p>
        <btn class="btn btn-primary message-button" id="message-seller-btn">Message seller</btn>
        <p class="big-id">${listing.id}</p>
        <btn class="btn btn-primary" id="fave-button">Favorite</btn>
        <btn class="btn btn-danger" id="delete-button">Delete</btn>
      </article>
      `);

    return articleContainer;
  };

  $("main").on("click", "#delete-button", (event) => {
    const listingid = $(".big-id").text();
    console.log(listingid);
    const idObject = { listingid };
    $.post("/listings/delete", idObject, () => {
      window.location.replace("/");
    });
  });
});
