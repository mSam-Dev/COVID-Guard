import axios from 'axios';

export const _loginGeneral = user => {
    return axios.post('api/registeredgeneralpublic/auth/login', user);
}

export const _loginHealth = user => {
    return axios.post('api/healthprofessional/auth/login', user);
}

export const _loginBusiness = user => {
    return axios.post('api/businessowner/auth/login', user);
}

export const _registerGeneral = user => {
    return axios.post('api/registeredgeneralpublic/auth/register', user);
}

export const _registerBusiness = user => {
    return axios.post('api/businessowner/auth/register', user);
}

export const _registerHealth = user => {
    return axios.post('api/healthprofessional/auth/register', user);
}

export const _getVaccineCenters = () => {
    return axios.get('api/generalpublic/vaccinationcentres');
}

export const _getCurrentHotspots = () => {
    return axios.get('api/generalpublic/currenthotspots');
}

export const _checkGeneralUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/auth/user', config);
}

export const _checkHealthUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/healthprofessional/auth/user', config);
}

export const _checkBusinessUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/businessowner/auth/user', config);
}

export const _forgotPasswordGeneral = email => {
    return axios.post('api/registeredgeneralpublic/auth/forgotpassword', email);
}

export const _forgotPasswordHealth = email => {
    return axios.post('api/healthprofessional/auth/forgotpassword', email);
}

export const _forgotPasswordBusiness = email => {
    return axios.post('api/businessowner/auth/forgotpassword', email);
}

export const _checkVaccinationValid = vaccinationCode => {
    return axios.post('api/generalpublic/checkvaccinationisvalid', vaccinationCode);
}

export const _getVaccinationStatus = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/vaccinationstatus', config);
}

export const _getGeneralProfile = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/profile', config);
}

export const _confirmPatientVaccination = (confirmation, token) => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.post('api/healthprofessional/confirmpatientvaccinationinformation', confirmation, config);
}

export const _getVenueInfo = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/businessowner/venueinfo', config);
}

export const _logoutBusiness = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/businessowner/auth/logout', config);
}

export const _logoutGeneral = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/auth/logout', config);
}

export const _logoutHealth = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/healthprofessional/auth/logout', config);
}
