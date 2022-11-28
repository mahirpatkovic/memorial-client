import axios from 'axios';
import ENV from '../util/env-config';
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(
//     'token'
// )}`;

class Service {
    static reqConfig() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };
    }

    static getCsrfToken() {
        return axios.get(
            ENV.apiBase + '/getCsrfToken',
            this.reqConfig(),
            this.reqConfig()
        );
    }

    static signup(reqData) {
        return axios.post(
            ENV.apiBase + '/users/signup',
            reqData,
            this.reqConfig()
        );
    }

    static login(reqData) {
        return axios.post(
            ENV.apiBase + '/users/login',
            reqData,
            this.reqConfig()
        );
    }

    static logout() {
        return axios.get(ENV.apiBase + '/users/logout', this.reqConfig());
    }

    static validateProfile(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/validateProfile/' + reqData.validationToken,
            this.reqConfig()
        );
    }

    static userAuthenticated(reqData) {
        return axios.post(
            ENV.apiBase + '/users/auth',
            reqData,
            this.reqConfig()
        );
    }

    static forgotPassword(reqData) {
        return axios.post(
            ENV.apiBase + '/users/forgotPassword',
            reqData,
            this.reqConfig()
        );
    }

    static resetPassword(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/resetPassword/' + reqData.resetToken,
            reqData.values,
            this.reqConfig()
        );
    }

    static findResetToken(reqData) {
        return axios.post(
            ENV.apiBase + '/users/findResetToken',
            reqData,
            this.reqConfig()
        );
    }

    static resendValidationEmail(reqData) {
        return axios.patch(
            ENV.apiBase +
                '/users/resendValidationEmail/' +
                reqData.validationToken,
            this.reqConfig()
        );
    }

    static getAllUsers() {
        return axios.get(ENV.apiBase + '/users', this.reqConfig());
    }

    static deactivateUser(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/deactivateUser',
            reqData,
            this.reqConfig()
        );
    }

    static activateUser(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/activateUser',
            reqData,
            this.reqConfig()
        );
    }

    static removeUser(reqData) {
        return axios.delete(
            ENV.apiBase + '/users/' + reqData,
            this.reqConfig()
        );
    }

    static userEditorAdd(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/userEditorAdd',
            reqData,
            this.reqConfig()
        );
    }

    static userEditorRemove(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/userEditorRemove',
            reqData,
            this.reqConfig()
        );
    }

    static updateUserProfile(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/updateUserProfile',
            reqData,
            this.reqConfig()
        );
    }

    static updateUserPassword(reqData) {
        return axios.patch(
            ENV.apiBase + '/users/updateUserPassword',
            reqData,
            this.reqConfig()
        );
    }

    static createDocument(reqData) {
        return axios.post(
            ENV.apiBase + '/documents',
            reqData,
            this.reqConfig()
        );
    }

    static getAllDocuments() {
        return axios.get(ENV.apiBase + '/documents', this.reqConfig());
    }

    static getDocument(reqData) {
        return axios.get(
            ENV.apiBase + '/documents/' + reqData.id,
            this.reqConfig()
        );
    }

    static approvePublicAccess(reqData) {
        return axios.patch(
            ENV.apiBase + '/documents/approvePublicAccess',
            reqData,
            this.reqConfig()
        );
    }

    static forbidPublicAccess(reqData) {
        return axios.patch(
            ENV.apiBase + '/documents/forbidPublicAccess',
            reqData,
            this.reqConfig()
        );
    }

    static deleteDocument(reqData) {
        return axios.patch(
            ENV.apiBase + '/documents/deleteDocument',
            reqData,
            this.reqConfig()
        );
    }

    static editDocument(reqData) {
        return axios.patch(
            ENV.apiBase + '/documents/editDocument',
            reqData,
            this.reqConfig()
        );
    }

    static removeDocument(reqData) {
        return axios.delete(
            ENV.apiBase + '/documents/removeDocument/' + reqData,
            this.reqConfig()
        );
    }

    static getUserHistoryReview() {
        return axios.get(
            ENV.apiBase + '/documents/userHistoryReview',
            this.reqConfig()
        );
    }

    static searchDocument(reqData) {
        return axios.post(
            ENV.apiBase + '/documents/searchDocument',
            reqData,
            this.reqConfig()
        );
    }

    static getApprovedDocuments() {
        return axios.get(
            ENV.apiBase + '/documents/approvedDocuments',
            this.reqConfig()
        );
    }

    static downloadDocument(reqData) {
        return axios.patch(
            ENV.apiBase + '/documents/download',
            reqData,
            this.reqConfig()
        );
    }

    static createRequest(reqData) {
        return axios.post(ENV.apiBase + '/requests', reqData, this.reqConfig());
    }

    static getAllRequests() {
        return axios.get(ENV.apiBase + '/requests', this.reqConfig());
    }

    static approveRequest(reqData) {
        return axios.patch(
            ENV.apiBase + '/requests/approveRequest',
            reqData,
            this.reqConfig()
        );
    }

    static declineRequest(reqData) {
        return axios.patch(
            ENV.apiBase + '/requests/declineRequest',
            reqData,
            this.reqConfig()
        );
    }

    static getLastDaysLoginStat() {
        return axios.get(
            ENV.apiBase + '/statistics/lastDaysLoginStatistics',
            this.reqConfig()
        );
    }

    static getDobAverageOfUsers() {
        return axios.get(
            ENV.apiBase + '/statistics/getDobAverageOfUsers',
            this.reqConfig()
        );
    }

    static getCountriesOfUsers() {
        return axios.get(
            ENV.apiBase + '/statistics/getCountriesOfUsers',
            this.reqConfig()
        );
    }

    static getUsersStats() {
        return axios.get(
            ENV.apiBase + '/statistics/getUsersStats',
            this.reqConfig()
        );
    }

    static getDocsStats() {
        return axios.get(
            ENV.apiBase + '/statistics/getDocsStats',
            this.reqConfig()
        );
    }
}

export default Service;
