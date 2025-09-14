import { useEffect, useState } from "react";
import API from "../api";

export default function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await API.get("/stores");
        setStores(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStores();
  }, []);

  return (
    <div>
      <h1>Stores</h1>
      {stores.map((store) => (
        <div key={store.id}>
          <h3>{store.name}</h3>
          <p>{store.description}</p>
        </div>
      ))}
    </div>
  );
}
