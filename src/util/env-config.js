const ENVIRONMENTS = {
  dev: {
    apiBase: 'http://localhost:4000/api',
  },
  prod: {
    apiBase: 'http://3.127.151.10:4000/api',
  },
};

const ENV = ENVIRONMENTS[process.env.REACT_APP_ENV];

export default ENV;
