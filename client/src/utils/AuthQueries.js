import axios from 'axios';


export const sendAdminEmail = async (request) => {
    return (
        axios.post('/api/v1/auth/email', request)
            .then(res => {
                return res.data;
            })
            .catch(err => console.log(err))
    )
};


export const sendLoginRequest = async (userCreds) => {
    return (
        axios.post('/api/v1/auth/login', userCreds)
            .then(res => {
                return res.data;
            })
            .catch(err => console.log(err))
    )
};

export const signup = async (userCreds) => {
    return (
        axios.post('/api/v1/auth/register', userCreds)
            .then(res => {
                console.log(res)
                return res.data;
            })
            .catch(err => console.log(err))
    )
};
