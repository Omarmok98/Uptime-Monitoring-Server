function addDurationToAxiosInstance(axiosInstance) {
  axiosInstance.interceptors.request.use(
    (config) => {
      const newConfig = { ...config };
      newConfig.metadata = { startTime: new Date() };
      return newConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      const newRes = { ...response };
      newRes.config.metadata.endTime = new Date();
      newRes.duration =
        newRes.config.metadata.endTime - newRes.config.metadata.startTime;
      return newRes;
    },
    (error) => {
      const newError = { ...error };
      newError.config.metadata.endTime = new Date();
      newError.duration =
        newError.config.metadata.endTime - newError.config.metadata.startTime;
      return Promise.reject(newError);
    }
  );
}

module.exports = {
  addDurationToAxiosInstance,
};
