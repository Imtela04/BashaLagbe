import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tablecom.css";

const Tablecom = ({ apiUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/payment/getall"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
      }
    };

    fetchData();
  }, [apiUrl]);

  console.log(data);

  function changeStatus(index) {
    let item = data[index];
    let obj_id = item._id;
    console.log(obj_id);

    // Check if the current status is "Pending"
    if (item.paymentResult.status === "pending") {
      // Update the status to "Completed" locally
      item.paymentResult.status = "completed";

      // // Send a POST request to the API using Axios
      // axios
      //   .post(`http://127.0.0.1:3001/api/payment/check/${obj_id}`, {
      //     status: "confirm",
      //   })
      //   .then((response) => {
      //     console.log("Success:", response.data);
      //     // Reload the page after the request is successful
      //     window.location.reload();
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
    } else {
      // If the status is not "Pending", the case should be handle this case differently
      console.log("Status is not pending, cannot confirm");
    }
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Payment Method</th>
          <th>Transaction ID</th>
          <th>Status</th>
          <th>Email Address</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.paymentMethod}</td>
            <td>{item.paymentResult.tnxid}</td>
            <td>{item.paymentResult.status}</td>
            <td>{item.paymentResult.email_address}</td>
            <td>{item.paymentResult.price}</td>
            <td>
              <button onClick={() => changeStatus(index)}>confirm</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Tablecom;
