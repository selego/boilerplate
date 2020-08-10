import "isomorphic-fetch";

import { apiURL } from "../config";

class api {
  constructor() {
    this.token = "";
  }

  getToken() {
    return this.token;
  }

  esQuery(queries) {
    let query = "";
    for (let i = 0; i < queries.length; i++) {
      query += `${JSON.stringify(queries[i])}\n`;
    }

    return fetch(`${apiURL}/es/_msearch`, {
      mode: "cors",
      method: "POST",
      redirect: "follow",
      referrer: "no-referrer",
      headers: { "Content-Type": "application/x-ndjson", Authorization: `JWT ${this.token}` },
      body: query,
    })
      .then((r) => r.json())
      .catch((e) => {
        console.log(e);
      });
  }

  getTotal(response) {
    return (response && response.hits && response.hits.total) || 0;
  }

  getHits(response) {
    return (response && response.hits && response.hits.hits) || [];
  }

  getAggregations(response, name) {
    if (response && response.aggregations && response.aggregations[name]) {
      if (response.aggregations[name].buckets) {
        let obj = {};
        for (let i = 0; i < response.aggregations[name].buckets.length; i++) {
          obj[response.aggregations[name].buckets[i].key] = response.aggregations[name].buckets[i].doc_count;
        }
        return obj;
      }
    }
    return {};
  }

  setToken(token) {
    this.token = token;
  }
  getToken() {
    return this.token;
  }

  get(path) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
      });

      const res = await response.json();
      if (response.status !== 200) {
        return reject(res);
      }

      resolve(res);
    });
  }

  put(path, body) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
      const res = await response.json();
      if (response.status !== 200) {
        return reject(res);
      }
      resolve(res);
    });
  }

  putFormData(path, body, files) {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name);
    }
    formData.append("body", JSON.stringify(body));

    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "PUT",
        headers: { Authorization: `JWT ${this.token}` },
        body: formData,
      });
      if (response.status !== 200) {
        return resolve({});
      }
      const res = await response.json();
      resolve(res);
    });
  }

  postFormData(path, body, files) {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name);
    }
    formData.append("body", JSON.stringify(body));

    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "POST",
        headers: {},
        body: formData,
      });
      if (response.status !== 200) {
        return resolve({});
      }
      const res = await response.json();
      resolve(res);
    });
  }

  remove(path) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
      });
      if (response.status !== 200) {
        return reject({});
      }
      const res = await response.json();
      resolve(res);
    });
  }

  post(path, body) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
          body: typeof body === "string" ? body : JSON.stringify(body),
        });

        const res = await response.json();
        if (response.status !== 200) {
          return reject(res);
        }
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }

  openpdf(path, fileName = "report.pdf") {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: this.token },
        });
        if (response.status !== 200) {
          return reject(res);
        }
        const file = await response.blob();

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();

        resolve();
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  }
}

const API = new api();
export default API;
