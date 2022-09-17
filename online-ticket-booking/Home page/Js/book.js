let trainName = "";
let coachName = "";
let selectedSeat = [];
let totalPrice = 0;
let user = {};
let from;
let to;
let date;
let selectedClass;

const totalPriceCalculation = () => {
  if (trainName === "Padma / Silk City (Dhaka to Rajshahi) (tk 300)") {
    totalPrice = selectedSeat.length * 300;
  } else if (trainName === "Sundarban Express (Dhaka to khulna) (tk 400)") {
    totalPrice = selectedSeat.length * 400;
  } else if (trainName === "Sirajganj Express (tk 250)") {
    totalPrice = selectedSeat.length * 250;
  } 
  else if (trainName === "Turna Express (Dhaka to Chattogram) (tk 750)") {
    totalPrice = selectedSeat.length * 750;
  } 

  else if (trainName === "Panchagarh Express (tk 550)") {
    totalPrice = selectedSeat.length * 550;
  } 

  else {
    totalPrice = selectedSeat.length * 300;
  }
};
const getInputValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

document.getElementById("coach").addEventListener("change", (e) => {
  coachName = e.target.value;
  ClearSeat();
  getBookingInfo();
  document.getElementById("count").innerText = 0;
  document.getElementById("total").innerText = 0;
});
document.getElementById("train").addEventListener("change", (e) => {
  trainName = e.target.value;
  ClearSeat();
  getBookingInfo();
  document.getElementById("count").innerText = 0;
  document.getElementById("total").innerText = 0;
});
const initialSetTrainCoach = () => {
  trainName = getInputValue("train");
  coachName = getInputValue("coach");
};
initialSetTrainCoach();
const handleSeatBook = async () => {
  if (!selectedSeat.length) {
    alert("select seat first");
    return;
  }
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " & " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  const trainInfo = selectedSeat?.map((item) => {
    let convertObj = {
      train_name: trainName,
      coach: coachName,
      seat: item,
      from,
      to,
      date,
      class: selectedClass,
      name: user.name,
      email: user.email,
      created: datetime,
    };
    return convertObj;
  });
  const userInfo = {
    name: user.name,
    email: user.email,
    date,
    class: selectedClass,
    from,
    to,
    train_name: trainName,
    seat: selectedSeat,
    coach: coachName,
    total_price: totalPrice,
  };

  try {
    const response = await fetch("http://localhost:5000/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trainInfo, userInfo }),
    });
    const result = await response.json();
    console.log(result);
    if (result.user_result.acknowledged) {
      alert(" booked successfully");
      getBookingInfo();
      window.history.pushState("", "", "/my-booking.html");
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllSelectedSeat = () => {
  const allSeat = document.querySelectorAll(".selected");

  allSeat.forEach((item) => selectedSeat.push(item.innerText));
};
const allSeat = document.querySelectorAll(".seat");
allSeat.forEach((item) =>
  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("occupied")) {
      alert(`${e.target.innerText} Seat already book`);
    } else {
      e.target.classList.toggle("selected");

      selectedSeat = [];
      getAllSelectedSeat();

      totalPriceCalculation();
      document.getElementById("count").innerText = selectedSeat.length;
      document.getElementById("total").innerText = totalPrice;
    }
  })
);
//  clear seletect seat whet train or coach change
const ClearSeat = () => {
  allSeat.forEach((item) => {
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
    }
  });
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
const displayBookingSeat = (data) => {
  const allSeat = document.querySelectorAll(".seat");

  allSeat.forEach((item) => {
    if (item.classList.contains("occupied")) {
      item.classList.remove("occupied");
    }
  });
  allSeat.forEach((item) => {
    data.forEach((seat) => {
      if (seat.seat == item.innerText) {
        item.classList.add("occupied");
      }
    });
  });
};
// get all book data

const getBookingInfo = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/booking?date=${date}&from=${from}&to=${to}&selectedClass=${selectedClass}&train_name=${trainName}&coach=${coachName}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (result) {
      const bookingList = [];
      result.map((item) => {
        if (item.seat.length > 1) {
          const trainInfo = item.seat?.map((itemm) => {
            let convertObj = {
              train_name: item.train_name,
              coach: item.coach,
              seat: itemm,
              from: item.from,
              to: item.to,
              date: item.date,
              class: item.class,
              name: item.name,
              email: item.email,
            };
            bookingList.push(convertObj);
          });
          return trainInfo;
        } else {
          let convertObj = {
            train_name: item.train_name,
            coach: item.coach,
            seat: item.seat,
            from: item.from,
            to: item.to,
            date: item.data,
            class: item.class,
            name: item.name,
            email: item.email,
          };
          bookingList.push(convertObj);
        }
      });
      displayBookingSeat(bookingList);
    }
  } catch (error) {
    console.log(error);
  }
};

const ValidCheck = async () => {
  var qs = await getQueryStrings();
  from = await qs["from"];
  to = await qs["to"];
  date = await qs["date"];
  selectedClass = await qs["class"];

  if (!from || !to || !date || !selectedClass) {
    window.history.pushState("", "", "/reserve.html");
    location.reload();
  }
  getBookingInfo();
};
ValidCheck();
const getUserInfo = () => {
  const userInfo = localStorage.getItem("user");
  user = JSON.parse(userInfo);
  if (!user) {
    window.history.pushState("", "", "/login.html");
    location.reload();
  }
};
getUserInfo();
