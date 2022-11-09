import axios from "axios";

const defaultConfigEndpoint = "/locales/default.json";

const getConfiguration = async () => {
  const endpoint = window.origin + defaultConfigEndpoint;

  const response = await axios.get(endpoint);
  return response.data;
};

const langConfigService = {
  getConfiguration: getConfiguration,
};

export { langConfigService };
