const ENVIRONMENTS = {
  dev: {
    apiBase: 'http://localhost:4000/api',
  },
  prod: {
    apiBase: 'ec2-3-72-61-118.eu-central-1.compute.amazonaws.com',
  },
};

const ENV = ENVIRONMENTS[process.env.REACT_APP_ENV];

export default ENV;
