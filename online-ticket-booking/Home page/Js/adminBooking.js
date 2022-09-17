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
  const arrayRev = data
    .map(function iterateItems(item) {
      return item;
    })
    .reverse();

  arrayRev.map((item, idx) => {
    table_container.innerHTML += `<tr>
  
      <th scope="row">${idx + 1}</th>
      <td>${item.date}</td>
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
  const userInfo = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch(`http://localhost:5000/booking`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result) {
      displayData(result);
    }
  } catch (error) {
    console.log(error);
  }
};

handleShowBooking();
