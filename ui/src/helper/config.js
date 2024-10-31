// exports.const= {
//     API_BASE_URL='localhost:3001/api/v2'
// }

let BASE_URL= process.env.REACT_APP_BASE_URL || "http://localhost:3000/v1"

export const routes = {
    googleLogin: `${BASE_URL}/auth/login/google-auth`,
    credits: `${BASE_URL}/users/credit`,
    request: `${BASE_URL}/org`,
    download: `${BASE_URL}/org/download`,
    getRequests: `${BASE_URL}/org`,


    login: `${BASE_URL}/auth/login`,
    registerUser: `${BASE_URL}/auth/register`,
    getUserList: `${BASE_URL}/users`,
    updateUserStatus:`${BASE_URL}/users/`,

    getAgreements: `${BASE_URL}/agreements`,
    createAgreement: `${BASE_URL}/agreements`,
    getApprovals: `${BASE_URL}/agreements/approvals/`,
    approveAgreement: `${BASE_URL}/agreements/approvals/`,
    getAgreementHistory: `${BASE_URL}/agreements/history`,

    activateUser: `${BASE_URL}/users/activate`,
    deActivateUser:`${BASE_URL}/users/deactivate`,
}

export const headers = () => {
    let headers = {"Content-Type": "application/json"}
    let token = localStorage.getItem("token")
    if(token){
        headers.Authorization = `Bearer ${token}`
    }
    return {headers};
};