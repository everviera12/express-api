const { supabaseConnection } = require("../connection/supabase");

const loginWithEmail = async (email, password) => {
    const { data, error } = await supabaseConnection.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
};


const registerWithEmail = async (email, password) => {
    const { data, error } = await supabaseConnection.auth.signUp({
        email,
        password,
    });

    return { data, error };
}

/* const logout = async (accessToken) => {
    const { error } = await supabaseConnection.auth.signOut({
        accessToken,
    });

    return { error };
}; */

module.exports = { loginWithEmail, registerWithEmail };