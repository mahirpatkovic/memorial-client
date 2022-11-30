import axios from 'axios';
import ENV from '../util/env-config';
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(
//     'token'
// )}`;

class Service {
  // static reqConfig() {
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   };
  // }

  static getCsrfToken() {
    return axios.get(ENV.apiBase + '/getCsrfToken');
  }

  static signup(reqData) {
    return axios.post(ENV.apiBase + '/users/signup', reqData);
  }

  static login(reqData) {
    return axios.post(ENV.apiBase + '/users/login', reqData);
  }

  static logout() {
    return axios.get(ENV.apiBase + '/users/logout');
  }

  static validateProfile(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/validateProfile/' + reqData.validationToken
    );
  }

  static userAuthenticated(reqData) {
    return axios.post(ENV.apiBase + '/users/auth', reqData);
  }

  static forgotPassword(reqData) {
    return axios.post(ENV.apiBase + '/users/forgotPassword', reqData);
  }

  static resetPassword(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/resetPassword/' + reqData.resetToken,
      reqData.values
    );
  }

  static findResetToken(reqData) {
    return axios.post(ENV.apiBase + '/users/findResetToken', reqData);
  }

  static resendValidationEmail(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/resendValidationEmail/' + reqData.validationToken
    );
  }

  static getAllUsers() {
    return axios.get(ENV.apiBase + '/users');
  }

  static deactivateUser(reqData) {
    return axios.patch(ENV.apiBase + '/users/deactivateUser', reqData);
  }

  static activateUser(reqData) {
    return axios.patch(ENV.apiBase + '/users/activateUser', reqData);
  }

  static removeUser(reqData) {
    return axios.delete(ENV.apiBase + '/users/' + reqData);
  }

  static userEditorAdd(reqData) {
    return axios.patch(ENV.apiBase + '/users/userEditorAdd', reqData);
  }

  static userEditorRemove(reqData) {
    return axios.patch(ENV.apiBase + '/users/userEditorRemove', reqData);
  }

  static updateUserProfile(reqData) {
    return axios.patch(ENV.apiBase + '/users/updateUserProfile', reqData);
  }

  static updateUserPassword(reqData) {
    return axios.patch(ENV.apiBase + '/users/updateUserPassword', reqData);
  }

  static createDocument(reqData) {
    return axios.post(ENV.apiBase + '/documents', reqData);
  }

  static getAllDocuments() {
    return axios.get(ENV.apiBase + '/documents');
  }

  static getDocument(reqData) {
    return axios.get(ENV.apiBase + '/documents/' + reqData.id);
  }

  static approvePublicAccess(reqData) {
    return axios.patch(ENV.apiBase + '/documents/approvePublicAccess', reqData);
  }

  static forbidPublicAccess(reqData) {
    return axios.patch(ENV.apiBase + '/documents/forbidPublicAccess', reqData);
  }

  static deleteDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/deleteDocument', reqData);
  }

  static editDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/editDocument', reqData);
  }

  static removeDocument(reqData) {
    return axios.delete(ENV.apiBase + '/documents/removeDocument/' + reqData);
  }

  static getUserHistoryReview() {
    return axios.get(ENV.apiBase + '/documents/userHistoryReview');
  }

  static searchDocument(reqData) {
    return axios.post(ENV.apiBase + '/documents/searchDocument', reqData);
  }

  static getApprovedDocuments() {
    return axios.get(ENV.apiBase + '/documents/approvedDocuments');
  }

  static downloadDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/download', reqData);
  }

  static createRequest(reqData) {
    return axios.post(ENV.apiBase + '/requests', reqData);
  }

  static getAllRequests() {
    return axios.get(ENV.apiBase + '/requests');
  }

  static approveRequest(reqData) {
    return axios.patch(ENV.apiBase + '/requests/approveRequest', reqData);
  }

  static declineRequest(reqData) {
    return axios.patch(ENV.apiBase + '/requests/declineRequest', reqData);
  }

  static getLastDaysLoginStat() {
    return axios.get(ENV.apiBase + '/statistics/lastDaysLoginStatistics');
  }

  static getDobAverageOfUsers() {
    return axios.get(ENV.apiBase + '/statistics/getDobAverageOfUsers');
  }

  static getCountriesOfUsers() {
    return axios.get(ENV.apiBase + '/statistics/getCountriesOfUsers');
  }

  static getUsersStats() {
    return axios.get(ENV.apiBase + '/statistics/getUsersStats');
  }

  static getDocsStats() {
    return axios.get(ENV.apiBase + '/statistics/getDocsStats');
  }
}

export default Service;
