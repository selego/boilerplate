import "isomorphic-fetch";

import { apiURL } from "../config";

const esQuery = (queries) => {
  let query = "";
  for (let i = 0; i < queries.length; i++) {
    query += `${JSON.stringify(queries[i])}\n`;
  }

  return fetch(`${apiURL}/es/_msearch`, {
    mode: "cors",
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    headers: { "Content-Type": "application/x-ndjson" },
    body: query,
  })
    .then((r) => r.json())
    .catch((e) => {
      console.log(e);
    });
};

const getTotal = (response) => {
  return (response && response.hits && response.hits.total) || 0;
};

const getHits = (response) => {
  return (response && response.hits && response.hits.hits) || [];
};

const getAggregations = (response, name) => {
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
};

const get = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

const put = (path, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
      });

      const res = await response.json();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

const putFormData = (path, body, files) => {
  let formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i], files[i].name);
  }
  formData.append("body", JSON.stringify(body));

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const res = await response.json();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

const postFormData = (path, body, files) => {
  let formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i], files[i].name);
  }
  formData.append("body", JSON.stringify(body));

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {},
        body: formData,
      });
      const res = await response.json();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

const remove = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const res = await response.json();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

const post = (path, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
};

export default {
  post,
  get,
  put,
  putFormData,
};
