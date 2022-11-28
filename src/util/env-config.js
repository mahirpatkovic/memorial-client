const ENVIRONMENTS = {
  dev: {
    apiBase: 'http://localhost:4000/api',
  },
  prod: {
    apiBase: 'ec2-3-121-22-149.eu-central-1.compute.amazonaws.com/api',
  },
};

const ENV = ENVIRONMENTS[process.env.REACT_APP_ENV];

export default ENV;
