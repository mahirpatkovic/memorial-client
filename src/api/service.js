import axios from 'axios';
import ENV from '../util/env-config';
// axios.defaults.withCredentials = true;
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
    return axios.get(ENV.apiBase + '/getCsrfToken', { withCredentials: true });
  }

  static signup(reqData) {
    return axios.post(ENV.apiBase + '/users/signup', reqData, {
      withCredentials: true,
    });
  }

  static login(reqData) {
    return axios.post(ENV.apiBase + '/users/login', reqData, {
      withCredentials: true,
    });
  }

  static logout() {
    return axios.get(ENV.apiBase + '/users/logout', { withCredentials: true });
  }

  static validateProfile(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/validateProfile/' + reqData.validationToken,
      { withCredentials: true }
    );
  }

  static userAuthenticated(reqData) {
    return axios.post(ENV.apiBase + '/users/auth', reqData, {
      withCredentials: true,
    });
  }

  static forgotPassword(reqData) {
    return axios.post(ENV.apiBase + '/users/forgotPassword', reqData, {
      withCredentials: true,
    });
  }

  static resetPassword(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/resetPassword/' + reqData.resetToken,
      reqData.values,
      { withCredentials: true }
    );
  }

  static findResetToken(reqData) {
    return axios.post(ENV.apiBase + '/users/findResetToken', reqData, {
      withCredentials: true,
    });
  }

  static resendValidationEmail(reqData) {
    return axios.patch(
      ENV.apiBase + '/users/resendValidationEmail/' + reqData.validationToken,
      { withCredentials: true }
    );
  }

  static getAllUsers() {
    return axios.get(ENV.apiBase + '/users', { withCredentials: true });
  }

  static deactivateUser(reqData) {
    return axios.patch(ENV.apiBase + '/users/deactivateUser', reqData, {
      withCredentials: true,
    });
  }

  static activateUser(reqData) {
    return axios.patch(ENV.apiBase + '/users/activateUser', reqData, {
      withCredentials: true,
    });
  }

  static removeUser(reqData) {
    return axios.delete(ENV.apiBase + '/users/' + reqData, {
      withCredentials: true,
    });
  }

  static userEditorAdd(reqData) {
    return axios.patch(ENV.apiBase + '/users/userEditorAdd', reqData, {
      withCredentials: true,
    });
  }

  static userEditorRemove(reqData) {
    return axios.patch(ENV.apiBase + '/users/userEditorRemove', reqData, {
      withCredentials: true,
    });
  }

  static updateUserProfile(reqData) {
    return axios.patch(ENV.apiBase + '/users/updateUserProfile', reqData, {
      withCredentials: true,
    });
  }

  static updateUserPassword(reqData) {
    return axios.patch(ENV.apiBase + '/users/updateUserPassword', reqData, {
      withCredentials: true,
    });
  }

  static createDocument(reqData) {
    return axios.post(ENV.apiBase + '/documents', reqData, {
      withCredentials: true,
    });
  }

  static getAllDocuments() {
    return axios.get(ENV.apiBase + '/documents', { withCredentials: true });
  }

  static getDocument(reqData) {
    return axios.get(ENV.apiBase + '/documents/' + reqData.id, {
      withCredentials: true,
    });
  }

  static approvePublicAccess(reqData) {
    return axios.patch(
      ENV.apiBase + '/documents/approvePublicAccess',
      reqData,
      { withCredentials: true }
    );
  }

  static forbidPublicAccess(reqData) {
    return axios.patch(ENV.apiBase + '/documents/forbidPublicAccess', reqData, {
      withCredentials: true,
    });
  }

  static deleteDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/deleteDocument', reqData, {
      withCredentials: true,
    });
  }

  static editDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/editDocument', reqData, {
      withCredentials: true,
    });
  }

  static removeDocument(reqData) {
    return axios.delete(ENV.apiBase + '/documents/removeDocument/' + reqData, {
      withCredentials: true,
    });
  }

  static getUserHistoryReview() {
    return axios.get(ENV.apiBase + '/documents/userHistoryReview', {
      withCredentials: true,
    });
  }

  static searchDocument(reqData) {
    return axios.post(ENV.apiBase + '/documents/searchDocument', reqData, {
      withCredentials: true,
    });
  }

  static getApprovedDocuments() {
    return axios.get(ENV.apiBase + '/documents/approvedDocuments', {
      withCredentials: true,
    });
  }

  static downloadDocument(reqData) {
    return axios.patch(ENV.apiBase + '/documents/download', reqData, {
      withCredentials: true,
    });
  }

  static createRequest(reqData) {
    return axios.post(ENV.apiBase + '/requests', reqData, {
      withCredentials: true,
    });
  }

  static getAllRequests() {
    return axios.get(ENV.apiBase + '/requests', { withCredentials: true });
  }

  static approveRequest(reqData) {
    return axios.patch(ENV.apiBase + '/requests/approveRequest', reqData, {
      withCredentials: true,
    });
  }

  static declineRequest(reqData) {
    return axios.patch(ENV.apiBase + '/requests/declineRequest', reqData, {
      withCredentials: true,
    });
  }

  static getLastDaysLoginStat() {
    return axios.get(ENV.apiBase + '/statistics/lastDaysLoginStatistics', {
      withCredentials: true,
    });
  }

  static getDobAverageOfUsers() {
    return axios.get(ENV.apiBase + '/statistics/getDobAverageOfUsers', {
      withCredentials: true,
    });
  }

  static getCountriesOfUsers() {
    return axios.get(ENV.apiBase + '/statistics/getCountriesOfUsers', {
      withCredentials: true,
    });
  }

  static getUsersStats() {
    return axios.get(ENV.apiBase + '/statistics/getUsersStats', {
      withCredentials: true,
    });
  }

  static getDocsStats() {
    return axios.get(ENV.apiBase + '/statistics/getDocsStats', {
      withCredentials: true,
    });
  }
}

export default Service;
