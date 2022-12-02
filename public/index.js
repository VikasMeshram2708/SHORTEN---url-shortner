const form = document.querySelector("form");
const generated = document.querySelector(".generated");

const api_URI = "http://localhost:5000/url";

async function formSubmitted(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const url = formData.get("url");
  const slug = formData.get("slug");
  const data = {
    url,
    slug,
  };
  //   console.log(data);
  const response = await fetch(api_URI, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  console.log(json);
  //   generated.innerHTML = <a href={`https://localhost:5000/${slug}`}></a>;
  generated.innerHTML = `http://localhost:5000/${slug}`;

  //   `https://localhost:5000/${json.slug}}`;
}
form.addEventListener("submit", formSubmitted);
