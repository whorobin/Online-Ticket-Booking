var data;

const displayData = (data) => {
  console.log(data.length)

  document.getElementById("total-books").innerText=data.length;
  
  const table_container = document.getElementById("table_container");
  const arrayRev = data
    .map(function iterateItems(item) {
      return item;
    })
    .reverse();

  arrayRev.slice(0, 8).map((item, idx) => {
    table_container.innerHTML += `<tr>

    <td>${item.name}</td>
    <td>${item.email}</td>
    <td>${item.total_price}</td>
    <td>
    <a href="admin-singel-bookings.html?email=${item.email}" class="btn">View</a>
  </td>
  
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
      data = result;
      displayData(result);
    }
  } catch (error) {
    console.log(error);
  }
};

handleShowBooking();

var input = document.getElementById("search_input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    const result = data.filter((item) => {
      return item.email.includes(input.value);
    });
    input.value = "";
    const table_container = document.getElementById("table_container");
    document.getElementById("table_container").innerHTML = "";
    result.map((item, idx) => {
      table_container.innerHTML += `<tr>
        <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.total_price}</td>
      <td>
      <a href="admin-singel-bookings.html?email=${item.email}" class="btn">View</a>
    </td>
    
    </tr>`;
    });
  }
});
