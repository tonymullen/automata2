import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

class AutomataDataService {

  getAll(page = 0) {
    return axios.get(`${API_BASE_URL}/api/v1/automata?page=${page}`);
  }

  get(id) {
    return axios.get(`${API_BASE_URL}/api/v1/automata/id/${id}`);
  }

  getByIdList(idList) {
    let listString = JSON.stringify(idList);
    let url = `${API_BASE_URL}/api/v1/automata/idList/${listString}`;
    return axios.get(url);
  }

  find(query, by='title', page=0) {
    return axios.get(
      `${API_BASE_URL}/api/v1/automata?${by}=${query}&page=${page}`
    );
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new AutomataDataService();
