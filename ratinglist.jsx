import { useState } from "react";
import API from "../api";

export default function RateStore({ storeId }) {
  const [rating, setRating] = useState(1);

  const submitRating = async () => {
    try {
      await API.post(`/stores/${storeId}/rating`, { rating });
      alert("Rating submitted!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>Rate this store</h3>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1,2,3,4,5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <button onClick={submitRating}>Submit</button>
    </div>
  );
}
