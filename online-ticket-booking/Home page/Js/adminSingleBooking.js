const handleDelete = async (id) => {
  console.log("id :", id);
  const userConfirm = confirm("Delete confirm ?");
  if (userConfirm) {
    try {
      const response = await fetch(`http://localhost:5000/booking/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);

      if (result.deletedCount) {
        alert("deleted successfully");
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const displayData = (data) => {
  const table_container = document.getElementById("table-row");

  data.map((item, idx) => {
    table_container.innerHTML += `<tr>
      <th scope="row">${idx + 1}</th>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.from}</td>
      <td>${item.to}</td>
      <td>${item.train_name} <br/> ${item.class}</td>
      <td>${item.coach}</td>
      <td>${item.seat}</td>
      <td>${item.total_price}</td>
      <td><button class="btn-danger" onclick='handleDelete("${
        item._id
      }")'> Delete</button</td>
    </tr>`;
  });
};

const handleShowBooking = async () => {
  var qs = await getQueryStrings();
  let email = await qs["email"];

  if (!email) {
    window.history.pushState("", "", "/login.html");
    location.reload();
  }
  try {
    const response = await fetch(
      `http://localhost:5000/mybookings?email=${email}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (result) {
      displayData(result);
    }
  } catch (error) {
    console.log(error);
  }
};

function getQueryStrings() {
  var assoc = {};
  var decode = function (s) {
    return decodeURIComponent(s.replace(/\+/g, " "));
  };
  var queryString = location.search.substring(1);
  var keyValues = queryString.split("&");

  for (var i in keyValues) {
    var key = keyValues[i].split("=");
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }

  return assoc;
}

handleShowBooking();
