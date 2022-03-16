const axios = require("axios");

const BASE_URL = "http://localhost:5000";

const parseMetricParams = (cik, annual, from, to, metric) => {
  return {
    cik: cik, // <cik of the company>,
    timeperiod: annual ? "annual" : "quaterly", // <annual (10-K forms)/quaterly (10-Q forms)>,
    from_date: from, // <YYYY-MM-DD>,
    to_date: to, // <YYYY-MM-DD>,
    metric: metric, // ["churn rate", "revenue retention", "LTV to CAC ratio", "Customer Engagement Score", "Recurring Revenue", "SAAS Quick Ratio", "SAAS Magic Number"]
  };
};

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
  return response.data;
};

const getCompanyMetrics = async (params) => {
  const response = await axios.post(
    `${BASE_URL}/extract`,
    parseMetricParams(
      params.cik,
      params.annual,
      params.from,
      params.to,
      params.metric
    )
  );
  return response.data;
};

export {
  root,
  getCompanyByName,
  getCompanyByTicker,
  getCompanyByCik,
  getCompanyMetrics,
};
