import { API } from "../../backend";

export const getProducts = () => {
    
  return fetch(`${API}product/`, { method: "GET"
  })
    //.then(response = > console.log(JsonParseresponse))
    .then(response => {
        console.log("hello",`${API}product`);
      return response.json();
    })
    .catch((err) => console.log(err));
};
