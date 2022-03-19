const axios = require("axios");

const BASE_URL = "https://digitalalpha.ml";

const root = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

const getCompanyByName = async (name) => {
  const response = await axios.post(`${BASE_URL}/companybyname`, { name });
  return response.data;
};

const getCompanyByTicker = async (ticker) => {
  const response = await axios.post(`${BASE_URL}/companybyticker`, { ticker });
  return response.data;
};

const getCompanyByCik = async (cik) => {
  const response = await axios.post(`${BASE_URL}/companybycik`, { cik });
  console.log(response);
  return response.data;
};

const getOverviewByTicker = async (ticker) => {
  const response = await axios.post(`${BASE_URL}/overviewbyticker`, { ticker });
  console.log(response);
  return response.data;
};

const getTimeSeriesByTicker = async (ticker) => {
  const response = await axios.post(`${BASE_URL}/tsbyticker`, { ticker });
  return response.data;
};

const getQnaByTicker = async (ticker) => {
  const response = await axios.post(`${BASE_URL}/qnabyticker`, { ticker });
  return response.data;
};
export {
  root,
  getCompanyByName,
  getCompanyByTicker,
  getCompanyByCik,
  getOverviewByTicker,
  getTimeSeriesByTicker,
  getQnaByTicker,
};
