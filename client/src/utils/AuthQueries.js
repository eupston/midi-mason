import axios from 'axios';

export const sendLoginRequest = async (userCreds) => {
    return (
        axios.post('/api/v1/auth/login', userCreds)
            .then(res => {
                return res.data;
            })
            .catch(err => console.log(err))
    )
};
